'use client'

import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { Card, InputField, PrimaryButton, ResultCard, SegmentedControl } from '@/components/site/form'
import { decimalToFraction, formatMixed, gcd, simplify, type Fraction } from '@/lib/fraction'
import { formatNumber, toNum } from '@/lib/format'
import { cn } from '@/lib/utils'

type Op = '+' | '-' | '*' | '/'
const ops: { value: Op; label: string; name: string }[] = [
  { value: '+', label: '+', name: 'Addition' },
  { value: '-', label: '−', name: 'Subtraction' },
  { value: '*', label: '×', name: 'Multiplication' },
  { value: '/', label: '÷', name: 'Division' },
]

function FractionInput({
  label,
  n,
  d,
  setN,
  setD,
}: {
  label: string
  n: string
  d: string
  setN: (v: string) => void
  setD: (v: string) => void
}) {
  const cls =
    'h-14 w-24 rounded-lg border border-border bg-white text-center text-xl font-semibold tabular-nums text-navy outline-none focus-visible:border-navy-2 focus-visible:ring-3 focus-visible:ring-navy-2/15'
  return (
    <fieldset className="flex flex-col items-center gap-2">
      <legend className="mb-2 text-sm font-medium text-foreground">{label}</legend>
      <input
        aria-label={`${label} numerator`}
        type="number"
        inputMode="numeric"
        step="1"
        placeholder="1"
        value={n}
        onChange={(e) => setN(e.target.value)}
        className={cls}
      />
      <span aria-hidden="true" className="h-0.5 w-24 rounded bg-navy" />
      <input
        aria-label={`${label} denominator`}
        type="number"
        inputMode="numeric"
        step="1"
        placeholder="2"
        value={d}
        onChange={(e) => setD(e.target.value)}
        className={cls}
      />
    </fieldset>
  )
}

function StackedFraction({ f, className }: { f: Fraction; className?: string }) {
  if (f.d === 1) return <span className={className}>{f.n}</span>
  return (
    <span className={cn('inline-flex flex-col items-center leading-none tabular-nums', className)}>
      <span>{f.n}</span>
      <span aria-hidden="true" className="my-1 h-0.5 w-full min-w-6 rounded bg-current" />
      <span>{f.d}</span>
    </span>
  )
}

type Result = { result: Fraction; steps: string[] } | string

function calculate(a: Fraction, b: Fraction, op: Op): Result {
  if ([a.n, a.d, b.n, b.d].some((v) => Number.isNaN(v))) return 'Please fill in all numerators and denominators.'
  if ([a.n, a.d, b.n, b.d].some((v) => !Number.isInteger(v))) return 'Please use whole numbers only.'
  if (a.d === 0 || b.d === 0) return 'Denominators cannot be zero.'
  if (op === '/' && b.n === 0) return 'Cannot divide by a fraction equal to zero.'
  const steps: string[] = []
  let raw: Fraction
  const sym = ops.find((o) => o.value === op)!.label
  steps.push(`${a.n}/${a.d} ${sym} ${b.n}/${b.d}`)
  if (op === '+' || op === '-') {
    const lcd = (a.d * b.d) / gcd(a.d, b.d)
    const an = a.n * (lcd / a.d)
    const bn = b.n * (lcd / b.d)
    steps.push(`Find a common denominator (${lcd}): ${an}/${lcd} ${sym} ${bn}/${lcd}`)
    raw = { n: op === '+' ? an + bn : an - bn, d: lcd }
    steps.push(`${op === '+' ? 'Add' : 'Subtract'} the numerators: ${raw.n}/${lcd}`)
  } else if (op === '*') {
    raw = { n: a.n * b.n, d: a.d * b.d }
    steps.push(`Multiply numerators and denominators: (${a.n}×${b.n})/(${a.d}×${b.d}) = ${raw.n}/${raw.d}`)
  } else {
    steps.push(`Multiply by the reciprocal: ${a.n}/${a.d} × ${b.d}/${b.n}`)
    raw = { n: a.n * b.d, d: a.d * b.n }
    steps.push(`= ${raw.n}/${raw.d}`)
  }
  const result = simplify(raw)
  const g = gcd(raw.n, raw.d)
  if (g > 1 || raw.d < 0) steps.push(`Simplify by dividing by ${g}: ${result.n}/${result.d}`)
  else steps.push('The fraction is already in simplest form.')
  return { result, steps }
}

