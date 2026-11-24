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
    sections: [
    {
      heading: 'How to Use a Financial Calculator',
      paragraphs: [
        'A financial calculator helps you calculate important financial values, including loan payments, interest rates, present value and future value. You can use it to understand loans, investments and other financial calculations.',
        'To use the Finance Calculator, enter the known financial values and select the value you want to calculate. The calculator will work out the missing value based on the information provided.',
      ],
    },
    {
      heading: 'Understanding the Financial Calculator Variables',
      list: [
        'Number of Periods (N): The total number of payment or investment periods.',
       'Interest Rate (I/Y): The annual interest rate used in the calculation.',
        'Present Value (PV): The current value of a loan or investment.',
        'Payment (PMT): The regular payment made or received during each period.',
        'Future Value (FV): The value of an investment or loan at the end of the selected period.',
      ],
    },
    {
      heading: 'How to Calculate Loan Payments',
      paragraphs: [
        'A financial calculator can help estimate regular loan payments when you know the loan amount, interest rate and repayment period.',
        'For example, consider a $20,000 loan with a 5% annual interest rate and a repayment period of 5 years. If payments are made monthly, the calculation uses 60 payment periods and a monthly interest rate of approximately 0.4167%.',
        'Enter the known values into the calculator and solve for the payment amount to estimate the monthly repayment.',
      ],
    },
    {
      heading: 'Understanding Present Value and Future Value',
      paragraphs: [
        'Present Value (PV) represents the value of money today, while Future Value (FV) represents what that money may be worth at a later date based on an interest rate and time period.',
        'For example, investing $100 for 5 years at an annual interest rate of 10% would result in an estimated future value of approximately $161.05, assuming annual compounding.',
      ],
    },
    {
      heading: 'Tips for Using a Financial Calculator',
      list: [
        'Enter the correct loan amount or investment value.',
        'Make sure the interest rate matches the payment period.',
        'Use the correct number of monthly or yearly periods.',
        'Check all entered values before calculating.',
        'Review the result to make sure it matches your financial assumptions.',
      ],
    },
    {
      heading: 'Conclusion',
      paragraphs: [
        'A financial calculator makes it easier to understand loans, payments, interest rates and investment values. By entering accurate information and selecting the value you want to calculate, you can quickly estimate important financial results.',
      ],
    },
  ] satisfies ContentSection[],
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
      heading: 'About Our Age Calculator',
      paragraphs: [
        'Calculator Flex has created a free online Age Calculator to help you easily find out your age and how much time is left until your next birthday. This online calculator is very easy to use. Simply enter your date of birth, select the desired date, and click the Calculate button. It will show your exact age and also tell you when your next birthday is. Our Age Calculator helps you find your age quickly and easily.',
      ],
    },
    {
      heading: 'How Old Am I? Age Calculator',
      paragraphs: [
        'You just need to enter your date of birth and the desired date in the Age Calculator, then click the Calculate button to find out exactly how old you are.',
      ],
    },
    {
      heading: 'How to Calculate Age in 2026?',
      paragraphs: [
        'If you want to know your age in 2026, enter your date of birth and select a date in 2026. Then click the Calculate button to get your exact age.',
        'For example, if your date of birth is 26 July 2003 and you want to know your age on 11 November 2026, enter both dates and click Calculate Age. The result will show that you are 23 years, 3 months, and 16 days old.',
      ],
    },
  ] satisfies ContentSection[],
}
