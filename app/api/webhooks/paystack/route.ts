import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyPaystackWebhook } from '@/lib/paystack/verify-webhook'
import { findOrderByReference, markOrderPaid } from '@/lib/payments/mark-order'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BODY_BYTES = 1024 * 1024

type PaystackWebhookBody = {
  event?: string
  data?: {
    id?: number
    status?: string
    reference?: string
    amount?: number
    currency?: string
    paid_at?: string | null
    paidAt?: string | null
    metadata?: { order_id?: unknown } | string | null
  }
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) {
    console.error('PAYSTACK_SECRET_KEY is not configured')
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

  const verified = verifyPaystackWebhook({
    rawBody,
    signature: request.headers.get('x-paystack-signature'),
    secret,
  })

  if (!verified.ok) {
    return NextResponse.json({ error: verified.message }, { status: verified.status })
  }

  const admin = createAdminClient()
  if (!admin) {
    console.error('Supabase service role is not configured for Paystack webhooks')
    return NextResponse.json({ error: 'Webhook is not configured.' }, { status: 503 })
  }

  let event: PaystackWebhookBody
  try {
    event = JSON.parse(rawBody) as PaystackWebhookBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 })
  }

  const eventType = asString(event.event) ?? 'unknown'
  const dataId = event.data?.id != null ? String(event.data.id) : asString(event.data?.reference)
  const deliveryId = `${eventType}:${dataId ?? 'unknown'}`

  const { error: insertError } = await admin.from('payment_webhook_events').insert({
    id: deliveryId,
    event_type: eventType,
    payload: event,
  })

  if (insertError) {
    if (insertError.code === '23505') {
      return NextResponse.json({ received: true, duplicate: true })
    }
    console.error('Failed to record Paystack webhook event', insertError)
    return NextResponse.json({ error: 'Unable to record webhook.' }, { status: 500 })
  }

  try {
    if (eventType === 'charge.success') {
      const reference = extractReference(event.data)

      if (!reference || typeof event.data?.amount !== 'number') {
        console.error('Paystack charge.success missing reference or amount')
        return NextResponse.json({ received: true })
      }

      await markOrderPaid(admin, {
        reference,
        amountCents: event.data.amount,
        currency: asString(event.data.currency) ?? 'ZAR',
        paidAt: event.data.paid_at ?? event.data.paidAt ?? null,
        provider: 'paystack',
      })

      const order = await findOrderByReference(admin, reference)
      if (order) {
        await admin
          .from('payment_webhook_events')
          .update({ order_id: order.id })
          .eq('id', deliveryId)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Failed to process Paystack webhook', error)
    await admin.from('payment_webhook_events').delete().eq('id', deliveryId)
    return NextResponse.json({ error: 'Unable to process webhook.' }, { status: 500 })
  }
}

function extractReference(data: PaystackWebhookBody['data']): string | null {
  const direct = asString(data?.reference)
  if (direct) return direct

  const metadata = data?.metadata
  if (typeof metadata === 'string') {
    try {
      const parsed = JSON.parse(metadata) as { order_id?: unknown }
      return asString(parsed.order_id)
    } catch {
      return null
    }
  }
  if (metadata && typeof metadata === 'object') {
    return asString(metadata.order_id)
  }
  return null
}
