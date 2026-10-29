import type { Metadata } from 'next'
import SiteShell from '@/components/SiteShell'

export const metadata: Metadata = {
  title: 'About',
}

export default function AboutPage() {
  return (
    <SiteShell>
      <article className="page-shell max-w-4xl py-12 sm:py-16">
        <p className="eyebrow">The brand</p>
        <h1 className="display-title mt-3">About Gummy Fever</h1>
        <div className="mt-8 space-y-5 text-base leading-relaxed text-black md:text-lg">
          <p>
            We don&apos;t stock. We drop. Each release is controlled. Each design is timestamped.
            Miss it once and you don&apos;t get it again. Heat doesn&apos;t wait.
          </p>
          <p>
            Built for street launches. Creative directors. Independent minds. Producers. Designers.
            Movers. If you understand tempo then you understand this brand.
          </p>
        </div>
      </article>
    </SiteShell>
  )
}
