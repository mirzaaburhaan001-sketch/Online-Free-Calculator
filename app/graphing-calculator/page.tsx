import type { Metadata } from 'next'
import { CalculatorPageLayout } from '@/components/site/calculator-page-layout'
import { GraphingCalculator } from '@/components/calculators/graphing-calculator'
import { graphingContent } from '@/lib/content'

export const metadata: Metadata = {
  title: graphingContent.title,
  description: graphingContent.description,
}

export default function Page() {
  return (
    <CalculatorPageLayout
      title={graphingContent.title}
      subtitle={graphingContent.subtitle}
      description={graphingContent.description}
      sections={graphingContent.sections}
      wide
    >
      <GraphingCalculator />
    </CalculatorPageLayout>
  )
}
