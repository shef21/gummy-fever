'use client'

import Link from 'next/link'
import SiteShell from '@/components/SiteShell'
import { CONTACT_EMAIL } from '@/lib/site'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <SiteShell>
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:py-28">
        <p className="eyebrow">Error</p>
        <h1 className="display-title mt-3">Something went wrong</h1>
        <p className="mt-4 text-base text-neutral-800 sm:text-lg">
          The shop hit a problem loading this page. Try again, or go back to the drop. If it
          keeps happening, email {CONTACT_EMAIL}
          {error.digest ? ` and mention code ${error.digest}` : ''}.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={() => reset()} className="btn-primary">
            Try again
          </button>
          <Link href="/" className="btn-secondary">
            Back home
          </Link>
        </div>
      </div>
    </SiteShell>
  )
}
