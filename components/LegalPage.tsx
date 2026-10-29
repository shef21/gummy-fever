import SiteShell from '@/components/SiteShell'
import { LEGAL_LAST_UPDATED } from '@/lib/site'

export default function LegalPage({
  kicker = 'Legal',
  title,
  children,
}: {
  kicker?: string
  title: string
  children: React.ReactNode
}) {
  return (
    <SiteShell>
      <article className="page-shell max-w-3xl py-12 sm:py-16">
        <p className="eyebrow">{kicker}</p>
        <h1 className="display-title mt-3">{title}</h1>
        <p className="mt-4 text-sm text-neutral-800">Last updated: {LEGAL_LAST_UPDATED}</p>
        <div className="legal-body mt-10 space-y-6 text-base leading-relaxed text-black">
          {children}
        </div>
        <p className="mt-12 border-t border-black pt-6 text-sm text-neutral-800">
          These pages describe this website as built. They are not a substitute for independent
          legal advice and should be reviewed by a legal professional before you rely on them.
        </p>
      </article>
    </SiteShell>
  )
}

export function LegalH2({ children }: { children: React.ReactNode }) {
  return <h2 className="!mt-10 text-2xl font-bold text-black">{children}</h2>
}

export function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-neutral-100 px-1 font-semibold text-black underline decoration-dotted underline-offset-4">
      {children}
    </span>
  )
}
