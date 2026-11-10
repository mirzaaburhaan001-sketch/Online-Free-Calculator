// Replace the description/section text below with the exact copy from the client requirements document.

export type ContentSection = {
  heading: string
  paragraphs?: string[]
  list?: string[]
  ordered?: boolean
}

export const homeContent = {
  title: 'Online Free Calculator',
  subtitle: 'Free Online Calculator – Easy and Fast to Use',
  description:
    'Online Free Calculator gives you a collection of simple, accurate calculators in one place. Choose a tool below to work out percentages, fractions, everyday math, graphs, financial values, mortgage payments and age in seconds.',
  about: {
    heading: 'About Our Online Free Calculator',
    paragraphs: [
      'Our Online Free Calculator is built to make everyday calculations quick and clear. Every tool works directly in your browser, with no sign-up or download required.',
    ],
  } satisfies ContentSection,
}

export const percentageContent = {
  title: 'Percentage Calculator',
  subtitle: 'Free Percentage Calculator Online',
  description:
    'Use this free percentage calculator to find the percentage of a number, compare two values, and work out percentage increase, decrease or difference.',
  sections: [
    {
      heading: 'About Percentage Calculator',
      paragraphs: [
        'Select the type of calculation you need, enter your numbers, and press Calculate to see the result instantly.',
      ],
    },
  ] satisfies ContentSection[],
}

export const fractionContent = {
  title: 'Fraction Calculator',
  subtitle: 'fraction calculator online',
  description:
    'Add, subtract, multiply and divide fractions, and convert between fractions, mixed numbers and decimals.',
  sections: [
    {
      heading: 'What Can You Do With This Fraction Calculator?',
      list: [
        'Add, subtract, multiply and divide fractions',
        'Simplify results automatically',
        'Convert improper fractions to mixed numbers',
        'Convert fractions to and from decimals',
      ],
    },
    {
      heading: 'How to Use the Fraction Calculator',
      ordered: true,
      list: [
        'Enter the numerator and denominator of the first fraction.',
        'Choose an operation.',
        'Enter the second fraction.',
        'Press Calculate to see the simplified result and steps.',
      ],
    },
  ] satisfies ContentSection[],
}

export const mathContent = {
  title: 'Math Calculator',
  subtitle: 'online math calculator',
  description:
    'Perform everyday arithmetic with parentheses, percentages, negative numbers, scientific notation and adjustable decimal precision.',
  sections: [
    {
      heading: 'What Can You Do With This Math Calculator?',
      list: [
        'Add, subtract, multiply and divide',
        'Group operations with parentheses',
        'Work with percentages and negative numbers',
        'Enter values in scientific notation',
        'Round results to a chosen precision',
      ],
    },
    {
      heading: 'How to Use the Math Calculator',
      ordered: true,
      list: [
        'Type an expression using the keypad or your keyboard.',
        'Choose a rounding precision if needed.',
        'Press = or Enter to see the result.',
      ],
    },
  ] satisfies ContentSection[],
}

export const graphingContent = {
  title: 'Graphing Calculator',
  subtitle: 'graphing calculator online free',
  description:
    'Plot functions, graph equations and points, and explore algebra visually with interactive sliders.',
  sections: [
    {
      heading: 'What Can You Do With This Graphing Calculator?',
      list: [
        'Plot functions',
        'Graph equations',
        'Plot points',
        'Visualize algebra',
        'Use interactive sliders',
        'Explore geometry',
        'Analyze graphs',
      ],
    },
    {
      heading: 'How to Use the Graphing Calculator',
      ordered: true,
      list: [
        'Type an equation such as y = a*x^2 + 1.',
        'Press Add Equation to plot it.',
        'Adjust slider a to see the graph change.',
        'Zoom in, zoom out or reset the view.',
      ],
    },
  ] satisfies ContentSection[],
}

export const financeContent = {
  title: 'Finance Calculator',
  subtitle: 'free finance calculator online',
  description:
    'Solve for any time value of money variable — payment, interest rate, number of periods, present value or future value.',
  sections: [] as ContentSection[],
}

export const mortgageContent = {
  title: 'Mortgage Calculator',
  subtitle: 'free online mortgage calculator',
  description:
    'Estimate your monthly mortgage payment including taxes, insurance, PMI and HOA fees, and see how extra payments shorten your loan.',
  sections: [] as ContentSection[],
}

export const ageContent = {
  title: 'Age Calculator',
  subtitle: 'age calculator online',
  description:
    'Calculate your exact age in years, months, weeks, days, hours, minutes and seconds, and see how many days remain until your next birthday.',
  sections: [
  {
    heading: 'What Can You Do With This Age Calculator?',
    list: [
      'Calculate your exact age in years, months, weeks and days',
      'Find your age in hours, minutes and seconds',
      'Check how many days are left until your next birthday',
      'Calculate your age using your date of birth and a target date',
    ],
  },
  {
    heading: 'How to Use the Age Calculator',
    ordered: true,
    list: [
      'Enter your date of birth.',
      'Select the target date.',
      'Click the Calculate button.',
      'View your exact age.',
      'Check how many days remain until your next birthday.',
    ],
  },
 
{
  heading: 'Frequently Asked Questions',
},
{
  heading: 'How to Calculate Age in 2026?',
  paragraphs: [
    'Enter your date of birth, select a date in 2026, and click Calculate to find your exact age.',
  ],
},
{
  heading: 'How Old Am I? Age Calculator',
  paragraphs: [
    'Enter your birth date and target date into the Age Calculator to find out exactly how old you are.',
  ],
},

] satisfies ContentSection[],
}
