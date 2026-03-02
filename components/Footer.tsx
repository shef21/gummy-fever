import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4">GUMMY FEVER</h3>
            <p className="text-sm text-white">
              Premium gummy clothing for every occasion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 uppercase text-sm">Shop</h4>
            <ul className="space-y-2 text-sm text-white">
              <li>
                <Link href="/collections/new" className="hover:opacity-80">
                  New In
                </Link>
              </li>
              <li>
                <Link href="/collections/all" className="hover:opacity-80">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/collections/featured" className="hover:opacity-80">
                  Featured
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4 uppercase text-sm">
              Customer Service
            </h4>
            <ul className="space-y-2 text-sm text-white">
              <li>
                <Link href="/shipping" className="hover:opacity-80">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:opacity-80">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:opacity-80">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 uppercase text-sm">Legal</h4>
            <ul className="space-y-2 text-sm text-white">
              <li>
                <Link href="/privacy" className="hover:opacity-80">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:opacity-80">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md">
            <h4 className="font-semibold mb-4 uppercase text-sm">
              Join Gummy Fever
            </h4>
            <p className="text-sm text-white mb-4">
              Get early access to new products, exclusive offers, and community
              events.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-gray-900 border border-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                className="bg-white text-black px-6 py-2 font-medium hover:bg-gray-200 transition-colors uppercase text-sm"
              >
                Submit
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-white">
          <p>© {new Date().getFullYear()} Gummy Fever. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
