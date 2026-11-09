

const faqs = [
  {
    question: 'How to Calculate Percentage of a Number?',
    answer:
      'To calculate the percentage of any number, divide the percentage by 100 and multiply the result by the given number. Let us understand this with an example. For example, if you want to calculate 20% of 150, multiply 150 by 20 and divide the result by 100. The answer will be 30. If you want quick and accurate results, use our Percentage Calculator.',
  },
  {
    question: 'What Is a Whole Number Fraction Calculator?',
    answer:
      'A Whole Number Fraction Calculator is an online tool that helps you perform calculations involving whole numbers and fractions. With its help, you can add, subtract, multiply, and divide fractions. You can also convert your final answer into its simplest form.',
  },
  {
    question: 'What Is a Graphing Calculator Online?',
    answer:
      'An online Graphing Calculator is a digital tool that helps users graph mathematical equations and visualize functions.',
  },
]


export function FAQSection() {
  return (
    <section className="w-full border-t border-border bg-background py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Got Questions?
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-muted-foreground">
            Find answers to common questions about our online calculators.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group rounded-xl border border-border bg-card p-5 transition-colors open:border-primary/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-foreground">
                <span>{faq.question}</span>
                <span className="text-xl text-primary transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 border-t border-border pt-4 text-sm leading-7 text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
