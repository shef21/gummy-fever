'use client'

import { useCartStore } from '@/lib/store/cart-store'

export default function OpenCartButton({
  children,
  className = 'btn-secondary',
}: {
  children: React.ReactNode
  className?: string
}) {
  const openCart = useCartStore((state) => state.openCart)

  return (
    <button type="button" onClick={openCart} className={className}>
      {children}
    </button>
  )
}
