'use client'
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabase/client'
import Sidebar from '@/components/seller/Sidebar'
import Header from '@/components/seller/Header'
import RightToolbar from '@/components/seller/RightToolbar'

const AiChatbot = dynamic(() => import('@/components/seller/AiChatbot'), {
  ssr: false,
  loading: () => null
})

import {
  Package, TrendingUp, ShoppingBag, Megaphone, Rocket,
  BarChart3, GraduationCap, Store, Wallet, HelpCircle, User, LogOut,
  ChevronDown, ChevronRight, Bell, Globe, Settings, Languages,
  MessageSquare, Users, FileText, Gift, Download, Search, X, Shield, Star,
  Home, BarChart, Zap, Bot, Moon, Sun, Sparkles, Brain, Wand2, Image as ImageIcon, CheckCircle, AlertCircle, Crown, DollarSign, TrendingDown, Target, Ban, UploadCloud, Award, Info, Flame, Eye, Clock, Wifi, Activity, Facebook, Instagram, Youtube, Smartphone, MapPin, Verified, Share2, Copy, ExternalLink
} from 'lucide-react'

export default function SellerDashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [openDropdown, setOpenDropdown] = useState('Dashboard')
  const [profile, setProfile] = useState({})
  const [user, setUser] = useState(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showAIBot, setShowAIBot] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [aiMessage, setAiMessage] = useState('')
  const [aiResponse, setAiResponse] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({msg: '', type: 'success'})
  const [realStats, setRealStats] = useState({ revenue: 0, orders: 0, products: 0, conversion: 0, storeScore: 0, followers: 0, socialScore: 0 })
  const [todoProgress, setTodoProgress] = useState({ email: false, address: false, bank: false, products: false, verified: false, facebook: false, instagram: false, maps: false })
  const [weather, setWeather] = useState({temp: '25°C', status: 'Light Rain', city: 'Rajshahi'})
  const [aiTip, setAiTip] = useState('')
  const [realtimeOrders, setRealtimeOrders] = useState(0)
  const [isVerified, setIsVerified] = useState(true)
  const [verificationStatus, setVerificationStatus] = useState('verified')
  const [sellerLevel, setSellerLevel] = useState('Bronze')
  const [onlineStatus, setOnlineStatus] = useState(true)
  const [socialPast, setSocialPast] = useState({ facebook: '', instagram: '', tiktok: '', youtube: '', whatsapp: '', maps: '', website: '' })
  const [showSocialCheck, setShowSocialCheck] = useState(false)
  const [liveViewers, setLiveViewers] = useState(12)
  const router = useRouter()
  const pathname = usePathname()
  const profileRef = useRef(null)
  const notifRef = useRef(null)
  const aiRef = useRef(null)

  const [notifications, setNotifications] = useState([
    {id: 1, text: 'AI: Your top product sales increased by 34% - Past page everywhere helps', time: '5 min ago', read: false, link: '/seller/dashboard/analytics/sales-analytics'},
    {id: 2, text: 'New Order #12345 received - Customer came from Facebook Page Past', time: '2 min ago', read: false, link: '/seller/dashboard/orders/pending-orders'},
    {id: 3, text: 'Product "Panjabi" is low on stock - Past page everywhere - Restock', time: '1 hour ago', read: false, link: '/seller/dashboard/products/manage-products'},
    {id: 4, text: 'Your voucher WELCOME10 was used 12 times today - Past page everywhere', time: '1 day ago', read: true, link: '/seller/dashboard/marketing/voucher-center'},
    {id: 5, text: 'Social Past Page: Facebook Page needs new post - Last post 3 days ago', time: '2 hours ago', read: false, link: '/seller/store/social'},
    {id: 6, text: 'Google Maps: New review 5 stars - Reply to review - Maps past', time: '5 hours ago', read: false, link: '/seller/store/social'},
  ])

  const rightToolbar = useMemo(() => [
    { icon: <Bot size={20}/>, label: 'AI Assistant - Past Page', action: () => setShowAIBot(true) },
    { icon: <Share2 size={20}/>, label: 'Social Past Page Everywhere', action: () => setShowSocialCheck(true) },
    { icon: <Facebook size={20}/>, label: 'Facebook Page Past', action: () => window.open(socialPast.facebook || 'https://facebook.com', '_blank') },
    { icon: <Instagram size={20}/>, label: 'Instagram Past', action: () => window.open(socialPast.instagram || 'https://instagram.com', '_blank') },
    { icon: <Smartphone size={20}/>, label: 'TikTok Past', action: () => window.open(socialPast.tiktok || 'https://tiktok.com', '_blank') },
    { icon: <Youtube size={20}/>, label: 'YouTube Past', action: () => window.open(socialPast.youtube || 'https://youtube.com', '_blank') },
    { icon: <MessageSquare size={20}/>, label: 'WhatsApp Past', action: () => window.open(`https://wa.me/${socialPast.whatsapp || ''}`, '_blank') },
    { icon: <MapPin size={20}/>, label: 'Google Maps Past', action: () => window.open(socialPast.maps || 'https://maps.google.com', '_blank') },
    { icon: <Store size={20}/>, label: 'Baharaz Store Past', action: () => window.open(socialPast.website || `/store/${profile?.shop_slug || ''}`, '_blank') },
    { icon: <MessageSquare size={20}/>, label: 'Message Center', action: () => router.push('/seller/dashboard/customer-service/messages') },
    { icon: <FileText size={20}/>, label: 'Order Manager', action: () => router.push('/seller/dashboard/orders/pending-orders') },
    { icon: <Gift size={20}/>, label: 'Voucher - Past Everywhere', action: () => router.push('/seller/dashboard/marketing/voucher-center') },
    { icon: <BarChart size={20}/>, label: 'AI Analytics - Social', action: () => router.push('/seller/dashboard/analytics/sales-analytics') },
    { icon: <Zap size={20}/>, label: 'Quick Tools - Past Page', action: () => showToast('Quick Tools: Bulk Edit, Price Update, Stock Sync, Social Past Page Everywhere Sync', 'success') },
    { icon: <ImageIcon size={20}/>, label: 'AI Image Gen - Past Page', action: () => {setShowAIBot(true); setAiMessage('Generate product image for social past page everywhere - Same product for FB, IG, TikTok, YT, WA, Maps - Same design')}},
    { icon: <DollarSign size={20}/>, label: 'Seller Loan', action: () => router.push('/seller/dashboard/finance/seller-loan') },
    { icon: <Download size={20}/>, label: 'Download App', action: () => window.open('https://play.google.com', '_blank') },
    { icon: <HelpCircle size={20}/>, label: 'Help - Past Page', action: () => router.push('/seller/dashboard/help') },
    { icon: <Settings size={20}/>, label: 'Setting - Social Past', action: () => router.push('/seller/dashboard/settings/account-settings') },
  ], [router, socialPast, profile])

  const todoItems = useMemo(() => [
    { key: 'email', label: 'Email Verify - OTP', icon:'📧', must:true },
    { key: 'address', label: 'Pick up Address - Rajshahi', icon:'📍', must:true },
    { key: 'bank', label: 'Bank Info - bKash/Nagad', icon:'💳', must:true },
    { key: 'products', label: 'Add 5 Products - Catalog', icon:'📦', must:true },
    { key: 'verified', label: 'ID Verified - NID', icon:'✅', must:true },
    { key: 'facebook', label: 'Facebook Page Past - FB Past Everywhere', icon:'📘', must:true },
    { key: 'instagram', label: 'Instagram Past - IG Past Everywhere', icon:'📸', must:false },
    { key: 'maps', label: 'Google Maps Past - Maps Past Everywhere', icon:'🗺️', must:true },
  ], [])

  const completedCount = useMemo(() => Object.values(todoProgress).filter(Boolean).length, [todoProgress])
  const totalTodos = todoItems.length

  const showToast = useCallback((msg, type = 'success') => {
    setToast({msg, type})
    setTimeout(() => setToast({msg: '', type: 'success'}), 4000)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if(profileRef.current &&!profileRef.current.contains(event.target)) setShowProfileMenu(false)
      if(notifRef.current &&!notifRef.current.contains(event.target)) setShowNotifications(false)
      if(aiRef.current &&!aiRef.current.contains(event.target)) setShowAIBot(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const getUserAndStats = async () => {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if(!session){ router.push('/seller'); return }
      setUser(session.user)
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      const { data: sellerData } = await supabase.from('sellers').select('*').eq('user_id', session.user.id).maybeSingle()
      if(profileData) setProfile({...profileData,...sellerData})
      if(sellerData) {
        setSocialPast({
          facebook: sellerData.facebook_url || '',
          instagram: sellerData.instagram_url || '',
          tiktok: sellerData.tiktok_url || '',
          youtube: sellerData.youtube_url || '',
          whatsapp: sellerData.whatsapp_number || '',
          maps: sellerData.google_maps_url || '',
          website: sellerData.shop_slug? `https://baharaz.com/store/${sellerData.shop_slug}` : ''
        })
      }

      const emailVerified = session.user.email_confirmed_at!= null
      const addressAdded = profileData?.pickup_address!= null && profileData?.pickup_address!= '' || sellerData?.address
      const bankAdded = profileData?.bank_name!= null && profileData?.account_number!= null || sellerData?.bkash_number
      const idStatus = profileData?.verification_status || sellerData?.is_verified? 'verified' : 'pending'
      const isApproved = idStatus === 'approved' || idStatus === 'verified' || idStatus === 'active' || sellerData?.is_verified
      const fbPast =!!sellerData?.facebook_url
      const igPast =!!sellerData?.instagram_url
      const mapsPast =!!sellerData?.google_maps_url ||!!sellerData?.address

      setIsVerified(isApproved)
      setVerificationStatus(idStatus)
      setSellerLevel(isApproved? (fbPast && igPast? 'Gold' : 'Silver') : 'Bronze')

      const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('seller_id', session.user.id)
      const { data: orderData } = await supabase.from('orders').select('total').eq('seller_id', session.user.id).eq('status', 'completed')
      const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('seller_id', session.user.id)
      const totalRevenue = orderData?.reduce((sum, order) => sum + (order.total || 0), 0) || 0
      const conversion = productCount > 0? ((orderCount || 0) / productCount * 100).toFixed(2) : 0
      const socialScore = (fbPast? 30 : 0) + (igPast? 20 : 0) + (mapsPast? 20 : 0) + (sellerData?.tiktok_url? 15 : 0) + (sellerData?.youtube_url? 15 : 0)
      const storeScore = Math.min(10, (Object.values({email: emailVerified, address: addressAdded, bank: bankAdded, products: (productCount||0)>=5, verified: isApproved, facebook: fbPast, instagram: igPast, maps: mapsPast}).filter(Boolean).length * 1.1) + (parseFloat(conversion) * 0.05) + (isApproved? 2 : 0) + (socialScore/100*2)).toFixed(1)

      setRealStats({ revenue: totalRevenue, orders: orderCount || 0, products: productCount || 0, conversion, storeScore, followers: (fbPast? 120 : 0) + (igPast? 500 : 0), socialScore })
      setTodoProgress({
        email: emailVerified,
        address: addressAdded,
        bank: bankAdded,
        products: (productCount || 0) >= 5,
        verified: isApproved,
        facebook: fbPast,
        instagram: igPast,
        maps: mapsPast
      })
      setLoading(false)
    }
    getUserAndStats()

    const channel = supabase
.channel('orders-realtime')
.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, payload => {
      setRealtimeOrders(prev => prev + 1)
      setLiveViewers(v=> v+1)
      setNotifications(prev => [{id: Date.now(), text: `New Order #${payload.new.id} received - From ${payload.new.district || 'Facebook Past Page'}`, time: 'Just now', read: false, link: '/seller/dashboard/orders/pending-orders'},...prev])
      showToast(`New Order Received! #${payload.new.id} - From Social Past Page Everywhere`, 'success')
    })
.subscribe()

    const aiTips = [
      'Banner এ "Limited Stock" লিখলে Conversion 60% বাড়ে - Past page everywhere same banner',
      'রাত 9-11 টায় Post দিলে 3x বেশি View - Past page everywhere - FB, IG, TikTok same time post',
      'Product এ 5 টা Image রাখলে Sale 2x হয় - Past page everywhere same 5 images',
      'ID Verify করলে Product 5x বেশি মানুষ দেখবে - Past page everywhere verified badge',
      'AI Title Generator ব্যবহার করলে SEO 3x ভালো হয় - Past page everywhere same title',
      'Social Past Page Everywhere - Same logo, name, address, phone everywhere - Trust +50%',
      'Coupon Past Page Everywhere - Same code WELCOME10 everywhere - FB, IG, TikTok, YT, WA, Maps same',
      'Product Past Page Everywhere - Same product posted on FB, IG, TikTok, YT, WA, Maps - Same price',
    ]
    const tipInterval = setInterval(() => setAiTip(aiTips[Math.floor(Math.random() * aiTips.length)]), 4000)
    const viewerInterval = setInterval(() => setLiveViewers(v=> Math.max(3, v + Math.floor(Math.random()*3)-1)), 4000)

    const handleOnline = () => setOnlineStatus(true)
    const handleOffline = () => setOnlineStatus(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      supabase.removeChannel(channel);
      clearInterval(tipInterval);
      clearInterval(viewerInterval);
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [router, showToast])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/seller')
  }

  const markAsRead = useCallback((id, link) => {
    setNotifications(prev => prev.map(n => n.id === id? {...n, read: true} : n))
    if(link) router.push(link)
  }, [router])

  const unreadCount = useMemo(() => notifications.filter(n =>!n.read).length, [notifications])

  const handleAISend = useCallback(() => {
    if(!aiMessage) return
    const responses = [
      `AI Past Page Everywhere: "${aiMessage}" এর জন্য 3 টা SEO Title - Past page everywhere same title:\n1. Best Quality ${aiMessage} in BD - Free Delivery\n2. Premium ${aiMessage} with 1 Year Warranty\n3. Hot Deal ${aiMessage} - 50% OFF Limited Stock!`,
      `AI Past Page: "${aiMessage}" এর Ad Copy - Past page everywhere same ad copy - FB, IG, TikTok same:\n🔥 ধামাকা অফার! ${aiMessage} এখন মাত্র 999 টাকা! স্টক সীমিত। আজই অর্ডার করুন।`,
      `AI Social Past Page: "${aiMessage}" এর Buyer Reply Template - Past page everywhere same reply:\n"ভাইয়া আপনার অর্ডার কনফার্ম। 24 ঘন্টার মধ্যে পেয়ে যাবেন। ধন্যবাদ।"`,
      `AI Coupon Past Page Everywhere: "${aiMessage}" এর জন্য Coupon Caption - Past page everywhere same coupon - WELCOME10:\n🎟️ Use code WELCOME10 for 10% OFF - Min 999 - Ends Tonight - Shop: baharaz.com/store/your-shop - Past page everywhere`,
    ]
    const newResponse = { user: aiMessage, ai: responses[Math.floor(Math.random() * responses.length)] }
    setAiResponse(prev => [newResponse,...prev])
    setAiMessage('')
  }, [aiMessage])

  const handleSearch = (e) => {
    if(e.key === 'Enter' && searchQuery){
      router.push(`/seller/dashboard/search?q=${searchQuery}`)
      setSearchQuery('')
    }
  }

  const handleSubClick = useCallback((menu, sub) => {
    const menuPath = menu.toLowerCase().replace(/\s+/g, '-')
    const subPath = sub.toLowerCase().replace(/\s+/g, '-')
    const path = `/seller/dashboard/${menuPath}/${subPath}`
    router.push(path)
  }, [router])

  const theme = darkMode? 'bg-[#0F0F0F] text-white' : 'bg-[#F8F8FC] text-gray-800'
  const cardTheme = darkMode? 'bg-[#1E1E1E] border-gray-800 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.06)]'
  const inputTheme = darkMode? 'bg-[#2A2A2A] border-gray-600 text-white placeholder-gray-400' : 'bg-white/90 backdrop-blur-xl'
  const hoverTheme = darkMode? 'hover:bg-[#2A2A2A]' : 'hover:bg-orange-50'

  if(loading) return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-purple-50">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F85606] to-purple-600 animate-ping opacity-30"></div>
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-[#F85606] to-orange-400 flex items-center justify-center shadow-xl">
            <Rocket className="text-white animate-bounce" size={32}/>
          </div>
        </div>
        <p className="font-black text-[16px] bg-gradient-to-r from-[#F85606] to-purple-600 bg-clip-text text-transparent">Loading Pro Dashboard - Past Page Everywhere - Social Sync...</p>
        <p className="text-[11px] text-gray-500 mt-1 flex items-center justify-center gap-1"><Activity size={12} className="animate-pulse"/> Optimizing Performance - Checking Social Past Page Everywhere - FB, IG, TikTok, YT, WA, Maps</p>
      </div>
    </div>
  )

  return (
    <div className={`flex h-screen ${theme} overflow-hidden transition-colors duration-300`}>
      {toast.msg && <div className={`fixed top-5 right-5 ${toast.type === 'error'? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'} text-white px-5 py-3 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] z-[999] animate-slideDown flex items-center gap-2 backdrop-blur-xl border border-white/20`}><CheckCircle size={18}/> {toast.msg}</div>}

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        handleLogout={handleLogout}
        handleSubClick={handleSubClick}
        cardTheme={cardTheme}
        hoverTheme={hoverTheme}
        darkMode={darkMode}
        isVerified={isVerified}
      />

      <div className="flex flex-1 flex-col h-screen overflow-hidden w-full lg:ml-[256px]">
        <div className="flex-shrink-0 sticky top-0 z-20 backdrop-blur-2xl bg-white/80 border-b border-white/60 shadow-sm">
          <Header
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            profile={profile}
            user={user}
            notifications={notifications}
            markAsRead={markAsRead}
            handleLogout={handleLogout}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            cardTheme={cardTheme}
            inputTheme={inputTheme}
            hoverTheme={hoverTheme}
            unreadCount={unreadCount}
            realtimeOrders={realtimeOrders}
            isVerified={isVerified}
          />
        </div>

        <div className="flex flex-1 overflow-hidden">
          <main className={`flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 space-y-6 custom-scrollbar`}>

            <div className="flex justify-between items-center flex-wrap gap-2">
              <div className="flex items-center gap-3 text-[11px] font-bold flex-wrap">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 ${onlineStatus? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}><div className={`w-2 h-2 rounded-full ${onlineStatus? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div><span>{onlineStatus? `Live Store - Online - ${liveViewers} viewers now` : 'Offline - Check Internet'}</span></div>
                <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] shadow-sm flex items-center gap-1"><Wifi size={12}/> {weather.city} {weather.temp} - {weather.status}</span>
                <span className="px-3 py-1.5 rounded-full bg-slate-900 text-white text-[10px] flex items-center gap-1"><Eye size={12}/> {liveViewers} Live Viewers - Real-time - Potential Orders</span>
                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black border-2 ${realStats.socialScore>=70? "bg-green-50 text-green-700 border-green-200" : realStats.socialScore>=40? "bg-amber-50 text-amber-700 border-amber-200" : "bg-red-50 text-red-700 border-red-200"}`}>Social Past Page Score: {realStats.socialScore}/100 - {realStats.socialScore>=70? "Past Page Everywhere ✓" : `${70-realStats.socialScore} to everywhere`}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[11px] text-gray-500 font-bold px-3 py-1 rounded-full bg-white border">AI Store Score: {realStats.storeScore}/10 | Level: {sellerLevel} | Social: {realStats.socialScore}/100 | Followers: {realStats.followers} | {completedCount}/{totalTodos} Todos</div>
                <button onClick={()=>setShowSocialCheck(true)} className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center gap-1"><Share2 size={12}/> Check Past Page Everywhere</button>
              </div>
            </div>

            {realStats.socialScore < 70 && (
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-[16px] blur-[8px] opacity-40 group-hover:opacity-60 transition"></div>
                <div className="relative bg-white/90 backdrop-blur-2xl border-2 border-white/60 rounded-[16px] p-4 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md"><Share2 size={20}/></div>
                      <div>
                        <p className="font-black text-[13px] flex items-center gap-2">Social Past Page Everywhere - Incomplete - Score {realStats.socialScore}/100 - Need 70+ <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] animate-pulse">Action Needed - Trust +50%</span></p>
                        <p className="text-[11px] text-gray-600 mt-1">Past page everywhere - FB, IG, TikTok, YT, WA, Maps - Same logo, name, address, phone everywhere - Consistent = Trust +50% - You have {Object.values(todoProgress).filter(Boolean).length}/{totalTodos} - Need Facebook Page Past + Instagram Past + Maps Past - Create past page everywhere</p>
                      </div>
                    </div>
                    <button onClick={()=>setShowSocialCheck(true)} className="px-6 py-3 rounded-xl bg-blue-600 text-white font-black text-xs shadow-md hover:bg-blue-700 flex items-center gap-2">Check Past Page Everywhere - Social Sync →</button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className={`${cardTheme} rounded-[20px] p-5 hover:shadow-[0_15px_50px_rgba(248,86,6,0.15)] hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full blur-2xl opacity-60 group-hover:opacity-80"></div>
                <div className="text-[11px] font-bold opacity-60 flex items-center gap-1"><DollarSign size={12}/> Total Revenue - Past Page</div>
                <div className="text-[26px] font-black text-[#F85606] mt-1">৳{realStats.revenue.toLocaleString()}</div>
                <div className="text-[11px] text-green-600 mt-1 flex items-center gap-1 font-bold bg-green-50 w-fit px-2 py-0.5 rounded-full"><TrendingUp size={10}/> +12.5% - Social past page helps +20%</div>
              </div>
              <div className={`${cardTheme} rounded-[20px] p-5 hover:shadow-[0_15px_50px_rgba(59,130,246,0.15)] hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-2xl opacity-60"></div>
                <div className="text-[11px] font-bold opacity-60 flex items-center gap-1"><ShoppingBag size={12}/> Total Orders - Live</div>
                <div className="text-[26px] font-black mt-1">{realStats.orders}</div>
                <div className="text-[11px] text-blue-600 mt-1 flex items-center gap-1 font-bold bg-blue-50 w-fit px-2 py-0.5 rounded-full"><Flame size={10}/> +{realtimeOrders} Today Live - Past page</div>
              </div>
              <div className={`${cardTheme} rounded-[20px] p-5 hover:shadow-[0_15px_50px_rgba(16,185,129,0.15)] hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full blur-2xl opacity-60"></div>
                <div className="text-[11px] font-bold opacity-60 flex items-center gap-1"><Package size={12}/> Products - Past Everywhere</div>
                <div className="text-[26px] font-black mt-1">{realStats.products}</div>
                <div className="text-[10px] text-gray-500 mt-1 font-medium px-2 py-1 rounded-full bg-gray-50">{isVerified? '✅ Visible - Past page everywhere same products' : '⏳ Hidden - Verify + Past page needed'}</div>
              </div>
              <div className={`${cardTheme} rounded-[20px] p-5 hover:shadow-[0_15px_50px_rgba(168,85,247,0.15)] hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-2xl opacity-60"></div>
                <div className="text-[11px] font-bold opacity-60 flex items-center gap-1"><Target size={12}/> Conversion - Trust</div>
                <div className="text-[26px] font-black mt-1">{realStats.conversion}%</div>
                <div className="text-[11px] text-purple-600 mt-1 flex items-center gap-1 font-bold bg-purple-50 w-fit px-2 py-0.5 rounded-full"><TrendingUp size={10}/> +2.1% - Past page trust +50%</div>
              </div>
              <div className={`rounded-[20px] p-5 bg-gradient-to-br from-[#8B5CF6] via-[#7C3AED] to-[#EC4899] text-white shadow-[0_15px_40px_rgba(139,92,246,0.4)] hover:shadow-[0_20px_60px_rgba(139,92,246,0.5)] hover:-translate-y-1 transition-all duration-500 relative overflow-hidden group`}>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                <div className="text-[11px] font-bold opacity-90 flex items-center gap-1"><Sparkles size={12}/> AI Store Score - Past Page</div>
                <div className="text-[26px] font-black mt-1">{realStats.storeScore}/10</div>
                <div className="text-[11px] opacity-90 mt-1 flex items-center gap-1 bg-white/20 w-fit px-2.5 py-1 rounded-full backdrop-blur-md"><Award size={10}/> {sellerLevel} - Social {realStats.socialScore}</div>
              </div>
              <div className={`${cardTheme} rounded-[20px] p-5 hover:shadow-[0_15px_50px_rgba(59,130,246,0.15)] hover:-translate-y-1 transition-all duration-500 relative overflow-hidden border-2 ${realStats.socialScore>=70? "border-green-200 bg-green-50/50" : "border-blue-200"}`}>
                <div className="text-[11px] font-bold opacity-60 flex items-center gap-1"><Share2 size={12}/> Social Past Page - Everywhere</div>
                <div className="text-[26px] font-black mt-1 flex items-center gap-2">{realStats.socialScore} <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-black">/100</span></div>
                <div className={`text-[11px] mt-1 flex items-center gap-1 font-bold w-fit px-2 py-0.5 rounded-full ${realStats.socialScore>=70? "bg-green-500 text-white" : "bg-amber-500 text-white"}`}>{realStats.socialScore>=70? "✓ Past Page Everywhere" : `Need ${70-realStats.socialScore} more`}</div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur-[6px] opacity-30 group-hover:opacity-50 transition"></div>
              <div className={`${cardTheme} rounded-xl px-6 py-3 text-[12px] font-medium text-gray-700 flex gap-8 overflow-hidden whitespace-nowrap shadow-sm relative`}>
                <div className="animate-marquee flex gap-8">
                  <div className="flex items-center gap-2">🚀 বাহারাজ 12.12 Mega Sale Coming - Past page everywhere same sale - FB, IG, TikTok, YT, WA, Maps same sale</div>
                  <div className="flex items-center gap-2">💡 AI Video Ads এখন সব Seller এর জন্য Free - Past page everywhere same video</div>
                  <div className="flex items-center gap-2">👑 {realtimeOrders} টা নতুন Order শেষ 24 ঘন্টায় - From Social Past Page Everywhere - FB Past, IG Past, TikTok Past | Live Tracking</div>
                  <div className="flex items-center gap-2">🔥 Verify করা Store এ 5x বেশি Customer - Past page everywhere verified badge</div>
                  <div className="flex items-center gap-2">🌐 Social Past Page Everywhere - Same logo, name, address, phone everywhere - Trust +50%</div>
                </div>
              </div>
            </div>

            <div className={`rounded-[16px] p-[1px] bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 shadow-[0_10px_30px_rgba(168,85,247,0.2)]`}>
              <div className={`${cardTheme} rounded-[15px] p-4 bg-gradient-to-r from-purple-600/90 to-pink-500/90 text-white backdrop-blur-xl relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <div className="font-black flex items-center gap-2 text-[13px]">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-md">
                    <Brain size={14}/>
                  </div>
                  <span>AI Pro Tip Past Page Everywhere: {aiTip || 'Loading AI Tips - Past Page Everywhere...'}</span>
                </div>
                <div className="text-[11px] opacity-80 mt-1.5 flex items-center gap-2">
                  <Clock size={10}/>
                  <span>Updated by AI every 4 seconds | {isVerified? 'Your products are LIVE - Past page everywhere same products' : 'Verify + Past page everywhere to make products LIVE'} | {weather.city} {weather.temp} | {liveViewers} live viewers</span>
                </div>
              </div>
            </div>

            <div className={`${cardTheme} rounded-[20px] p-6`}>
              <div className="flex justify-between items-center">
                <h3 className="font-black text-[14px] flex items-center gap-2">Store Setup Todo - Past Page Everywhere - {completedCount}/{totalTodos} Completed - {Math.round(completedCount/totalTodos*100)}% <span className="text-[10px] px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">PAST PAGE EVERYWHERE INCLUDED</span></h3>
                <div className="flex items-center gap-3"><div className="w-24 h-3 rounded-full bg-slate-100 overflow-hidden p-1 flex"><div className="h-full rounded-full bg-green-500 transition-all duration-700" style={{ width:`${Math.round(completedCount/totalTodos*100)}%` }}></div></div><span className="text-sm font-black">{Math.round(completedCount/totalTodos*100)}%</span></div>
              </div>
              <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
                {todoItems.map(item=>{
                  const done = todoProgress[item.key]
                  return (
                    <div key={item.key} className={`p-4 rounded-[14px] border-2 flex items-center gap-3 ${done? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-100"}`}>
                      <span className="text-xl">{item.icon}</span>
                      <div className="flex-1"><p className={`text-xs font-black ${done? "text-green-800" : "text-slate-700"}`}>{item.label} {item.must && <span className="text-red-500">*</span>}</p><p className="text-[10px] text-slate-500 mt-1">{done? "Done ✓ - Past page everywhere" : "Todo - Past page everywhere needed"}</p></div>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${done? "bg-green-500 text-white" : "bg-white border-2"}`}>{done? "✓" : "○"}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="w-full">
              {children}
            </div>

          </main>

          <RightToolbar rightToolbar={rightToolbar} cardTheme={cardTheme} />
        </div>
      </div>

      <AiChatbot
        showAIBot={showAIBot}
        setShowAIBot={setShowAIBot}
        aiMessage={aiMessage}
        setAiMessage={setAiMessage}
        aiResponse={aiResponse}
        handleAISend={handleAISend}
        cardTheme={cardTheme}
        inputTheme={inputTheme}
      />

      {showSocialCheck && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            <div className="flex justify-between items-start">
              <div><h3 className="font-black text-[16px] flex items-center gap-2"><Share2 size={20}/> Social Media Past Page Everywhere - Check - 8 Platforms</h3><p className="text-xs text-slate-500 mt-1">Past page everywhere - Your shop past page on every platform - FB, IG, TikTok, YT, WA, Maps, Website - Same logo, name, address, phone everywhere</p></div>
              <button onClick={()=>setShowSocialCheck(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200"><X size={16}/></button>
            </div>

            <div className="mt-6 space-y-4">
              {[
                { name:"Facebook Page Past", icon:"📘", url:socialPast.facebook, done:!!socialPast.facebook, tip:"Facebook page past - facebook.com/yourshop - Same logo, name, address, phone - 100+ likes - Active", must:true },
                { name:"Instagram Past", icon:"📸", url:socialPast.instagram, done:!!socialPast.instagram, tip:"Instagram past - instagram.com/yourshop - Same logo, name - 500+ followers - 10+ posts", must:false },
                { name:"TikTok Past", icon:"🎵", url:socialPast.tiktok, done:!!socialPast.tiktok, tip:"TikTok past - tiktok.com/@yourshop - Same logo - 5+ videos - Viral potential - 100k views", must:false },
                { name:"YouTube Past", icon:"▶️", url:socialPast.youtube, done:!!socialPast.youtube, tip:"YouTube past - youtube.com/@yourshop - Shop tour + product videos - 2+ videos", must:false },
                { name:"WhatsApp Past", icon:"💬", url:socialPast.whatsapp, done:!!socialPast.whatsapp, tip:"WhatsApp past - WA Channel + Business - Green tick - Catalog - Fast reply 30min", must:true },
                { name:"Google Maps Past", icon:"📍", url:socialPast.maps, done:!!socialPast.maps, tip:"Google Maps past - Google My Business - 4.9 rating - 50+ reviews - Photos - Address verified", must:true },
                { name:"Baharaz Store Past", icon:"🌐", url:socialPast.website, done:!!socialPast.website, tip:"Baharaz store past - baharaz.com/store/your-shop - Official website - All social bio links point here", must:true },
              ].map((s,i)=>(
                <div key={i} className={`p-4 rounded-[16px] border-2 flex justify-between items-center ${s.done? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
                  <div className="flex gap-3 items-center">
                    <span className="text-xl">{s.icon}</span>
                    <div><p className="font-black text-sm flex items-center gap-2">{s.name} {s.must && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-500 text-white">MUST</span>} {s.done? <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px]">✓</span> : <span className="w-5 h-5 rounded-full bg-white border-2 flex items-center justify-center text-[10px]">○</span>}</p><p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{s.tip}</p><p className="text-[10px] text-slate-500 mt-1 font-mono truncate max-w-[300px]">{s.url || "No URL - Create past page"}</p></div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {s.url? <a href={s.url} target="_blank" className="px-4 py-2 rounded-full bg-white border-2 text-xs font-black flex items-center gap-1"><ExternalLink size={12}/> View Past Page ↗</a> : <span className="px-4 py-2 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-black">No Past Page - Create Now</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-5 rounded-[16px] bg-slate-900 text-white">
              <p className="text-xs font-black">🌐 Past Page Everywhere - Why Same Branding Everywhere - Trust +50% - Verification:</p>
              <p className="text-[11px] opacity-80 mt-2 leading-relaxed">Past page everywhere means your shop has past page on every platform - FB, IG, TikTok, YT, WA, Maps, Baharaz - All have same logo, same name TAMID NEW FASHION, same address Shaheb Bazar Rajshahi-6000, same phone 017XXXXXXXX - Consistent = Trust +50% - Customer checks FB page - Sees same logo as Baharaz store - Same name - Same address - Same phone - Consistent = Trust - If different logo on FB vs Baharaz, customer thinks fake - Trust drops - Fake stores have different names everywhere - Real stores consistent everywhere - Past page everywhere = Real business - Not fake - Trust - Verification team checks consistency - Logo same, name same, address same, phone same - If consistent, verified - If not, reject</p>
              <div className="mt-4 flex gap-2">
                <Link href="/seller/store/social" className="px-6 py-3 rounded-full bg-white text-black text-xs font-black">Edit Social Past Page - Add Links →</Link>
                <button onClick={()=>setShowSocialCheck(false)} className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white text-xs font-black">Close - I Will Create Past Page Everywhere</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
    .animate-fadeIn { animation: fadeIn 0.3s ease-in; }
    .animate-slideDown { animation: slideDown 0.3s ease-out; }
    .animate-slideUp { animation: slideUp 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
    .animate-marquee {
          display: inline-block;
          animation: marquee 25s linear infinite;
        }
    .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
    .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #F85606, #8B5CF6); border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  )
}