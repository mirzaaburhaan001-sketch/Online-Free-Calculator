'use client'

import { useState } from 'react'
import { Card, InputField, PrimaryButton, ResultCard, SegmentedControl, SelectField } from '@/components/site/form'
import { amortize, monthlyPI, type MortgageInputs } from '@/lib/mortgage'
import { formatCurrency, formatDuration, toNum } from '@/lib/format'

const defaults = {
  homePrice: '400000',
  down: '20',
  years: '30',
  rate: '6.5',
  taxRate: '1.2',
  insurance: '1500',
  pmiRate: '0.5',
  hoa: '0',
  extraMonthly: '0',
  extraYearly: '0',
  extraOnce: '0',
  extraOnceMonth: '12',
}

type Form = typeof defaults

function BalanceChart({ original, extra }: { original: number[]; extra: number[] }) {
  const W = 600
  const H = 200
  const max = original[0] || 1
  const len = original.length - 1 || 1
  const line = (arr: number[]) =>
    arr
      .map((b, i) => `${i ? 'L' : 'M'}${((i / len) * W).toFixed(1)},${(H - (b / max) * H).toFixed(1)}`)
      .join('')
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-44 w-full" preserveAspectRatio="none" role="img" aria-label="Loan balance over time">
        <path d={line(original)} fill="none" stroke="#9AB3D6" strokeWidth={2} vectorEffect="non-scaling-stroke" />
        <path d={line(extra)} fill="none" stroke="#101D38" strokeWidth={2.5} vectorEffect="non-scaling-stroke" />
      </svg>
      <figcaption className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 bg-[#9AB3D6]" aria-hidden="true" /> Original schedule
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 bg-navy" aria-hidden="true" /> With extra payments
        </span>
      </figcaption>
    </figure>
  )
}

