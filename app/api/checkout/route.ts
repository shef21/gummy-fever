import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { CheckoutError, recomputeOrderTotals } from '@/lib/checkout/recompute'
import { getSiteUrl } from '@/lib/checkout/site-url'
import { createYocoCheckout } from '@/lib/yoco/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_TEXT = 200
const MAX_ADDRESS = 500

type ShippingInput = {
  firstName?: unknown
  lastName?: unknown
  address?: unknown
  city?: unknown
  postalCode?: unknown
  country?: unknown
}

function requireText(value: unknown, field: string, max = MAX_TEXT): string {
  if (typeof value !== 'string') {
    throw new CheckoutError(`${field} is required.`, 400)
  }
  const trimmed = value.trim()
  if (!trimmed) {
    throw new CheckoutError(`${field} is required.`, 400)
  }
  if (trimmed.length > max) {
    throw new CheckoutError(`${field} is too long.`, 400)
  }
  return trimmed
}

function parseEmail(value: unknown): string {
  const email = requireText(value, 'Email', 255).toLowerCase()
  if (!EMAIL_RE.test(email)) {
    throw new CheckoutError('Please enter a valid email address.', 400)
  }
  return email
}

function parseShipping(input: ShippingInput | undefined) {
  if (!input || typeof input !== 'object') {
    throw new CheckoutError('Shipping address is required.', 400)
  }
  return {
    firstName: requireText(input.firstName, 'First name'),
    lastName: requireText(input.lastName, 'Last name'),
    address: requireText(input.address, 'Address', MAX_ADDRESS),
    city: requireText(input.city, 'City'),
    postalCode: requireText(input.postalCode, 'Postal code', 32),
    country: requireText(input.country, 'Country'),
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const admin = createAdminClient()

    if (!supabase || !admin) {
      return NextResponse.json(
        { error: 'Checkout is not configured.' },
        { status: 503 }
      )
    }

    if (!process.env.YOCO_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Payment is not configured.' },
        { status: 503 }
      )
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Please sign in to checkout.' }, { status: 401 })
    }

    const body = (await request.json().catch(() => null)) as {
      email?: unknown
      shipping?: ShippingInput
      items?: unknown
    } | null

    if (!body) {
      return NextResponse.json({ error: 'Invalid checkout request.' }, { status: 400 })
    }

    const email = parseEmail(body.email)
    const shipping = parseShipping(body.shipping)
    if (!Array.isArray(body.items)) {
      return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 })
    }

    const computed = await recomputeOrderTotals(admin, body.items)

    const { data: order, error: orderError } = await admin
      .from('orders')
      .insert({
        user_id: user.id,
        email,
        total: computed.total,
        status: 'pending',
        shipping_address: shipping,
        billing_address: shipping,
      })
      .select('id')
      .single()

    if (orderError || !order?.id) {
      console.error('Failed to create pending order', orderError)
      return NextResponse.json(
        { error: 'Unable to start payment. Please try again.' },
        { status: 500 }
      )
    }

    const { error: itemsError } = await admin.from('order_items').insert(
      computed.lines.map((line) => ({
        order_id: order.id,
        product_id: line.productId,
        variant_id: line.variantId,
        quantity: line.quantity,
        price: line.unitPrice,
      }))
    )

    if (itemsError) {
      console.error('Failed to create order items', itemsError)
      await admin.from('orders').delete().eq('id', order.id)
      return NextResponse.json(
        { error: 'Unable to start payment. Please try again.' },
        { status: 500 }
      )
    }

    const siteUrl = getSiteUrl()
    const checkout = await createYocoCheckout({
      amountCents: computed.totalCents,
      orderId: order.id,
      successUrl: `${siteUrl}/checkout/success?orderId=${encodeURIComponent(order.id)}`,
      cancelUrl: `${siteUrl}/checkout/cancelled?orderId=${encodeURIComponent(order.id)}`,
      failureUrl: `${siteUrl}/checkout/failed?orderId=${encodeURIComponent(order.id)}`,
      lineItems: computed.lines.map((line) => ({
        displayName: line.name,
        quantity: line.quantity,
        pricingDetails: { price: line.unitCents },
      })),
    })

    const { error: updateError } = await admin
      .from('orders')
      .update({ yoco_checkout_id: checkout.id })
      .eq('id', order.id)
      .eq('status', 'pending')

    if (updateError) {
      console.error('Failed to store Yoco checkout id', updateError)
    }

    return NextResponse.json({
      orderId: order.id,
      redirectUrl: checkout.redirectUrl,
    })
  } catch (error) {
    if (error instanceof CheckoutError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error('Checkout failed', error)
    return NextResponse.json(
      { error: 'Unable to start payment. Please try again.' },
      { status: 500 }
    )
  }
}
