import Link from 'next/link'
import Image from 'next/image'
import SiteShell from '@/components/SiteShell'
import ProductCard from '@/components/ProductCard'
import NewsletterForm from '@/components/NewsletterForm'
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

  if (featuredProducts.length > 0) {
    const uniqueByName = new Map<string, ProductRow>()
    for (const product of featuredProducts) {
      if (!uniqueByName.has(product.name)) {
        uniqueByName.set(product.name, product)
      }
    }
    featuredProducts = Array.from(uniqueByName.values())
  }

  const collections = [
    {
      title: 'New In',
      href: '/collections/new',
      image: '/left.png',
    },
    {
      title: 'Featured',
      href: '/collections/featured',
      image: '/middle.jpeg',
    },
    {
      title: 'Shop All',
      href: '/collections/all',
      image: '/right.jpeg',
    },
  ]

  return (
    <SiteShell>
      <section className="relative flex h-[70vh] min-h-[28rem] items-center justify-center overflow-hidden text-white sm:h-[80vh]">
        <div className="absolute inset-0 grid grid-cols-3">
          <div className="relative">
            <Image
              src="/left.png"
              alt="Gummy Fever look, back print on a black tee"
              fill
              priority
              sizes="33vw"
              className="object-cover"
            />
          </div>
          <div className="relative">
            <Image
              src="/middle.jpeg"
              alt="Gummy Fever look, front graphic tee"
              fill
              priority
              sizes="33vw"
              className="object-cover"
            />
          </div>
          <div className="relative">
            <Image
              src="/right.jpeg"
              alt="Gummy Fever look, studio portrait"
              fill
              priority
              sizes="33vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="absolute inset-0 bg-black/65" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/40"
          aria-hidden="true"
        />

        <div className="relative z-10 px-4 text-center">
          <h1 className="hero-copy text-4xl font-bold uppercase tracking-tight text-white sm:text-6xl md:text-7xl">
            Gummy Fever
          </h1>
          <p className="hero-copy mt-4 text-base tracking-wide text-white sm:text-lg md:text-xl">
            Turn up the heat
          </p>
          <Link href="/collections/all" className="btn-invert mt-8">
            Shop the melt
          </Link>
        </div>
      </section>

      <section className="bg-black px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl text-left md:text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-white">
            Brand Statement
          </p>
          <div className="space-y-4 text-sm leading-relaxed text-white md:text-base">
            <p>
              <span className="text-base font-semibold md:text-lg">
                Gummy Fever was never about candy.
              </span>{' '}
              It&apos;s about pressure. About heat. About what happens when things start to melt.
              We design for the loud creatives, the studio runners, the late-night planners, the
              ones who don&apos;t move quiet. Every drop is intentional. Every piece carries
              weight. Every graphic means something.
            </p>
            <p>
              <span className="font-semibold">You don&apos;t wear Gummy Fever to blend in.</span>{' '}
              <span className="font-semibold">You wear it when you&apos;re ready to be seen.</span>
            </p>
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 ? (
        <section className="section-y bg-neutral-50 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 text-center text-2xl font-bold uppercase tracking-tight text-black md:text-3xl">
              Shop the drop
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="section-y bg-neutral-50 px-4 text-center">
          <h2 className="text-2xl font-bold uppercase text-black">Shop the drop</h2>
          <p className="mt-3 text-neutral-800">The next drop is not listed yet.</p>
        </section>
      )}

      <section className="section-y px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">
          {collections.map((collection) => (
            <Link
              key={collection.href}
              href={collection.href}
              className="group relative flex h-80 items-center justify-center overflow-hidden bg-neutral-100 sm:h-96"
            >
              <Image
                src={collection.image}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-black/55 transition-colors group-hover:bg-black/65" />
              <div className="relative z-10 px-4 text-center text-white">
                <h2 className="hero-copy text-3xl font-bold uppercase">{collection.title}</h2>
                <span className="hero-copy mt-3 inline-block text-sm uppercase tracking-[0.16em]">
                  Discover
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-black px-4 py-16 text-white sm:px-6 lg:px-8 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold uppercase tracking-tight text-white md:text-4xl">
            Join Gummy Fever
          </h2>
          <p className="mx-auto mt-4 mb-8 max-w-lg text-white">
            Get early access to seasonal sales, new arrivals, and community events.
          </p>
          <div className="mx-auto max-w-md">
            <NewsletterForm invert id="home-newsletter-email" />
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
