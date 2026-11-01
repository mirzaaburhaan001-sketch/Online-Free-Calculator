type Node =
  | { t: 'num'; v: number }
  | { t: 'var'; name: string }
  | { t: 'un'; op: '-' | '%'; a: Node }
  | { t: 'bin'; op: '+' | '-' | '*' | '/' | '^'; a: Node; b: Node }
  | { t: 'fn'; name: string; a: Node }

export type Scope = Record<string, number>

const FUNCS: Record<string, (x: number) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  sqrt: Math.sqrt,
  abs: Math.abs,
  ln: Math.log,
  log: Math.log10,
  exp: Math.exp,
  floor: Math.floor,
  ceil: Math.ceil,
}

const CONSTS: Scope = { pi: Math.PI, e: Math.E }

type Token = { k: 'num'; v: number } | { k: 'id'; v: string } | { k: 'op'; v: string }

function tokenize(src: string): Token[] {
  const s = src.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/π/g, 'pi')
  const out: Token[] = []
  let i = 0
  while (i < s.length) {
    const c = s[i]
    if (/\s/.test(c)) {
      i++
      continue
    }
    if (/[0-9.]/.test(c)) {
      const m = /^(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?/.exec(s.slice(i))
      if (!m) throw new Error('Invalid number')
      out.push({ k: 'num', v: parseFloat(m[0]) })
      i += m[0].length
      continue
    }
    if (/[a-zA-Z]/.test(c)) {
      const m = /^[a-zA-Z]+/.exec(s.slice(i))!
      const word = m[0].toLowerCase()
      if (FUNCS[word] || word === 'pi') {
        out.push({ k: 'id', v: word })
      } else {
        for (const ch of word) out.push({ k: 'id', v: ch })
      }
      i += m[0].length
      continue
    }
    if ('+-*/^()%'.includes(c)) {
      out.push({ k: 'op', v: c })
      i++
      continue
    }
    throw new Error(`Unexpected character "${c}"`)
  }
  return out
}

export function parse(src: string): Node {
  const tokens = tokenize(src)
  let pos = 0
  const peek = () => tokens[pos]
  const isOp = (v: string) => peek()?.k === 'op' && peek()!.v === v

  const startsPrimary = () => {
    const t = peek()
    return !!t && (t.k === 'num' || t.k === 'id' || (t.k === 'op' && t.v === '('))
  }

  function expr(): Node {
    let a = term()
    while (isOp('+') || isOp('-')) {
      const op = tokens[pos++].v as '+' | '-'
      a = { t: 'bin', op, a, b: term() }
    }
    return a
  }

  function term(): Node {
    let a = unary()
    for (;;) {
      if (isOp('*') || isOp('/')) {
        const op = tokens[pos++].v as '*' | '/'
        a = { t: 'bin', op, a, b: unary() }
      } else if (startsPrimary()) {
        a = { t: 'bin', op: '*', a, b: power() }
      } else break
    }
    return a
  }

  function unary(): Node {
    if (isOp('-')) {
      pos++
      return { t: 'un', op: '-', a: unary() }
    }
    if (isOp('+')) {
      pos++
      return unary()
    }
    return power()
  }

  function power(): Node {
    const base = postfix()
    if (isOp('^')) {
      pos++
      return { t: 'bin', op: '^', a: base, b: unary() }
    }
    return base
  }

  function postfix(): Node {
    let a = primary()
    while (isOp('%')) {
      pos++
      a = { t: 'un', op: '%', a }
    }
    return a
  }

  function primary(): Node {
    const t = tokens[pos++]
    if (!t) throw new Error('Incomplete expression')
    if (t.k === 'num') return { t: 'num', v: t.v }
    if (t.k === 'id') {
      if (FUNCS[t.v]) {
        const arg = isOp('(') ? primary() : postfix()
        return { t: 'fn', name: t.v, a: arg }
      }
      return { t: 'var', name: t.v }
    }
    if (t.v === '(') {
      const inner = expr()
      if (!isOp(')')) throw new Error('Missing closing parenthesis')
      pos++
      return inner
    }
    throw new Error(`Unexpected "${t.v}"`)
  }

  const node = expr()
  if (pos < tokens.length) throw new Error(`Unexpected "${tokens[pos].v}"`)
  return node
}

export function evaluate(node: Node, scope: Scope = {}): number {
  switch (node.t) {
    case 'num':
      return node.v
    case 'var': {
      if (node.name in scope) return scope[node.name]
      if (node.name in CONSTS) return CONSTS[node.name]
      throw new Error(`Unknown variable "${node.name}"`)
    }
    case 'un': {
      const a = evaluate(node.a, scope)
      return node.op === '-' ? -a : a / 100
    }
    case 'fn':
      return FUNCS[node.name](evaluate(node.a, scope))
    case 'bin': {
      const a = evaluate(node.a, scope)
      const b = evaluate(node.b, scope)
      switch (node.op) {
        case '+':
          return a + b
        case '-':
          return a - b
        case '*':
          return a * b
        case '/':
          return a / b
        case '^':
          return Math.pow(a, b)
      }
    }
  }
}

export function collectVars(node: Node, out = new Set<string>()): Set<string> {
  if (node.t === 'var' && !(node.name in CONSTS)) out.add(node.name)
  if ('a' in node) collectVars(node.a, out)
  if ('b' in node) collectVars(node.b, out)
  return out
}

export function compile(src: string) {
  const node = parse(src)
  return { node, vars: collectVars(node), fn: (scope: Scope) => evaluate(node, scope) }
}
