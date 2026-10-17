'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  Home, Package, ShoppingBag, TrendingUp, Megaphone, BarChart3,
  GraduationCap, Store, Wallet, HelpCircle, ChevronDown, ChevronRight, LogOut,
  Settings, Layers, Star, Users, FileText, Gift, Percent, BellRing, Truck,
  Crown, Sparkles, Shield, Award, Zap, Bot, Image as ImageIcon, MessageSquare,
  CloudRain, Sun, TrendingUp as TrendingUpIcon, AlertTriangle, Target, Rocket,
  Briefcase, Globe, Phone, Mail, Headphones, Box, DollarSign, BarChart, Wrench, Lock, Ban, Flame, Eye, CheckCircle, UploadCloud,
  Search, Filter, Activity, Verified, Wifi, Clock, Layers as LayersIcon, Plus
} from 'lucide-react'

// ✅ FULL MENU - Baharaz PRO MAX + 8 NEW FEATURE - FIXED ROUTES - ROCKET LIGHT
export const menuItems = [
  {
    name: 'Dashboard',
    icon: <Home size={20}/>,
    path: '/seller/dashboard',
    sub: [],
    badge: 'AI'
  },
  {
    name: 'Products',
    icon: <Package size={20}/>,
    path: '',
    sub: [
      {name: 'Add Product', badge: 'AI', realPath: '/seller/products/add'},
      {name: 'Manage Products', realPath: '/seller/products'},
      {name: 'Categories', realPath: '/seller/products/category-management'},
      {name: 'Brands', realPath: '/seller/products/brands'},
      {name: 'Product Review', badge: 'New', realPath: '/seller/products/reviews'},
      {name: 'Bulk Upload', realPath: '/seller/products/ai-bulk-upload'},
      {name: 'Stock Alert', realPath: '/seller/products/stock-alert'},
      {name: 'AI Image Edit', badge: 'AI', realPath: '/seller/products/ai-image-edit'}
    ]
  },
  {
    name: 'Orders',
    icon: <ShoppingBag size={20}/>,
    path: '',
    sub: [
      {name: 'Pending Orders', badge: 5, realPath: '/seller/dashboard/orders/pending-orders'},
      {name: 'Processing', badge: 12, realPath: '/seller/dashboard/orders/processing'},
      {name: 'Ready to Ship', badge: 8, realPath: '/seller/dashboard/orders/ready-to-ship'},
      {name: 'Completed', realPath: '/seller/dashboard/orders/completed'},
      {name: 'Cancelled', realPath: '/seller/dashboard/orders/cancelled'},
      {name: 'Returns', badge: 'Hot', realPath: '/seller/dashboard/orders/returns'},
      {name: 'Disputes', realPath: '/seller/dashboard/orders/disputes'},
      {name: 'Bulk Print Invoice', realPath: '/seller/dashboard/orders/bulk-invoice'}
    ]
  },
  {
    name: 'Marketing',
    icon: <Megaphone size={20}/>,
    path: '',
    sub: [
      {name: 'Voucher Center', realPath: '/seller/dashboard/marketing/voucher-center'},
      {name: 'Campaign', badge: 'Pro', realPath: '/seller/dashboard/marketing/campaign'},
      {name: 'AI Ad Copy', badge: 'AI', realPath: '/seller/dashboard/marketing/ai-ad-copy'},
      {name: 'Flash Sale', realPath: '/seller/dashboard/marketing/flash-sale'},
      {name: 'Bundle Deal', realPath: '/seller/dashboard/marketing/bundle-deal'},
      {name: 'Affiliate', realPath: '/seller/dashboard/marketing/affiliate'},
      {name: 'Sponsored Ads', realPath: '/seller/dashboard/marketing/sponsored-ads'},
      {name: 'Live Selling', badge: 'New', realPath: '/seller/dashboard/marketing/live-selling'}
    ]
  },
  {
    name: 'AI Assistant',
    icon: <Bot size={20}/>,
    path: '',
    sub: [
      {name: 'AI Title Generator', badge: 'AI', realPath: '/seller/dashboard/ai-assistant/ai-title-generator'},
      {name: 'AI Product Description', badge: 'AI', realPath: '/seller/dashboard/ai-assistant/ai-product-description'},
      {name: 'AI Ad Copy', badge: 'AI', realPath: '/seller/dashboard/ai-assistant/ai-ad-copy'},
      {name: 'AI Reply Buyer', badge: 'AI', realPath: '/seller/dashboard/ai-assistant/ai-reply-buyer'},
      {name: 'AI Chatbot', badge: 'Pro', realPath: '/seller/dashboard/ai-assistant/ai-chatbot'},
      {name: 'AI Image Gen', badge: 'New', realPath: '/seller/dashboard/ai-assistant/ai-image-gen'},
      {name: 'AI Price Suggest', realPath: '/seller/dashboard/ai-assistant/ai-price-suggest'},
      {name: 'AI Competitor Scan', realPath: '/seller/dashboard/ai-assistant/ai-competitor-scan'}
    ],
    tag: 'NEW'
  },
  {
    name: 'Analytics',
    icon: <BarChart3 size={20}/>,
    path: '',
    sub: [
      {name: 'Sales Analytics', realPath: '/seller/dashboard/analytics/sales-analytics'},
      {name: 'Traffic Analytics', realPath: '/seller/dashboard/analytics/traffic-analytics'},
      {name: 'Product Performance', badge: 'AI', realPath: '/seller/dashboard/analytics/product-performance'},
      {name: 'Customer Insights', realPath: '/seller/dashboard/analytics/customer-insights'},
      {name: 'Competitor Analysis', realPath: '/seller/dashboard/analytics/competitor-analysis'},
      {name: 'Profit Report', realPath: '/seller/dashboard/analytics/profit-report'}
    ]
  },
  {
    name: 'Seller University',
    icon: <GraduationCap size={20}/>,
    path: '',
    sub: [
      {name: 'Courses', realPath: '/seller/dashboard/seller-university/courses'},
      {name: 'Tutorials', realPath: '/seller/dashboard/seller-university/tutorials'},
      {name: 'Webinar', badge: 'Live', realPath: '/seller/dashboard/seller-university/webinar'},
      {name: 'Success Stories', realPath: '/seller/dashboard/seller-university/success-stories'},
      {name: 'Seller Academy', realPath: '/seller/dashboard/seller-university/seller-academy'},
      {name: '1-to-1 Mentor', realPath: '/seller/dashboard/seller-university/mentor'}
    ]
  },
  {
    name: 'My Store',
    icon: <Store size={20}/>,
    path: '',
    sub: [
      {name: 'Store Profile', realPath: '/seller/dashboard/my-store/store-profile'},
      {name: 'Store Decoration', badge: 'Pro', realPath: '/seller/dashboard/my-store/store-decoration'},
      {name: 'Store Analytics', realPath: '/seller/dashboard/my-store/store-analytics'},
      {name: 'Follow Campaign', realPath: '/seller/dashboard/my-store/follow-campaign'},
      {name: 'Store SEO', realPath: '/seller/dashboard/my-store/store-seo'},
      {name: 'Store Coupons', realPath: '/seller/dashboard/my-store/store-coupons'}
    ]
  },
  {
    name: 'Finance',
    icon: <Wallet size={20}/>,
    path: '',
    sub: [
      {name: 'Balance', realPath: '/seller/dashboard/finance/balance'},
      {name: 'Withdraw', realPath: '/seller/dashboard/finance/withdraw'},
      {name: 'Transactions', realPath: '/seller/dashboard/finance/transactions'},
      {name: 'Tax Invoice', realPath: '/seller/dashboard/finance/tax-invoice'},
      {name: 'Seller Loan', realPath: '/seller/dashboard/finance/seller-loan'},
      {name: 'Revenue Report', realPath: '/seller/dashboard/finance/revenue-report'},
      {name: 'Expense Tracker', realPath: '/seller/dashboard/finance/expense-tracker'}
    ]
  },
  {
    name: 'Customer Service',
    icon: <MessageSquare size={20}/>,
    path: '',
    sub: [
      {name: 'Messages', badge: 3, realPath: '/seller/dashboard/customer-service/messages'},
      {name: 'Chat', realPath: '/seller/dashboard/customer-service/chat'},
      {name: 'Reviews', realPath: '/seller/dashboard/customer-service/reviews'},
      {name: 'Return Requests', realPath: '/seller/dashboard/customer-service/return-requests'},
      {name: 'FAQ Manager', realPath: '/seller/dashboard/customer-service/faq-manager'},
      {name: 'AI Auto Reply', realPath: '/seller/dashboard/customer-service/ai-auto-reply'}
    ]
  },
  {
    name: 'Logistics',
    icon: <Truck size={20}/>,
    path: '',
    sub: [
      {name: 'Shipping Settings', realPath: '/seller/dashboard/logistics/shipping-settings'},
      {name: 'Pickup Address', realPath: '/seller/dashboard/logistics/pickup-address'},
      {name: 'Waybill Print', realPath: '/seller/dashboard/logistics/waybill-print'},
      {name: 'Courier Partner', realPath: '/seller/dashboard/logistics/courier-partner'},
      {name: 'Track Shipment', realPath: '/seller/dashboard/logistics/track-shipment'}
    ]
  },
  {
    name: 'Settings',
    icon: <Settings size={20}/>,
    path: '',
    sub: [
      {name: 'Account Settings', realPath: '/seller/dashboard/settings/account-settings'},
      {name: 'Notification Settings', realPath: '/seller/dashboard/settings/notification-settings'},
      {name: 'API Keys', realPath: '/seller/dashboard/settings/api-keys'},
      {name: 'Team Members', realPath: '/seller/dashboard/settings/team-members'},
      {name: 'Security', realPath: '/seller/dashboard/settings/security'}
    ]
  },
  { name: 'Help', icon: <HelpCircle size={20}/>, path: '/seller/dashboard/help', sub: [] },
]

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen, openDropdown, setOpenDropdown, handleLogout, handleSubClick, cardTheme, hoverTheme, darkMode, isVerified = true }) {
  const [hoveredMenu, setHoveredMenu] = useState(null)
  const [time, setTime] = useState(new Date())
  const [weather, setWeather] = useState({temp: '25°C', status: 'Light Rain'})
  const [pendingOrders, setPendingOrders] = useState(3)
  const [levelProgress, setLevelProgress] = useState(65)
  const [searchQuery, setSearchQuery] = useState('')
  const [isOnline, setIsOnline] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const sellerLevel = isVerified? "Gold" : "Bronze"
  const sellerRating = 4.8
  const todaySales = 0

  const lockedMenus = ['Products', 'Orders', 'Marketing', 'Finance']

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => { clearInterval(timer); window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline) }
  }, [])

  // ✅ NEW: Filter Menu by Search - PRO FEATURE
  const filteredMenu = useMemo(() => {
    if(!searchQuery) return menuItems
    return menuItems.filter(m =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.sub.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [searchQuery])

  const handleMenuClick = useCallback((item) => {
    if(lockedMenus.includes(item.name) &&!isVerified){
      handleSubClick('Settings', 'Account Settings')
      return
    }
    if(item.path){
      router.push(item.path)
    } else {
      if(!isSidebarOpen){
        setIsSidebarOpen(true)
      } else {
        setOpenDropdown(openDropdown === item.name? '' : item.name)
      }
    }
  }, [isSidebarOpen, openDropdown, router, setIsSidebarOpen, setOpenDropdown, isVerified, handleSubClick])

  // ✅ FIXED: Direct realPath navigation - NO 404 - ROCKET FAST
  const handleSubItemClick = useCallback((itemName, sub) => {
    const isLocked = lockedMenus.includes(itemName) &&!isVerified
    if(isLocked){
      handleSubClick('Settings', 'Account Settings')
      return
    }
    if(sub.realPath){
      router.push(sub.realPath)
    } else {
      handleSubClick(itemName, sub.name)
    }
  }, [isVerified, router, handleSubClick])

  const getBadgeColor = useCallback((badge) => {
    if(badge === 'AI') return 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_3px_10px_rgba(168,85,247,0.4)]'
    if(badge === 'Pro') return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-[0_3px_10px_rgba(249,115,22,0.4)]'
    if(badge === 'New') return 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-[0_3px_10px_rgba(16,185,129,0.4)]'
    if(badge === 'Hot') return 'bg-gradient-to-r from-red-500 to-rose-500 shadow-[0_3px_10px_rgba(239,68,68,0.4)]'
    if(badge === 'Live') return 'bg-red-500 animate-pulse shadow-[0_3px_10px_rgba(239,68,68,0.6)]'
    if(typeof badge === 'number') return 'bg-gradient-to-r from-[#F85606] to-orange-500 shadow-[0_3px_10px_rgba(248,86,6,0.4)]'
    return 'bg-gray-500'
  }, [])

  return (
    <aside className={`${cardTheme} border-r flex-col transition-all duration-500 shadow-[0_10px_60px_rgba(0,0,0,0.1)] backdrop-blur-2xl ${isSidebarOpen? 'w-64' : 'w-20'} h-screen overflow-hidden fixed left-0 top-0 z-30 flex`}>

      {/* TOP LOGO + SELLER LEVEL + RATING + PROGRESS + VERIFICATION BADGE - 3D GLASS */}
      <div onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-4 border-b flex items-center cursor-pointer ${hoverTheme} ${isSidebarOpen? 'gap-3' : 'justify-center'} flex-shrink-0 relative group`}>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition duration-500"></div>
        <div className="relative">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F85606] to-orange-400 flex items-center justify-center shadow-[0_8px_20px_rgba(248,86,6,0.3)] group-hover:scale-110 group-hover:rotate-3 transition duration-300">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="white"><path d="M16 0L0 8v16l16 8 16-8V8L16 0zm0 24L4 18V10l12 6 12-6v8l-12 6z"/><path d="M16 4l10 5v2L16 6 6 11v-2l10-5z" fill="white" opacity="0.8"/></svg>
          </div>
          {isVerified? <Crown size={12} className="absolute -top-1 -right-1 text-yellow-400 bg-white rounded-full p-0.5 shadow-md animate-bounce" /> : <Shield size={12} className="absolute -top-1 -right-1 text-gray-400 bg-white rounded-full p-0.5 shadow-md" />}
          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${isOnline? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
        </div>
        {isSidebarOpen && (
          <div className="flex-1 relative">
            <h1 className="font-black text-[15px] bg-gradient-to-r from-[#F85606] to-orange-500 bg-clip-text text-transparent whitespace-nowrap flex items-center gap-1">বাহারাজ <Sparkles size={12} className="text-yellow-400 animate-pulse"/></h1>
            <div className="flex items-center gap-2 mt-0.5">
              <p className={`text-[11px] flex items-center gap-1 font-bold px-2 py-0.5 rounded-full ${isVerified? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500'}`}><Award size={10}/> {sellerLevel} {isVerified && <Verified size={10} className="text-blue-500"/>}</p>
              <div className="flex items-center gap-0.5 bg-orange-50 px-1.5 py-0.5 rounded-full">
                <Star size={10} className="text-yellow-400 fill-yellow-400"/>
                <span className="text-[11px] font-black">{sellerRating}</span>
              </div>
              {!isVerified && <Ban size={10} className="text-red-500" title="Not Verified"/>}
              {isOnline && <Wifi size={10} className="text-green-500"/>}
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-gradient-to-r from-[#F85606] to-orange-400 h-1.5 rounded-full transition-all duration-1000 relative" style={{width: `${isVerified? 100 : levelProgress}%`}}>
                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
        {!isSidebarOpen && <ChevronRight size={14} className="absolute right-1.5 text-gray-400 bg-white rounded-full p-0.5 shadow-sm"/>}
      </div>

      {/* ✅ NEW: SIDEBAR SEARCH - PRO FEATURE */}
      {isSidebarOpen && (
        <div className="p-2.5 border-b border-gray-100/50">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input
              value={searchQuery}
              onChange={(e)=>setSearchQuery(e.target.value)}
              placeholder="Search menu, AI, Orders..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 border border-gray-100 text-[12px] font-medium placeholder:text-gray-400 focus:bg-white focus:border-[#F85606]/30 focus:ring-2 focus:ring-[#F85606]/10 outline-none transition-all"
            />
            {searchQuery && <button onClick={()=>setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><span className="text-[12px]">✕</span></button>}
          </div>
        </div>
      )}

      {/* MENU - ONLY THIS SCROLLS - 100% WORKING FIX + MIDDLE POINT VERIFICATION CARD */}
      <nav className="flex-1 min-h-0 overflow-y-auto py-2 no-scrollbar space-y-1">

        {/* DASHBOARD - FIRST */}
        {(() => {
          const dashboardItem = filteredMenu.find(m => m.name === 'Dashboard')
          if(!dashboardItem) return null
          const isActive = pathname === dashboardItem.path
          return (
            <div className="px-2">
              <div
                onClick={() => handleMenuClick(dashboardItem)}
                className={`px-3 py-3 flex items-center cursor-pointer rounded-xl transition-all duration-300
                  ${isActive? 'bg-gradient-to-r from-[#F85606] to-orange-500 text-white shadow-[0_8px_25px_rgba(248,86,6,0.4)] scale-[1.02]' : `${hoverTheme} hover:shadow-md hover:translate-x-1`}
                  ${!isSidebarOpen && 'justify-center'}`}
              >
                <span className={`${isActive? 'text-white' : darkMode? 'text-gray-400' : 'text-gray-600'} flex-shrink-0`}>{dashboardItem.icon}</span>
                {isSidebarOpen && (
                  <>
                    <span className={`text-[13px] font-bold ml-3 flex-1 whitespace-nowrap ${isActive? 'text-white' : ''}`}>{dashboardItem.name}</span>
                    {dashboardItem.badge && <span className={`text-[9px] ${isActive? 'bg-white text-[#F85606]' : getBadgeColor(dashboardItem.badge)} text-white px-2 py-0.5 rounded-full font-black`}>{dashboardItem.badge}</span>}
                  </>
                )}
              </div>
            </div>
          )
        })()}

        {/* MIDDLE POINT - ID VERIFY CARD - DASHBOARD এর নিচে Colorful 3D Glass - PRO LEVEL */}
        {isSidebarOpen &&!isVerified && (
          <div className="px-2.5 my-3">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 rounded-[16px] blur-[10px] opacity-60 group-hover:opacity-90 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-white via-orange-50/80 to-white backdrop-blur-2xl border border-white/60 rounded-[16px] p-3.5 shadow-[0_10px_30px_rgba(248,86,6,0.2)] hover:shadow-[0_15px_40px_rgba(248,86,6,0.3)] hover:-translate-y-1 transition-all duration-500">
                <div className="absolute top-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-red-500 via-yellow-400 via-green-400 to-purple-500 rounded-t-[16px]"></div>
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F85606] to-orange-400 flex items-center justify-center text-white shadow-[0_8px_20px_rgba(248,86,6,0.4)] animate-pulse">
                    <Shield size={16}/>
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-black bg-gradient-to-r from-[#F85606] to-purple-600 bg-clip-text text-transparent flex items-center gap-1">ID Verify করুন <Sparkles size={10} className="text-orange-500"/></p>
                    <p className="text-[9px] text-gray-600 leading-tight font-medium mt-0.5">Verify করলে Store Live হবে<br/><span className="text-[#F85606] font-bold">🙏 স্যার অনুগ্রহ করে কমপ্লিট করুন</span></p>
                  </div>
                </div>
                <button onClick={() => handleSubItemClick('Settings', {name: 'Account Settings', realPath: '/seller/dashboard/settings/account-settings'})} className="mt-3 w-full bg-gradient-to-r from-[#F85606] via-orange-500 to-pink-500 text-white text-[10px] font-black py-2.5 rounded-xl shadow-[0_8px_20px_rgba(248,86,6,0.4)] hover:shadow-[0_10px_30px_rgba(248,86,6,0.5)] hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-1.5 relative overflow-hidden group/btn">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                  <UploadCloud size={12}/> Verify Now <Rocket size={10} className="animate-bounce"/>
                </button>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-[8px] text-gray-500 flex items-center gap-1"><Eye size={8}/> 5x More Views</p>
                  <p className="text-[8px] text-green-600 font-bold flex items-center gap-1"><CheckCircle size={8}/> 2 Min Process</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REST OF MENU */}
        {filteredMenu.filter(m => m.name!== 'Dashboard').map(item => {
          const isActive = pathname === item.path || pathname.startsWith(`/seller/dashboard/${item.name.toLowerCase().replace(/\s+/g,'-')}`) || (item.name==='Products' && pathname.startsWith('/seller/products'))
          const isLocked = lockedMenus.includes(item.name) &&!isVerified
          return(
          <div key={item.name} className="relative px-2" onMouseEnter={() => setHoveredMenu(item.name)} onMouseLeave={() => setHoveredMenu(null)}>

            <div
              onClick={() => handleMenuClick(item)}
              className={`px-3 py-2.5 flex items-center cursor-pointer rounded-xl transition-all duration-300
                ${isActive? 'bg-gradient-to-r from-orange-500/10 to-[#F85606]/10 border border-orange-200/50 text-[#F85606] shadow-sm' : `${hoverTheme} hover:shadow-sm`}
                ${!isSidebarOpen && 'justify-center'}
                ${hoveredMenu === item.name? 'translate-x-1 shadow-md' : ''}
                ${isLocked? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
              title={isLocked? 'ID Verify করুন - Bank + NID লাগবে' : item.name}
            >
              <span className={`${isActive? 'text-[#F85606]' : darkMode? 'text-gray-400' : 'text-gray-500'} flex-shrink-0 transition-all duration-300 ${hoveredMenu === item.name? 'scale-110 rotate-3' : ''}`}>{item.icon}</span>

              {isSidebarOpen && (
                <>
                  <span className={`text-[13px] font-medium ml-3 flex-1 whitespace-nowrap transition ${isActive? 'text-[#F85606] font-bold' : ''}`}>{item.name}</span>

                  {isLocked && <Lock size={12} className="text-red-500 mr-1.5 animate-pulse"/>}

                  {item.tag && <span className="text-[8px] bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-0.5 rounded-full font-black mr-1.5 shadow-md animate-pulse">{item.tag}</span>}

                  {item.badge && <span className={`text-[9px] ${getBadgeColor(item.badge)} text-white px-2 py-0.5 rounded-full font-black mr-1.5 shadow-md`}>{item.badge}</span>}

                  {item.sub.length > 0 && (
                    <span className={`text-gray-400 transition-transform duration-300 ${openDropdown === item.name? 'rotate-90 text-[#F85606]' : ''}`}>
                      <ChevronRight size={14}/>
                    </span>
                  )}
                </>
              )}
            </div>

            {isSidebarOpen && item.sub.length > 0 && openDropdown === item.name && (
              <div className={`${darkMode? 'bg-[#1F1F1F]/80' : 'bg-gray-50/80'} backdrop-blur-xl mx-2 mt-1 rounded-xl border border-gray-100/50 py-1.5 animate-fadeIn shadow-inner`}>
                {item.sub.map(sub => {
                  const isSubActive = pathname === sub.realPath
                  return (
                  <div
                    key={sub.name}
                    onClick={() =>!isLocked && handleSubItemClick(item.name, sub)}
                    className={`py-2 px-4 ml-2 text-[12px] transition-all duration-200 flex items-center justify-between pr-3 group rounded-lg mr-2
                      ${isSubActive? 'bg-white text-[#F85606] font-bold shadow-sm translate-x-1 border border-orange-100' : ''}
                      ${isLocked? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer hover:text-[#F85606] hover:bg-white hover:shadow-sm hover:font-bold hover:translate-x-1'}`}
                  >
                    <span className="flex items-center gap-2"><div className={`w-1 h-1 rounded-full ${isSubActive? 'bg-[#F85606]' : 'bg-gray-300 group-hover:bg-[#F85606]'}`}></div>{sub.name}</span>
                    {sub.badge && <span className={`text-[8px] ${getBadgeColor(sub.badge)} text-white px-1.5 py-0.5 rounded-full font-black shadow-sm`}>{sub.badge}</span>}
                  </div>
                )})}
              </div>
            )}
          </div>
          )
        })}
        {filteredMenu.length===0 && isSidebarOpen && (
          <div className="px-4 py-8 text-center">
            <Search size={20} className="mx-auto text-gray-300 mb-2"/>
            <p className="text-[11px] text-gray-500 font-bold">No menu found for "{searchQuery}"</p>
            <button onClick={()=>setSearchQuery('')} className="mt-2 text-[11px] text-[#F85606] font-bold bg-orange-50 px-3 py-1 rounded-full">Clear Search</button>
          </div>
        )}
      </nav>

      {/* BOTTOM WEATHER + STATS + QUICK ACTIONS + LOGOUT - PRO 3D GLASS */}
      <div className="border-t border-gray-100/50 flex-shrink-0 backdrop-blur-xl bg-white/50">
        {isSidebarOpen && (
          <div className="px-3 py-3 space-y-2.5">
            <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl p-2.5 border border-white/60 backdrop-blur-xl hover:shadow-md transition">
              <div className={`text-[11px] flex items-center justify-between font-bold ${darkMode? 'text-gray-300' : 'text-gray-700'}`}>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white shadow-sm"><CloudRain size={12}/></div>
                  <span>{weather.temp} {weather.status}</span>
                </div>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1"><Clock size={10}/>{time.toLocaleTimeString('en-BD', {hour: '2-digit', minute: '2-digit'})}</span>
              </div>
              <div className={`text-[10px] flex items-center justify-between mt-2 ${darkMode? 'text-gray-400' : 'text-gray-600'}`}>
                <span className="flex items-center gap-1"><Target size={10} className="text-green-500"/> আজকের বিক্রি</span>
                <span className="font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1"><Activity size={10}/> ৳{todaySales}</span>
              </div>
              <div className={`text-[10px] flex items-center justify-between mt-1.5 ${darkMode? 'text-gray-400' : 'text-gray-600'}`}>
                <span className="flex items-center gap-1"><TrendingUpIcon size={10} className="text-[#F85606]"/> Conversion</span>
                <span className="font-black text-[#F85606] bg-orange-50 px-2 py-0.5 rounded-full flex items-center gap-1"><LayersIcon size={10}/> 0% {isVerified? 'Live' : 'Hidden'}</span>
              </div>
              <div className="mt-2 flex items-center gap-1 text-[9px] text-gray-500">
                <div className={`w-2 h-2 rounded-full ${isOnline? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="font-bold">{isOnline? 'Online - Store Live' : 'Offline'}</span>
                <span className="ml-auto px-1.5 py-0.5 bg-white rounded-full text-[8px] font-bold">{isVerified? '✅ Verified' : '⏳ Pending'}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSubItemClick('Products', {name: 'Add Product', realPath: '/seller/products/add'})}
                disabled={!isVerified}
                className={`bg-gradient-to-r from-[#F85606] to-orange-500 text-white text-[11px] py-2 rounded-xl flex items-center justify-center gap-1 font-black shadow-[0_5px_15px_rgba(248,86,6,0.3)] hover:shadow-[0_8px_20px_rgba(248,86,6,0.4)] hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:grayscale`}>
                <Plus size={12}/> Add
              </button>
              <button onClick={() => handleSubItemClick('Customer Service', {name: 'Chat', realPath: '/seller/dashboard/customer-service/chat'})} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[11px] py-2 rounded-xl flex items-center justify-center gap-1 font-black shadow-[0_5px_15px_rgba(168,85,247,0.3)] hover:shadow-[0_8px_20px_rgba(168,85,247,0.4)] hover:scale-105 active:scale-95 transition-all"><Headphones size={12}/> Help</button>
            </div>
          </div>
        )}
        <div className="p-2.5">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-2.5 text-red-500 hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 hover:text-white p-2.5 rounded-xl transition-all duration-300 ${!isSidebarOpen && 'justify-center'} hover:shadow-[0_8px_20px_rgba(239,68,68,0.3)] hover:scale-[1.02] active:scale-95 font-bold text-[12px] border border-red-100 hover:border-transparent`}
            title="Logout"
          >
            <LogOut size={18}/>
            {isSidebarOpen && <span>Logout - {isOnline? 'Online' : 'Offline'}</span>}
          </button>
        </div>
      </div>

      <style jsx>{`
   .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
   .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
   .animate-fadeIn {
          animation: fadeIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) ;
        }
      `}</style>
    </aside>
  )
}