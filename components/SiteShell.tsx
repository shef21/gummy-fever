'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Cart from '@/components/Cart'

export default function SiteShell({
  children,
  mainClassName = '',
}: {
  children: React.ReactNode
  mainClassName?: string
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Header />
      <Cart />
      <main id="main-content" className={`flex-1 ${mainClassName}`}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
