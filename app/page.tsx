import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Cart from '@/components/Cart'

export default function Home() {
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
        <section className="relative h-[80vh] flex items-center justify-center bg-black text-white">
          <div className="text-center px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              GUMMY FEVER
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              Premium Gummy Clothing
            </p>
            <Link
              href="/collections/all"
              className="inline-block bg-white text-black px-8 py-4 font-bold uppercase tracking-wide hover:bg-gray-200 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </section>

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
                  <div className="text-center z-10">
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
            <p className="text-gray-300 mb-8">
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
