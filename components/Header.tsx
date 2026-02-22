'use client'

import Link from 'next/link'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import { useState } from 'react'

export default function Header() {
  const { openCart, getItemCount } = useCartStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const itemCount = getItemCount()

  const navLinks = [
    { href: '/collections/new', label: 'NEW IN' },
    { href: '/collections/featured', label: 'FEATURED' },
    { href: '/collections/all', label: 'SHOP ALL' },
    { href: '/about', label: 'ABOUT' },
    { href: '/contact', label: 'CONTACT' },
  ]

  return (
    <header 
      className="sticky top-0 z-50 bg-white border-b border-black text-black"
      style={{ backgroundColor: '#ffffff', color: '#000000' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="!text-black text-2xl font-bold"
            style={{ color: '#000000' }}
          >
            GUMMY FEVER
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="!text-black text-sm font-medium hover:underline uppercase tracking-wide"
                style={{ color: '#000000' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Cart Button */}
          <button
            onClick={openCart}
            className="relative flex items-center space-x-2 hover:opacity-70 transition-opacity !text-black"
            style={{ color: '#000000' }}
          >
            <ShoppingCart className="w-6 h-6 !text-black" style={{ color: '#000000', fill: '#000000' }} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden !text-black"
            style={{ color: '#000000' }}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 !text-black" style={{ color: '#000000', fill: '#000000' }} />
            ) : (
              <Menu className="w-6 h-6 !text-black" style={{ color: '#000000', fill: '#000000' }} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-black">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="!text-black text-sm font-medium hover:underline uppercase tracking-wide"
                  style={{ color: '#000000' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
