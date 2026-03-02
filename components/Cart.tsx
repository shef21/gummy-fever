'use client'

import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import Image from 'next/image'
import Link from 'next/link'

export default function Cart() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getTotal,
  } = useCartStore()

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={closeCart}
      />

      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black">
          <h2 className="text-xl font-bold uppercase text-black">Cart</h2>
          <button
            onClick={closeCart}
            className="hover:opacity-70 transition-opacity text-black"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-black">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => {
                const itemKey = item.variant ? `${item.id}-${item.variant}` : item.id
                return (
                <div key={itemKey} className="flex gap-4">
                  <div className="relative w-20 h-20 bg-gray-100 flex-shrink-0">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm text-black">{item.name}</h3>
                    {item.variant && (
                      <p className="text-xs text-black">{item.variant}</p>
                    )}
                    <p className="text-sm font-medium mt-1 text-black">
                      R {item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            itemKey,
                            item.quantity - 1
                          )
                        }
                        className="border border-black w-8 h-8 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-black">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            itemKey,
                            item.quantity + 1
                          )
                        }
                        className="border border-black w-8 h-8 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(itemKey)}
                    className="text-black hover:text-black transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )})}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-black p-6 space-y-4">
            <div className="flex justify-between text-lg font-bold text-black">
              <span>Total</span>
              <span>R {getTotal().toFixed(2)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full bg-black text-white py-3 text-center font-medium hover:bg-gray-800 transition-colors uppercase tracking-wide"
            >
              Checkout
            </Link>
            <Link
              href="/collections/all"
              onClick={closeCart}
              className="block w-full border border-black py-3 text-center font-medium hover:bg-black hover:text-white transition-colors uppercase tracking-wide"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
