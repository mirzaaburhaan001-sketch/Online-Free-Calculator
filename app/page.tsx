
import { calculators } from '@/lib/calculators'
import { homeContent } from '@/lib/content'
import { CalculatorCard } from '@/components/site/calculator-card'
import { ContentBlock } from '@/components/site/calculator-page-layout'
import { FAQSection } from '@/components/site/faq-section'

export default function HomePage() {
  return (
    <>
      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="mx-auto max-w-3xl pb-12 pt-14 text-center sm:pt-20">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-navy sm:text-5xl">{homeContent.title}</h1>
          <h2 className="mt-4 text-balance text-lg font-medium text-navy-2 sm:text-xl">{homeContent.subtitle}</h2>
          <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">{homeContent.description}</p>
        </header>

        <section aria-labelledby="tools-heading">
          <h2 id="tools-heading" className="text-2xl font-semibold tracking-tight text-navy">
            Our Calculator Tools
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {calculators.map((c) => (
              <li key={c.href}>
                <CalculatorCard calculator={c} />
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-16 max-w-3xl">
          <ContentBlock section={homeContent.about} />
        </div>
      </main>

      <FAQSection />
    </>
  )
}
