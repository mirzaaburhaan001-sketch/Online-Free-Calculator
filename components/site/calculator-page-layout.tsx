
import Link from 'next/link'
import type { ReactNode } from 'react'
import type { ContentSection } from '@/lib/content'
import { cn } from '@/lib/utils'

const calculatorLinks = [
  { title: 'Percentage Calculator', href: '/percentage-calculator' },
  { title: 'Fraction Calculator', href: '/fraction-calculator' },
  { title: 'Math Calculator', href: '/math-calculator' },
  { title: 'Graphing Calculator', href: '/graphing-calculator' },
  { title: 'Finance Calculator', href: '/finance-calculator' },
  { title: 'Mortgage Calculator', href: '/mortgage-calculator' },
  { title: 'Age Calculator', href: '/age-calculator' },
]

export function CalculatorPageLayout({
  title,
  subtitle,
  description,
  sections = [],
  wide,
  children,
}: {
  title: string
  subtitle: string
  description: string
  sections?: ContentSection[]
  wide?: boolean
  children: ReactNode
}) {
  const otherCalculators = calculatorLinks.filter(
    (calculator) => calculator.title !== title,
  )

  return (
    <main className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-balance text-3xl font-bold tracking-tight text-navy sm:text-4xl">{title}</h1>
        <h2 className="mt-3 text-lg font-medium text-navy-2 first-letter:uppercase sm:text-xl">{subtitle}</h2>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{description}</p>
      </header>

      <section aria-label={`${title} tool`} className={cn('mx-auto mt-10', wide ? 'max-w-6xl' : 'max-w-3xl')}>
        {children}
      </section>

      <nav aria-label="Other Calculators" className="mx-auto mt-14 max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight text-navy">
          Other Calculators
        </h2>
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {otherCalculators.map((calculator) => (
            <li key={calculator.href}>
              <Link
                href={calculator.href}
                className="text-navy-2 underline underline-offset-4 hover:text-navy"
              >
                {calculator.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {sections.length > 0 && (
        <div className="mx-auto mt-14 max-w-3xl space-y-10">
          {sections.map((s) => (
            <ContentBlock key={s.heading} section={s} />
          ))}
        </div>
      )}
    </main>
  )
}

export function ContentBlock({ section }: { section: ContentSection }) {
  const ListTag = section.ordered ? 'ol' : 'ul'
  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight text-navy">{section.heading}</h2>
      {section.paragraphs?.map((p) => (
        <p key={p} className="mt-3 leading-relaxed text-muted-foreground">
          {p}
        </p>
      ))}
      {section.list && (
        <ListTag
          className={cn(
            'mt-4 space-y-2 pl-5 leading-relaxed text-muted-foreground',
            section.ordered ? 'list-decimal' : 'list-disc marker:text-navy-2',
          )}
        >
          {section.list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ListTag>
      )}
    </section>
  )
}
