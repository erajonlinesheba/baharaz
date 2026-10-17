'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const pathname = usePathname()
  const lastScrollRef = useRef(0)

  useEffect(() => {
    const update = () => {
      try {
        // 2টা Key থেকেই Count নিবে - তোমার Bug Fix
        const c1 = JSON.parse(localStorage.getItem('baharaz_cart') || '[]')
        const c2 = JSON.parse(localStorage.getItem('eRajCart') || '[]')
        const cart = c1.length > 0 ? c1 : c2
        setCartCount(cart.reduce((a, b) => a + (b.qty || b.quantity || 1), 0))
      } catch {}
    }
    update()
    window.addEventListener('cartUpdated', update)
    window.addEventListener('storage', update)
    window.addEventListener('authChanged', update)
    window.addEventListener('cart-cleared', update)

    // FIX: Scroll Hide Logic - Ref দিয়ে
    const onScroll = () => {
      const current = window.scrollY
      if (current <= 100) {
        setIsVisible(true)
      } else {
        if (current > lastScrollRef.current) {
          setIsVisible(false) // নিচে Scroll করলে লুকাবে
        } else {
          setIsVisible(true) // উপরে Scroll করলে দেখাবে
        }
      }
      lastScrollRef.current = current
    }
    
    window.addEventListener('scroll', onScroll, { passive: true })

    // Mobile এ Body Padding যাতে Content না ঢাকে
    if (window.innerWidth < 1024) {
      document.body.style.paddingBottom = '56px'
    }

    return () => {
      window.removeEventListener('cartUpdated', update)
      window.removeEventListener('storage', update)
      window.removeEventListener('authChanged', update)
      window.removeEventListener('cart-cleared', update)
      window.removeEventListener('scroll', onScroll)
      document.body.style.paddingBottom = '0px'
    }
  }, [])

  const isActive = (p) => pathname === p

  return (
    <div className={`fixed bottom-0 left-0 w-full h-[56px] bg-white/95 backdrop-blur-md border-t border-gray-200 flex items-center justify-around z-[9998] lg:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.06)] transition-transform duration-300 will-change-transform pb-[env(safe-area-inset-bottom)] ${isVisible? 'translate-y-0' : 'translate-y-[110%]'}`}>
      <Link href="/" className={`flex flex-col items-center flex-1 h-full justify-center transition-colors ${isActive('/')?'text-[#F85606]':'text-gray-500 hover:text-black'}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive('/')?2.2:1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        <span className={`text-[10px] mt-0.5 ${isActive('/')?'font-black':'font-medium'}`}>Home</span>
      </Link>
      <Link href="/category" className={`flex flex-col items-center flex-1 h-full justify-center transition-colors ${isActive('/category') || pathname.startsWith('/category')?'text-[#F85606]':'text-gray-500 hover:text-black'}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive('/category')?2.2:1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
        <span className={`text-[10px] mt-0.5 ${isActive('/category')?'font-black':'font-medium'}`}>Categories</span>
      </Link>
      <Link href="/cart" className={`flex flex-col items-center flex-1 h-full justify-center relative transition-colors ${isActive('/cart')?'text-[#F85606]':'text-gray-500 hover:text-black'}`}>
        <div className="relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive('/cart')?2.2:1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          {cartCount>0 && <span className="absolute -top-2 -right-2 bg-[#F85606] text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-black px-1 shadow-[0_2px_6px_rgba(248,86,6,0.5)] animate-pulse">{cartCount>99?'99+':cartCount}</span>}
        </div>
        <span className={`text-[10px] mt-0.5 ${isActive('/cart')?'font-black':'font-medium'}`}>Cart</span>
      </Link>
      <Link href="/account" className={`flex flex-col items-center flex-1 h-full justify-center transition-colors ${pathname.startsWith('/account')?'text-[#F85606]':'text-gray-500 hover:text-black'}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={pathname.startsWith('/account')?2.2:1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        <span className={`text-[10px] mt-0.5 ${pathname.startsWith('/account')?'font-black':'font-medium'}`}>Account</span>
      </Link>
    </div>
  )
}