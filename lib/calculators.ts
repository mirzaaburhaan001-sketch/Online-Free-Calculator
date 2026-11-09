import {
  Percent,
  Divide,
  Calculator,
  LineChart,
  Landmark,
  Home,
  CalendarDays,
  type LucideIcon,
} from 'lucide-react'

export type CalculatorLink = {
  name: string
  href: string
  icon: LucideIcon
}

export const calculators: CalculatorLink[] = [
  { name: 'Percentage Calculator', href: '/percentage-calculator', icon: Percent },
  { name: 'Fraction Calculator', href: '/fraction-calculator', icon: Divide },
  { name: 'Math Calculator', href: '/math-calculator', icon: Calculator },
  { name: 'Graphing Calculator', href: '/graphing-calculator', icon: LineChart },
  { name: 'Finance Calculator', href: '/finance-calculator', icon: Landmark },
  { name: 'Mortgage Calculator', href: '/mortgage-calculator', icon: Home },
  { name: 'Age Calculator', href: '/age-calculator', icon: CalendarDays },
]
