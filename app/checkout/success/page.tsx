'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SiteShell from '@/components/SiteShell'
import StatusScreen from '@/components/StatusScreen'
import { useCartStore } from '@/lib/store/cart-store'

type ViewState = 'loading' | 'paid' | 'failed' | 'pending' | 'missing'

export default function CheckoutSuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart)
  const [view, setView] = useState<ViewState>('loading')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const orderId = params.get('orderId')
    if (!orderId) {
      setView('missing')
      return
    }
    const confirmedOrderId = orderId

    let cancelled = false
    let attempts = 0
    const maxAttempts = 15

    async function poll() {
      const response = await fetch(
        `/api/checkout/status?orderId=${encodeURIComponent(confirmedOrderId)}`
      )
      const payload = (await response.json().catch(() => null)) as {
        status?: string
      } | null

      if (cancelled) return

      if (payload?.status === 'paid') {
        clearCart()
        setView('paid')
        return
      }

      if (payload?.status === 'failed') {
        setView('failed')
        return
      }

      attempts += 1
      if (attempts >= maxAttempts) {
        setView('pending')
        return
      }

      window.setTimeout(poll, 2000)
    }

    poll()
    return () => {
      cancelled = true
    }
  }, [clearCart])

  if (view === 'failed') {
    return (
      <SiteShell>
        <StatusScreen
          kicker="Payment"
          title="Payment failed"
          body="Yoco did not complete this payment. The order was not marked paid — you can return to checkout and try again."
          actions={
            <>
              <Link href="/checkout" className="btn-primary">
                Return to checkout
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

  if (view === 'pending') {
    return (
      <SiteShell>
        <StatusScreen
          kicker="Payment"
          title="Confirming payment"
          body="Yoco is still confirming this payment. The cart is only cleared after the order is marked paid. You will receive an email once it is confirmed — do not pay again unless you were not charged."
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

  if (view === 'missing') {
    return (
      <SiteShell>
        <StatusScreen
          kicker="Payment"
          title="Payment received"
          body="If you completed payment, you will receive a confirmation email shortly. Your cart is only cleared after the order is marked paid."
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

  if (view === 'loading') {
    return (
      <SiteShell>
        <StatusScreen
          kicker="Payment"
          title="Confirming payment"
          body="Please wait while we confirm your payment with Yoco."
        />
      </SiteShell>
    )
  }

  return (
    <SiteShell>
      <StatusScreen
        kicker="Thank you"
        title="Order confirmed"
        body="Thank you for your purchase. You will receive a confirmation email shortly."
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
