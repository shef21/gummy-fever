import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Cart from '@/components/Cart'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  price: number
  images: string[]
  category_id: string
}

export default async function CollectionPage({
  params,
}: {
  params: { slug: string }
}) {
  // Local UI only - no Supabase connection yet
  const displayProducts: Product[] = []

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Cart />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 uppercase">
            {params.slug.replace('-', ' ')}
          </h1>

          {displayProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-4">
                No products available yet.
              </p>
              <p className="text-sm text-gray-400 mb-4">
                This is a local UI preview. Products will appear here once connected to a database.
              </p>
              <Link
                href="/"
                className="mt-4 inline-block text-black underline hover:no-underline"
              >
                Back to Home
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
                  <div className="relative aspect-square bg-gray-100 mb-4 overflow-hidden">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium mb-1 group-hover:underline">
                    {product.name}
                  </h3>
                  <p className="text-sm font-bold">${product.price.toFixed(2)}</p>
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
