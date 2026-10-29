import SiteShell from '@/components/SiteShell'
import NotFoundTools from '@/components/NotFoundTools'

export default function NotFound() {
  return (
    <SiteShell>
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center sm:py-28">
        <p className="eyebrow">404</p>
        <h1 className="display-title mt-3 text-balance">This page is not on the drop</h1>
        <p className="mt-4 text-base text-neutral-800 sm:text-lg">
          That address is not a Gummy Fever page. The piece may have sold out, the link may be
          old, or the URL is wrong. Shop the current drop, go home, or open your cart.
        </p>
        <NotFoundTools />
      </div>
    </SiteShell>
  )
}
