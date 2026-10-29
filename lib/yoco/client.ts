import 'server-only'
import { isYocoCheckoutUrl } from '@/lib/yoco/urls'

const YOCO_CHECKOUTS_URL = 'https://payments.yoco.com/api/checkouts'

export type YocoLineItem = {
  displayName: string
  quantity: number
  pricingDetails: {
    price: number
  }
}

export type CreateYocoCheckoutInput = {
  amountCents: number
  orderId: string
  successUrl: string
  cancelUrl: string
  failureUrl: string
  lineItems: YocoLineItem[]
}

export type YocoCheckout = {
  id: string
  redirectUrl: string
  status: string
  amount: number
  currency: string
  paymentId: string | null
}

export async function createYocoCheckout(
  input: CreateYocoCheckoutInput
): Promise<YocoCheckout> {
  const secret = process.env.YOCO_SECRET_KEY
  if (!secret) {
    throw new Error('YOCO_SECRET_KEY is not configured')
  }

  const response = await fetch(YOCO_CHECKOUTS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': input.orderId,
    },
    body: JSON.stringify({
      amount: input.amountCents,
      currency: 'ZAR',
      successUrl: input.successUrl,
      cancelUrl: input.cancelUrl,
      failureUrl: input.failureUrl,
      metadata: {
        orderId: input.orderId,
      },
      externalId: input.orderId,
      lineItems: input.lineItems,
    }),
  })

  const body = (await response.json().catch(() => null)) as
    | (Partial<YocoCheckout> & { message?: string })
    | null

  if (!response.ok) {
    console.error('Yoco checkout create failed', {
      status: response.status,
      message: body?.message ?? 'Unknown Yoco error',
    })
    throw new Error('Yoco checkout could not be created')
  }

  if (!body?.id || !body.redirectUrl || !isYocoCheckoutUrl(body.redirectUrl)) {
    console.error('Yoco checkout response was missing a valid redirect URL')
    throw new Error('Yoco checkout could not be created')
  }

  return {
    id: body.id,
    redirectUrl: body.redirectUrl,
    status: body.status ?? 'created',
    amount: Number(body.amount) || input.amountCents,
    currency: body.currency ?? 'ZAR',
    paymentId: body.paymentId ?? null,
  }
}
