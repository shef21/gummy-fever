import type { SupabaseClient } from '@supabase/supabase-js'
import { isUuid, zarToCents } from '@/lib/checkout/recompute'

export type OrderPaymentRow = {
  id: string
  total: number | string
  status: string
  payment_reference: string | null
  payment_status: string | null
}

export async function findOrderByReference(
  admin: SupabaseClient,
  reference: string
): Promise<OrderPaymentRow | null> {
  if (isUuid(reference)) {
    const { data, error } = await admin
      .from('orders')
      .select('id, total, status, payment_reference, payment_status')
      .eq('id', reference)
      .maybeSingle()
    if (error) throw error
    if (data) return data as OrderPaymentRow
  }

  const { data, error } = await admin
    .from('orders')
    .select('id, total, status, payment_reference, payment_status')
    .eq('payment_reference', reference)
    .maybeSingle()
  if (error) throw error
  return (data as OrderPaymentRow | null) ?? null
}

export async function markOrderPaid(
  admin: SupabaseClient,
  options: {
    reference: string
    amountCents: number
    currency: string
    paidAt?: string | null
    provider?: string
  }
): Promise<'paid' | 'mismatch' | 'missing'> {
  const order = await findOrderByReference(admin, options.reference)
  if (!order) return 'missing'

  if (order.status === 'paid') return 'paid'

  if (options.currency && options.currency !== 'ZAR') {
    console.error('Payment currency was not ZAR', {
      orderId: order.id,
      currency: options.currency,
    })
    return 'mismatch'
  }

  const expectedCents = zarToCents(Number(order.total))
  if (options.amountCents !== expectedCents) {
    console.error('Payment amount did not match order total', {
      orderId: order.id,
      expectedCents,
      payloadAmount: options.amountCents,
    })
    return 'mismatch'
  }

  const { error } = await admin
    .from('orders')
    .update({
      status: 'paid',
      payment_provider: options.provider ?? 'paystack',
      payment_reference: options.reference,
      payment_status: 'success',
      paid_at: options.paidAt ?? new Date().toISOString(),
    })
    .eq('id', order.id)
    .neq('status', 'paid')

  if (error) throw error
  return 'paid'
}

export async function markOrderFailed(
  admin: SupabaseClient,
  reference: string
): Promise<'failed' | 'paid' | 'missing'> {
  const order = await findOrderByReference(admin, reference)
  if (!order) return 'missing'
  if (order.status === 'paid') return 'paid'

  const { error } = await admin
    .from('orders')
    .update({
      status: 'failed',
      payment_status: 'failed',
    })
    .eq('id', order.id)
    .neq('status', 'paid')

  if (error) throw error
  return 'failed'
}
