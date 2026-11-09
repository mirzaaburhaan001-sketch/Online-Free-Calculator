'use client'

import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { Card, PrimaryButton, ResultCard, SegmentedControl, SelectField } from '@/components/site/form'
import { formatCurrency, formatNumber, toNum } from '@/lib/format'
import { cn } from '@/lib/utils'

type Key = 'PMT' | 'IY' | 'N' | 'PV' | 'FV'
type Values = Record<Key, string>

const fields: { key: Key; short: string; name: string; unit: string; placeholder: string }[] = [
  { key: 'PMT', short: 'PMT', name: 'Periodic Payment', unit: '$ per period', placeholder: '-200' },
  { key: 'IY', short: 'I/Y', name: 'Interest Rate', unit: '% per year', placeholder: '6' },
  { key: 'N', short: 'N', name: 'Number of Compounding Periods', unit: 'periods', placeholder: '120' },
  { key: 'PV', short: 'PV', name: 'Present Value', unit: '$ today', placeholder: '-1000' },
  { key: 'FV', short: 'FV', name: 'Future Value', unit: '$ at end', placeholder: '0' },
]

type Nums = { PMT: number; i: number; N: number; PV: number; FV: number; t: number }

const growth = (i: number, n: number) => Math.pow(1 + i, n)
const annuity = (i: number, n: number, t: number) => (i === 0 ? n : ((1 + i * t) * (growth(i, n) - 1)) / i)

function solve(target: Key, v: Nums): number {
  const { PMT, i, N, PV, FV, t } = v
  switch (target) {
    case 'FV':
      return -(PV * growth(i, N) + PMT * annuity(i, N, t))
    case 'PV':
      return -(FV + PMT * annuity(i, N, t)) / growth(i, N)
    case 'PMT':
      return -(FV + PV * growth(i, N)) / annuity(i, N, t)
    case 'N': {
      if (i === 0) return -(FV + PV) / PMT
      const p = PMT * (1 + i * t)
      return Math.log((p - FV * i) / (p + PV * i)) / Math.log(1 + i)
    }
    case 'IY': {
      const f = (r: number) => PV * growth(r, N) + PMT * annuity(r, N, t) + FV
      let lo = -0.9999
      let hi = 1
      const steps = 400
      let found: [number, number] | null = null
      for (let k = 0; k < steps; k++) {
        const a = lo + ((hi - lo) * k) / steps
        const b = lo + ((hi - lo) * (k + 1)) / steps
        if (Math.sign(f(a)) !== Math.sign(f(b))) {
          found = [a, b]
          break
        }
      }
      if (!found) return NaN
      ;[lo, hi] = found
      for (let k = 0; k < 100; k++) {
        const mid = (lo + hi) / 2
        if (Math.sign(f(mid)) === Math.sign(f(lo))) lo = mid
        else hi = mid
      }
      return (lo + hi) / 2
    }
  }
}

type Result = { key: Key; value: number; nums: Nums; py: number } | string

