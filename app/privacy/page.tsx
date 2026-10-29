import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage, { LegalH2, Placeholder } from '@/components/LegalPage'
import {
  CONTACT_EMAIL,
  INFORMATION_OFFICER,
  OPERATOR_COUNTRY,
  OPERATOR_NAME,
  PLACEHOLDERS,
  SITE_NAME,
  SITE_URL,
} from '@/lib/site'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        {SITE_NAME} ({SITE_URL}) is a clothing storefront operated by {OPERATOR_NAME} in{' '}
        {OPERATOR_COUNTRY}. This notice describes personal information this website actually
        handles. It is written with the Protection of Personal Information Act 4 of 2013 (POPIA)
        in mind. It is not legal advice.
      </p>
      <p>
        Responsible party / information officer (as published for the operator): {INFORMATION_OFFICER}.
        Contact: <a className="underline underline-offset-4" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        Physical / postal address:{' '}
        <Placeholder>{PLACEHOLDERS.postalAddress}</Placeholder>. Phone:{' '}
        <Placeholder>{PLACEHOLDERS.phone}</Placeholder>.
      </p>

      <LegalH2>Minimum age</LegalH2>
      <p>
        You must be 18 or older to create an account or place an order. We do not intend to
        collect personal information from children under 18. If you believe we have, email{' '}
        {CONTACT_EMAIL} and we will delete it.
      </p>

      <LegalH2>What this site collects</LegalH2>
      <p>The code in this storefront collects or holds the following, and nothing more:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>
          <strong>Account (Supabase Auth).</strong> If you sign in or sign up, we process the
          email and password you type. Sign-up can send a verification email. The auth session is
          kept with cookies set by Supabase on this site. We do not use browser localStorage for
          that session in this codebase.
        </li>
        <li>
          <strong>Cart.</strong> The bag is held in memory in your browser (Zustand) for the
          current visit. It is not written to our database from the cart itself.
        </li>
        <li>
          <strong>Checkout form.</strong> Email, name, shipping address, and card number / expiry
          / CVV are held in React state in your browser while you complete the form. No payment
          processor is connected. Completing checkout currently simulates a successful order after
          you are signed in, then clears the cart. Card details are not sent to a payments API
          from this site.
        </li>
        <li>
          <strong>Contact form.</strong> Name, email, and message are confirmed in the browser
          only. They are not posted to a backend in the current code. Email {CONTACT_EMAIL} if
          you need us to actually receive a request.
        </li>
        <li>
          <strong>Newsletter fields.</strong> Homepage and footer email fields are not connected
          to a mailing-list API in the current code.
        </li>
        <li>
          <strong>Product catalogue.</strong> Product names, prices, images, and stock flags are
          read from Supabase (or a local fallback catalogue) so we can show the shop.
        </li>
      </ul>
      <p>
        This website does not include analytics, advertising pixels, heatmaps, or session
        recording in the current codebase.
      </p>

      <LegalH2>Why we process it (POPIA)</LegalH2>
      <ul className="list-disc space-y-2 pl-6">
        <li>To create and maintain an account you asked for (contract / legitimate interest in running the shop).</li>
        <li>To take steps toward an order you submit, including delivery details (contract).</li>
        <li>To answer support, privacy, or legal requests you send to {CONTACT_EMAIL}.</li>
        <li>To keep the site secure and limit abuse of sign-in.</li>
      </ul>
      <p>
        We do not sell personal information. We do not run a newsletter from this form until a
        list is actually connected.
      </p>

      <LegalH2>Operators and operators&apos; tools</LegalH2>
      <p>
        Hosting is on Vercel. Account and catalogue data, when configured, live in Supabase
        (PostgreSQL and Auth). Those providers process data as operators to the extent you use
        those features. We do not name a card acquirer because none is wired.
      </p>

      <LegalH2>Cookies</LegalH2>
      <p>
        Necessary cookies may be set for the Supabase auth session after you sign in. See the{' '}
        <Link href="/cookies" className="underline underline-offset-4">
          Cookie Notice
        </Link>
        .
      </p>

      <LegalH2>Your POPIA rights</LegalH2>
      <p>
        You may request access to personal information we hold about you, correction, deletion,
        or objection, and you may lodge a complaint with the Information Regulator (South
        Africa). Email {CONTACT_EMAIL}. Account deletion is handled by hand until an in-app
        delete path exists.
      </p>
      <p>
        Information Regulator contact details are published by that office. We do not reproduce
        them here in case they change.
      </p>

      <LegalH2>Security and retention</LegalH2>
      <p>
        We use HTTPS and provider-managed auth. No method of transmission is 100% secure. We keep
        account records while the account exists, and support emails for as long as needed to
        deal with your request or a legal duty. Simulated checkout does not create a charged
        payment record through a processor.
      </p>

      <LegalH2>Contact</LegalH2>
      <p>
        Privacy questions: {CONTACT_EMAIL}, for the attention of {INFORMATION_OFFICER}.
      </p>
    </LegalPage>
  )
}
