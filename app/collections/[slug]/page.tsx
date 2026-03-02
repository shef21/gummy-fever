import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Cart from '@/components/Cart'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { getProductsByCollection } from '@/lib/data/products'

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
    <div className="min-h-screen flex flex-col">
      <Header />
      <Cart />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 uppercase text-white">
            {params.slug.replace('-', ' ')}
          </h1>

          {displayProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white text-lg mb-4">
                No products in this collection yet.
              </p>
              <Link
                href="/collections/all"
                className="mt-4 inline-block text-white underline hover:no-underline"
              >
                View all
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group"
                >
                  <div className="relative aspect-square bg-gray-800 mb-4 overflow-hidden">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white">
                        No Image
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium mb-1 group-hover:underline text-white">
                    {product.name}
                  </h3>
                  <p className="text-sm font-bold text-white">R {Number(product.price).toFixed(2)}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
