import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage, { LegalH2, Placeholder } from '@/components/LegalPage'
import { CONTACT_EMAIL, PLACEHOLDERS, SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Returns & Refunds',
  alternates: { canonical: '/returns' },
}

export default function ReturnsPage() {
  return (
    <LegalPage kicker="Customer service" title="Returns & Refunds">
      <p>
        This page is for {SITE_NAME} clothing. It covers statutory rights under the Consumer
        Protection Act 68 of 2008 (CPA) and the cooling-off right in section 44 of the Electronic
        Communications and Transactions Act 25 of 2002 (ECT Act), plus how this shop treats
        change-of-mind returns. It is not legal advice.
      </p>
      <p>
        Email{' '}
        <a className="underline underline-offset-4" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>{' '}
        to start a return. Return address:{' '}
        <Placeholder>{PLACEHOLDERS.returnAddress}</Placeholder>.
      </p>

      <LegalH2>Cooling-off (ECT Act s 44)</LegalH2>
      <p>
        If you are a consumer who concluded this electronic transaction by phone or online
        without meeting the supplier in person, you may cancel without reason within seven days
        after you receive the goods. Tell us in writing (email is enough). You return the goods
        to us. The Act allows the supplier to charge only the direct cost of returning the goods,
        unless we collected a payment we must refund. We will refund other payments we actually
        received for that order, subject to the Act.
      </p>
      <p>
        Cooling-off does not apply in every case listed in the ECT Act (for example certain
        goods made to your specification). Standard sized apparel from a drop is generally
        returnable under s 44 if the other requirements of that section are met.
      </p>
      <p>
        Because checkout on this site currently simulates a successful order and no payment
        processor is connected, there may be no card charge to reverse. If a real payment method
        is added later, refunds will follow that provider&apos;s timing plus the Act.
      </p>

      <LegalH2>Defective goods (CPA)</LegalH2>
      <p>
        If a garment is unsafe, defective, or not of the quality or description you are entitled
        to under the CPA, you have the remedies in section 56 — including repair, replacement, or
        refund — within six months of delivery, depending on the facts. Contact {CONTACT_EMAIL}{' '}
        with photos, your order email, and what is wrong. Do not wear the piece further if you
        are claiming a defect.
      </p>

      <LegalH2>Change of mind, fit, and exchanges</LegalH2>
      <p>
        Limited drops often cannot be swapped for another size once a size is gone. If we offer a
        change-of-mind return beyond the s 44 cooling-off window, it will only apply to:
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Unworn, unwashed items</li>
        <li>Original tags still attached</li>
        <li>Returned in original packaging where practical</li>
        <li>
          Within <Placeholder>{PLACEHOLDERS.changeOfMindPeriod}</Placeholder> of delivery (owner to
          fill)
        </li>
      </ul>
      <p>
        We do not accept change-of-mind returns of worn, washed, altered, or damaged garments,
        or items without tags. Size and fit: product copy describes the cut (including boxy
        tees). Compare measurements on the product page and photos. A size that is sold out is
        not listed and will not be restocked on the same drop, so an exchange is not guaranteed.
      </p>

      <LegalH2>How to return</LegalH2>
      <ol className="list-decimal space-y-2 pl-6">
        <li>Email {CONTACT_EMAIL} with your name, order email, item, and reason.</li>
        <li>Wait for a return confirmation before you ship.</li>
        <li>
          Send the parcel to <Placeholder>{PLACEHOLDERS.returnAddress}</Placeholder> with tracking
          if you can.
        </li>
        <li>
          We inspect the return and then refund or replace according to the right you used
          (cooling-off, CPA defect, or approved change of mind).
        </li>
      </ol>

      <LegalH2>Refunds</LegalH2>
      <p>
        Statutory refunds follow the CPA / ECT Act. Where we actually received money, we will
        refund the original method once that method exists. Until a processor is connected, this
        shop does not collect live card payments, so there may be nothing to reverse on the card.
        We will still confirm the return in writing.
      </p>
      <p>
        Delivery charges for a change-of-mind return (outside s 44) are for your account unless
        we agree otherwise. Defective goods: you should not be left paying to send back a piece
        that was not of good quality.
      </p>

      <LegalH2>Related policies</LegalH2>
      <p>
        <Link href="/shipping" className="underline underline-offset-4">
          Shipping &amp; Delivery
        </Link>
        {' · '}
        <Link href="/terms" className="underline underline-offset-4">
          Terms
        </Link>
        {' · '}
        <Link href="/contact" className="underline underline-offset-4">
          Contact
        </Link>
      </p>
    </LegalPage>
  )
}
