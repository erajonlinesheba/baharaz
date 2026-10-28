'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const [cartCount, setCartCount] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [flashLive, setFlashLive] = useState(true)
  const lastScrollRef = useRef(0)

  useEffect(() => {
    const update = () => {
      try {
        const c1 = JSON.parse(localStorage.getItem('baharaz_cart') || '[]')
        const c2 = JSON.parse(localStorage.getItem('eRajCart') || '[]')
        const cart = c1.length > 0 ? c1 : c2
        setCartCount(cart.reduce((a, b) => a + (b.qty || b.quantity || 1), 0))
      } catch {}
    }
    update()
    window.addEventListener('cartUpdated', update)
    window.addEventListener('storage', update)
    const flashInterval = setInterval(()=> setFlashLive(f => !f), 1200)
    const onScroll = () => {
      const current = window.scrollY || document.documentElement.scrollTop
      if (current <= 60) setIsVisible(true)
      else {
        if (current > lastScrollRef.current + 12) setIsVisible(false)
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
    }
  }, [])

  // যেখানে যেখানে দেখা দরকার না, সেখানেই Hide হবে
  const HIDE_PAGES = ["/login", "/signup", "/admin", "/checkout", "/payment", "/order-success"]
  if (HIDE_PAGES.some(p => pathname.startsWith(p))) return null

  const isActive = (p) => pathname === p
  const isActiveStarts = (p) => pathname === p || pathname.startsWith(p + "/")
  const haptic = () => { if(typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(8) }

  return (
    <div className={`fixed bottom-0 left-0 w-full bg-[#ffffff] border-t border-[#eeeeee] flex items-center justify-around z-[9998] lg:hidden shadow-[0_-1px_8px_rgba(0,0,0,0.05)] transition-transform duration-300 will-change-transform ${isVisible? 'translate-y-0' : 'translate-y-[110%]'}`}
      style={{ height: 'calc(56px + env(safe-area-inset-bottom))', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      
      <Link onClick={haptic} href="/" className={`flex flex-col items-center justify-center flex-1 h-[56px] gap-[2px] ${isActive('/')?'text-[#F85606]':'text-[#9a9a9a]'}`}>
        <div className={`w-[22px] h-[22px] flex items-center justify-center rounded-[7px] ${isActive('/')?'bg-[#fff1eb]':''}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isActive('/') ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isActive('/') ? "0" : "1.7"}><path d="M3 9L12 2l9 7v11a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-5H10v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9z"/></svg>
        </div>
        <span className={`text-[9px] leading-none ${isActive('/')?'font-[700]':'font-[500]'}`}>Home</span>
      </Link>

      <Link onClick={haptic} href="/category" className={`flex flex-col items-center justify-center flex-1 h-[56px] gap-[2px] ${isActiveStarts('/category')?'text-[#F85606]':'text-[#9a9a9a]'}`}>
        <div className={`w-[22px] h-[22px] flex items-center justify-center rounded-[7px] ${isActiveStarts('/category')?'bg-[#fff1eb]':''}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>
        </div>
        <span className={`text-[9px] leading-none ${isActiveStarts('/category')?'font-[700]':'font-[500]'}`}>Category</span>
      </Link>

      <Link onClick={haptic} href="/flash-sale" className="flex flex-col items-center justify-center flex-1 h-[56px] relative -top-[8px]">
        <div className={`w-[46px] h-[46px] rounded-full bg-gradient-to-br from-[#F85606] to-[#FF8A00] flex items-center justify-center shadow-[0_3px_10px_rgba(248,86,6,0.3)] border-[2.5px] border-white transition-transform duration-300 ${flashLive?'scale-[1.05]':'scale-[1]'}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>
        </div>
        <span className="text-[8.5px] font-[800] text-[#F85606] mt-[1px] leading-none">FLASH</span>
      </Link>

      <Link onClick={haptic} href="/cart" className={`flex flex-col items-center justify-center flex-1 h-[56px] gap-[2px] relative ${isActive('/cart')?'text-[#F85606]':'text-[#9a9a9a]'}`}>
        <div className={`w-[22px] h-[22px] flex items-center justify-center rounded-[7px] ${isActive('/cart')?'bg-[#fff1eb]':''}`}>
          <div className="relative">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            {cartCount>0 && <span className="absolute -top-[6px] -right-[8px] bg-[#F85606] text-white text-[8.5px] min-w-[14px] h-[14px] px-[2px] rounded-full flex items-center justify-center font-[700] border-[1.5px] border-white leading-none">{cartCount > 99 ? '99+' : cartCount}</span>}
          </div>
        </div>
        <span className={`text-[9px] leading-none ${isActive('/cart')?'font-[700]':'font-[500]'}`}>Cart</span>
      </Link>

      <Link onClick={haptic} href="/account" className={`flex flex-col items-center justify-center flex-1 h-[56px] gap-[2px] ${pathname.startsWith('/account')?'text-[#F85606]':'text-[#9a9a9a]'}`}>
        <div className={`w-[22px] h-[22px] flex items-center justify-center rounded-[7px] ${pathname.startsWith('/account')?'bg-[#fff1eb]':''}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill={pathname.startsWith('/account') ? "currentColor" : "none"} stroke="currentColor" strokeWidth={pathname.startsWith('/account') ? "0" : "1.7"}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <span className={`text-[9px] leading-none ${pathname.startsWith('/account')?'font-[700]':'font-[500]'}`}>Account</span>
      </Link>
    </div>
  )
}