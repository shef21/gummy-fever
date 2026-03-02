import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Cart from '@/components/Cart'

export default function ReturnsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Cart />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-white">
          <h1 className="text-4xl font-bold mb-8 uppercase">Returns</h1>
          <div className="prose prose-lg max-w-none prose-headings:text-black prose-p:text-black prose-li:text-black">
            <h2 className="text-2xl font-bold mt-8 mb-4">Return Policy</h2>
            <p className="mb-6">
              We want you to be completely satisfied with your purchase. If you
              are not happy with your order, you may return it within 14 days
              of delivery for a full refund or exchange.
            </p>
            <h2 className="text-2xl font-bold mt-8 mb-4">Return Conditions</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Items must be unused and in original packaging</li>
              <li>Items must be returned within 14 days of delivery</li>
              <li>Proof of purchase is required</li>
            </ul>
            <h2 className="text-2xl font-bold mt-8 mb-4">How to Return</h2>
            <ol className="list-decimal pl-6 mb-6 space-y-2">
              <li>Contact us at melting@gummyfever.com</li>
              <li>We will provide you with a return authorization number</li>
              <li>Ship the item back to us using the provided label</li>
              <li>Once received, we will process your refund</li>
            </ol>
            <h2 className="text-2xl font-bold mt-8 mb-4">Refunds</h2>
            <p className="mb-6">
              Refunds will be processed to the original payment method within
              5-10 business days after we receive your return.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
