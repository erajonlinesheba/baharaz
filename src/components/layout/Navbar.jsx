'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [flashLive, setFlashLive] = useState(true)
  const [hasNewMsg, setHasNewMsg] = useState(false)
  const [hasNewOffer, setHasNewOffer] = useState(true)
  const pathname = usePathname()
  const lastScrollRef = useRef(0)

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

        const msg = localStorage.getItem('baharaz_has_new_msg')
        if(msg === 'true') setHasNewMsg(true)
      } catch {}
    }
    
    update()
    window.addEventListener('cartUpdated', update)
    window.addEventListener('storage', update)
    window.addEventListener('wishlistUpdated', update)
    window.addEventListener('cart-update', update)

    const flashInterval = setInterval(()=> setFlashLive(f => !f), 1500)
    const offerTimer = setTimeout(()=> setHasNewOffer(false), 15000)

    // ✅ FIXED SCROLL - আগে window.scrollY 0 থাকতো flex এর কারণে, এখন layout ঠিক, তাই scroll কাজ করবে
    const onScroll = () => {
      const current = window.scrollY
      if (current <= 100) {
        setIsVisible(true)
      } else {
        if (current > lastScrollRef.current + 8) {
          setIsVisible(false)
        } else if (current < lastScrollRef.current - 8) {
          setIsVisible(true)
        }
      }
      lastScrollRef.current = current
    }
    
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('cartUpdated', update)
      window.removeEventListener('storage', update)
      window.removeEventListener('wishlistUpdated', update)
      window.removeEventListener('cart-update', update)
      window.removeEventListener('scroll', onScroll)
      clearInterval(flashInterval)
      clearTimeout(offerTimer)
    }
  }, [])

  const isActive = (p) => pathname === p
  const haptic = () => { if(typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10) }

  return (
    <>
      {/* ✅ LIVE VIEWERS STRIP DELETE KORE DILAM */}

      <div className={`fixed bottom-0 left-0 w-full h-[64px] bg-white/95 backdrop-blur-[16px] border-t border-gray-200 flex items-center justify-around z-[9998] lg:hidden shadow-[0_-8px_24px_rgba(0,0,0,0.08)] transition-transform duration-300 will-change-transform pb-[env(safe-area-inset-bottom)] rounded-t-[18px] ${isVisible? 'translate-y-0' : 'translate-y-[110%]'}`}>
        
        {/* HOME */}
        <Link href="/" onClick={haptic} className={`flex flex-col items-center flex-1 h-full justify-center transition-all relative ${isActive('/')?'text-[#F85606]':'text-gray-500'}`}>
          <div className={`p-1 rounded-full ${isActive('/')?'bg-[#FFF1EB]' : ''}`}>
            <svg className="w-6 h-6" fill={isActive('/') ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive('/')?2.2:1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          </div>
          <span className={`text-[10px] mt-0.5 ${isActive('/')?'font-black':'font-medium'}`}>Home</span>
          {isActive('/') && <span className="absolute bottom-1 w-1 h-1 bg-[#F85606] rounded-full"></span>}
        </Link>

        {/* CATEGORIES */}
        <Link href="/category" onClick={haptic} className={`flex flex-col items-center flex-1 h-full justify-center relative ${isActive('/category') || pathname.startsWith('/category')?'text-[#F85606]':'text-gray-500'}`}>
          <div className={`p-1 rounded-full ${isActive('/category') || pathname.startsWith('/category')?'bg-[#FFF1EB]' : ''}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive('/category')?2.2:1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          </div>
          <span className={`text-[10px] mt-0.5 ${isActive('/category')?'font-black':'font-medium'}`}>Categories</span>
        </Link>

        {/* FLASH SALE - CENTER */}
        <Link href="/flash-sale" onClick={haptic} className="flex flex-col items-center flex-1 h-full justify-center relative -top-3">
          <div className={`w-[56px] h-[56px] rounded-full bg-gradient-to-br from-[#F85606] to-[#FF8A00] flex items-center justify-center shadow-[0_6px_16px_rgba(248,86,6,0.4)] border-[4px] border-white transition-transform active:scale-95 ${flashLive?'scale-105':''}`}>
            <span className="text-[22px]">⚡</span>
            {hasNewOffer && <span className="absolute top-0 right-1 w-3 h-3 bg-red-600 border-2 border-white rounded-full animate-ping"></span>}
            {hasNewOffer && <span className="absolute top-0 right-1 w-3 h-3 bg-red-600 border-2 border-white rounded-full"></span>}
          </div>
          <span className="text-[10px] mt-1 font-black text-[#F85606]">Flash</span>
          {flashLive && <span className="absolute bottom-7 bg-black text-white text-[7px] px-1 rounded font-bold">LIVE</span>}
        </Link>

        {/* CART */}
        <Link href="/cart" onClick={haptic} className={`flex flex-col items-center flex-1 h-full justify-center relative ${isActive('/cart')?'text-[#F85606]':'text-gray-500'}`}>
          <div className={`relative p-1 rounded-full ${isActive('/cart')?'bg-[#FFF1EB]' : ''}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive('/cart')?2.2:1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            {cartCount>0 && <span className="absolute -top-2 -right-2 bg-[#F85606] text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-black px-1 shadow border border-white">{cartCount>99?'99+':cartCount}</span>}
          </div>
          <span className={`text-[10px] mt-0.5 ${isActive('/cart')?'font-black':'font-medium'}`}>Cart</span>
        </Link>

        {/* ACCOUNT */}
        <Link href="/account" onClick={haptic} className={`flex flex-col items-center flex-1 h-full justify-center relative ${pathname.startsWith('/account') || pathname.startsWith('/profile') || pathname.startsWith('/wishlist')?'text-[#F85606]':'text-gray-500'}`}>
          <div className={`relative p-1 rounded-full ${pathname.startsWith('/account')?'bg-[#FFF1EB]' : ''}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={pathname.startsWith('/account')?2.2:1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            {(wishlistCount>0 || hasNewMsg) && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>}
          </div>
          <span className={`text-[10px] mt-0.5 ${pathname.startsWith('/account')?'font-black':'font-medium'}`}>Account</span>
        </Link>

      </div>

      {/* AI FLOATING BUTTON */}
      <Link href="/search" className={`fixed bottom-[88px] right-4 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-[0_6px_20px_rgba(0,0,0,0.3)] z-[9996] lg:hidden transition-transform duration-300 ${isVisible ? 'scale-100' : 'scale-0'}`}>
        <span className="text-[18px]">✨</span>
      </Link>
    </>
  )
}