'use client'

import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { Card, InputField, PrimaryButton, SelectField } from '@/components/site/form'
import { formatNumber, toNum } from '@/lib/format'

type Mode = 'of' | 'is' | 'increase' | 'decrease' | 'difference'

const modes: { value: Mode; label: string; a: string; b: string; aSuffix?: string }[] = [
  { value: 'of', label: 'Percentage of a number', a: 'Percentage', b: 'Number', aSuffix: '%' },
  { value: 'is', label: 'What percentage is one number of another', a: 'Number', b: 'Of total' },
  { value: 'increase', label: 'Percentage increase', a: 'Original value', b: 'New value' },
  { value: 'decrease', label: 'Percentage decrease', a: 'Original value', b: 'New value' },
  { value: 'difference', label: 'Percentage difference', a: 'First value', b: 'Second value' },
]

function compute(mode: Mode, a: number, b: number): { value: string; summary: string } | string {
  if (Number.isNaN(a) || Number.isNaN(b)) return 'Please enter both values.'
  switch (mode) {
    case 'of':
      return { value: formatNumber((a / 100) * b), summary: `${formatNumber(a)}% of ${formatNumber(b)}` }
    case 'is':
      if (b === 0) return 'The total cannot be zero.'
      return { value: `${formatNumber((a / b) * 100)}%`, summary: `${formatNumber(a)} is this percentage of ${formatNumber(b)}` }
    case 'increase':
    case 'decrease': {
      if (a === 0) return 'The original value cannot be zero.'
      const change = ((b - a) / Math.abs(a)) * 100
      const value = mode === 'increase' ? change : -change
      return {
        value: `${formatNumber(value)}%`,
        summary: `From ${formatNumber(a)} to ${formatNumber(b)} (${change >= 0 ? 'increase' : 'decrease'} of ${formatNumber(Math.abs(change))}%)`,
      }
    }
    case 'difference': {
      const avg = (Math.abs(a) + Math.abs(b)) / 2
      if (avg === 0) return 'Values cannot both be zero.'
      return {
        value: `${formatNumber((Math.abs(a - b) / avg) * 100)}%`,
        summary: `Difference between ${formatNumber(a)} and ${formatNumber(b)} relative to their average`,
      }
    }
  }
}

export function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>('of')
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [result, setResult] = useState<ReturnType<typeof compute> | null>(null)
  const config = modes.find((m) => m.value === mode)!

  const reset = () => {
    setA('')
    setB('')
    setResult(null)
  }

  return (
    <Card className="p-5 sm:p-8">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setResult(compute(mode, toNum(a), toNum(b)))
        }}
        className="space-y-6"
      >
        <SelectField
          label="Calculation type"
          value={mode}
          onChange={(e) => {
            setMode(e.target.value as Mode)
            reset()
          }}
          options={modes.map((m) => ({ value: m.value, label: m.label }))}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label={config.a}
            type="number"
            inputMode="decimal"
            step="any"
            placeholder="0"
            suffix={config.aSuffix}
            value={a}
            onChange={(e) => setA(e.target.value)}
          />
          <InputField
            label={config.b}
            type="number"
            inputMode="decimal"
            step="any"
            placeholder="0"
            value={b}
            onChange={(e) => setB(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <PrimaryButton type="submit" className="sm:flex-1">
            Calculate
          </PrimaryButton>
          <PrimaryButton variant="secondary" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </PrimaryButton>
        </div>
      </form>

      <div aria-live="polite" className="mt-6 rounded-xl border border-[#D6E6FB] bg-sky p-5 sm:p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-navy">Result</p>
        {result === null ? (
          <p className="mt-2 text-navy">Enter values and press Calculate.</p>
        ) : typeof result === 'string' ? (
          <p className="mt-2 font-medium text-destructive">{result}</p>
        ) : (
          <>
            <p className="mt-1 text-4xl font-bold tabular-nums tracking-tight text-navy">{result.value}</p>
           <p className="mt-2 text-sm text-navy">{result.summary}</p>
          </>
        )}
      </div>
    </Card>
  )
}