export function FractionCalculator() {
  const [an, setAn] = useState('')
  const [ad, setAd] = useState('')
  const [bn, setBn] = useState('')
  const [bd, setBd] = useState('')
  const [op, setOp] = useState<Op>('+')
  const [result, setResult] = useState<Result | null>(null)

  return (
    <div className="space-y-6">
      <Card className="p-5 sm:p-8">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setResult(calculate({ n: toNum(an), d: toNum(ad) }, { n: toNum(bn), d: toNum(bd) }, op))
          }}
        >
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10">
            <FractionInput label="First fraction" n={an} d={ad} setN={setAn} setD={setAd} />
            <div role="radiogroup" aria-label="Operation" className="grid grid-cols-4 gap-2 sm:grid-cols-1">
              {ops.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  role="radio"
                  aria-checked={op === o.value}
                  aria-label={o.name}
                  onClick={() => setOp(o.value)}
                  className={cn(
                    'flex size-11 items-center justify-center rounded-lg border text-xl font-semibold transition-colors',
                    op === o.value ? 'border-navy bg-navy text-white' : 'border-border bg-white text-navy hover:bg-sky',
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <FractionInput label="Second fraction" n={bn} d={bd} setN={setBn} setD={setBd} />
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PrimaryButton type="submit" className="sm:flex-1">
              Calculate
            </PrimaryButton>
            <PrimaryButton
              variant="secondary"
              onClick={() => {
                setAn('')
                setAd('')
                setBn('')
                setBd('')
                setResult(null)
              }}
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Reset
            </PrimaryButton>
          </div>
        </form>

        <div aria-live="polite" className="mt-6">
          {typeof result === 'string' && (
            <p className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm font-medium text-destructive">
              {result}
            </p>
          )}
          {result && typeof result !== 'string' && (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="flex flex-col items-center justify-center rounded-xl bg-navy p-5 text-white">
                  <p className="text-xs font-medium uppercase tracking-wider text-white/70">Simplified</p>
                  <StackedFraction f={result.result} className="mt-2 text-3xl font-bold" />
                </div>
                <ResultCard label="Mixed number" value={formatMixed(result.result)} />
                <ResultCard label="Decimal" value={formatNumber(result.result.n / result.result.d, 6)} />
              </div>
              <div className="rounded-xl border border-[#D6E6FB] bg-sky p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-navy-2/70">Step-by-step</p>
                <ol className="mt-3 list-decimal space-y-1.5 pl-5 font-mono text-sm text-navy">
                  {result.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>
      </Card>

      <FractionConverter />
    </div>
  )
}

type ConvMode = 'fraction' | 'mixed' | 'decimal'

function FractionConverter() {
  const [mode, setMode] = useState<ConvMode>('fraction')
  const [whole, setWhole] = useState('')
  const [n, setN] = useState('')
  const [d, setD] = useState('')
  const [dec, setDec] = useState('')
  const [out, setOut] = useState<Fraction | string | null>(null)

  const convert = () => {
    if (mode === 'decimal') {
      const x = toNum(dec)
      setOut(Number.isFinite(x) ? decimalToFraction(x) : 'Enter a valid decimal value.')
      return
    }
    const nn = toNum(n)
    const dd = toNum(d)
    const ww = mode === 'mixed' ? toNum(whole || '0') : 0
    if ([nn, dd, ww].some((v) => Number.isNaN(v) || !Number.isInteger(v))) return setOut('Use whole numbers only.')
    if (dd === 0) return setOut('Denominator cannot be zero.')
    const sign = ww < 0 ? -1 : 1
    setOut(simplify({ n: ww * dd + sign * nn, d: dd }))
  }

  return (
    <Card className="p-5 sm:p-8">
      <h3 className="text-lg font-semibold text-navy">Fraction Conversion</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Convert common fractions, improper fractions, mixed numbers and decimal values.
      </p>
      <div className="mt-5">
        <SegmentedControl
          label="Input type"
          value={mode}
          onChange={(v) => {
            setMode(v)
            setOut(null)
          }}
          options={[
            { value: 'fraction', label: 'Fraction' },
            { value: 'mixed', label: 'Mixed number' },
            { value: 'decimal', label: 'Decimal' },
          ]}
        />
      </div>
      <form
        className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end"
        onSubmit={(e) => {
          e.preventDefault()
          convert()
        }}
      >
        {mode === 'decimal' ? (
          <InputField
            label="Decimal value"
            type="number"
            step="any"
            inputMode="decimal"
            placeholder="0.75"
            value={dec}
            onChange={(e) => setDec(e.target.value)}
            className="flex-1"
          />
        ) : (
          <div className={cn('grid flex-1 gap-3', mode === 'mixed' ? 'grid-cols-3' : 'grid-cols-2')}>
            {mode === 'mixed' && (
              <InputField label="Whole" type="number" placeholder="1" value={whole} onChange={(e) => setWhole(e.target.value)} />
            )}
            <InputField label="Numerator" type="number" placeholder="7" value={n} onChange={(e) => setN(e.target.value)} />
            <InputField label="Denominator" type="number" placeholder="4" value={d} onChange={(e) => setD(e.target.value)} />
          </div>
        )}
        <PrimaryButton type="submit">Convert</PrimaryButton>
      </form>
      <div aria-live="polite" className="mt-5">
        {typeof out === 'string' && <p className="text-sm font-medium text-destructive">{out}</p>}
        {out && typeof out !== 'string' && (
          <div className="grid gap-3 sm:grid-cols-3">
            <ResultCard label="Fraction" value={`${out.n}/${out.d}`} />
            <ResultCard label="Mixed number" value={formatMixed(out)} />
            <ResultCard label="Decimal" value={formatNumber(out.n / out.d, 6)} />
          </div>
        )}
      </div>
    </Card>
  )
}
