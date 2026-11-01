'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Calculator, ChevronDown, Menu, X } from 'lucide-react'
import { calculators } from '@/lib/calculators'
import { cn } from '@/lib/utils'

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMobileOpen(false)
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const isCalculatorRoute = calculators.some((c) => c.href === pathname)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
      >
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-navy">
          <span className="flex size-8 items-center justify-center rounded-lg bg-navy text-white">
            <Calculator className="size-4" aria-hidden="true" />
          </span>
          <span className="text-[15px] tracking-tight">Online Free Calculator</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className={cn(
              'rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sky hover:text-navy',
              pathname === '/' ? 'text-navy' : 'text-muted-foreground',
            )}
          >
            Home
          </Link>
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="calculators-menu"
              onClick={() => setMenuOpen((o) => !o)}
              className={cn(
                'flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sky hover:text-navy',
                isCalculatorRoute ? 'text-navy' : 'text-muted-foreground',
              )}
            >
              Calculators
              <ChevronDown
                className={cn('size-4 transition-transform', menuOpen && 'rotate-180')}
                aria-hidden="true"
              />
            </button>
            {menuOpen && (
              <ul
                id="calculators-menu"
                className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-border bg-white p-1.5 shadow-lg shadow-navy/5"
              >
                {calculators.map(({ name, href, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={pathname === href ? 'page' : undefined}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sky',
                        pathname === href ? 'bg-sky font-medium text-navy' : 'text-foreground',
                      )}
                    >
                      <Icon className="size-4 text-navy-2" aria-hidden="true" />
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-lg text-navy hover:bg-sky md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
        </button>
      </nav>

      {mobileOpen && (
        <div id="mobile-menu" className="border-t border-border bg-white md:hidden">
          <ul className="mx-auto max-w-6xl space-y-1 px-4 py-3">
            <li>
              <Link
                href="/"
                className={cn(
                  'block rounded-lg px-3 py-2.5 text-sm font-medium',
                  pathname === '/' ? 'bg-sky text-navy' : 'text-foreground',
                )}
              >
                Home
              </Link>
            </li>
            <li className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Calculators
            </li>
            {calculators.map(({ name, href, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={pathname === href ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm',
                    pathname === href ? 'bg-sky font-medium text-navy' : 'text-foreground',
                  )}
                >
                  <Icon className="size-4 text-navy-2" aria-hidden="true" />
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
