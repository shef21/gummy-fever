import Link from 'next/link'
import Image from 'next/image'
import { formatZar } from '@/lib/format'

export type ProductCardData = {
  id: string
  name: string
  price: number
  images?: string[] | null
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  const image = product.images?.[0]

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block rounded-sm focus-visible:outline-none"
    >
      <div className="relative mb-3 aspect-square overflow-hidden bg-neutral-100">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-neutral-700">
            Image coming soon
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-black underline-offset-4 group-hover:underline">
        {product.name}
      </h3>
      <p className="mt-1 text-sm font-semibold text-black">{formatZar(product.price)}</p>
    </Link>
  )
}
