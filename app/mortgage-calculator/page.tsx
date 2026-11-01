import type { Metadata } from 'next'
import { CalculatorPageLayout } from '@/components/site/calculator-page-layout'
import { MortgageCalculator } from '@/components/calculators/mortgage-calculator'
import { mortgageContent } from '@/lib/content'

export const metadata: Metadata = {
  title: mortgageContent.title,
  description: mortgageContent.description,
}

export default function Page() {
  return (
    <CalculatorPageLayout
      title={mortgageContent.title}
      subtitle={mortgageContent.subtitle}
      description={mortgageContent.description}
      sections={mortgageContent.sections}
      wide
    >
      <MortgageCalculator />
    </CalculatorPageLayout>
  )
}
