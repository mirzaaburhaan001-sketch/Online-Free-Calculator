'use client'

import { useRef, useState } from 'react'
import { Delete } from 'lucide-react'
import { Card, SegmentedControl, SelectField } from '@/components/site/form'
import { evaluate, parse } from '@/lib/expression'
import { cn } from '@/lib/utils'

type KeyKind = 'num' | 'op' | 'fn' | 'eq'
type Key = { label: string; insert?: string; action?: 'clear' | 'back' | 'neg' | 'eq'; kind: KeyKind; aria?: string; span?: 2 }

const keys: Key[] = [
  { label: 'C', action: 'clear', kind: 'fn', aria: 'Clear' },
  { label: '⌫', action: 'back', kind: 'fn', aria: 'Backspace' },
  { label: '(', insert: '(', kind: 'fn' },
  { label: ')', insert: ')', kind: 'fn' },
  { label: '÷', insert: '÷', kind: 'op', aria: 'Divide' },
  { label: '7', insert: '7', kind: 'num' },
  { label: '8', insert: '8', kind: 'num' },
  { label: '9', insert: '9', kind: 'num' },
  { label: '%', insert: '%', kind: 'fn', aria: 'Percent' },
  { label: '×', insert: '×', kind: 'op', aria: 'Multiply' },
  { label: '4', insert: '4', kind: 'num' },
  { label: '5', insert: '5', kind: 'num' },
  { label: '6', insert: '6', kind: 'num' },
  { label: 'EXP', insert: 'e', kind: 'fn', aria: 'Scientific notation exponent' },
  { label: '−', insert: '−', kind: 'op', aria: 'Subtract' },
  { label: '1', insert: '1', kind: 'num' },
  { label: '2', insert: '2', kind: 'num' },
  { label: '3', insert: '3', kind: 'num' },
  { label: '±', action: 'neg', kind: 'fn', aria: 'Toggle negative' },
  { label: '+', insert: '+', kind: 'op', aria: 'Add' },
  { label: '0', insert: '0', kind: 'num', span: 2 },
  { label: '.', insert: '.', kind: 'num', aria: 'Decimal point' },
  { label: '=', action: 'eq', kind: 'eq', aria: 'Equals', span: 2 },
]

const precisionOptions = [
  { value: 'auto', label: 'Auto' },
  ...Array.from({ length: 11 }, (_, i) => ({ value: String(i), label: `${i} decimal${i === 1 ? '' : 's'}` })),
]

type Rounding = 'round' | 'floor' | 'ceil'
type Notation = 'standard' | 'scientific'

function formatResult(value: number, precision: string, rounding: Rounding, notation: Notation) {
  if (!Number.isFinite(value)) throw new Error(Number.isNaN(value) ? 'Invalid result' : 'Cannot divide by zero')
  let v = value
  if (precision !== 'auto') {
    const p = 10 ** Number(precision)
    v = Math[rounding](v * p) / p
  }
  if (notation === 'scientific') {
    return precision === 'auto' ? v.toExponential() : v.toExponential(Number(precision))
  }
  if (precision !== 'auto') return v.toFixed(Number(precision))
  return String(parseFloat(v.toPrecision(12)))
}

