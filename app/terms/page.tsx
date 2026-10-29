import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage, { LegalH2, Placeholder } from '@/components/LegalPage'
import {
  CONTACT_EMAIL,
  GOVERNING_LAW,
  OPERATOR_COUNTRY,
  OPERATOR_NAME,
  PLACEHOLDERS,
  SITE_NAME,
  SITE_URL,
} from '@/lib/site'

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <LegalPage title="Terms and Conditions">
      <p>
        These terms apply to {SITE_NAME} at {SITE_URL}, a clothing storefront operated by{' '}
        {OPERATOR_NAME} in {OPERATOR_COUNTRY}. By using this website you agree to these terms.
        They describe the site as built. They are not a substitute for independent legal advice.
      </p>

      <LegalH2>Electronic Communications and Transactions Act — supplier information (s 43)</LegalH2>
      <p>We set out the following as required for an electronic supplier, using published facts and marked gaps:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Trading name: {SITE_NAME}</li>
        <li>Operator / supplier: {OPERATOR_NAME}</li>
        <li>
          Registered company name if different:{' '}
          <Placeholder>{PLACEHOLDERS.registeredCompanyName}</Placeholder>
        </li>
        <li>
          Registration number: <Placeholder>{PLACEHOLDERS.registrationNumber}</Placeholder>
        </li>
        <li>
          VAT number: <Placeholder>{PLACEHOLDERS.vatNumber}</Placeholder>
        </li>
        <li>Place of operation: {OPERATOR_COUNTRY}</li>
        <li>
          Physical / postal address: <Placeholder>{PLACEHOLDERS.postalAddress}</Placeholder>
        </li>
        <li>
          Email: <a className="underline underline-offset-4" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </li>
        <li>
          Phone: <Placeholder>{PLACEHOLDERS.phone}</Placeholder>
        </li>
        <li>Website: {SITE_URL}</li>
        <li>Main goods: limited-drop clothing and related apparel graphics as listed on product pages</li>
        <li>Prices: shown in South African rand (R) on each product page, inclusive of any VAT only once a VAT number is filled in</li>
        <li>Payment: no payment processor is connected; checkout simulates a successful order after sign-in</li>
        <li>
          Delivery: see the{' '}
          <Link href="/shipping" className="underline underline-offset-4">
            Shipping &amp; Delivery
          </Link>{' '}
          page (timeframes and fees are placeholders until the owner fills them)
        </li>
        <li>
          Returns: see{' '}
          <Link href="/returns" className="underline underline-offset-4">
            Returns &amp; Refunds
          </Link>
          , including ECT Act s 44 cooling-off
        </li>
      </ul>
      <p>
        Postal address is not published on the operator&apos;s other site; email {CONTACT_EMAIL}{' '}
        if you need it in writing.
      </p>

      <LegalH2>The product</LegalH2>
      <p>
        {SITE_NAME} sells clothing. Listings show name, price, description, and photos where
        available. Colours and fit can vary on screen. Boxy cuts are described on product pages.
        Limited drops may sell out; sold-out pieces and sizes are not restocked on the same
        drop.
      </p>

      <LegalH2>Accounts and age</LegalH2>
      <p>
        Checkout requires an account (Supabase Auth). You must be 18 or older to create an
        account or order. Keep your password confidential.
      </p>

      <LegalH2>Orders and payment</LegalH2>
      <p>
        Adding items to the cart does not reserve stock. The cart is kept in the browser for the
        visit. Checkout collects contact, shipping, and card fields in the browser. No payment
        provider is wired, so this site does not take a live card payment. Completing checkout
        while signed in currently waits briefly, clears the cart, and shows an order-confirmed
        screen. That is a simulation, not a charged sale through an acquirer.
      </p>
      <p>
        When a processor is connected, separate payment terms will be shown at checkout. Until
        then, do not enter live card details.
      </p>

      <LegalH2>Availability</LegalH2>
      <p>
        We may refuse or limit orders, take the shop down for maintenance, or change listings
        without notice. If a piece is shown in stock and then cannot be fulfilled, we will
        contact you at the email on the account or order form.
      </p>

      <LegalH2>Intellectual property</LegalH2>
      <p>
        Graphics, product photos, and the {SITE_NAME} name on this site belong to the operator
        or licensors. You may not copy them for commercial use. Copyright notices: email{' '}
        {OPERATOR_NAME} at {CONTACT_EMAIL} with a description of the work, where it appears, your
        contact details, and a good-faith statement that the use is not authorised.
      </p>

      <LegalH2>Acceptable use</LegalH2>
      <p>
        Do not misuse the shop, attack the site, or scrape it in a way that harms the service.
        We may suspend access to protect the store.
      </p>

      <LegalH2>Liability</LegalH2>
      <p>
        Nothing in these terms limits rights you have under the Consumer Protection Act 68 of
        2008 or other South African law that cannot be excluded. Subject to those rights, the
        operator is not liable for losses that were not reasonably foreseeable from using a
        public website or from simulated checkout.
      </p>

      <LegalH2>Law</LegalH2>
      <p>
        These terms are governed by the law of {GOVERNING_LAW}. Questions: {CONTACT_EMAIL}.
      </p>
    </LegalPage>
  )
}
