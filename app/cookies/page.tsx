import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage, { LegalH2 } from '@/components/LegalPage'
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Cookie Notice',
  alternates: { canonical: '/cookies' },
}

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie Notice">
      <p>
        This notice is for {SITE_NAME}. It reflects cookies and similar storage actually used in
        the current storefront code. There is no analytics or advertising tag in this repository.
      </p>

      <LegalH2>Necessary cookies</LegalH2>
      <p>
        If you create an account or sign in, Supabase Auth may set cookies on this domain so we
        can keep you logged in and know that checkout is yours. Those cookies are required for
        the account and checkout path to work. They are not used here for advertising.
      </p>
      <p>
        The shopping cart is kept in memory in your browser for the visit (Zustand). It is not
        stored in localStorage in this codebase and it is not a tracking cookie.
      </p>

      <LegalH2>What we do not use</LegalH2>
      <ul className="list-disc space-y-2 pl-6">
        <li>No analytics cookies (no PostHog, Google Analytics, or similar in this code)</li>
        <li>No advertising or retargeting pixels</li>
        <li>No session recording</li>
        <li>No cookie banner that writes a consent flag, because optional cookies are not present</li>
      </ul>

      <LegalH2>Managing cookies</LegalH2>
      <p>
        You can block or delete cookies in your browser. If you block all cookies, sign-in and
        checkout may not work. For a privacy request, email {CONTACT_EMAIL}.
      </p>
      <p>
        See also the{' '}
        <Link href="/privacy" className="underline underline-offset-4">
          Privacy Policy
        </Link>
        .
      </p>
    </LegalPage>
  )
}
