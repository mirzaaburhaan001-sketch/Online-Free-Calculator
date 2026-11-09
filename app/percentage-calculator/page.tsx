import type { Metadata } from 'next'
import { CalculatorPageLayout } from '@/components/site/calculator-page-layout'
import { PercentageCalculator } from '@/components/calculators/percentage-calculator'
import { percentageContent } from '@/lib/content'

export const metadata: Metadata = {
  title: percentageContent.title,
  description: percentageContent.description,
}

export default function Page() {
  return (
    <CalculatorPageLayout
      title={percentageContent.title}
      subtitle={percentageContent.subtitle}
      description={percentageContent.description}
      sections={percentageContent.sections}
    >
      <PercentageCalculator />
    </CalculatorPageLayout>
  )
}
