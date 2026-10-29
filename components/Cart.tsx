'use client'

import { X, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import Image from 'next/image'
import Link from 'next/link'
import QuantityStepper from '@/components/QuantityStepper'
import { formatZar } from '@/lib/format'

export default function Cart() {
  const items = useCartStore((state) => state.items)
  const isOpen = useCartStore((state) => state.isOpen)
  const closeCart = useCartStore((state) => state.closeCart)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const getTotal = useCartStore((state) => state.getTotal)

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60"
        onClick={closeCart}
        aria-hidden="true"
      />

      <aside
        className="fixed right-0 top-0 z-50 flex h-full w-full flex-col border-l border-black bg-white text-black shadow-xl sm:w-96"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        <div className="flex items-center justify-between border-b border-black px-5 py-4">
          <h2 id="cart-title" className="text-xl font-bold uppercase tracking-tight text-black">
            Cart
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="tap text-black hover:opacity-70"
            aria-label="Close cart"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-4 text-center">
              <ShoppingBag className="mb-4 h-12 w-12 text-neutral-700" aria-hidden="true" />
              <p className="text-lg font-semibold text-black">Your cart is empty</p>
              <p className="mt-2 text-sm text-neutral-800">
                Nothing in the bag yet. Shop the current drop and add a piece when you are ready.
              </p>
              <Link
                href="/collections/all"
                onClick={closeCart}
                className="btn-primary mt-6 w-full"
              >
                Shop the drop
              </Link>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => {
                const itemKey = item.variant ? `${item.id}-${item.variant}` : item.id
                return (
                  <li key={itemKey} className="flex gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 bg-neutral-100">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="sr-only">No image for {item.name}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-medium text-black">{item.name}</h3>
                      {item.variant ? (
                        <p className="text-xs text-neutral-800">{item.variant}</p>
                      ) : null}
                      <p className="mt-1 text-sm font-semibold text-black">
                        {formatZar(item.price)}
                      </p>
                      <div className="mt-2">
                        <QuantityStepper
                          value={item.quantity}
                          onDecrease={() => updateQuantity(itemKey, item.quantity - 1)}
                          onIncrease={() => updateQuantity(itemKey, item.quantity + 1)}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(itemKey)}
                      className="tap self-start text-black hover:opacity-70"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {items.length > 0 ? (
          <div className="space-y-3 border-t border-black p-5">
            <div className="flex justify-between text-lg font-bold text-black">
              <span>Total</span>
              <span>{formatZar(getTotal())}</span>
            </div>
            <Link href="/checkout" onClick={closeCart} className="btn-primary w-full">
              Checkout
            </Link>
            <Link href="/collections/all" onClick={closeCart} className="btn-secondary w-full">
              Continue shopping
            </Link>
          </div>
        ) : null}
      </aside>
    </>
  )
}
