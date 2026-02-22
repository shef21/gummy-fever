import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Cart from '@/components/Cart'

export default function ShippingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Cart />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 uppercase">Shipping</h1>
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mt-8 mb-4">Shipping Options</h2>
            <p className="mb-6">
              We offer various shipping options to meet your needs. All orders
              are processed within 1-2 business days.
            </p>
            <h2 className="text-2xl font-bold mt-8 mb-4">Shipping Rates</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Standard Shipping: $5.99 (5-7 business days)</li>
              <li>Express Shipping: $9.99 (2-3 business days)</li>
              <li>Overnight Shipping: $19.99 (Next business day)</li>
            </ul>
            <h2 className="text-2xl font-bold mt-8 mb-4">International Shipping</h2>
            <p className="mb-6">
              International shipping rates vary by destination. Please contact us
              for specific rates to your country.
            </p>
            <h2 className="text-2xl font-bold mt-8 mb-4">Tracking</h2>
            <p className="mb-6">
              Once your order ships, you will receive a tracking number via
              email to monitor your package&apos;s journey.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