export function MathCalculator() {
  const [expr, setExpr] = useState('')
  const [previous, setPrevious] = useState('')
  const [error, setError] = useState('')
  const [precision, setPrecision] = useState('auto')
  const [rounding, setRounding] = useState<Rounding>('round')
  const [notation, setNotation] = useState<Notation>('standard')
  const [justEvaluated, setJustEvaluated] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const calculate = () => {
    if (!expr.trim()) return
    try {
      const value = evaluate(parse(expr.replace(/(\d)e(?![+\-−\d])/g, '$1e0')))
      const out = formatResult(value, precision, rounding, notation)
      setPrevious(`${expr} =`)
      setExpr(out)
      setError('')
      setJustEvaluated(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid expression')
    }
  }

  const press = (k: Key) => {
    setError('')
    if (k.action === 'eq') return calculate()
    if (k.action === 'clear') {
      setExpr('')
      setPrevious('')
      setJustEvaluated(false)
      return
    }
    if (k.action === 'back') {
      setExpr((s) => s.slice(0, -1))
      setJustEvaluated(false)
      return
    }
    if (k.action === 'neg') {
      setExpr((s) => {
        const wrapped = /\(-([\d.]+(?:e[+\-−]?\d+)?)\)$/.exec(s)
        if (wrapped) return s.slice(0, -wrapped[0].length) + wrapped[1]
        const trailing = /([\d.]+(?:e[+\-−]?\d+)?)$/.exec(s)
        if (trailing) return s.slice(0, -trailing[0].length) + `(-${trailing[1]})`
        return s + '-'
      })
      setJustEvaluated(false)
      return
    }
    const ins = k.insert!
    setExpr((s) => (justEvaluated && k.kind === 'num' ? ins : s + ins))
    setJustEvaluated(false)
    inputRef.current?.focus({ preventScroll: true })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <Card className="overflow-hidden">
        <div className="bg-navy px-5 pb-5 pt-4 sm:px-6">
          <p className="h-5 truncate text-right font-mono text-sm text-white/60" aria-label="Previous calculation">
            {previous}
          </p>
          <label htmlFor="math-display" className="sr-only">
            Expression
          </label>
          <input
            ref={inputRef}
            id="math-display"
            value={expr}
            onChange={(e) => {
              setExpr(e.target.value)
              setError('')
              setJustEvaluated(false)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                e.preventDefault()
                calculate()
              }
              if (e.key === 'Escape') {
                setExpr('')
                setPrevious('')
              }
            }}
            inputMode="none"
            autoComplete="off"
            spellCheck={false}
            placeholder="0"
            className="mt-1 w-full bg-transparent text-right font-mono text-4xl font-semibold tabular-nums text-white outline-none placeholder:text-white/40 sm:text-5xl"
          />
          <p aria-live="polite" className="mt-1 h-5 text-right text-sm text-[#FFB4A8]">
            {error}
          </p>
        </div>
        <div className="grid grid-cols-5 gap-2 bg-[#F3F6FB] p-3 sm:gap-2.5 sm:p-4">
          {keys.map((k) => (
            <button
              key={k.label}
              type="button"
              aria-label={k.aria ?? k.label}
              onClick={() => press(k)}
              className={cn(
                'flex h-14 items-center justify-center rounded-xl text-lg font-semibold transition-colors active:scale-[0.98] sm:h-16',
                k.span === 2 && 'col-span-2',
                k.kind === 'num' && 'border border-border bg-white text-foreground hover:bg-[#F7F9FC]',
                k.kind === 'fn' && 'bg-sky text-navy hover:bg-[#DCEBFF]',
                k.kind === 'op' && 'bg-navy-2 text-white hover:bg-navy',
                k.kind === 'eq' && 'bg-navy text-white hover:bg-navy-2',
                k.label === 'EXP' && 'text-sm',
              )}
            >
              {k.action === 'back' ? <Delete className="size-5" aria-hidden="true" /> : k.label}
            </button>
          ))}
        </div>
      </Card>

      <Card className="space-y-5 p-5">
        <h3 className="font-semibold text-navy">Result options</h3>
        <SelectField
          label="Decimal precision"
          value={precision}
          onChange={(e) => setPrecision(e.target.value)}
          options={precisionOptions}
        />
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-foreground">Rounding</p>
          <SegmentedControl
            label="Rounding"
            value={rounding}
            onChange={setRounding}
            options={[
              { value: 'round', label: 'Nearest' },
              { value: 'floor', label: 'Down' },
              { value: 'ceil', label: 'Up' },
            ]}
          />
        </div>
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-foreground">Notation</p>
          <SegmentedControl
            label="Notation"
            value={notation}
            onChange={setNotation}
            options={[
              { value: 'standard', label: 'Standard' },
              { value: 'scientific', label: 'Scientific' },
            ]}
          />
        </div>
        <p className="rounded-lg bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
          {'Use EXP for scientific notation, e.g. 1.5e3 = 1500. Rounding applies when a fixed precision is selected.'}
        </p>
      </Card>
    </div>
  )
}
