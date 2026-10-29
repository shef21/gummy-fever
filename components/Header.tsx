'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import { useState } from 'react'

const navLinks = [
  { href: '/collections/new', label: 'New In' },
  { href: '/collections/featured', label: 'Featured' },
  { href: '/collections/all', label: 'Shop All' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const openCart = useCartStore((state) => state.openCart)
  const itemCount = useCartStore((state) =>
    state.items.reduce((count, item) => count + item.quantity, 0)
  )
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-black bg-white text-black">
      <div className="page-shell">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex min-h-11 items-center shrink-0">
            <Image
              src="/hero.jpeg"
              alt="Gummy Fever home"
              width={140}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="tap px-3 text-xs font-semibold uppercase tracking-[0.16em] text-black hover:underline underline-offset-4"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={openCart}
              className="relative tap text-black hover:opacity-70"
              aria-label={itemCount > 0 ? `Open cart, ${itemCount} items` : 'Open cart'}
            >
              <ShoppingCart className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
              {itemCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[11px] font-bold leading-none text-white">
                  {itemCount}
                </span>
              ) : null}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="tap text-black md:hidden"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen ? (
          <nav
            id="mobile-nav"
            className="border-t border-black py-3 md:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex min-h-11 items-center text-sm font-semibold uppercase tracking-[0.16em] text-black"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        ) : null}
      </div>
    </header>
  )
}
