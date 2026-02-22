import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Cart from '@/components/Cart'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Cart />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 uppercase">Privacy Policy</h1>
          <div className="prose prose-lg max-w-none">
            <p className="mb-6 text-sm text-gray-600">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <h2 className="text-2xl font-bold mt-8 mb-4">Information We Collect</h2>
            <p className="mb-6">
              We collect information that you provide directly to us, including
              when you create an account, make a purchase, or contact us for
              support.
            </p>
            <h2 className="text-2xl font-bold mt-8 mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>To process and fulfill your orders</li>
              <li>To communicate with you about your orders</li>
              <li>To send you marketing communications (with your consent)</li>
              <li>To improve our website and services</li>
            </ul>
            <h2 className="text-2xl font-bold mt-8 mb-4">Data Security</h2>
            <p className="mb-6">
              We implement appropriate security measures to protect your
              personal information. However, no method of transmission over the
              internet is 100% secure.
            </p>
            <h2 className="text-2xl font-bold mt-8 mb-4">Your Rights</h2>
            <p className="mb-6">
              You have the right to access, update, or delete your personal
              information at any time. Please contact us to exercise these
              rights.
            </p>
            <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
            <p className="mb-6">
              If you have questions about this Privacy Policy, please contact
              us at privacy@gummyfever.com
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
