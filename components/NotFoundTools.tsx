'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import OpenCartButton from '@/components/OpenCartButton'
import { products } from '@/lib/data/products'

export default function NotFoundTools() {
  const [query, setQuery] = useState('')

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return []
    return products.filter((product) => product.name.toLowerCase().includes(needle)).slice(0, 6)
  }, [query])

  return (
    <div className="mt-10 w-full max-w-md text-left">
      <label htmlFor="not-found-search" className="mb-2 block font-medium text-black">
        Search the drop
      </label>
      <input
        id="not-found-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Try “boxy bear”"
        className="input-field"
      />
      {query.trim() ? (
        <ul className="mt-3 border border-black bg-white">
          {matches.length === 0 ? (
            <li className="px-4 py-3 text-sm text-neutral-800">
              No matching piece in the local catalogue. Use Shop all for the live drop.
            </li>
          ) : (
            matches.map((product) => (
              <li key={product.id} className="border-b border-black last:border-b-0">
                <Link
                  href={`/products/${product.id}`}
                  className="flex min-h-11 items-center px-4 text-sm text-black hover:bg-neutral-50"
                >
                  {product.name}
                </Link>
              </li>
            ))
          )}
        </ul>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
        <Link href="/" className="btn-primary">
          Home
        </Link>
        <Link href="/collections/all" className="btn-secondary">
          Shop all
        </Link>
        <OpenCartButton>Open cart</OpenCartButton>
      </div>
    </div>
  )
}
