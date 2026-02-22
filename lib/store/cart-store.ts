import { create } from 'zustand'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  variant?: string
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()((set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item, quantity = 1) => {
        const items = get().items
        const itemKey = item.variant ? `${item.id}-${item.variant}` : item.id
        const existingItem = items.find(
          (i) => (i.variant ? `${i.id}-${i.variant}` : i.id) === itemKey
        )
        
        if (existingItem) {
          set({
            items: items.map((i) => {
              const iKey = i.variant ? `${i.id}-${i.variant}` : i.id
              return iKey === itemKey
                ? { ...i, quantity: i.quantity + quantity }
                : i
            }),
          })
        } else {
          set({ items: [...items, { ...item, quantity }] })
        }
      },
      removeItem: (id) => {
        set({ 
          items: get().items.filter((item) => {
            const itemKey = item.variant ? `${item.id}-${item.variant}` : item.id
            return itemKey !== id
          })
        })
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set({
          items: get().items.map((item) => {
            const itemKey = item.variant ? `${item.id}-${item.variant}` : item.id
            return itemKey === id ? { ...item, quantity } : item
          }),
        })
      },
      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }))
