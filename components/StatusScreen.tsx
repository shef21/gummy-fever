import Link from 'next/link'

export default function StatusScreen({
  kicker,
  title,
  body,
  actions,
}: {
  kicker?: string
  title: string
  body: string
  actions?: React.ReactNode
}) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center sm:py-28">
      {kicker ? <p className="eyebrow mb-4">{kicker}</p> : null}
      <h1 className="display-title text-balance">{title}</h1>
      <p className="mt-4 text-base text-neutral-800 sm:text-lg">{body}</p>
      {actions ? (
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
          {actions}
        </div>
      ) : null}
    </div>
  )
}

export function DefaultShopActions() {
  return (
    <>
      <Link href="/collections/all" className="btn-primary">
        Shop all
      </Link>
      <Link href="/" className="btn-secondary">
        Back home
      </Link>
    </>
  )
}
