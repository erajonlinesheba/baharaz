'use client'
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AlgoliaSearch from '@/components/search/AlgoliaSearch'

export default function Header(){
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [wishCount, setWishCount] = useState(0)
  const [lang, setLang] = useState('en')

  const userRef = useRef(null)
  const menuRef = useRef(null)
  const fetchedRef = useRef(false) // FIX - Duplicate Block
  const router = useRouter()
  
  // FIX - supabase client একবারই তৈরি হবে, প্রতি Render এ না
  const supabase = useMemo(()=> createClient(), [])

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

  const loadData = useCallback(async()=>{
    if(fetchedRef.current) return
    fetchedRef.current = true
    try{
      // CACHE - Instant Load
      try{
        const cachedProfile = sessionStorage.getItem('baharaz_profile')
        if(cachedProfile){
          const cp = JSON.parse(cachedProfile)
          setProfile(cp.profile)
          setUser(cp.user)
        }
        const localCart = JSON.parse(localStorage.getItem('baharaz_cart')||'[]')
        setCartCount(localCart.reduce((a,b)=>a+(b.qty||b.quantity||1),0))
        const localWish = JSON.parse(localStorage.getItem('baharaz_wishlist')||'[]')
        setWishCount(localWish.length)
      }catch{}

      const { data:{ session } } = await supabase.auth.getSession()
      const au = session?.user
      if(au){
        setUser(au)
        let displayName = au.user_metadata?.full_name || au.user_metadata?.name || au.email?.split('@')[0] || 'User'
        let avatar = au.user_metadata?.avatar_url || au.user_metadata?.picture || null
        try{
          const { data: prof } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', au.id).single()
          if(prof?.full_name) displayName = prof.full_name
          if(prof?.avatar_url) avatar = prof.avatar_url
        }catch{}
        const finalProfile = {
          full_name: displayName,
          avatar_url: avatar,
          email: au.email,
          email_verified: au.email_confirmed_at? true : false
        }
        setProfile(finalProfile)
        try{ sessionStorage.setItem('baharaz_profile', JSON.stringify({ profile: finalProfile, user: au })) }catch{}
      } else {
        setUser(null)
        setProfile(null)
      }
    }catch(err){
      console.log('header load error', err)
    } finally {
      // 5 সেকেন্ড পর আবার Fetch Allow করবে
      setTimeout(()=>{ fetchedRef.current = false }, 5000)
    }
  }, [supabase])

  useEffect(()=>{
    let mounted = true
    loadData()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session)=>{
      if(!mounted) return
      if(event==='SIGNED_IN'){ fetchedRef.current = false; loadData(); setShowUserMenu(false) }
      if(event==='SIGNED_OUT'){
        setUser(null); setProfile(null); setShowUserMenu(false); setCartCount(0); setWishCount(0)
        localStorage.removeItem('baharaz_user')
        sessionStorage.removeItem('baharaz_profile')
        fetchedRef.current = false
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
    
    window.addEventListener('cartUpdated', onCartUpdate)
    window.addEventListener('wishlistUpdated', onCartUpdate)
    window.addEventListener('storage', onCartUpdate)
    window.addEventListener('authChanged', loadData)
    window.addEventListener('cart-cleared', ()=>setCartCount(0))
    
    return ()=>{
      mounted = false
      document.removeEventListener('mousedown', handleOutside)
      window.removeEventListener('cartUpdated', onCartUpdate)
      window.removeEventListener('wishlistUpdated', onCartUpdate)
      window.removeEventListener('storage', onCartUpdate)
      window.removeEventListener('authChanged', loadData)
      subscription.unsubscribe()
    }
  },[loadData, supabase])

  const handleLogout = async()=>{
    try{
      await supabase.auth.signOut()
      localStorage.setItem('baharaz_cart', '[]')
      localStorage.setItem('baharaz_wishlist', '[]')
      sessionStorage.clear()
      fetchedRef.current = false
      setUser(null); setProfile(null); setCartCount(0); setWishCount(0); setShowUserMenu(false)
      window.dispatchEvent(new Event('authChanged'))
      router.push('/')
      setTimeout(()=>{ window.location.href = '/' }, 300)
    }catch(e){ localStorage.clear(); window.location.href = '/' }
  }

  return (
    <>
      <div className="w-full max-w-[100vw] overflow-x-hidden bg-[#F85606] select-none flex flex-col shadow-sm">
        <div className="w-full max-w-[1188px] mx-auto h-[56px] md:h-[75px] flex items-center px-3 md:px-0">
          <Link href="/" className="shrink-0 w-[44px] md:w-[120px] flex items-center">
            <img src="/logo.png" alt="Baharaz" className="w-[38px] md:w-[105px] h-[38px] md:h-[40px] object-contain bg-white rounded-[6px] md:rounded-none md:bg-transparent p-1 md:p-0" draggable={false} />
          </Link>

          <div className="flex-1 max-w-[620px] md:max-w-[620px] h-[36px] md:h-[45px] ml-4 md:ml-[72px]">
            <div className="w-full h-full bg-white rounded-[2px] overflow-hidden flex">
              <div className="flex-1 h-full">
                <AlgoliaSearch placeholder={lang==='en'? "Search in Baharaz" : "বাহারাজে খুঁজুন"} />
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center ml-2 md:ml-[14px]">
            <Link href="/cart" className="relative w-[42px] h-[42px] flex items-center justify-center hover:bg-white/10 rounded-full transition">
              <svg className="w-[28px] h-[28px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {cartCount>0 && <span className="absolute -top-1 -right-1 bg-white text-[#F85606] text-[11px] min-w-[20px] h-[20px] rounded-full flex items-center justify-center font-black px-1 border-2 border-[#F85606]">{cartCount}</span>}
            </Link>
            {user && (
              <div className="relative md:hidden ml-1" ref={userRef}>
                <button onClick={()=>setShowUserMenu(!showUserMenu)} className="w-8 h-8 rounded-full bg-white overflow-hidden">
                  <img src={profile?.avatar_url || `https://ui-avatars.com/api/?name=U&background=ffffff&color=F85606`} className="w-full h-full object-cover" alt="" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {user && showUserMenu && (
        <div ref={menuRef} className="fixed top-[56px] right-2 lg:right-[calc(50vw-594px)] w-[320px] max-w-[calc(100vw-16px)] bg-white rounded-[12px] shadow-[0_20px_60px_rgba(0,0,0,0.35)] border border-gray-200 z-[999999] overflow-hidden md:hidden">
          <div className="p-4 bg-gradient-to-br from-[#FFF4F0] to-[#FFE8DE] border-b flex items-center gap-3">
            <img src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name}&background=F85606&color=fff`} className="w-12 h-12 rounded-full bg-white object-cover border-2 border-white" alt="" />
            <div className="flex-1 overflow-hidden"><p className="font-bold text-[14px] truncate">{profile?.full_name}</p><p className="text-[11px] text-gray-600 truncate">{profile?.email}</p></div>
          </div>
          <div className="p-2 bg-white">
            <button onClick={()=>{ setShowUserMenu(false); router.push('/account') }} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-[6px] text-[13px]">👤 My Account</button>
            <button onClick={()=>{ setShowUserMenu(false); router.push('/account/orders') }} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-[6px] text-[13px]">📦 My Orders</button>
            <hr className="my-2" />
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 rounded-[6px] text-[13px] text-red-600 font-medium">🚪 Logout</button>
          </div>
        </div>
      )}
    </>
  )
}