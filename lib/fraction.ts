export type Fraction = { n: number; d: number }

export function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) [a, b] = [b, a % b]
  return a || 1
}

export function simplify({ n, d }: Fraction): Fraction {
  if (d < 0) {
    n = -n
    d = -d
  }
  const g = gcd(n, d)
  return { n: n / g, d: d / g }
}

export function toMixed({ n, d }: Fraction) {
  const sign = n < 0 ? -1 : 1
  const abs = Math.abs(n)
  return { whole: sign * Math.floor(abs / d), rem: abs % d, d, sign }
}

export function formatMixed(f: Fraction) {
  const { whole, rem, d, sign } = toMixed(f)
  if (rem === 0) return String(whole)
  if (whole === 0) return `${sign < 0 ? '-' : ''}${rem}/${d}`
  return `${whole} ${rem}/${d}`
}

export function decimalToFraction(x: number, maxDen = 1_000_000): Fraction {
  if (Number.isInteger(x)) return { n: x, d: 1 }
  const str = x.toString()
  const decimals = str.includes('.') ? str.split('.')[1].length : 0
  if (decimals > 0 && decimals <= 6) {
    const d = 10 ** decimals
    return simplify({ n: Math.round(x * d), d })
  }
  let h1 = 1,
    h0 = 0,
    k1 = 0,
    k0 = 1,
    b = x
  do {
    const a = Math.floor(b)
    ;[h1, h0] = [a * h1 + h0, h1]
    ;[k1, k0] = [a * k1 + k0, k1]
    b = 1 / (b - a)
  } while (Math.abs(x - h1 / k1) > 1e-9 && k1 < maxDen)
  return simplify({ n: h1, d: k1 })
}
