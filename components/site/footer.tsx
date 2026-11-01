import Link from 'next/link'
import { calculators } from '@/lib/calculators'

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-navy">
                Home
              </Link>
            </li>
            {calculators.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="hover:text-navy">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-6 text-sm text-muted-foreground">
          {'© '}
          {new Date().getFullYear()} Online Free Calculator
        </p>
      </div>
    </footer>
  )
}
