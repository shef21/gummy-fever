import 'server-only'
import { createHmac, timingSafeEqual } from 'crypto'

const MAX_SKEW_SECONDS = 180
const FUTURE_SKEW_SECONDS = 5

export type WebhookVerifyResult =
  | { ok: true }
  | { ok: false; status: number; message: string }

function decodeWebhookSecret(secret: string): Buffer {
  const value = secret.startsWith('whsec_') ? secret.slice('whsec_'.length) : secret
  return Buffer.from(value, 'base64')
}

function signaturesMatch(expected: string, provided: string): boolean {
  const expectedBuf = Buffer.from(expected)
  const providedBuf = Buffer.from(provided)
  if (expectedBuf.length !== providedBuf.length) {
    timingSafeEqual(expectedBuf, expectedBuf)
    return false
  }
  return timingSafeEqual(expectedBuf, providedBuf)
}

/**
 * Verify a Yoco Checkout API webhook using Standard Webhooks v1.
 * signed_payload = "{webhook-id}.{webhook-timestamp}.{raw_body}"
 */
export function verifyYocoWebhook(options: {
  rawBody: string
  webhookId: string | null
  webhookTimestamp: string | null
  webhookSignature: string | null
  secret: string
  nowSeconds?: number
}): WebhookVerifyResult {
  const { rawBody, webhookId, webhookTimestamp, webhookSignature, secret } = options

  if (!webhookId || !webhookTimestamp || !webhookSignature) {
    return { ok: false, status: 400, message: 'Missing webhook signature headers.' }
  }

  const timestamp = Number(webhookTimestamp)
  if (!Number.isFinite(timestamp)) {
    return { ok: false, status: 400, message: 'Invalid webhook timestamp.' }
  }

  const now = options.nowSeconds ?? Math.floor(Date.now() / 1000)
  if (timestamp > now + FUTURE_SKEW_SECONDS || now - timestamp > MAX_SKEW_SECONDS) {
    return { ok: false, status: 400, message: 'Webhook timestamp is outside the allowed window.' }
  }

  const signedContent = `${webhookId}.${webhookTimestamp}.${rawBody}`
  const expectedSignature = createHmac('sha256', decodeWebhookSecret(secret))
    .update(signedContent)
    .digest('base64')

  const candidates = webhookSignature.split(' ').flatMap((token) => {
    const [version, value] = token.split(',', 2)
    if (version !== 'v1' || !value) {
      return []
    }
    return [value]
  })

  if (candidates.length === 0) {
    return { ok: false, status: 400, message: 'No supported webhook signature.' }
  }

  const matched = candidates.some((candidate) => signaturesMatch(expectedSignature, candidate))
  if (!matched) {
    return { ok: false, status: 400, message: 'Invalid webhook signature.' }
  }

  return { ok: true }
}
