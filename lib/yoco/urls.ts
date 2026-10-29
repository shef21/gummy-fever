export function isYocoCheckoutUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return (
      parsed.protocol === 'https:' &&
      (parsed.hostname === 'yoco.com' || parsed.hostname.endsWith('.yoco.com'))
    )
  } catch {
    return false
  }
}
