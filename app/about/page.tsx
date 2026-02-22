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
          <h1 className="text-4xl font-bold mb-8 uppercase">About Gummy Fever</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-lg mb-6">
              Welcome to Gummy Fever, your destination for premium gummy clothing.
            </p>
            <p className="mb-6">
              We are committed to providing the highest quality gummy clothing
              with exceptional design and craftsmanship. Our mission is to bring
              style and confidence to every customer.
            </p>
            <h2 className="text-2xl font-bold mt-8 mb-4">Our Story</h2>
            <p className="mb-6">
              Founded with a passion for quality and innovation, Gummy Fever has
              been dedicated to crafting exceptional gummy clothing that makes
              a statement and brings confidence to those who wear it.
            </p>
            <h2 className="text-2xl font-bold mt-8 mb-4">Our Values</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Quality materials and craftsmanship</li>
              <li>Customer satisfaction above all</li>
              <li>Sustainable and ethical practices</li>
              <li>Innovation in design and style</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
