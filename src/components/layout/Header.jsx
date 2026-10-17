'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AlgoliaSearch from '@/components/search/AlgoliaSearch'
import CategoryMegaMenu from './CategoryMegaMenu'

export default function Header(){
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [wishCount, setWishCount] = useState(0)
  const [lang, setLang] = useState('en')

  const userRef = useRef(null)
  const menuRef = useRef(null)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(()=>{
    const saved = localStorage.getItem('baharaz-lang')
    if(saved) setLang(saved)
    const onLangChange = ()=>{
      const ns = localStorage.getItem('baharaz-lang')
      if(ns) setLang(ns)
    }
    window.addEventListener('langChanged', onLangChange)
    window.addEventListener('storage', onLangChange)
    return ()=>{
      window.removeEventListener('langChanged', onLangChange)
      window.removeEventListener('storage', onLangChange)
    }
  },[])

  const showCategoriesStrip = useMemo(()=>{
    if (!pathname) return false
    if (pathname === '/') return false
    return true
  }, [pathname])

  useEffect(()=>{
    let mounted = true
    const loadData = async()=>{
      try{
        const { data:{ session } } = await supabase.auth.getSession()
        const au = session?.user
        if(!mounted) return
        if(au){
          setUser(au)
          // ===== FIX: Profile Table থেকে নাম আনবে - Gmail না, Account এর নাম =====
          let displayName = au.user_metadata?.full_name || au.user_metadata?.name || au.email?.split('@')[0] || 'User'
          let avatar = au.user_metadata?.avatar_url || au.user_metadata?.picture || null
          try{
            const { data: prof } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', au.id).single()
            if(prof?.full_name) displayName = prof.full_name
            if(prof?.avatar_url) avatar = prof.avatar_url
          }catch{}
          setProfile({
            full_name: displayName,
            avatar_url: avatar,
            email: au.email,
            email_verified: au.email_confirmed_at? true : false
          })
        } else {
          setUser(null)
          setProfile(null)
        }
        const localCart = JSON.parse(localStorage.getItem('baharaz_cart')||'[]')
        setCartCount(localCart.reduce((a,b)=>a+(b.qty||b.quantity||1),0))
        const localWish = JSON.parse(localStorage.getItem('baharaz_wishlist')||'[]')
        setWishCount(localWish.length)
      }catch(err){
        console.log('header load error', err)
      }
    }
    loadData()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session)=>{
      if(event==='SIGNED_IN'){ 
        loadData()
        setShowUserMenu(false)
      }
      if(event==='SIGNED_OUT'){
        setUser(null)
        setProfile(null)
        setShowUserMenu(false)
        setCartCount(0)
        setWishCount(0)
        localStorage.removeItem('baharaz_user')
        window.dispatchEvent(new Event('authChanged'))
      }
    })
    const handleOutside = (e)=>{
      if(userRef.current &&!userRef.current.contains(e.target) && menuRef.current &&!menuRef.current.contains(e.target)){
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    const onCartUpdate = ()=>{
      try{
        const c = JSON.parse(localStorage.getItem('baharaz_cart')||'[]')
        setCartCount(c.reduce((a,b)=>a+(b.qty||b.quantity||1),0))
      }catch{}
      try{
        const w = JSON.parse(localStorage.getItem('baharaz_wishlist')||'[]')
        setWishCount(w.length)
      }catch{}
    }
    const onCartCleared = ()=>{
      setCartCount(0)
    }
    const onProfileUpdated = ()=>{
      loadData()
    }
    window.addEventListener('cartUpdated', onCartUpdate)
    window.addEventListener('wishlistUpdated', onCartUpdate)
    window.addEventListener('storage', onCartUpdate)
    window.addEventListener('authChanged', loadData)
    window.addEventListener('profileUpdated', onProfileUpdated)
    window.addEventListener('cart-cleared', onCartCleared)
    return ()=>{
      mounted = false
      document.removeEventListener('mousedown', handleOutside)
      window.removeEventListener('cartUpdated', onCartUpdate)
      window.removeEventListener('wishlistUpdated', onCartUpdate)
      window.removeEventListener('storage', onCartUpdate)
      window.removeEventListener('authChanged', loadData)
      window.removeEventListener('profileUpdated', onProfileUpdated)
      window.removeEventListener('cart-cleared', onCartCleared)
      subscription.unsubscribe()
    }
  },[])

  const handleLogout = async()=>{
    try{
      // ===== FINAL LOGOUT FIX - 100% CLEAR =====
      await supabase.auth.signOut()
      
      // All Local Keys Clear - তোমার 54 Order Bug এর জন্য
      const keysToClear = [
        'baharaz_user','baharaz_token','baharaz_cart','cart','eRajCart',
        'baharaz_cart_items','baharaz_checkout_items','baharaz_checkout_summary',
        'baharaz_buy_now','baharaz_checkout_type','baharaz_wishlist',
        'eraj_all_orders','baharaz_orders','eraj_orders','all_orders','eraj_last_order',
        'baharaz_last_order','supabase.auth.token'
      ]
      keysToClear.forEach(k=> localStorage.removeItem(k))
      
      // Force Empty
      localStorage.setItem('baharaz_cart', '[]')
      localStorage.setItem('cart', '[]')
      localStorage.setItem('eRajCart', '[]')
      localStorage.setItem('baharaz_wishlist', '[]')
      localStorage.setItem('eraj_all_orders', '[]')
      localStorage.setItem('baharaz_orders', '[]')
      
      sessionStorage.clear()

      setUser(null)
      setProfile(null)
      setCartCount(0)
      setWishCount(0)
      setShowUserMenu(false)
      
      window.dispatchEvent(new Event('authChanged'))
      window.dispatchEvent(new Event('cartUpdated'))
      window.dispatchEvent(new CustomEvent('cart-cleared'))

      // Force Redirect - Header 100% Logout দেখাবে
      router.push('/')
      setTimeout(()=>{
        window.location.href = '/'
      }, 300)
      
    }catch(e){
      console.log('logout error', e)
      localStorage.clear()
      sessionStorage.clear()
      window.location.href = '/'
    }
  }

  return (
    <>
      <div className="w-full bg-[#F85606] select-none flex flex-col items-center sticky top-0 z-[9990] shadow-sm">
        <div className="w-full max-w-[1320px] h-[75px] flex items-center justify-between px-4 gap-4 shrink-0 mx-auto">
          <Link href="/" className="w-[200px] min-w-[200px] max-w-[200px] h-[39px] flex items-center shrink-0 select-none">
            <img src="/logo.png" alt="Baharaz" className="w-[127px] h-[40px] object-contain" draggable={false} onError={(e)=>{ e.currentTarget.style.display='none'; const nxt = e.currentTarget.nextSibling; if(nxt) nxt.style.display='block' }} />
            <span className="hidden text-white font-black text-[24px]">Baharaz</span>
          </Link>
          <div className="flex-1 max-w-[760px] h-[45px] flex items-center shrink-0">
            <div className="w-full h-full bg-white rounded-[2px] overflow-hidden">
              <AlgoliaSearch placeholder={lang==='en'? "Search in Baharaz" : "বাহারাজে খুঁজুন"} />
            </div>
          </div>
          <div className="w-auto flex items-center justify-end gap-3 shrink-0">
            <Link href="/cart" className="relative w-[45px] h-[45px] flex items-center justify-center hover:bg-white/10 rounded-full transition">
              <svg className="w-[30px] h-[30px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {cartCount>0 && <span className="absolute -top-1 -right-1 bg-white text-[#F85606] text-[11px] min-w-[20px] h-[20px] rounded-full flex items-center justify-center font-black px-1">{cartCount}</span>}
            </Link>
            {user && (
              <div className="relative md:hidden" ref={userRef}>
                <button onClick={()=>setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 hover:bg-white/15 rounded-full p-1 pr-2 transition">
                  <img src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name||'User')}&background=ffffff&color=F85606&bold=true`} alt="user" className="w-8 h-8 rounded-full bg-white object-cover border-2 border-white/50" draggable={false} referrerPolicy="no-referrer" />
                  <svg className={`w-3 h-3 text-white transition-transform ${showUserMenu? 'rotate-180':''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {showCategoriesStrip && (
          <div className="bg-white w-full h-[40px] border-b flex justify-center shrink-0 z-[100]">
            <div className="w-full max-w-[1320px] mx-auto px-4 h-full flex items-center">
              <div className="group relative h-full flex items-center">
                <button className="flex items-center gap-1.5 text-[#1a6bd1] font-bold text-[14px] h-full px-3 hover:text-[#0f4da0] select-none bg-white">
                  Categories
                  <svg className="w-3.5 h-3.5 transition-transform duration-150 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className="hidden group-hover:flex fixed top-[115px] left-2 lg:left-[calc(50vw-660px)] z-[999999] shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-gray-100 rounded-b-lg overflow-hidden bg-white">
                  <CategoryMegaMenu />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {user && showUserMenu && (
        <div ref={menuRef} className="fixed top-[76px] right-2 lg:right-[calc(50vw-660px)] w-[320px] max-w-[calc(100vw-16px)] bg-white rounded-[12px] shadow-[0_20px_60px_rgba(0,0,0,0.35)] border border-gray-200 z-[999999] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 md:hidden">
          <div className="p-4 bg-gradient-to-br from-[#FFF4F0] to-[#FFE8DE] border-b">
            <div className="flex items-center gap-3">
              <img src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name||'User')}&background=F85606&color=fff&bold=true`} className="w-12 h-12 rounded-full bg-white object-cover border-2 border-white shadow-sm" alt="" />
              <div className="flex-1 overflow-hidden">
                <p className="font-bold text-[14px] text-black truncate">{profile?.full_name}</p>
                <p className="text-[11px] text-gray-600 truncate">{profile?.email}</p>
                <p className={`text-[10px] mt-1 inline-flex px-2 py-0.5 rounded-full font-bold ${profile?.email_verified? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{profile?.email_verified? '✓ Verified' : 'Unverified'}</p>
              </div>
            </div>
          </div>
          <div className="p-2 bg-white">
            <button onClick={()=>{ setShowUserMenu(false); router.push('/account') }} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-[6px] text-[13px] text-black"><span>👤</span> My Account</button>
            <button onClick={()=>{ setShowUserMenu(false); router.push('/account/orders') }} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-[6px] text-[13px] text-black"><span>📦</span> My Orders <span className="ml-auto bg-[#F85606] text-white text-[10px] px-1.5 py-0.5 rounded-full">New</span></button>
            <button onClick={()=>{ setShowUserMenu(false); router.push('/wishlist') }} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-[6px] text-[13px] text-black"><span>❤️</span> Wishlist <span className="ml-auto bg-gray-100 px-2 py-0.5 rounded-full text-[11px] font-bold">{wishCount}</span></button>
            <button onClick={()=>{ setShowUserMenu(false); router.push('/account/reviews') }} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-[6px] text-[13px] text-black"><span>⭐</span> My Reviews</button>
            <button onClick={()=>{ setShowUserMenu(false); router.push('/account/vouchers') }} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-[6px] text-[13px] text-black"><span>🎟️</span> Vouchers</button>
            <hr className="my-2" />
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 rounded-[6px] text-[13px] text-red-600 font-medium"><span>🚪</span> Logout</button>
          </div>
        </div>
      )}
    </>
  )
}