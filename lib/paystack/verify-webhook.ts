import 'server-only'
import { createHmac, timingSafeEqual } from 'crypto'

export type WebhookVerifyResult =
  | { ok: true }
  | { ok: false; status: number; message: string }

function signaturesMatch(expectedHex: string, providedHex: string): boolean {
  const expectedBuf = Buffer.from(expectedHex)
  const providedBuf = Buffer.from(providedHex)
  if (expectedBuf.length !== providedBuf.length) {
    timingSafeEqual(expectedBuf, expectedBuf)
    return false
  }
  return timingSafeEqual(expectedBuf, providedBuf)
}

/**
 * Paystack signs the raw JSON body with HMAC SHA512 using the secret key.
 * Compare against the `x-paystack-signature` header (hex digest).
 */
export function verifyPaystackWebhook(options: {
  rawBody: string
  signature: string | null
  secret: string
}): WebhookVerifyResult {
  const { rawBody, signature, secret } = options
  if (!signature) {
    return { ok: false, status: 400, message: 'Missing Paystack signature header.' }
  }

  const expected = createHmac('sha512', secret).update(rawBody).digest('hex')
  if (!signaturesMatch(expected, signature)) {
    return { ok: false, status: 400, message: 'Invalid Paystack signature.' }
  }

  return { ok: true }
}
