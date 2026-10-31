import type { SupabaseClient } from '@supabase/supabase-js'

export type CheckoutItemInput = {
  productId: string
  variantId?: string | null
  variant?: string | null
  quantity: number
}

export type PricedLine = {
  productId: string
  variantId: string | null
  name: string
  quantity: number
  unitPrice: number
  unitCents: number
  lineCents: number
}

export type RecomputedOrder = {
  lines: PricedLine[]
  total: number
  totalCents: number
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const MAX_LINES = 50
const MAX_QUANTITY = 20
const MIN_PAYMENT_CENTS = 200

export class CheckoutError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message)
    this.name = 'CheckoutError'
  }
}

export function isUuid(value: string): boolean {
  return UUID_RE.test(value)
}

export function zarToCents(amount: number): number {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new CheckoutError('Invalid amount.', 400)
  }
  return Math.round(amount * 100)
}

function lineKey(item: CheckoutItemInput): string {
  return `${item.productId}:${item.variantId ?? ''}:${item.variant ?? ''}`
}

export function mergeItems(items: CheckoutItemInput[]): CheckoutItemInput[] {
  const merged = new Map<string, CheckoutItemInput>()

  for (const item of items) {
    if (!item || typeof item.productId !== 'string' || !isUuid(item.productId)) {
      throw new CheckoutError('One or more products are not available for purchase.', 400)
    }

    const quantity = Number(item.quantity)
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      throw new CheckoutError('Invalid item quantity.', 400)
    }

    const variantId =
      typeof item.variantId === 'string' && item.variantId.trim()
        ? item.variantId.trim()
        : null
    if (variantId && !isUuid(variantId)) {
      throw new CheckoutError('One or more product variants are not available.', 400)
    }

    const variant =
      typeof item.variant === 'string' && item.variant.trim()
        ? item.variant.trim().slice(0, 255)
        : null

    const normalized: CheckoutItemInput = {
      productId: item.productId,
      variantId,
      variant,
      quantity,
    }
    const key = lineKey(normalized)
    const existing = merged.get(key)
    if (existing) {
      const nextQty = existing.quantity + quantity
      if (nextQty > MAX_QUANTITY) {
        throw new CheckoutError('Invalid item quantity.', 400)
      }
      existing.quantity = nextQty
    } else {
      merged.set(key, normalized)
    }
  }

  if (merged.size === 0) {
    throw new CheckoutError('Your cart is empty.', 400)
  }
  if (merged.size > MAX_LINES) {
    throw new CheckoutError('Too many items in this order.', 400)
  }

  return Array.from(merged.values())
}

type ProductRow = {
  id: string
  name: string
  price: number | string
  in_stock: boolean | null
}

type VariantRow = {
  id: string
  product_id: string
  name: string
  price: number | string | null
  stock: number | null
}

export async function recomputeOrderTotals(
  admin: SupabaseClient,
  rawItems: CheckoutItemInput[]
): Promise<RecomputedOrder> {
  const items = mergeItems(rawItems)
  const productIds = Array.from(new Set(items.map((item) => item.productId)))

  const { data: products, error: productsError } = await admin
    .from('products')
    .select('id, name, price, in_stock')
    .in('id', productIds)

  if (productsError) {
    console.error('Failed to load products for checkout', productsError)
    throw new CheckoutError('Unable to start payment. Please try again.', 500)
  }

  const productById = new Map<string, ProductRow>(
    ((products ?? []) as ProductRow[]).map((product) => [product.id, product])
  )

  const { data: variants, error: variantsError } = await admin
    .from('product_variants')
    .select('id, product_id, name, price, stock')
    .in('product_id', productIds)

  if (variantsError) {
    console.error('Failed to load variants for checkout', variantsError)
    throw new CheckoutError('Unable to start payment. Please try again.', 500)
  }

  const variantsByProduct = new Map<string, VariantRow[]>()
  for (const variant of (variants ?? []) as VariantRow[]) {
    const list = variantsByProduct.get(variant.product_id) ?? []
    list.push(variant)
    variantsByProduct.set(variant.product_id, list)
  }

  const lines: PricedLine[] = []

  for (const item of items) {
    const product = productById.get(item.productId)
    if (!product || product.in_stock === false) {
      throw new CheckoutError('One or more products are not available for purchase.', 400)
    }

    let variant: VariantRow | null = null
    const productVariants = variantsByProduct.get(product.id) ?? []
    if (item.variantId) {
      variant = productVariants.find((row) => row.id === item.variantId) ?? null
      if (!variant) {
        throw new CheckoutError('One or more product variants are not available.', 400)
      }
    } else if (item.variant) {
      variant =
        productVariants.find(
          (row) => row.name.toLowerCase() === item.variant!.toLowerCase()
        ) ?? null
      if (!variant) {
        throw new CheckoutError('One or more product variants are not available.', 400)
      }
    }

    if (variant && variant.stock != null && variant.stock < item.quantity) {
      throw new CheckoutError(`${product.name} does not have enough stock.`, 400)
    }

    const unitPrice = Number(variant?.price ?? product.price)
    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      throw new CheckoutError('One or more products are not available for purchase.', 400)
    }

    const unitCents = zarToCents(unitPrice)
    const displayName = variant ? `${product.name} — ${variant.name}` : product.name

    lines.push({
      productId: product.id,
      variantId: variant?.id ?? null,
      name: displayName,
      quantity: item.quantity,
      unitPrice,
      unitCents,
      lineCents: unitCents * item.quantity,
    })
  }

  const totalCents = lines.reduce((sum, line) => sum + line.lineCents, 0)
  if (totalCents < MIN_PAYMENT_CENTS) {
    throw new CheckoutError('Orders must be at least R2.00.', 400)
  }

  return {
    lines,
    total: totalCents / 100,
    totalCents,
  }
}
