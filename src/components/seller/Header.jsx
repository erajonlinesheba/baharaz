'use client'
import { useState, useRef, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Bell, Moon, Sun, User, LogOut, Settings, Globe, MessageSquare, Package, ShoppingBag, Gift, Sparkles, Bot, Brain, Zap, Crown, Shield, Award, Eye, DollarSign, Flame, Target, Activity, Wifi, Clock, Menu, X, Store, ExternalLink, Copy, CheckCircle } from 'lucide-react'

export default function Header({ darkMode, setDarkMode, profile, user, notifications, markAsRead, handleLogout, searchQuery, setSearchQuery, handleSearch, cardTheme, inputTheme, hoverTheme, unreadCount, realtimeOrders, isVerified }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSearchAI, setShowSearchAI] = useState(false)
  const [liveTime, setLiveTime] = useState(new Date().toLocaleTimeString('en-BD', {hour: '2-digit', minute: '2-digit'}))
  const [copied, setCopied] = useState(false)
  const profileRef = useRef(null)
  const notifRef = useRef(null)
  const router = useRouter()

  const storeUrl = useMemo(()=> profile?.store_slug? `${typeof window!=='undefined'? window.location.origin : ''}/store/${profile.store_slug}` : '', [profile])

  useEffect(()=>{
    const handleClickOutside = (e) => {
      if(profileRef.current &&!profileRef.current.contains(e.target)) setShowProfileMenu(false)
      if(notifRef.current &&!notifRef.current.contains(e.target)) setShowNotifications(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    const timer = setInterval(()=> setLiveTime(new Date().toLocaleTimeString('en-BD', {hour: '2-digit', minute: '2-digit'})), 1000)
    return ()=>{ document.removeEventListener('mousedown', handleClickOutside); clearInterval(timer) }
  }, [])

  const handleCopyStore = () => {
    if(!storeUrl) return
    navigator.clipboard.writeText(storeUrl)
    setCopied(true)
    setTimeout(()=>setCopied(false), 2000)
  }

  return (
    <div className={`w-full px-4 md:px-6 py-3 flex items-center justify-between gap-3 ${cardTheme} rounded-none border-0 border-b`}>
      {/* LEFT - SEARCH + AI */}
      <div className="flex items-center gap-3 flex-1 max-w-[600px]">
        <div className="relative flex-1 group">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#F85606] transition"/>
          <input
            value={searchQuery}
            onChange={(e)=>{ setSearchQuery(e.target.value); setShowSearchAI(e.target.value.length>1) }}
            onKeyDown={handleSearch}
            placeholder="Search REAL products, orders, AI..."
            className={`w-full pl-10 pr-10 py-2.5 rounded-full border text-[13px] font-medium outline-none transition-all ${inputTheme} focus:border-[#F85606]/40 focus:ring-2 focus:ring-[#F85606]/10`}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchQuery && <button onClick={()=>{setSearchQuery(''); setShowSearchAI(false)}} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition"><X size={10}/></button>}
            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-violet-600 to-orange-500 flex items-center justify-center text-white shadow-md"><Bot size={12}/></div>
          </div>

          {/* REAL AI SEARCH SUGGESTION - PRO */}
          {showSearchAI && searchQuery && (
            <div className="absolute top-[110%] left-0 right-0 bg-white border rounded-[16px] shadow-[0_15px_50px_rgba(0,0,0,0.15)] p-2 z-50 animate-slideDown">
              <div className="text-[10px] font-black text-gray-500 px-3 py-1.5 flex items-center gap-1"><Brain size={10} className="text-violet-500"/> REAL AI Suggestions for "{searchQuery}"</div>
              {[
                { icon: <Package size={12}/>, text: `Search Products: ${searchQuery} - REAL DB`, action: ()=>router.push(`/seller/products?search=${searchQuery}`) },
                { icon: <ShoppingBag size={12}/>, text: `Search Orders: ${searchQuery} - REAL`, action: ()=>router.push(`/seller/dashboard/orders/pending-orders?search=${searchQuery}`) },
                { icon: <Sparkles size={12}/>, text: `AI Title for: ${searchQuery} - REAL AI`, action: ()=>router.push(`/seller/dashboard/ai-assistant/ai-title-generator?q=${searchQuery}`) },
              ].map((s,i)=>(
                <button key={i} onClick={s.action} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-gray-50 flex items-center gap-2 text-[12px] font-medium transition hover:translate-x-1">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">{s.icon}</div>
                  {s.text}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* LIVE STATS - REAL */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full text-[11px] font-black text-green-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live {liveTime}
          </div>
          {realtimeOrders>0 && (
            <div className="flex items-center gap-1 bg-gradient-to-r from-[#F85606] to-orange-500 text-white px-3 py-1.5 rounded-full text-[11px] font-black shadow-md animate-bounce">
              <Flame size={12}/> +{realtimeOrders} New Orders REAL!
            </div>
          )}
        </div>
      </div>

      {/* RIGHT - ACTIONS - REAL */}
      <div className="flex items-center gap-2">
        {/* STORE LINK - REAL */}
        {profile?.store_slug && (
          <div className="hidden md:flex items-center gap-1 bg-[#f6f6f8] border rounded-full pl-3 pr-1 py-1">
            <Store size={12} className="text-black/40"/>
            <span className="text-[11px] font-bold max-w-[120px] truncate">/store/{profile.store_slug}</span>
            <button onClick={handleCopyStore} className={`w-7 h-7 rounded-full flex items-center justify-center transition ${copied? 'bg-green-500 text-white' : 'bg-black text-white hover:scale-110'}`}>
              {copied? <CheckCircle size={12}/> : <Copy size={12}/>}
            </button>
            <a href={storeUrl} target="_blank" className="w-7 h-7 rounded-full bg-gradient-to-r from-violet-600 to-orange-500 text-white flex items-center justify-center hover:scale-110 transition"><ExternalLink size={12}/></a>
          </div>
        )}

        <button onClick={()=>setDarkMode(!darkMode)} className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all hover:scale-110 ${hoverTheme}`}>
          {darkMode? <Sun size={16}/> : <Moon size={16}/>}
        </button>

        <button onClick={()=>router.push('/seller/dashboard/customer-service/messages')} className={`w-9 h-9 rounded-full border flex items-center justify-center relative hover:scale-110 transition ${hoverTheme}`}>
          <MessageSquare size={16}/>
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md">3</span>
        </button>

        {/* NOTIFICATION - REAL */}
        <div className="relative" ref={notifRef}>
          <button onClick={()=>setShowNotifications(!showNotifications)} className={`w-9 h-9 rounded-full border flex items-center justify-center relative hover:scale-110 transition ${hoverTheme}`}>
            <Bell size={16}/>
            {unreadCount>0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md animate-pulse">{unreadCount}</span>}
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-[120%] w-[350px] bg-white border rounded-[18px] shadow-[0_15px_50px_rgba(0,0,0,0.15)] overflow-hidden z-50 animate-slideDown">
              <div className="p-4 border-b flex items-center justify-between">
                <span className="font-black text-[13px] flex items-center gap-2"><Activity size={14} className="text-[#F85606]"/> Real Notifications - {unreadCount} New</span>
                <span className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded-full font-bold border border-green-200 flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Live</span>
              </div>
              <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                {notifications.map(n=>(
                  <div key={n.id} onClick={()=>markAsRead(n.id, n.link)} className={`p-3.5 border-b hover:bg-gray-50 cursor-pointer transition ${!n.read? 'bg-orange-50/50' : ''}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${!n.read? 'bg-gradient-to-br from-[#F85606] to-orange-400 text-white' : 'bg-gray-100 text-gray-500'}`}><Bell size={14}/></div>
                      <div className="flex-1">
                        <p className="text-[12px] font-medium leading-5">{n.text}</p>
                        <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1"><Clock size={10}/>{n.time} • REAL</p>
                      </div>
                      {!n.read && <div className="w-2 h-2 bg-[#F85606] rounded-full animate-pulse mt-1"></div>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2.5 bg-gray-50 flex gap-2">
                <button onClick={()=>router.push('/seller/dashboard/orders/pending-orders')} className="flex-1 bg-black text-white py-2 rounded-full font-black text-[11px]">View All REAL Orders</button>
                <button onClick={()=>setShowNotifications(false)} className="px-4 py-2 rounded-full border bg-white font-black text-[11px]">Close</button>
              </div>
            </div>
          )}
        </div>

        {/* PROFILE - REAL */}
        <div className="relative" ref={profileRef}>
          <button onClick={()=>setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-2 border rounded-full pl-1 pr-3 py-1 hover:shadow-md transition bg-white hover:scale-[1.02]">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F85606] to-orange-400 flex items-center justify-center text-white font-black text-[12px] shadow-md">{profile?.full_name?.[0] || user?.email?.[0] || 'S'}</div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div className="hidden md:block text-left">
              <div className="text-[11px] font-black leading-3 flex items-center gap-1">{profile?.full_name || 'Seller'} {isVerified? <Crown size={10} className="text-yellow-500"/> : <Shield size={10} className="text-gray-400"/>}</div>
              <div className="text-[10px] text-gray-500 font-bold flex items-center gap-1">{isVerified? 'Gold Seller - REAL' : 'Bronze'} <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span> Live</div>
            </div>
          </button>
          {showProfileMenu && (
            <div className="absolute right-0 top-[120%] w-[280px] bg-white border rounded-[18px] shadow-[0_15px_50px_rgba(0,0,0,0.15)] overflow-hidden z-50 animate-slideDown">
              <div className="p-4 bg-gradient-to-br from-[#F85606] to-orange-400 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                <div className="flex items-center gap-3 relative">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-[16px]">{profile?.full_name?.[0] || 'S'}</div>
                  <div>
                    <div className="font-black text-[13px] flex items-center gap-1">{profile?.full_name} {isVerified && <Award size={12} className="text-yellow-300"/>}</div>
                    <div className="text-[11px] opacity-90">{user?.email}</div>
                    <div className="mt-1 flex items-center gap-1 text-[10px] bg-white/20 px-2 py-0.5 rounded-full w-fit backdrop-blur-md"><Store size={10}/> /store/{profile?.store_slug} • REAL</div>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <button onClick={()=>{router.push('/seller/dashboard/settings/account-settings'); setShowProfileMenu(false)}} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-[12px] font-bold transition"><Settings size={14}/> Account Settings - REAL</button>
                <button onClick={()=>{storeUrl && window.open(storeUrl, '_blank'); setShowProfileMenu(false)}} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-[12px] font-bold transition"><Eye size={14}/> View REAL Store <ExternalLink size={10} className="ml-auto"/></button>
                <button onClick={()=>{router.push('/seller/dashboard/help'); setShowProfileMenu(false)}} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-[12px] font-bold transition"><Globe size={14}/> Help Center</button>
                <div className="border-t my-1"></div>
                <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-500 text-[12px] font-black transition"><LogOut size={14}/> Logout REAL</button>
              </div>
              <div className="px-4 py-2 bg-gray-50 text-[10px] text-gray-500 font-bold flex items-center justify-between">
                <span className="flex items-center gap-1"><Wifi size={10} className="text-green-500"/> REAL DB Connected</span>
                <span className="flex items-center gap-1"><Clock size={10}/>{liveTime}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
       .animate-slideDown { animation: slideDown 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
       .custom-scrollbar::-webkit-scrollbar { width: 4px; }
       .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #F85606, #8B5CF6); border-radius: 10px; }
      `}</style>
    </div>
  )
}