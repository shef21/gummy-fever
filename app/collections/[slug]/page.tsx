import Link from 'next/link'
import SiteShell from '@/components/SiteShell'
import ProductCard from '@/components/ProductCard'
import { createClient } from '@/lib/supabase/server'
import { getProductsByCollection } from '@/lib/data/products'
import { collectionTitle } from '@/lib/format'

interface ProductRow {
  id: string
  name: string
  price: number
  images: string[]
  category_id: string | null
  featured: boolean
  in_stock: boolean
}

export default async function CollectionPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = await createClient()
  let displayProducts: ProductRow[] = []

  if (supabase) {
    if (params.slug === 'all') {
      const { data } = await supabase
        .from('products')
        .select('id, name, price, images, category_id, featured, in_stock')
        .eq('in_stock', true)
        .order('created_at', { ascending: false })
      displayProducts = (data ?? []) as ProductRow[]
    } else {
      const { data } = await supabase
        .from('products')
        .select('id, name, price, images, category_id, featured, in_stock')
        .eq('in_stock', true)
        .eq('featured', true)
        .order('created_at', { ascending: false })
      displayProducts = (data ?? []) as ProductRow[]
    }
  }

  if (displayProducts.length === 0) {
    displayProducts = getProductsByCollection(params.slug) as ProductRow[]
  }

  return (
    <SiteShell>
      <div className="section-y px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">Collection</p>
          <h1 className="display-title mt-3">{collectionTitle(params.slug)}</h1>

          {displayProducts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg text-black">No products in this collection yet.</p>
              <p className="mt-2 text-sm text-neutral-800">
                Limited drops sell through. Check Shop All for what is still available.
              </p>
              <Link href="/collections/all" className="btn-primary mt-6">
                View all
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  )
}
