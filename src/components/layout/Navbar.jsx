'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [flashLive, setFlashLive] = useState(true)
  const [hasNewOffer, setHasNewOffer] = useState(true)
  const lastScrollRef = useRef(0)

  // ✅ 1. Hook সব আগে - কোন return এর আগে
  useEffect(() => {
    const update = () => {
      try {
        const c1 = JSON.parse(localStorage.getItem('baharaz_cart') || '[]')
        const c2 = JSON.parse(localStorage.getItem('eRajCart') || '[]')
        const cart = c1.length > 0 ? c1 : c2
        setCartCount(cart.reduce((a, b) => a + (b.qty || b.quantity || 1), 0))
        const w1 = JSON.parse(localStorage.getItem('baharaz_wishlist') || '[]')
        const w2 = JSON.parse(localStorage.getItem('wishlist') || '[]')
        const wish = w1.length > 0 ? w1 : w2
        setWishlistCount(wish.length)
      } catch {}
    }
    update()
    window.addEventListener('cartUpdated', update)
    window.addEventListener('storage', update)
    const flashInterval = setInterval(()=> setFlashLive(f => !f), 1500)
    const offerTimer = setTimeout(()=> setHasNewOffer(false), 15000)

    const onScroll = () => {
      const current = window.scrollY || document.documentElement.scrollTop
      if (current <= 80) setIsVisible(true)
      else {
        if (current > lastScrollRef.current + 10) setIsVisible(false)
        else if (current < lastScrollRef.current - 20) setIsVisible(true)
      }
      lastScrollRef.current = current
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('cartUpdated', update)
      window.removeEventListener('storage', update)
      window.removeEventListener('scroll', onScroll)
      clearInterval(flashInterval)
      clearTimeout(offerTimer)
    }
  }, [])

  // ✅ 2. Hook এর পরে Check - এখন Error হবে না
  const ALLOWED_PAGES = ["/", "/category", "/flash-sale", "/cart"]
  const shouldShow = ALLOWED_PAGES.some(page => {
    if (page === "/") return pathname === "/"
    return pathname === page || pathname.startsWith(page + "/")
  })

  if (!shouldShow) {
    return null
  }

  const isActive = (p) => pathname === p
  const haptic = () => { if(navigator.vibrate) navigator.vibrate(10) }

  return (
    <>
      <div className={`fixed bottom-0 left-0 w-full h-[64px] bg-white/95 backdrop-blur-[16px] border-t border-gray-200 flex items-center justify-around z-[9998] lg:hidden shadow-[0_-8px_24px_rgba(0,0,0,0.08)] transition-transform duration-300 pb-[env(safe-area-inset-bottom)] rounded-t-[18px] ${isVisible? 'translate-y-0' : 'translate-y-[120%]'}`}>
        
        <Link href="/" className={`flex flex-col items-center flex-1 h-full justify-center ${isActive('/')?'text-[#F85606]':'text-gray-500'}`}>
          <span className="text-[20px]">🏠</span>
          <span className="text-[10px] font-bold">Home</span>
        </Link>

        <Link href="/category" className={`flex flex-col items-center flex-1 h-full justify-center ${pathname.startsWith('/category')?'text-[#F85606]':'text-gray-500'}`}>
          <span className="text-[20px]">📦</span>
          <span className="text-[10px]">Categories</span>
        </Link>

        <Link href="/flash-sale" className="flex flex-col items-center flex-1 h-full justify-center relative -top-3">
          <div className={`w-[56px] h-[56px] rounded-full bg-gradient-to-br from-[#F85606] to-[#FF8A00] flex items-center justify-center shadow border-[4px] border-white ${flashLive?'scale-105':''}`}>
            <span className="text-[22px]">⚡</span>
          </div>
          <span className="text-[10px] font-black text-[#F85606]">Flash</span>
        </Link>

        <Link href="/cart" className={`flex flex-col items-center flex-1 h-full justify-center ${isActive('/cart')?'text-[#F85606]':'text-gray-500'}`}>
          <span className="text-[20px]">🛒{cartCount>0 && <span className="absolute ml-1 bg-[#F85606] text-white text-[10px] w-[18px] h-[18px] rounded-full flex items-center justify-center">{cartCount}</span>}</span>
          <span className="text-[10px]">Cart</span>
        </Link>

        <Link href="/account" className={`flex flex-col items-center flex-1 h-full justify-center ${pathname.startsWith('/account')?'text-[#F85606]':'text-gray-500'}`}>
          <span className="text-[20px]">👤</span>
          <span className="text-[10px]">Account</span>
        </Link>
      </div>
    </>
  )
}