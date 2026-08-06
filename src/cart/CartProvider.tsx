import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CatalogWine } from '../data/catalog'

const STORAGE_KEY = 'altura-cart'

export type CartItem = {
  id: number
  name: string
  slug: string
  price: string
  priceValue: number
  img: string
  qty: number
}

type CartContextValue = {
  items: CartItem[]
  count: number
  total: number
  open: boolean
  setOpen: (open: boolean) => void
  /** Increments when items are added — used to animate the header cart icon. */
  bump: number
  addItem: (wine: CatalogWine, qty?: number) => void
  removeItem: (id: number) => void
  setQty: (id: number, qty: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function parsePrice(price: string): number {
  const cleaned = price.replace(/[^\d,.-]/g, '').replace(',', '.')
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : 0
}

export function formatPrice(value: number): string {
  return `${value.toFixed(2).replace('.', ',')} €`
}

function loadCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartItem[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [open, setOpen] = useState(false)
  const [bump, setBump] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setItems(loadCart())
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, ready])

  const addItem = useCallback((wine: CatalogWine, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === wine.id)
      if (existing) {
        return prev.map((i) =>
          i.id === wine.id ? { ...i, qty: i.qty + qty } : i,
        )
      }
      return [
        ...prev,
        {
          id: wine.id,
          name: wine.name,
          slug: wine.slug,
          price: wine.price,
          priceValue: parsePrice(wine.price),
          img: wine.img,
          qty,
        },
      ]
    })
    setBump((n) => n + 1)
  }, [])

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const setQty = useCallback((id: number, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id))
      return
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, i) => sum + i.qty, 0)
    const total = items.reduce((sum, i) => sum + i.priceValue * i.qty, 0)
    return { items, count, total, open, setOpen, bump, addItem, removeItem, setQty, clear }
  }, [items, open, bump, addItem, removeItem, setQty, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