export function FinanceCalculator() {
  const [target, setTarget] = useState<Key>('FV')
  const [values, setValues] = useState<Values>({ PMT: '-200', IY: '6', N: '120', PV: '-1000', FV: '' })
  const [py, setPy] = useState('12')
  const [timing, setTiming] = useState<'end' | 'begin'>('end')
  const [result, setResult] = useState<Result | null>(null)

  const calculate = () => {
    const known = fields.filter((f) => f.key !== target)
    const missing = known.find((f) => Number.isNaN(toNum(values[f.key])))
    if (missing) return setResult(`Please enter a value for ${missing.short} (${missing.name}).`)
    const periodsPerYear = Number(py)
    const nums: Nums = {
      PMT: toNum(values.PMT) || 0,
      i: (toNum(values.IY) || 0) / 100 / periodsPerYear,
      N: toNum(values.N) || 0,
      PV: toNum(values.PV) || 0,
      FV: toNum(values.FV) || 0,
      t: timing === 'begin' ? 1 : 0,
    }
    if (target !== 'N' && nums.N <= 0) return setResult('N must be greater than zero.')
    const raw = solve(target, nums)
    if (!Number.isFinite(raw)) {
      return setResult('No solution for these values. Check the signs: money paid out should be negative and money received positive.')
    }
    const value = target === 'IY' ? raw * periodsPerYear * 100 : raw
    const solved = { ...nums }
    if (target === 'IY') solved.i = raw
    else if (target === 'N') solved.N = raw
    else solved[target] = raw
    setResult({ key: target, value, nums: solved, py: periodsPerYear })
  }

  const display = (key: Key, v: number) =>
    key === 'IY' ? `${formatNumber(v, 4)}%` : key === 'N' ? formatNumber(v, 2) : formatCurrency(v)

  return (
    <div className="space-y-6">
      <Card className="p-5 sm:p-8">
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Select the value to calculate</p>
          <SegmentedControl
            label="Value to calculate"
            value={target}
            onChange={(k) => {
              setTarget(k)
              setResult(null)
            }}
            options={fields.map((f) => ({ value: f.key, label: f.short }))}
          />
        </div>

        <form
          className="mt-6"
          onSubmit={(e) => {
            e.preventDefault()
            calculate()
          }}
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {fields.map((f) => {
              const isTarget = f.key === target
              return (
                <div
                  key={f.key}
                  className={cn(
                    'flex flex-col rounded-xl border p-4 transition-colors',
                    isTarget ? 'border-navy bg-sky' : 'border-border bg-white',
                  )}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-mono text-lg font-bold text-navy">{f.short}</span>
                    {isTarget && (
                      <span className="rounded-full bg-navy px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                        Solve
                      </span>
                    )}
                  </div>
                  <label htmlFor={`fin-${f.key}`} className="mt-0.5 min-h-10 text-xs leading-snug text-muted-foreground">
                    {f.name}
                  </label>
                  <input
                    id={`fin-${f.key}`}
                    type="number"
                    step="any"
                    inputMode="decimal"
                    disabled={isTarget}
                    placeholder={isTarget ? '?' : f.placeholder}
                    value={isTarget ? '' : values[f.key]}
                    onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                    className="mt-2 h-11 w-full rounded-lg border border-border bg-white px-3 font-mono tabular-nums outline-none focus-visible:border-navy-2 focus-visible:ring-3 focus-visible:ring-navy-2/15 disabled:border-dashed disabled:bg-transparent disabled:text-center"
                  />
                  <span className="mt-1.5 text-xs text-muted-foreground">{f.unit}</span>
                </div>
              )
            })}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Periods per year (P/Y)"
              value={py}
              onChange={(e) => setPy(e.target.value)}
              options={[
                { value: '1', label: 'Annually (1)' },
                { value: '2', label: 'Semi-annually (2)' },
                { value: '4', label: 'Quarterly (4)' },
                { value: '12', label: 'Monthly (12)' },
                { value: '52', label: 'Weekly (52)' },
                { value: '365', label: 'Daily (365)' },
              ]}
            />
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">Payment timing</span>
              <SegmentedControl
                label="Payment timing"
                value={timing}
                onChange={setTiming}
                options={[
                  { value: 'end', label: 'End of period' },
                  { value: 'begin', label: 'Beginning' },
                ]}
              />
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Sign convention: enter money you pay out (deposits, payments) as negative numbers and money you receive as positive.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <PrimaryButton type="submit" className="sm:flex-1">
              Calculate {fields.find((f) => f.key === target)!.short}
            </PrimaryButton>
            <PrimaryButton
              variant="secondary"
              onClick={() => {
                setValues({ PMT: '', IY: '', N: '', PV: '', FV: '' })
                setResult(null)
              }}
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Reset
            </PrimaryButton>
          </div>
        </form>
      </Card>

      <section aria-labelledby="fin-result" aria-live="polite">
        <h2 id="fin-result" className="text-xl font-semibold tracking-tight text-navy">
          Calculator Result
        </h2>
        <Card className="mt-4 p-5 sm:p-6">
          {result === null && <p className="text-muted-foreground">Enter four known values and press Calculate.</p>}
          {typeof result === 'string' && <p className="font-medium text-destructive">{result}</p>}
          {result && typeof result !== 'string' && (
            <div className="space-y-4">
              <ResultCard
                emphasis
                label={`${fields.find((f) => f.key === result.key)!.short} — ${fields.find((f) => f.key === result.key)!.name}`}
                value={display(result.key, result.value)}
                sub={
                  result.key === 'N'
                    ? `${formatNumber(result.value / result.py, 2)} years at ${result.py} periods per year`
                    : undefined
                }
              />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <ResultCard label="PMT" value={formatCurrency(result.nums.PMT)} />
                <ResultCard label="I/Y" value={`${formatNumber(result.nums.i * result.py * 100, 4)}%`} />
                <ResultCard label="N" value={formatNumber(result.nums.N, 2)} />
                <ResultCard label="PV" value={formatCurrency(result.nums.PV)} />
                <ResultCard label="FV" value={formatCurrency(result.nums.FV)} />
              </div>
              <div className="rounded-xl bg-muted p-4 text-sm leading-relaxed text-muted-foreground">
                <p className="font-medium text-foreground">Calculation summary</p>
                <p className="mt-1">
                  {`Over ${formatNumber(result.nums.N, 2)} periods at ${formatNumber(result.nums.i * 100, 4)}% per period, payments made at the ${result.nums.t ? 'beginning' : 'end'} of each period. Total payments: ${formatCurrency(result.nums.PMT * result.nums.N)}.`}
                </p>
              </div>
            </div>
          )}
        </Card>
      </section>
    </div>
  )
}
