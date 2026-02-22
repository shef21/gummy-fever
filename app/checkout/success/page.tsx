import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Cart from '@/components/Cart'
import { CheckCircle } from 'lucide-react'

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Cart />

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-md text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-6 text-green-600" />
          <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. You will receive a confirmation email
            shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/collections/all"
              className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors uppercase tracking-wide"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="border border-black px-6 py-3 font-medium hover:bg-black hover:text-white transition-colors uppercase tracking-wide"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
