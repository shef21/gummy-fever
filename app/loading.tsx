export default function Loading() {
  return (
    <div className="min-h-screen bg-white px-4 py-16" aria-busy="true" aria-live="polite">
      <p className="sr-only">Loading</p>
      <div className="mx-auto max-w-7xl">
        <div className="h-8 w-48 bg-neutral-100" />
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="aspect-square bg-neutral-100" />
          <div className="aspect-square bg-neutral-100" />
          <div className="aspect-square bg-neutral-100" />
          <div className="aspect-square bg-neutral-100" />
        </div>
      </div>
    </div>
  )
}
