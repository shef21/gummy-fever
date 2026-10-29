import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { zarToCents } from '@/lib/checkout/recompute'
import { verifyYocoWebhook } from '@/lib/yoco/verify-webhook'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BODY_BYTES = 1024 * 1024

type YocoWebhookBody = {
  id?: string
  type?: string
  event_type?: string
  createdDate?: string
  payload?: {
    id?: string
    amount?: number
    currency?: string
    status?: string
    metadata?: Record<string, unknown>
  }
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

export async function POST(request: Request) {
  const secret = process.env.YOCO_WEBHOOK_SECRET
  if (!secret) {
    console.error('YOCO_WEBHOOK_SECRET is not configured')
    return NextResponse.json({ error: 'Webhook is not configured.' }, { status: 503 })
  }

  const contentLength = Number(request.headers.get('content-length') ?? '0')
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Payload too large.' }, { status: 413 })
  }

  const rawBody = await request.text()
  if (rawBody.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Payload too large.' }, { status: 413 })
  }

  const verified = verifyYocoWebhook({
    rawBody,
    webhookId: request.headers.get('webhook-id'),
    webhookTimestamp: request.headers.get('webhook-timestamp'),
    webhookSignature: request.headers.get('webhook-signature'),
    secret,
  })

  if (!verified.ok) {
    return NextResponse.json({ error: verified.message }, { status: verified.status })
  }

  const admin = createAdminClient()
  if (!admin) {
    console.error('Supabase service role is not configured for Yoco webhooks')
    return NextResponse.json({ error: 'Webhook is not configured.' }, { status: 503 })
  }

  let event: YocoWebhookBody
  try {
    event = JSON.parse(rawBody) as YocoWebhookBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 })
  }

  const deliveryId = request.headers.get('webhook-id')
  if (!deliveryId) {
    return NextResponse.json({ error: 'Missing webhook id.' }, { status: 400 })
  }

  const eventType = asString(event.type) ?? asString(event.event_type)
  const { error: insertError } = await admin.from('yoco_webhook_events').insert({
    id: deliveryId,
    event_type: eventType ?? 'unknown',
    payload: event,
  })

  if (insertError) {
    if (insertError.code === '23505') {
      return NextResponse.json({ received: true, duplicate: true })
    }
    console.error('Failed to record Yoco webhook event', insertError)
    return NextResponse.json({ error: 'Unable to record webhook.' }, { status: 500 })
  }

  try {
    if (eventType === 'payment.succeeded' || eventType === 'payment.failed') {
      await applyPaymentEvent(admin, event, eventType, deliveryId)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Failed to process Yoco webhook', error)
    await admin.from('yoco_webhook_events').delete().eq('id', deliveryId)
    return NextResponse.json({ error: 'Unable to process webhook.' }, { status: 500 })
  }
}

async function applyPaymentEvent(
  admin: NonNullable<ReturnType<typeof createAdminClient>>,
  event: YocoWebhookBody,
  eventType: string,
  deliveryId: string
) {
  const payload = event.payload ?? {}
  const metadata = payload.metadata ?? {}
  const orderId = asString(metadata.orderId) ?? asString(metadata.order_id)
  const checkoutId = asString(metadata.checkoutId)
  const paymentId = asString(payload.id)

  let order: {
    id: string
    total: number | string
    status: string
    yoco_checkout_id: string | null
    yoco_payment_id: string | null
  } | null = null

  if (orderId) {
    const { data, error } = await admin
      .from('orders')
      .select('id, total, status, yoco_checkout_id, yoco_payment_id')
      .eq('id', orderId)
      .maybeSingle()
    if (error) {
      throw error
    }
    order = data
  }

  if (!order && checkoutId) {
    const { data, error } = await admin
      .from('orders')
      .select('id, total, status, yoco_checkout_id, yoco_payment_id')
      .eq('yoco_checkout_id', checkoutId)
      .maybeSingle()
    if (error) {
      throw error
    }
    order = data
  }

  if (!order) {
    console.error('Yoco webhook did not match an order', {
      eventType,
      orderId,
      checkoutId,
    })
    return
  }

  await admin
    .from('yoco_webhook_events')
    .update({ order_id: order.id })
    .eq('id', deliveryId)

  const nextStatus = eventType === 'payment.succeeded' ? 'paid' : 'failed'

  if (order.status === 'paid') {
    return
  }

  if (nextStatus === 'paid') {
    const expectedCents = zarToCents(Number(order.total))
    if (typeof payload.amount === 'number' && payload.amount !== expectedCents) {
      console.error('Yoco payment amount did not match order total', {
        orderId: order.id,
        expectedCents,
        payloadAmount: payload.amount,
      })
      return
    }
    if (payload.currency && payload.currency !== 'ZAR') {
      console.error('Yoco payment currency was not ZAR', {
        orderId: order.id,
        currency: payload.currency,
      })
      return
    }
  }

  const { error: updateError } = await admin
    .from('orders')
    .update({
      status: nextStatus,
      yoco_payment_id: paymentId ?? order.yoco_payment_id,
      yoco_checkout_id: checkoutId ?? order.yoco_checkout_id,
    })
    .eq('id', order.id)
    .neq('status', 'paid')

  if (updateError) {
    throw updateError
  }
}
