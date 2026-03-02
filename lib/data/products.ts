export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category_id: string
  in_stock: boolean
  featured?: boolean
}

const boxyBearDescription =
  'Premium boxy fit tee. Heavyweight cotton, relaxed cut. Part of the Boxy Bear range—wear it when you\'re ready to be seen.'

export const products: Product[] = [
  {
    id: 'boxy-bear-tshirt',
    name: 'Boxy Bear Tshirt',
    description: boxyBearDescription,
    price: 45.0,
    images: [],
    category_id: 'tshirts',
    in_stock: true,
    featured: true,
  },
  {
    id: 'boxy-bear-tshirt-black',
    name: 'Boxy Bear Tshirt — Black',
    description: boxyBearDescription,
    price: 45.0,
    images: ['/left.png', '/middle.jpeg', '/right.jpeg'],
    category_id: 'tshirts',
    in_stock: true,
    featured: true,
  },
  {
    id: 'boxy-bear-tshirt-white',
    name: 'Boxy Bear Tshirt — White',
    description: boxyBearDescription,
    price: 45.0,
    images: [],
    category_id: 'tshirts',
    in_stock: true,
    featured: true,
  },
  {
    id: 'boxy-bear-tshirt-grey',
    name: 'Boxy Bear Tshirt — Grey',
    description: boxyBearDescription,
    price: 45.0,
    images: [],
    category_id: 'tshirts',
    in_stock: true,
    featured: true,
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getProductsByCollection(slug: string): Product[] {
  if (slug === 'all') return products
  if (slug === 'new' || slug === 'featured') return products.filter((p) => p.featured)
  return products
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured)
}
