export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category_id: string
  featured: boolean
  in_stock: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
}

export interface ProductVariant {
  id: string
  product_id: string
  name: string
  price: number
  stock: number
}
