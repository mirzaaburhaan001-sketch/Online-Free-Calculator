'use client'

import { useState } from 'react'
import { Cake } from 'lucide-react'
import { Card, InputField, PrimaryButton, ResultCard } from '@/components/site/form'
import { formatNumber } from '@/lib/format'

function parseDate(v: string) {
  const [y, m, d] = v.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function todayISO() {
  const t = new Date()
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

type AgeResult = {
  years: number
  months: number
  days: number
  totalMonths: number
  totalDays: number
  nextBirthdayDays: number
  nextBirthdayDate: Date
}

function calculateAge(birth: Date, target: Date): AgeResult | string {
  if (target < birth) return 'The age-at date must be on or after the date of birth.'
  let years = target.getFullYear() - birth.getFullYear()
  let months = target.getMonth() - birth.getMonth()
  let days = target.getDate() - birth.getDate()
  if (days < 0) {
    months--
    days += daysInMonth(target.getFullYear(), target.getMonth() - 1)
  }
  if (months < 0) {
    years--
    months += 12
  }
  const totalDays = Math.round((Date.UTC(target.getFullYear(), target.getMonth(), target.getDate()) - Date.UTC(birth.getFullYear(), birth.getMonth(), birth.getDate())) / 86_400_000)
  let next = new Date(target.getFullYear(), birth.getMonth(), birth.getDate())
  if (next < target) next = new Date(target.getFullYear() + 1, birth.getMonth(), birth.getDate())
  const nextBirthdayDays = Math.round(
    (Date.UTC(next.getFullYear(), next.getMonth(), next.getDate()) - Date.UTC(target.getFullYear(), target.getMonth(), target.getDate())) / 86_400_000,
  )
  return { years, months, days, totalMonths: years * 12 + months, totalDays, nextBirthdayDays, nextBirthdayDate: next }
}

export function AgeCalculator() {
  const [birth, setBirth] = useState('')
  const [target, setTarget] = useState(todayISO)
  const [result, setResult] = useState<AgeResult | string | null>(null)

  return (
    <Card className="p-5 sm:p-8">
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
          if (!birth || !target) return setResult('Please select both dates.')
          setResult(calculateAge(parseDate(birth), parseDate(target)))
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="Date of Birth" type="date" value={birth} max={target} onChange={(e) => setBirth(e.target.value)} required />
          <InputField label="Age at the Date of" type="date" value={target} onChange={(e) => setTarget(e.target.value)} required />
        </div>
        <PrimaryButton type="submit" className="w-full">
          Calculate Age
        </PrimaryButton>
      </form>

      <div aria-live="polite" className="mt-6">
        {typeof result === 'string' && <p className="font-medium text-destructive">{result}</p>}
        {result && typeof result !== 'string' && (
          <div className="space-y-4">
            <div className="rounded-xl bg-navy p-6 text-white">
              <p className="text-xs font-medium uppercase tracking-wider text-white/70">Age</p>
              <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                {result.years} <span className="text-lg font-medium text-white/70">years</span> {result.months}{' '}
                <span className="text-lg font-medium text-white/70">months</span> {result.days}{' '}
                <span className="text-lg font-medium text-white/70">days</span>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <ResultCard label="Total months" value={formatNumber(result.totalMonths, 0)} />
              <ResultCard label="Total weeks" value={formatNumber(Math.floor(result.totalDays / 7), 0)} sub={`${result.totalDays % 7} days`} />
              <ResultCard label="Total days" value={formatNumber(result.totalDays, 0)} />
              <ResultCard label="Total hours" value={formatNumber(result.totalDays * 24, 0)} />
              <ResultCard label="Total minutes" value={formatNumber(result.totalDays * 1440, 0)} />
              <ResultCard label="Total seconds" value={formatNumber(result.totalDays * 86400, 0)} />
            </div>
            <div className="flex items-center gap-4 rounded-xl border border-[#D6E6FB] bg-sky p-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-navy">
                <Cake className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-semibold text-navy">
                  {result.nextBirthdayDays === 0 ? 'Happy birthday!' : `${result.nextBirthdayDays} days until next birthday`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {result.nextBirthdayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
