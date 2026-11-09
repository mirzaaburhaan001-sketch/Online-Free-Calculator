import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { CalculatorLink } from '@/lib/calculators'

export function CalculatorCard({ calculator }: { calculator: CalculatorLink }) {
  const { name, href, icon: Icon } = calculator
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-border bg-white p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:border-navy-2/30 hover:shadow-md hover:shadow-navy/5 focus-visible:ring-3 focus-visible:ring-navy-2/25 outline-none"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-sky text-navy transition-colors group-hover:bg-navy group-hover:text-white">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="flex-1 font-semibold text-navy">{name}</span>
      <ArrowRight
        className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-navy"
        aria-hidden="true"
      />
    </Link>
  )
}
