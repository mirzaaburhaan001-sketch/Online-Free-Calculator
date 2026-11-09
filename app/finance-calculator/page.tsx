import type { Metadata } from 'next'
import { CalculatorPageLayout } from '@/components/site/calculator-page-layout'
import { FinanceCalculator } from '@/components/calculators/finance-calculator'
import { financeContent } from '@/lib/content'

export const metadata: Metadata = {
  title: financeContent.title,
  description: financeContent.description,
}

export default function Page() {
  return (
    <CalculatorPageLayout
      title={financeContent.title}
      subtitle={financeContent.subtitle}
      description={financeContent.description}
      sections={financeContent.sections}
      wide
    >
      <FinanceCalculator />
    </CalculatorPageLayout>
  )
}
