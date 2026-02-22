'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Cart from '@/components/Cart'
import { useCartStore } from '@/lib/store/cart-store'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  })
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    // Here you would integrate with your payment processor (Stripe, etc.)
    // For now, we'll simulate a successful order
    
    setTimeout(() => {
      clearCart()
      setProcessing(false)
      router.push('/checkout/success')
    }, 2000)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <Cart />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <button
              onClick={() => router.push('/collections/all')}
              className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Cart />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 uppercase">Checkout</h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <section>
                <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full border border-black px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </section>

              {/* Shipping Address */}
              <section>
                <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="border border-black px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="border border-black px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Address"
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full border border-black px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="border border-black px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <input
                    type="text"
                    placeholder="Postal Code"
                    required
                    value={formData.postalCode}
                    onChange={(e) =>
                      setFormData({ ...formData, postalCode: e.target.value })
                    }
                    className="border border-black px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Country"
                  required
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className="w-full border border-black px-4 py-3 mt-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </section>

              {/* Payment Information */}
              <section>
                <h2 className="text-xl font-bold mb-4">Payment Information</h2>
                <input
                  type="text"
                  placeholder="Card Number"
                  required
                  value={formData.cardNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, cardNumber: e.target.value })
                  }
                  className="w-full border border-black px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    required
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expiryDate: e.target.value })
                    }
                    className="border border-black px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    required
                    value={formData.cvv}
                    onChange={(e) =>
                      setFormData({ ...formData, cvv: e.target.value })
                    }
                    className="border border-black px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </section>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 sticky top-20">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  {items.map((item) => {
                    const itemKey = item.variant ? `${item.id}-${item.variant}` : item.id
                    return (
                      <div key={itemKey} className="flex justify-between text-sm">
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    )
                  })}
                </div>
                <div className="border-t border-black pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full mt-6 bg-black text-white py-4 font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Processing...' : 'Complete Order'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
