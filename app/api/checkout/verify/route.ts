import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyPaystackTransaction } from '@/lib/paystack/client'
import { markOrderFailed, markOrderPaid } from '@/lib/payments/mark-order'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const REFERENCE_RE = /^[A-Za-z0-9._=-]{8,100}$/

export async function GET(request: Request) {
  const reference = new URL(request.url).searchParams.get('reference')?.trim() ?? ''
  if (!REFERENCE_RE.test(reference)) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  }

  const admin = createAdminClient()
  if (!admin) {
    return NextResponse.json({ error: 'Checkout is not configured.' }, { status: 503 })
  }

  if (!process.env.PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ error: 'Payment is not configured.' }, { status: 503 })
  }

  try {
    const verified = await verifyPaystackTransaction(reference)
    if (!verified) {
      return NextResponse.json(
        { status: 'pending' },
        { headers: { 'Cache-Control': 'no-store' } }
      )
    }

    if (verified.status === 'success') {
      const result = await markOrderPaid(admin, {
        reference: verified.reference,
        amountCents: verified.amount,
        currency: verified.currency,
        paidAt: verified.paidAt,
        provider: 'paystack',
      })
      const status = result === 'paid' ? 'paid' : result === 'missing' ? 'pending' : 'pending'
      return NextResponse.json({ status }, { headers: { 'Cache-Control': 'no-store' } })
    }

    if (verified.status === 'failed' || verified.status === 'reversed') {
      const result = await markOrderFailed(admin, verified.reference)
      return NextResponse.json(
        { status: result === 'paid' ? 'paid' : 'failed' },
        { headers: { 'Cache-Control': 'no-store' } }
      )
    }

    return NextResponse.json(
      { status: 'pending' },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    console.error('Failed to verify Paystack transaction', error)
    return NextResponse.json({ error: 'Unable to verify payment.' }, { status: 500 })
  }
}
