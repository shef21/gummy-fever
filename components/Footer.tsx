import Link from 'next/link'
import NewsletterForm from '@/components/NewsletterForm'
import { CONTACT_EMAIL, OPERATOR_NAME, SITE_NAME } from '@/lib/site'

const shopLinks = [
  { href: '/collections/new', label: 'New In' },
  { href: '/collections/all', label: 'Shop All' },
  { href: '/collections/featured', label: 'Featured' },
]

const serviceLinks = [
  { href: '/shipping', label: 'Shipping & Delivery' },
  { href: '/returns', label: 'Returns & Refunds' },
  { href: '/contact', label: 'Contact' },
]

const legalLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms and Conditions' },
  { href: '/cookies', label: 'Cookie Notice' },
]

function FooterList({
  title,
  links,
}: {
  title: string
  links: { href: string; label: string }[]
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">{title}</h4>
      <ul className="mt-4 space-y-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex min-h-11 items-center text-sm text-white hover:underline underline-offset-4"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="mt-auto bg-black text-white">
      <div className="page-shell py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <h3 className="text-xl font-bold uppercase tracking-tight text-white">{SITE_NAME}</h3>
            <p className="mt-4 text-sm leading-relaxed text-white">
              Premium clothing. Limited drops. Operated by {OPERATOR_NAME} in South Africa.
            </p>
            <p className="mt-4 text-sm text-white">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex min-h-11 items-center underline underline-offset-4"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>

          <FooterList title="Shop" links={shopLinks} />
          <FooterList title="Customer Service" links={serviceLinks} />
          <FooterList title="Legal" links={legalLinks} />
        </div>

        <div className="mt-12 border-t border-white/30 pt-8">
          <div className="max-w-md">
            <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
              Join Gummy Fever
            </h4>
            <p className="mt-3 mb-4 text-sm text-white">
              Drop notices, early access, and community events. This form is not connected to a
              mailing list yet.
            </p>
            <NewsletterForm invert id="footer-newsletter-email" />
          </div>
        </div>

        <div className="mt-12 border-t border-white/30 pt-8 text-center text-sm text-white">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. Operated by {OPERATOR_NAME}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