export function MortgageCalculator() {
  const [form, setForm] = useState<Form>(defaults)
  const [downMode, setDownMode] = useState<'percent' | 'amount'>('percent')
  const [submitted, setSubmitted] = useState<Form>(defaults)
  const [submittedMode, setSubmittedMode] = useState(downMode)
  const [balanceYear, setBalanceYear] = useState(5)

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const n = (k: keyof Form) => toNum(submitted[k]) || 0
  const homePrice = n('homePrice')
  const downPayment = submittedMode === 'percent' ? (homePrice * n('down')) / 100 : n('down')
  const loan = Math.max(0, homePrice - downPayment)
  const valid = homePrice > 0 && loan > 0 && n('years') > 0

  const inputs: MortgageInputs = {
    homePrice,
    downPayment,
    years: n('years'),
    rate: n('rate'),
    taxRate: n('taxRate'),
    insurance: n('insurance'),
    pmiRate: downPayment / homePrice < 0.2 ? n('pmiRate') : 0,
    hoa: n('hoa'),
    extraMonthly: n('extraMonthly'),
    extraYearly: n('extraYearly'),
    extraOnce: n('extraOnce'),
    extraOnceMonth: n('extraOnceMonth'),
  }

  const pi = valid ? monthlyPI(loan, inputs.rate, inputs.years) : 0
  const tax = (homePrice * inputs.taxRate) / 100 / 12
  const ins = inputs.insurance / 12
  const pmi = (loan * inputs.pmiRate) / 100 / 12
  const monthly = pi + tax + ins + pmi + inputs.hoa
  const original = valid ? amortize(inputs, false) : null
  const extra = valid ? amortize(inputs, true) : null
  const hasExtras = inputs.extraMonthly + inputs.extraYearly + inputs.extraOnce > 0
  const breakdown = [
    { label: 'Principal & interest', value: pi, color: '#101D38' },
    { label: 'Property tax', value: tax, color: '#2D5A9E' },
    { label: 'Home insurance', value: ins, color: '#6B93CF' },
    { label: 'PMI', value: pmi, color: '#A9C4EA' },
    { label: 'HOA fees', value: inputs.hoa, color: '#D6E6FB' },
  ].filter((b) => b.value > 0)

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <Card className="p-5 sm:p-6">
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault()
            setSubmitted(form)
            setSubmittedMode(downMode)
          }}
        >
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold uppercase tracking-wider text-navy-2/70">Loan details</legend>
            <InputField label="Home price" prefix="$" type="number" min="0" step="any" value={form.homePrice} onChange={set('homePrice')} />
            <div className="space-y-1.5">
              <div className="flex items-end justify-between gap-3">
                <InputField
                  label="Down payment"
                  prefix={downMode === 'amount' ? '$' : undefined}
                  suffix={downMode === 'percent' ? '%' : undefined}
                  type="number"
                  min="0"
                  step="any"
                  value={form.down}
                  onChange={set('down')}
                  className="flex-1"
                />
                <div className="w-32">
                  <SegmentedControl
                    label="Down payment unit"
                    value={downMode}
                    onChange={(m) => {
                      const price = toNum(form.homePrice) || 0
                      const v = toNum(form.down) || 0
                      setForm((f) => ({
                        ...f,
                        down: m === 'amount' ? String(Math.round((price * v) / 100)) : price ? String(+((v / price) * 100).toFixed(2)) : '0',
                      }))
                      setDownMode(m)
                    }}
                    options={[
                      { value: 'percent', label: '%' },
                      { value: 'amount', label: '$' },
                    ]}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SelectField
                label="Loan term"
                value={form.years}
                onChange={set('years')}
                options={['10', '15', '20', '25', '30', '40'].map((y) => ({ value: y, label: `${y} years` }))}
              />
              <InputField label="Interest rate" suffix="%" type="number" min="0" step="any" value={form.rate} onChange={set('rate')} />
            </div>
          </fieldset>

          <fieldset className="space-y-4 border-t border-border pt-5">
            <legend className="sr-only">Taxes and fees</legend>
            <p className="text-sm font-semibold uppercase tracking-wider text-navy-2/70" aria-hidden="true">
              Taxes & fees
            </p>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Property tax" suffix="%/yr" type="number" min="0" step="any" value={form.taxRate} onChange={set('taxRate')} />
              <InputField label="Home insurance" prefix="$" suffix="/yr" type="number" min="0" step="any" value={form.insurance} onChange={set('insurance')} />
              <InputField
                label="PMI"
                suffix="%/yr"
                type="number"
                min="0"
                step="any"
                value={form.pmiRate}
                onChange={set('pmiRate')}
                hint="Applies when down payment is under 20%"
              />
              <InputField label="HOA fees" prefix="$" suffix="/mo" type="number" min="0" step="any" value={form.hoa} onChange={set('hoa')} />
            </div>
          </fieldset>

          <fieldset className="space-y-4 border-t border-border pt-5">
            <legend className="sr-only">Extra payments</legend>
            <p className="text-sm font-semibold uppercase tracking-wider text-navy-2/70" aria-hidden="true">
              Extra payments
            </p>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Extra monthly" prefix="$" type="number" min="0" step="any" value={form.extraMonthly} onChange={set('extraMonthly')} />
              <InputField label="Extra yearly" prefix="$" type="number" min="0" step="any" value={form.extraYearly} onChange={set('extraYearly')} />
              <InputField label="One-time payment" prefix="$" type="number" min="0" step="any" value={form.extraOnce} onChange={set('extraOnce')} />
              <InputField label="In month #" type="number" min="1" step="1" value={form.extraOnceMonth} onChange={set('extraOnceMonth')} />
            </div>
          </fieldset>

          <PrimaryButton type="submit" className="w-full">
            Calculate
          </PrimaryButton>
        </form>
      </Card>

      <div className="space-y-6" aria-live="polite">
        {!valid || !original || !extra ? (
          <Card className="p-6 text-destructive">Please enter a valid home price, down payment and loan term.</Card>
        ) : (
          <>
            <Card className="p-5 sm:p-6">
              <ResultCard emphasis label="Estimated monthly payment" value={formatCurrency(monthly)} sub={`Loan amount ${formatCurrency(loan, 0)}`} />
              <div className="mt-5 flex h-3 overflow-hidden rounded-full" aria-hidden="true">
                {breakdown.map((b) => (
                  <span key={b.label} style={{ width: `${(b.value / monthly) * 100}%`, backgroundColor: b.color }} />
                ))}
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                {breakdown.map((b) => (
                  <div key={b.label} className="flex items-center justify-between">
                    <dt className="flex items-center gap-2 text-muted-foreground">
                      <span className="size-2.5 rounded-full" style={{ backgroundColor: b.color }} aria-hidden="true" />
                      {b.label}
                    </dt>
                    <dd className="font-medium tabular-nums text-foreground">{formatCurrency(b.value)}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <ResultCard label="Total loan amount" value={formatCurrency(loan, 0)} />
                <ResultCard label="Total interest" value={formatCurrency(extra.totalInterest, 0)} />
                <ResultCard label="Total loan cost" value={formatCurrency(loan + extra.totalInterest, 0)} />
                <ResultCard label="Payoff time" value={formatDuration(extra.months)} />
              </div>
            </Card>

            <Card className="p-5 sm:p-6">
              <h3 className="font-semibold text-navy">Extra payment impact</h3>
              {!hasExtras && (
                <p className="mt-1 text-sm text-muted-foreground">Add extra payments to see how much time and interest you can save.</p>
              )}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <ResultCard label="Original payoff" value={formatDuration(original.months)} />
                <ResultCard label="New payoff" value={formatDuration(extra.months)} />
                <ResultCard label="Interest saved" value={formatCurrency(original.totalInterest - extra.totalInterest, 0)} />
                <ResultCard
                  label="Time saved"
                  value={formatDuration(original.months - extra.months)}
                />
              </div>
              <div className="mt-5">
                <BalanceChart original={original.balances} extra={extra.balances} />
              </div>
              <div className="mt-5 border-t border-border pt-5">
                <div className="flex items-center justify-between">
                  <label htmlFor="balance-year" className="text-sm font-medium">
                    Remaining loan balance after year {balanceYear}
                  </label>
                  <span className="font-semibold tabular-nums text-navy">
                    {formatCurrency(extra.balances[Math.min(balanceYear * 12, extra.balances.length - 1)], 0)}
                  </span>
                </div>
                <input
                  id="balance-year"
                  type="range"
                  min={1}
                  max={inputs.years}
                  value={Math.min(balanceYear, inputs.years)}
                  onChange={(e) => setBalanceYear(Number(e.target.value))}
                  className="mt-3 w-full accent-navy"
                />
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
