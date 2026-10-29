import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import SiteShell from '@/components/SiteShell'

export default function CheckoutSuccessPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <CheckCircle className="mx-auto mb-6 h-16 w-16 text-black" aria-hidden="true" />
        <p className="eyebrow">Thank you</p>
        <h1 className="mt-3 text-3xl font-bold uppercase tracking-tight text-black">
          Order confirmed
        </h1>
        <p className="mt-4 text-black">
          Thank you for your purchase. This checkout path currently simulates a successful order
          after you are signed in. No payment processor is connected, so no card charge is made
          from this site. If you need a record of the order, email us.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/collections/all" className="btn-primary">
            Continue shopping
          </Link>
          <Link href="/" className="btn-secondary">
            Back to home
          </Link>
        </div>
      </div>
    </SiteShell>
  )
}
