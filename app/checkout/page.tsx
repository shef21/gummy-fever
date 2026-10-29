'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import SiteShell from '@/components/SiteShell'
import StatusScreen from '@/components/StatusScreen'
import { useCartStore } from '@/lib/store/cart-store'
import { createClient } from '@/lib/supabase/client'
import { formatZar } from '@/lib/format'

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const getTotal = useCartStore((state) => state.getTotal)
  const clearCart = useCartStore((state) => state.clearCart)
  const [authLoading, setAuthLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
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

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient()
      if (!supabase) {
        setUserId(null)
        setAuthLoading(false)
        return
      }

      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Checkout auth.getUser() failed', error)
        setUserId(null)
      } else {
        setUserId(data.user?.id ?? null)
      }
      setAuthLoading(false)
    }
    loadUser()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) {
      setProcessing(false)
      router.push(`/login?returnUrl=${encodeURIComponent('/checkout')}`)
      return
    }
    setProcessing(true)

    setTimeout(() => {
      clearCart()
      setProcessing(false)
      router.push('/checkout/success')
    }, 2000)
  }

  if (items.length === 0) {
    return (
      <SiteShell>
        <StatusScreen
          kicker="Checkout"
          title="Your cart is empty"
          body="Add a piece from the current drop before you check out."
          actions={
            <>
              <Link href="/collections/all" className="btn-primary">
                Continue shopping
              </Link>
              <Link href="/" className="btn-secondary">
                Back home
              </Link>
            </>
          }
        />
      </SiteShell>
    )
  }

  const field =
    'input-field'

  return (
    <SiteShell>
      <div className="page-shell max-w-4xl py-12 sm:py-16">
        <p className="eyebrow">Order</p>
        <h1 className="display-title mt-3">Checkout</h1>
        <p className="mt-4 max-w-2xl text-sm text-neutral-800">
          Checkout requires an account. No payment processor is connected yet — completing an
          order simulates a successful placement after you are signed in. Do not enter live card
          details.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <section>
              <h2 className="mb-4 text-xl font-bold text-black">Contact information</h2>
              <label htmlFor="email" className="mb-2 block font-medium text-black">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={field}
              />
            </section>

            <section>
              <h2 className="mb-4 text-xl font-bold text-black">Shipping address</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="mb-2 block font-medium text-black">
                    First name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    autoComplete="given-name"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={field}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="mb-2 block font-medium text-black">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    autoComplete="family-name"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={field}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="address" className="mb-2 block font-medium text-black">
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  autoComplete="street-address"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={field}
                />
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="city" className="mb-2 block font-medium text-black">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    autoComplete="address-level2"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={field}
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="mb-2 block font-medium text-black">
                    Postal code
                  </label>
                  <input
                    id="postalCode"
                    type="text"
                    name="postalCode"
                    autoComplete="postal-code"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className={field}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="country" className="mb-2 block font-medium text-black">
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  name="country"
                  autoComplete="country-name"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className={field}
                />
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-bold text-black">Payment information</h2>
              <p className="mb-4 text-sm text-neutral-800">
                Card fields are collected in the browser only. No payment provider is wired, and
                no charge is made.
              </p>
              <label htmlFor="cardNumber" className="mb-2 block font-medium text-black">
                Card number
              </label>
              <input
                id="cardNumber"
                type="text"
                name="cardNumber"
                autoComplete="cc-number"
                inputMode="numeric"
                required
                value={formData.cardNumber}
                onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                className={`${field} mb-4`}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="expiryDate" className="mb-2 block font-medium text-black">
                    Expiry (MM/YY)
                  </label>
                  <input
                    id="expiryDate"
                    type="text"
                    name="expiryDate"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className={field}
                  />
                </div>
                <div>
                  <label htmlFor="cvv" className="mb-2 block font-medium text-black">
                    CVV
                  </label>
                  <input
                    id="cvv"
                    type="text"
                    name="cvv"
                    autoComplete="cc-csc"
                    inputMode="numeric"
                    required
                    value={formData.cvv}
                    onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                    className={field}
                  />
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 border border-black bg-neutral-50 p-6 text-black">
              <h2 className="mb-4 text-xl font-bold">Order summary</h2>
              <ul className="mb-6 space-y-3 text-sm">
                {items.map((item) => {
                  const itemKey = item.variant ? `${item.id}-${item.variant}` : item.id
                  return (
                    <li key={itemKey} className="flex justify-between gap-3">
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        {formatZar(item.price * item.quantity)}
                      </span>
                    </li>
                  )
                })}
              </ul>
              <div className="flex justify-between border-t border-black pt-4 text-lg font-bold">
                <span>Total</span>
                <span>{formatZar(getTotal())}</span>
              </div>
              <button
                type="submit"
                disabled={processing || authLoading || !userId}
                className="btn-primary mt-6 w-full"
              >
                {authLoading
                  ? 'Checking login...'
                  : !userId
                    ? 'Login to checkout'
                    : processing
                      ? 'Processing...'
                      : 'Complete order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </SiteShell>
  )
}
