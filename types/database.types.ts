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

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled'

export interface Order {
  id: string
  user_id: string | null
  email: string
  total: number
  status: OrderStatus
  shipping_address: Record<string, unknown> | null
  billing_address: Record<string, unknown> | null
  yoco_checkout_id: string | null
  yoco_payment_id: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  variant_id: string | null
  quantity: number
  price: number
  created_at: string
}
