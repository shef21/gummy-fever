import 'server-only'
import { isPaystackCheckoutUrl } from '@/lib/paystack/urls'

const PAYSTACK_API = 'https://api.paystack.co'

export type InitializePaystackInput = {
  email: string
  amountCents: number
  reference: string
  callbackUrl: string
  orderId: string
}

export type PaystackInitializeResult = {
  authorizationUrl: string
  accessCode: string
  reference: string
}

export type PaystackVerifyResult = {
  status: string
  reference: string
  amount: number
  currency: string
  paidAt: string | null
  id: number | null
}

function secretKey(): string {
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) {
    throw new Error('PAYSTACK_SECRET_KEY is not configured')
  }
  return secret
}

export async function initializePaystackTransaction(
  input: InitializePaystackInput
): Promise<PaystackInitializeResult> {
  const response = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: input.email,
      amount: input.amountCents,
      currency: 'ZAR',
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: {
        order_id: input.orderId,
      },
    }),
  })

  const body = (await response.json().catch(() => null)) as {
    status?: boolean
    message?: string
    data?: {
      authorization_url?: string
      access_code?: string
      reference?: string
    }
  } | null

  if (!response.ok || !body?.status || !body.data?.authorization_url) {
    console.error('Paystack initialize failed', {
      httpStatus: response.status,
      message: body?.message ?? 'Unknown Paystack error',
    })
    throw new Error('Paystack transaction could not be initialized')
  }

  if (!isPaystackCheckoutUrl(body.data.authorization_url)) {
    console.error('Paystack initialize returned a non-Paystack URL')
    throw new Error('Paystack transaction could not be initialized')
  }

  return {
    authorizationUrl: body.data.authorization_url,
    accessCode: body.data.access_code ?? '',
    reference: body.data.reference ?? input.reference,
  }
}

export async function verifyPaystackTransaction(
  reference: string
): Promise<PaystackVerifyResult | null> {
  const response = await fetch(
    `${PAYSTACK_API}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secretKey()}`,
      },
    }
  )

  const body = (await response.json().catch(() => null)) as {
    status?: boolean
    message?: string
    data?: {
      status?: string
      reference?: string
      amount?: number
      currency?: string
      paid_at?: string | null
      paidAt?: string | null
      id?: number
    }
  } | null

  if (response.status === 404 || !body?.status || !body.data) {
    return null
  }

  if (!response.ok) {
    console.error('Paystack verify failed', {
      httpStatus: response.status,
      message: body.message ?? 'Unknown Paystack error',
    })
    throw new Error('Paystack transaction could not be verified')
  }

  return {
    status: body.data.status ?? 'unknown',
    reference: body.data.reference ?? reference,
    amount: Number(body.data.amount) || 0,
    currency: body.data.currency ?? '',
    paidAt: body.data.paid_at ?? body.data.paidAt ?? null,
    id: typeof body.data.id === 'number' ? body.data.id : null,
  }
}
