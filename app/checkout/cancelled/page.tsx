import Link from 'next/link'
import SiteShell from '@/components/SiteShell'
import StatusScreen from '@/components/StatusScreen'

export default function CheckoutCancelledPage() {
  return (
    <SiteShell>
      <StatusScreen
        kicker="Payment"
        title="Payment cancelled"
        body="The Paystack checkout was cancelled. No payment was taken. You can return to checkout and try again."
        actions={
          <>
            <Link href="/checkout" className="btn-primary">
              Return to checkout
            </Link>
            <Link href="/collections/all" className="btn-secondary">
              Continue shopping
            </Link>
          </>
        }
      />
    </SiteShell>
  )
}
