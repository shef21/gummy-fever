import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Cart from '@/components/Cart'
import { createClient } from '@/lib/supabase/server'
import { getFeaturedProducts } from '@/lib/data/products'

interface ProductRow {
  id: string
  name: string
  price: number
  images: string[]
  featured: boolean
}

export default async function Home() {
  const supabase = await createClient()
  let featuredProducts: ProductRow[] = []

  if (supabase) {
    const { data } = await supabase
      .from('products')
      .select('id, name, price, images, featured')
      .eq('in_stock', true)
      .eq('featured', true)
      .order('created_at', { ascending: false })
    featuredProducts = (data ?? []) as ProductRow[]
  }

  if (featuredProducts.length === 0) {
    featuredProducts = getFeaturedProducts() as ProductRow[]
  }

  const collections = [
    {
      title: 'NEW IN',
      href: '/collections/new',
      image: '/collections/new.jpg',
    },
    {
      title: 'FEATURED',
      href: '/collections/featured',
      image: '/collections/featured.jpg',
    },
    {
      title: 'SHOP ALL',
      href: '/collections/all',
      image: '/collections/all.jpg',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#ffffff' }}>
      <Header />
      <Cart />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center justify-center text-white overflow-hidden">
          {/* Image strip background */}
          <div className="absolute inset-0 grid grid-cols-3">
            <div className="relative">
              <Image
                src="/left.png"
                alt="Gummy Fever left feature"
                fill
                priority
                className="object-cover"
              />
            </div>
            <div className="relative">
              <Image
                src="/middle.jpeg"
                alt="Gummy Fever middle feature"
                fill
                priority
                className="object-cover"
              />
            </div>
            <div className="relative">
              <Image
                src="/right.jpeg"
                alt="Gummy Fever right feature"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>

          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/55" />

          {/* Centered content */}
          <div className="relative z-10 text-center px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              GUMMY FEVER
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white tracking-wide">
              Turn up the heat
            </p>
            <Link
              href="/collections/all"
              className="inline-block bg-white text-black px-8 py-4 font-bold uppercase tracking-wide hover:bg-gray-200 transition-colors"
            >
              SHOP THE MELT
            </Link>
          </div>
        </section>

        {/* Brand Statement */}
        <section className="bg-black text-white py-16 px-4">
          <div className="max-w-3xl mx-auto text-left md:text-center">
            <p className="text-xs tracking-[0.25em] uppercase text-white mb-4">
              Brand Statement
            </p>
            <div className="space-y-4 text-sm md:text-base leading-relaxed text-white">
              <p>
                <span className="font-semibold text-base md:text-lg">
                  Gummy Fever was never about candy.
                </span>{' '}
                It&apos;s about pressure. About heat. About what happens when things
                start to melt. We design for the loud creatives, the studio
                runners, the late-night planners, the ones who don&apos;t move quiet.
                Every drop is intentional. Every piece carries weight. Every
                graphic means something.
              </p>
              <p>
                <span className="font-semibold">
                  You don&apos;t wear Gummy Fever to blend in.
                </span>{' '}
                <span className="font-semibold">
                  You wear it when you&apos;re ready to be seen.
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* Featured / Product strip */}
        {featuredProducts.length > 0 && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 uppercase text-center text-black">
                Shop the drop
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group"
                  >
                    <div className="relative aspect-square bg-gray-200 mb-4 overflow-hidden">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-black">
                          No Image
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium mb-1 group-hover:underline text-black">
                      {product.name}
                    </h3>
                    <p className="text-sm font-bold text-black">R {Number(product.price).toFixed(2)}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Collections Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {collections.map((collection) => (
                <Link
                  key={collection.href}
                  href={collection.href}
                  className="group relative h-96 bg-gray-100 flex items-center justify-center overflow-hidden"
                >
                  <div className="text-center z-10 text-black">
                    <h2 className="text-3xl font-bold mb-4 group-hover:underline">
                      {collection.title}
                    </h2>
                    <span className="text-sm uppercase tracking-wide">
                      Discover
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              JOIN GUMMY FEVER
            </h2>
            <p className="text-white mb-8">
              Get early access to seasonal sales, new arrivals, and community
              events.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-gray-900 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                className="bg-white text-black px-8 py-3 font-bold uppercase tracking-wide hover:bg-gray-200 transition-colors"
              >
                Submit
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
