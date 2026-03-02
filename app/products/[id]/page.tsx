'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Cart from '@/components/Cart'
import { useCartStore } from '@/lib/store/cart-store'
import { createClient } from '@/lib/supabase/client'
import { getProductById } from '@/lib/data/products'
import { Plus, Minus } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  in_stock: boolean
}

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem, openCart } = useCartStore()

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      if (supabase) {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, description, price, images, in_stock')
          .eq('id', productId)
          .single()
        if (data && !error) {
          setProduct({
            id: data.id,
            name: data.name,
            description: data.description ?? '',
            price: Number(data.price),
            images: Array.isArray(data.images) ? data.images : [],
            in_stock: Boolean(data.in_stock),
          })
          setLoading(false)
          return
        }
      }
      const found = getProductById(productId)
      setProduct(found ?? null)
      setLoading(false)
    }
    load()
  }, [productId])

  const handleAddToCart = () => {
    if (!product) return

    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
      },
      quantity
    )
    openCart()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <Header />
        <Cart />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <p className="mb-4">
              This is a local UI preview. Products will be available once connected to a database.
            </p>
            <Link
              href="/collections/all"
              className="inline-block bg-white text-black px-6 py-3 font-medium hover:bg-gray-200 transition-colors"
            >
              Browse Collections
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Cart />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <div className="relative aspect-square bg-gray-800 mb-4">
                {product.images && product.images[selectedImage] ? (
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    No Image
                  </div>
                )}
              </div>
              {product.images && product.images.length > 1 && (
                <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-20 w-20 flex-shrink-0 bg-gray-800 border-2 ${
                        selectedImage === index
                          ? 'border-white'
                          : 'border-transparent'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-4xl font-bold mb-4 text-white">{product.name}</h1>
              <p className="text-2xl font-bold mb-6 text-white">
                R {Number(product.price).toFixed(2)}
              </p>
              <p className="text-white mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-8">
                <span className="font-medium text-white">Quantity:</span>
                <div className="flex items-center border border-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-white hover:bg-white hover:text-black transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-2 text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-white hover:bg-white hover:text-black transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className={`w-full py-4 font-bold uppercase tracking-wide transition-colors ${
                  product.in_stock
                    ? 'bg-white text-black hover:bg-gray-200'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
              </button>

              {!product.in_stock && (
                <p className="mt-4 text-sm text-white">
                  This product is currently out of stock.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
