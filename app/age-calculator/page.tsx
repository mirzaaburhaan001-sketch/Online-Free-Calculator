import type { Metadata } from 'next'
import { CalculatorPageLayout } from '@/components/site/calculator-page-layout'
import { AgeCalculator } from '@/components/calculators/age-calculator'
import { ageContent } from '@/lib/content'

export const metadata: Metadata = {
  title: ageContent.title,
  description: ageContent.description,
}

export default function Page() {
  return (
    <CalculatorPageLayout
      title={ageContent.title}
      subtitle={ageContent.subtitle}
      description={ageContent.description}
      sections={ageContent.sections}
    >
      <AgeCalculator />
    </CalculatorPageLayout>
  )
}
