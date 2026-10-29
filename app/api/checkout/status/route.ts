import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isUuid } from '@/lib/checkout/recompute'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const orderId = new URL(request.url).searchParams.get('orderId')
  if (!orderId || !isUuid(orderId)) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  }

  const admin = createAdminClient()
  if (!admin) {
    return NextResponse.json({ error: 'Checkout is not configured.' }, { status: 503 })
  }

  const { data, error } = await admin
    .from('orders')
    .select('status')
    .eq('id', orderId)
    .maybeSingle()

  if (error) {
    console.error('Failed to load order status', error)
    return NextResponse.json({ error: 'Unable to load order status.' }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  }

  return NextResponse.json(
    { status: data.status },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
