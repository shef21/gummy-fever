import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Cart from '@/components/Cart'

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Cart />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-white">
          <h1 className="text-4xl font-bold mb-8 uppercase">Terms of Use</h1>
          <div className="prose prose-lg max-w-none prose-headings:text-black prose-p:text-black prose-li:text-black">
            <p className="mb-6 text-sm text-white">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <h2 className="text-2xl font-bold mt-8 mb-4">Acceptance of Terms</h2>
            <p className="mb-6">
              By accessing and using this website, you accept and agree to be
              bound by the terms and provision of this agreement.
            </p>
            <h2 className="text-2xl font-bold mt-8 mb-4">Use License</h2>
            <p className="mb-6">
              Permission is granted to temporarily download one copy of the
              materials on Gummy Fever&apos;s website for personal, non-commercial
              transitory viewing only.
            </p>
            <h2 className="text-2xl font-bold mt-8 mb-4">Product Information</h2>
            <p className="mb-6">
              We strive to provide accurate product descriptions and pricing.
              However, we do not warrant that product descriptions or other
              content on this site is accurate, complete, reliable, current, or
              error-free.
            </p>
            <h2 className="text-2xl font-bold mt-8 mb-4">Limitations</h2>
            <p className="mb-6">
              In no event shall Gummy Fever or its suppliers be liable for any
              damages arising out of the use or inability to use the materials
              on Gummy Fever&apos;s website.
            </p>
            <h2 className="text-2xl font-bold mt-8 mb-4">Contact Information</h2>
            <p className="mb-6">
              If you have any questions about these Terms of Use, please contact
              us at melting@gummyfever.com
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
