import type { Metadata } from 'next'
import { CalculatorPageLayout } from '@/components/site/calculator-page-layout'
import { MathCalculator } from '@/components/calculators/math-calculator'
import { mathContent } from '@/lib/content'

export const metadata: Metadata = {
  title: mathContent.title,
  description: mathContent.description,
  alternates: {
    canonical: '/math-calculator',
  },
}
export default function Page() {
  return (
    <CalculatorPageLayout
      title={mathContent.title}
      subtitle={mathContent.subtitle}
      description={mathContent.description}
      sections={mathContent.sections}
      wide
    >
      <MathCalculator />
    </CalculatorPageLayout>
  )
}
