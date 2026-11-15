export function isPaystackCheckoutUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return (
      parsed.protocol === 'https:' &&
      (parsed.hostname === 'paystack.com' || parsed.hostname.endsWith('.paystack.com'))
    )
  } catch {
    return false
  }
}
