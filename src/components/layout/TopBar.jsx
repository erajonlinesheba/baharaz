'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { createPortal } from 'react-dom'

export default function TopBar(){
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('baharaz-profile')
        if (cached) {
          const c = JSON.parse(cached)
          if (c?.id) return { id: c.id, email: c.email }
        }
      } catch {}
    }
    return null
  })
  const [profile, setProfile] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('baharaz-profile')
        if (cached) {
          const c = JSON.parse(cached)
          if (c?.full_name) return { full_name: c.full_name, avatar: c.avatar || '', email: c.email || '' }
        }
      } catch {}
    }
    return { full_name: '', avatar: '', email: '' }
  })
  const [showAppQR, setShowAppQR] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [lang, setLang] = useState('en')
  const [authChecked, setAuthChecked] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('baharaz-profile')
    }
    return false
  })
  const [mounted, setMounted] = useState(false)
  const [menuPos, setMenuPos] = useState({ top: 102, right: 8 })
  const appRef = useRef(null)
  const profileBtnRef = useRef(null)
  const supabase = createClient()

  useEffect(()=>{ setMounted(true) },[])

  useEffect(()=>{
    const saved = localStorage.getItem('baharaz-lang')
    if(saved) setLang(saved)
    const onLang = ()=>{
      const ns = localStorage.getItem('baharaz-lang')
      if(ns) setLang(ns)
    }
    window.addEventListener('langChanged', onLang)
    window.addEventListener('storage', onLang)
    return ()=>{
      window.removeEventListener('langChanged', onLang)
      window.removeEventListener('storage', onLang)
    }
  },[])

  const updateMenuPos = () => {
    if(profileBtnRef.current){
      const rect = profileBtnRef.current.getBoundingClientRect()
      // আরো নিচে + আরো ডানে - হেডারের নিচে বের হবে
      // Topbar 28px + Header 64px + 10px gap = 102px
      const headerHeight = 28 + 64
      const rightFromFrame = Math.max(4, window.innerWidth - rect.right - 50)
      setMenuPos({ top: headerHeight + 10, right: rightFromFrame })
    }
  }

  useEffect(()=>{
    if(showProfileMenu) updateMenuPos()
    const onResize = () => { if(showProfileMenu) updateMenuPos() }
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onResize)
    return ()=>{ window.removeEventListener('resize', onResize); window.removeEventListener('scroll', onResize) }
  },[showProfileMenu])

  const toggleLanguage = () => {
    const newLang = lang === 'en'? 'bn' : 'en'
    setLang(newLang)
    localStorage.setItem('baharaz-lang', newLang)
    window.dispatchEvent(new Event('langChanged'))
    window.dispatchEvent(new Event('storage'))
  }

  useEffect(()=>{
    let mountedFlag = true
    
    const loadProfile = async (currentUser) => {
      if(!currentUser){
        const hasCache = localStorage.getItem('baharaz-profile')
        if(!hasCache && mountedFlag){
          setUser(null)
          setProfile({ full_name: '', avatar: '', email: '' })
          setAuthChecked(true)
        }
        if(mountedFlag && !hasCache){
          setAuthChecked(true)
        }
        return
      }
      if(mountedFlag) setUser(currentUser)
      const meta = currentUser.user_metadata || {}
      let avatar = meta.avatar_url || meta.picture || meta.avatar || ''
      let rawName = meta.full_name || meta.name || currentUser.email?.split('@')[0] || 'My Account'
      let email = currentUser.email || ''
      
      try{
        const { data: prof } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', currentUser.id).single()
        if(prof?.full_name) rawName = prof.full_name
        if(prof?.avatar_url) avatar = prof.avatar_url
      }catch{}

      if(mountedFlag){
        const finalProfile = { 
          full_name: rawName.toUpperCase(), 
          avatar: avatar,
          email: email 
        }
        setProfile(finalProfile)
        setAuthChecked(true)
        localStorage.setItem('baharaz-profile', JSON.stringify({
          id: currentUser.id,
          full_name: finalProfile.full_name,
          avatar: finalProfile.avatar,
          email: finalProfile.email
        }))
      }
    }

    const init = async() => {
      try{
        const { data: { session } } = await supabase.auth.getSession()
        if(session?.user){
          if(mountedFlag) await loadProfile(session.user)
        } else {
          if(mountedFlag){
            const hasCache = localStorage.getItem('baharaz-profile')
            if(!hasCache){
              setAuthChecked(true)
              setUser(null)
            } else {
              setAuthChecked(true)
            }
          }
        }
      }catch{
        if(mountedFlag) setAuthChecked(true)
      }
    }
    
    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if(event === 'SIGNED_OUT'){
        if(mountedFlag){
          setUser(null)
          setProfile({ full_name: '', avatar: '', email: '' })
          setAuthChecked(true)
          localStorage.removeItem('baharaz-profile')
        }
        return
      }
      if(mountedFlag) await loadProfile(session?.user || null)
    })

    const onAuth = async() => {
      const { data:{ user: u } } = await supabase.auth.getUser()
      if(mountedFlag) await loadProfile(u)
    }
    window.addEventListener('authChanged', onAuth)
    window.addEventListener('profileUpdated', onAuth)
    
    return ()=>{ 
      mountedFlag=false
      subscription.unsubscribe()
      window.removeEventListener('authChanged', onAuth)
      window.removeEventListener('profileUpdated', onAuth)
    }
  },[])

  const handleLogout = async () => {
    try {
      localStorage.removeItem('baharaz-profile')
      localStorage.removeItem('eraj_addresses')
      setUser(null)
      setProfile({ full_name: '', avatar: '', email: '' })
      setShowProfileMenu(false)
      setAuthChecked(true)
      await supabase.auth.signOut()
      window.dispatchEvent(new Event('authChanged'))
      window.location.href = '/'
    } catch(e) { console.log(e) }
  }

  const initial = profile.full_name ? profile.full_name[0] : 'D'

  return (
    <>
      <div className="w-full bg-[#F85606] h-[28px] flex items-center relative z-[9999]" suppressHydrationWarning>
        <div className="w-full max-w-[1188px] mx-auto px-3 h-[28px] flex items-center justify-between text-white text-[11px] font-medium gap-2">
          
          <div className="hidden md:flex items-center gap-5 shrink-0">
            <div className="relative flex items-center gap-1 cursor-pointer" ref={appRef} onMouseEnter={()=>setShowAppQR(true)} onMouseLeave={()=>setShowAppQR(false)}>
              <span className="uppercase tracking-wide whitespace-nowrap">Save More On App</span>
              {showAppQR && (
                <div className="absolute top-[38px] left-0 w-[300px] bg-white rounded-[8px] shadow-[0_10px_40px_rgba(0,0,0,0.2)] p-4 z-[9999] flex gap-3 border">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://baharaz.com" alt="QR" className="w-[100px] h-[100px] border rounded" />
                  <div className="flex-1">
                    <p className="text-black font-bold text-[13px] leading-tight">Enjoy 15% Off + Free Delivery</p>
                    <p className="text-gray-500 text-[11px] mt-1">Scan QR to Download App</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-5 uppercase tracking-wide ml-auto shrink-0 whitespace-nowrap">
            <Link href="/seller" className="hover:text-white/80 shrink-0">Become A Seller</Link>
            <Link href="/help" className="hover:text-white/80 hidden sm:block shrink-0">Help & Support</Link>
            <Link href="/track-order" className="hover:text-white/80 hidden md:block shrink-0">Track Order</Link>
            
            <div className="relative w-[135px] h-[28px] shrink-0 flex items-center justify-end">
              {!authChecked ? (
                <div className="absolute right-0 flex items-center gap-3">
                  <span className="w-[80px] h-[12px] bg-white/20 rounded animate-pulse inline-block"></span>
                </div>
              ) : !user ? (
                <div className="absolute right-0 flex items-center gap-3">
                  <Link href="/login" className="hover:text-white/80 font-bold shrink-0">Login</Link>
                  <Link href="/register" className="hover:text-white/80 font-bold shrink-0">Sign Up</Link>
                </div>
              ) : (
                <div className="absolute right-0 flex items-center justify-end max-w-[135px]">
                  <button 
                    ref={profileBtnRef}
                    onClick={()=>{ updateMenuPos(); setShowProfileMenu(!showProfileMenu)}}
                    onMouseEnter={()=>{ updateMenuPos(); setShowProfileMenu(true)}}
                    className="opacity-95 hover:opacity-100 cursor-pointer font-bold whitespace-nowrap bg-transparent border-0 text-white text-[11px] uppercase tracking-wide flex items-center gap-1.5"
                  >
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="avatar" className="w-5 h-5 rounded-full object-cover bg-white shrink-0" />
                    ) : (
                      <span className="w-5 h-5 bg-white text-[#F85606] rounded-full flex items-center justify-center text-[10px] font-black shrink-0">
                        {initial}
                      </span>
                    )}
                    <span className="max-w-[80px] lg:max-w-[120px] truncate">
                      {profile.full_name?.length > 18 ? profile.full_name.slice(0,18) : profile.full_name}
                    </span>
                  </button>
                </div>
              )}
            </div>

            <button onClick={toggleLanguage} className="w-[36px] md:w-[45px] min-w-[36px] h-[20px] bg-white/15 hover:bg-white/25 px-2 py-0.5 rounded-[4px] font-black flex items-center justify-center shrink-0 ml-1">
              {lang==='en'? 'ভাষা' : 'EN'}
            </button>
          </div>
        </div>
      </div>

      {mounted && user && showProfileMenu && createPortal(
        <>
          <div className="fixed inset-0 z-[999998] bg-transparent" onClick={()=>setShowProfileMenu(false)}></div>
          <div 
            className="fixed w-[300px] max-w-[95vw] bg-white rounded-[12px] shadow-[0_20px_60px_rgba(0,0,0,0.25)] z-[999999] border border-gray-100 overflow-hidden"
            style={{ top: `${menuPos.top}px`, right: `${menuPos.right}px` }}
            onMouseLeave={()=>setShowProfileMenu(false)}
            onMouseEnter={()=>{ updateMenuPos(); setShowProfileMenu(true)}}
          >
            <div className="px-5 py-4 flex items-center gap-3 border-b border-gray-100">
              {profile.avatar ? (
                <img src={profile.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 bg-[#F85606] text-white rounded-full flex items-center justify-center font-black text-[16px]">
                  {initial}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-black font-bold text-[14px] truncate uppercase">{profile.full_name}</p>
                <p className="text-gray-500 text-[11px] truncate">{profile.email}</p>
              </div>
            </div>

            <div className="py-1">
              <Link href="/account" onClick={()=>setShowProfileMenu(false)} className="flex items-center gap-3 px-5 py-[10px] text-black text-[13px] hover:bg-gray-50">
                <span className="text-[14px]">👤</span> Manage My Account
              </Link>
              <Link href="/account/orders" onClick={()=>setShowProfileMenu(false)} className="flex items-center gap-3 px-5 py-[10px] text-black text-[13px] hover:bg-gray-50">
                <span className="text-[14px]">📦</span> My Orders
              </Link>
              <Link href="/account/wishlist" onClick={()=>setShowProfileMenu(false)} className="flex items-center gap-3 px-5 py-[10px] text-black text-[13px] hover:bg-gray-50">
                <span className="text-[14px]">❤️</span> My Wishlist
              </Link>
              <Link href="/account/reviews" onClick={()=>setShowProfileMenu(false)} className="flex items-center gap-3 px-5 py-[10px] text-black text-[13px] hover:bg-gray-50">
                <span className="text-[14px]">⭐</span> My Reviews
              </Link>
              <Link href="/account/returns" onClick={()=>setShowProfileMenu(false)} className="flex items-center gap-3 px-5 py-[10px] text-black text-[13px] hover:bg-gray-50">
                <span className="text-[14px]">↩️</span> My Returns & Cancellations
              </Link>
              <div className="border-t border-gray-100 mt-1">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-[10px] text-black text-[13px] hover:bg-gray-50 text-left">
                  <span className="text-[14px]">🚪</span> Logout
                </button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  )
}