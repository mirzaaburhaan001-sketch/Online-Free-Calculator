import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-10 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 font-semibold text-navy">
          <Image
            src="/logo.png"
            alt="Online Free Calculator"
            width={100}
            height={100}
            className="h-24 w-24 object-contain"
          />
        </Link>

        {/* Terms & Conditions — centered */}
        <nav aria-label="Footer" className="mt-4 flex justify-center">
          <Link
            href="/terms-and-conditions"
            className="rounded-full bg-sky px-6 py-2 text-sm font-semibold text-navy shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-navy hover:text-white hover:shadow-md"
          >
            Terms &amp; Conditions
          </Link>
        </nav>

        {/* Copyright */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {'© '}
          {new Date().getFullYear()} Online Free Calculator
        </p>
      </div>
    </footer>
  )
}