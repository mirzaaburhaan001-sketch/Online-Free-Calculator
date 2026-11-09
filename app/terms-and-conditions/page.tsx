
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Read the Terms and Conditions of Calculator Flex.',
}

const sections = [
  {
    title: 'Use of Our Website',
    content:
      'Our website is created to make your everyday calculations easier. You agree to use this website only for lawful purposes.',
  },
  {
    title: 'Accuracy of Results',
    content:
      'We always try our best to provide you with accurate calculation results. However, we cannot guarantee that our tools will always provide completely accurate results at all times. We recommend that you verify the results yourself before making any important decisions.',
  },
  {
    title: 'Intellectual Property',
    content:
      'All designs, text, and other information available on our website are protected by intellectual property rights. You are not allowed to steal or copy any of our website content without permission.',
  },
  {
    title: 'Limitation of Liability',
    content:
      'Calculator Flex is not responsible for any loss or damage caused by relying on our website or its calculation results.',
  },
  {
    title: 'Changes to These Terms',
    content:
      'We have the right to make any changes to these Terms and Conditions at any time. Any changes we make will be published on this page.',
  },
  {
    title: 'Contact Us',
    content:
      'If you have any questions, you can feel free to contact us through our Contact Us page.',
  },
]

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-background py-16 md:py-24">
      <article className="mx-auto max-w-4xl px-4 sm:px-6">
        <header className="mb-12">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Calculator Flex
          </span>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Terms and Conditions
          </h1>

          <p className="mt-5 text-base leading-8 text-muted-foreground">
            Welcome to Calculator Flex! Before using our website, you should
            know and agree to follow some of our guidelines. Please read these
            guidelines carefully before using our website.
          </p>
        </header>

        <div className="space-y-9">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-3 text-xl font-semibold text-foreground">
                {section.title}
              </h2>
              <p className="text-sm leading-8 text-muted-foreground md:text-base">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-sm leading-7 text-muted-foreground">
            By continuing to use our Calculator Flex website, you agree to
            follow all these Terms and Conditions.
          </p>
        </div>
      </article>
    </main>
  )
}
