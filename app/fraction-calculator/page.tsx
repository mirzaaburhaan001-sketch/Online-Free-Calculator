import type { Metadata } from 'next'
import { CalculatorPageLayout } from '@/components/site/calculator-page-layout'
import { FractionCalculator } from '@/components/calculators/fraction-calculator'
import { fractionContent } from '@/lib/content'

export const metadata: Metadata = {
  title: fractionContent.title,
  description: fractionContent.description,
}

export default function Page() {
  return (
    <CalculatorPageLayout
      title={fractionContent.title}
      subtitle={fractionContent.subtitle}
      description={fractionContent.description}
      sections={fractionContent.sections}
    >
      <FractionCalculator />
    </CalculatorPageLayout>
  )
}
