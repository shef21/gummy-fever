import Link from 'next/link'
import SiteShell from '@/components/SiteShell'
import StatusScreen from '@/components/StatusScreen'

export default function CheckoutFailedPage() {
  return (
    <SiteShell>
      <StatusScreen
        kicker="Payment"
        title="Payment failed"
        body="Yoco could not complete this payment. No order was marked paid. You can return to checkout and try again."
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
