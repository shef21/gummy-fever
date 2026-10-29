'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import SiteShell from '@/components/SiteShell'
import QuantityStepper from '@/components/QuantityStepper'
import StatusScreen, { DefaultShopActions } from '@/components/StatusScreen'
import { useCartStore } from '@/lib/store/cart-store'
import { createClient } from '@/lib/supabase/client'
import { getProductById } from '@/lib/data/products'
import { formatZar } from '@/lib/format'

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
  const addItem = useCartStore((state) => state.addItem)
  const openCart = useCartStore((state) => state.openCart)

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
      <SiteShell>
        <div className="page-shell py-12" aria-busy="true" aria-live="polite">
          <p className="sr-only">Loading product</p>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="aspect-square bg-neutral-100" />
            <div className="space-y-4 pt-4">
              <div className="h-10 w-2/3 bg-neutral-100" />
              <div className="h-6 w-24 bg-neutral-100" />
              <div className="h-24 w-full bg-neutral-100" />
              <div className="h-12 w-full bg-neutral-100" />
            </div>
          </div>
        </div>
      </SiteShell>
    )
  }

  if (!product) {
    return (
      <SiteShell>
        <StatusScreen
          kicker="Product"
          title="Piece not found"
          body="This item is not in the current drop, the link is wrong, or it has been pulled. Sold-out sizes are not restocked on the same drop."
          actions={<DefaultShopActions />}
        />
      </SiteShell>
    )
  }

  const activeImage = product.images?.[selectedImage]

  return (
    <SiteShell>
      <div className="page-shell py-10 sm:py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="relative aspect-square bg-neutral-100">
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-neutral-700">
                  Image coming soon
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 ? (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 w-20 flex-shrink-0 bg-neutral-100 ${
                      selectedImage === index ? 'ring-2 ring-black ring-offset-2' : ''
                    }`}
                    aria-label={`Show image ${index + 1} of ${product.name}`}
                    aria-current={selectedImage === index}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 text-2xl font-bold text-black">{formatZar(product.price)}</p>
            <p className="mt-6 leading-relaxed text-neutral-800">{product.description}</p>

            <p className="mt-6 text-sm text-neutral-800">
              Limited drop. If your size is sold out it is not listed and will not be restocked on
              this release. Check the description and photos for fit — this is a boxy cut.
            </p>

            <div className="mt-8">
              <p id="qty-label" className="mb-3 font-medium text-black">
                Quantity
              </p>
              <QuantityStepper
                labelledBy="qty-label"
                value={quantity}
                onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
                onIncrease={() => setQuantity(quantity + 1)}
              />
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className={`mt-8 w-full ${product.in_stock ? 'btn-primary' : 'btn bg-neutral-300 text-neutral-700'}`}
            >
              {product.in_stock ? 'Add to cart' : 'Sold out'}
            </button>

            {!product.in_stock ? (
              <div className="mt-4 border border-black bg-neutral-50 p-4 text-sm text-black">
                <p className="font-semibold">This piece is sold out</p>
                <p className="mt-2 text-neutral-800">
                  Sold-out garments and sizes are not restocked on the same drop. Browse what is
                  still available, or email us if you need a fit question on a future release.
                </p>
                <Link href="/collections/all" className="mt-4 inline-flex btn-secondary">
                  Shop available pieces
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </SiteShell>
  )
}
