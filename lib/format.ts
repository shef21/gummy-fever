export function formatZar(amount: number): string {
  return `R ${Number(amount).toFixed(2)}`
}

export function collectionTitle(slug: string): string {
  return slug.replace(/-/g, ' ')
}
