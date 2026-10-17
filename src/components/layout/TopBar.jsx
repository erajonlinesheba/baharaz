'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function TopBar(){
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState({ full_name: '', avatar: '', email: '' })
  const [showAppQR, setShowAppQR] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [lang, setLang] = useState('en')
  const appRef = useRef(null)
  const supabase = createClient()

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

  const toggleLanguage = () => {
    const newLang = lang === 'en'? 'bn' : 'en'
    setLang(newLang)
    localStorage.setItem('baharaz-lang', newLang)
    window.dispatchEvent(new Event('langChanged'))
    window.dispatchEvent(new Event('storage'))
  }

  useEffect(()=>{
    let mounted = true
    const load = async()=>{
      try{
        const { data:{ session } } = await supabase.auth.getSession()
        if(!mounted) return
        if(session?.user){
          setUser(session.user)
          // Gmail এর ছবি + নাম
          const meta = session.user.user_metadata || {}
          let avatar = meta.avatar_url || meta.picture || meta.avatar || ''
          let rawName = meta.full_name || meta.name || session.user.email?.split('@')[0] || 'My Account'
          let email = session.user.email || ''
          
          try{
            const { data: prof } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', session.user.id).single()
            if(prof?.full_name) rawName = prof.full_name
            if(prof?.avatar_url) avatar = prof.avatar_url
          }catch{}

          setProfile({ 
            full_name: rawName.toUpperCase(), 
            avatar: avatar,
            email: email 
          })
        } else {
          setUser(null)
          setProfile({ full_name: '', avatar: '', email: '' })
        }
      }catch{}
    }
    load()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(()=>load())
    const onAuth = ()=>load()
    const onProfileUpdated = ()=>load()
    window.addEventListener('authChanged', onAuth)
    window.addEventListener('profileUpdated', onProfileUpdated)
    return ()=>{ mounted=false; subscription.unsubscribe(); window.removeEventListener('authChanged', onAuth); window.removeEventListener('profileUpdated', onProfileUpdated) }
  },[])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile({ full_name: '', avatar: '', email: '' })
      setShowProfileMenu(false)
      localStorage.removeItem('eraj_addresses')
      window.dispatchEvent(new Event('authChanged'))
      window.location.href = '/'
    } catch(e) { console.log(e) }
  }

  const initial = profile.full_name ? profile.full_name[0] : 'D'

  return (
    <>
      <div className="w-full bg-[#F85606] h-[26px] flex items-center justify-center relative z-[1000]">
        <div className="w-[1188px] max-w-full mx-auto px-2 h-[26px] flex items-center justify-between text-white text-[11px] font-medium shrink-0">
          <div className="flex items-center gap-5 shrink-0 min-w-[140px]">
            <div className="relative hidden md:flex items-center gap-1 cursor-pointer shrink-0" ref={appRef} onMouseEnter={()=>setShowAppQR(true)} onMouseLeave={()=>setShowAppQR(false)}>
              <span className="uppercase tracking-wide whitespace-nowrap">Save More On App</span>
              {showAppQR && (
                <div className="absolute top-[26px] left-0 w-[300px] bg-white rounded-[8px] shadow-[0_10px_40px_rgba(0,0,0,0.2)] p-4 z-[3000] flex gap-3 border">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://baharaz.com" alt="QR" className="w-[100px] h-[100px] border rounded" />
                  <div className="flex-1">
                    <p className="text-black font-bold text-[13px] leading-tight">Enjoy 15% Off + Free Delivery</p>
                    <p className="text-gray-500 text-[11px] mt-1">Scan QR to Download App</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6 uppercase tracking-wide ml-auto shrink-0">
            <Link href="/seller" className="hover:text-white/80 whitespace-nowrap shrink-0">Become A Seller</Link>
            <Link href="/help" className="hover:text-white/80 hidden sm:block whitespace-nowrap shrink-0">Help & Support</Link>
            {/* TRACK-ORDER - এখন track-order এ যাবে */}
            <Link href="/track-order" className="hover:text-white/80 hidden md:block whitespace-nowrap shrink-0">Track Order</Link>
            
            {!user? (
              <>
                <Link href="/login" className="hover:text-white/80 font-bold whitespace-nowrap shrink-0">Login</Link>
                <Link href="/register" className="hover:text-white/80 font-bold whitespace-nowrap shrink-0">Sign Up</Link>
              </>
            ) : (
              <div className="relative hidden md:block shrink-0">
                {/* TOPBAR এ - তীর বাদ, শুধু D + NAME - তোমার Screenshot 1 এর মতো */}
                <button 
                  onClick={()=>setShowProfileMenu(!showProfileMenu)}
                  onMouseEnter={()=>setShowProfileMenu(true)}
                  className="opacity-95 hover:opacity-100 cursor-pointer font-bold whitespace-nowrap bg-transparent border-0 text-white text-[11px] uppercase tracking-wide flex items-center gap-1.5"
                >
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="avatar" className="w-5 h-5 rounded-full object-cover bg-white" />
                  ) : (
                    <span className="w-5 h-5 bg-white text-[#F85606] rounded-full flex items-center justify-center text-[10px] font-black">
                      {initial}
                    </span>
                  )}
                  <span className="max-w-[120px] truncate">
                    {profile.full_name?.length > 18 ? profile.full_name.slice(0,18) : profile.full_name}
                  </span>
                </button>
              </div>
            )}

            <button onClick={toggleLanguage} className="w-[45px] min-w-[45px] max-w-[45px] h-[20px] bg-white/15 hover:bg-white/25 px-2.5 py-0.5 rounded-[4px] font-black flex items-center justify-center shrink-0">
              {lang==='en'? 'ভাষা' : 'EN'}
            </button>
          </div>
        </div>
      </div>

      {/* DROPDOWN - তোমার Screenshot 2 এর মতো - Gmail ছবি + Name + Email */}
      {user && showProfileMenu && (
        <>
          <div className="fixed inset-0 z-[999998]" onClick={()=>setShowProfileMenu(false)}></div>
          <div 
            className="fixed top-[26px] right-[20px] md:right-[calc((100vw-1188px)/2+10px)] w-[300px] bg-white rounded-[12px] shadow-[0_20px_60px_rgba(0,0,0,0.25)] z-[999999] border border-gray-100 overflow-hidden"
            onMouseLeave={()=>setShowProfileMenu(false)}
            onMouseEnter={()=>setShowProfileMenu(true)}
          >
            {/* Header - Screenshot এর মতো */}
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
        </>
      )}
    </>
  )
}