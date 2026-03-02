import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Cart from '@/components/Cart'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Cart />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 uppercase text-white">About Gummy Fever</h1>
          <div className="space-y-4 text-base md:text-lg leading-relaxed text-white">
            <p>
              We don&apos;t stock. We drop. Each release is controlled. Each design
              is timestamped. Miss it once and you don&apos;t get it again. Heat
              doesn&apos;t wait. 
            </p>
            <p>
              Built for Street launches. Creative directors. Independent minds. Producers.
              Designers. Movers. If you understand tempo then you understand
              this brand.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
