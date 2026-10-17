'use client'
import { useEffect } from 'react'

export default function CartSync() {
  useEffect(() => {
    const syncCart = () => {
      try {
        const cart = localStorage.getItem('baharaz_cart') || localStorage.getItem('cart')
        if (!cart) return

        // 2 টা key তেই same cart রাখো
        localStorage.setItem('baharaz_cart', cart)
        localStorage.setItem('cart', cart)

        // count update
        const parsed = JSON.parse(cart)
        if (Array.isArray(parsed)) {
          const count = parsed.reduce((acc, item) => acc + (item.quantity || item.qty || 1), 0)
          localStorage.setItem('cart_count', count.toString())
        }
      } catch (err) {
        console.error('CartSync error:', err)
      }
    }

    // প্রথম বার sync
    syncCart()

    // অন্য tab থেকে cart change হলে sync
    window.addEventListener('storage', syncCart)

    return () => {
      window.removeEventListener('storage', syncCart)
    }
  }, [])

  return null
}