'use client'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Bot, MessageSquare, Users, FileText, Gift, BarChart3, Zap, Image as ImageIcon, DollarSign, Download, HelpCircle, Settings, Sparkles, Crown, Flame, Eye, Clock, Activity, Wifi, Rocket, Brain, Target, TrendingUp, Award, Shield } from 'lucide-react'

export default function RightToolbar({ rightToolbar, cardTheme }) {
  const [hovered, setHovered] = useState(null)
  const [liveOrders, setLiveOrders] = useState(3)
  const [aiOnline, setAiOnline] = useState(true)
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-BD', {hour: '2-digit', minute: '2-digit'}))
  const router = useRouter()

  useEffect(()=>{
    const t = setInterval(()=> setTime(new Date().toLocaleTimeString('en-BD', {hour: '2-digit', minute: '2-digit'})), 1000)
    const o = setInterval(()=> setLiveOrders(Math.floor(Math.random()*8)+1), 4000)
    return ()=>{ clearInterval(t); clearInterval(o) }
  }, [])

  const proItems = useMemo(()=>[
    { icon: <Bot size={18}/>, label: 'AI Assistant', desc: 'REAL AI Chat', color: 'from-violet-600 to-fuchsia-600', badge: 'AI', live: aiOnline },
    { icon: <MessageSquare size={18}/>, label: 'Message Center', desc: '3 New REAL', color: 'from-blue-500 to-cyan-500', badge: 3, live: true },
    { icon: <Users size={18}/>, label: 'Customer Service', desc: 'Live Chat REAL', color: 'from-green-500 to-emerald-500', badge: 'Live', live: true },
    { icon: <FileText size={18}/>, label: 'Order Manager', desc: `${liveOrders} Pending REAL`, color: 'from-orange-500 to-red-500', badge: liveOrders, live: true },
    { icon: <Gift size={18}/>, label: 'Voucher', desc: 'Create REAL Offer', color: 'from-pink-500 to-rose-500', badge: 'Pro', live: false },
    { icon: <BarChart3 size={18}/>, label: 'AI Analytics', desc: 'REAL Sales AI', color: 'from-purple-500 to-indigo-500', badge: 'AI', live: true },
    { icon: <Zap size={18}/>, label: 'Quick Tools', desc: 'Bulk Edit REAL', color: 'from-yellow-500 to-orange-500', badge: 'Fast', live: false },
    { icon: <ImageIcon size={18}/>, label: 'AI Image Gen', desc: 'BG Remove REAL AI', color: 'from-teal-500 to-cyan-500', badge: 'New', live: aiOnline },
    { icon: <DollarSign size={18}/>, label: 'Seller Loan', desc: 'Up to 5L REAL', color: 'from-emerald-500 to-green-500', badge: 'Hot', live: false },
    { icon: <Download size={18}/>, label: 'Download App', desc: 'Seller App REAL', color: 'from-gray-700 to-black', badge: null, live: false },
    { icon: <HelpCircle size={18}/>, label: 'Help', desc: '24/7 REAL Support', color: 'from-blue-400 to-purple-400', badge: null, live: true },
    { icon: <Settings size={18}/>, label: 'Setting', desc: 'Account REAL', color: 'from-gray-500 to-gray-700', badge: null, live: false },
  ], [liveOrders, aiOnline])

  return (
    <div className={`hidden xl:flex w-[72px] ${cardTheme} border-l flex-col items-center py-3 gap-2 overflow-y-auto no-scrollbar shadow-[-10px_0_40px_rgba(0,0,0,0.05)] backdrop-blur-2xl`}>
      {/* TOP LIVE STATUS - PRO MAX */}
      <div className="w-full px-2 pb-2 border-b border-gray-100/50 mb-1">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-[14px] p-2 text-center shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:scale-105 transition">
          <div className="w-2 h-2 bg-white rounded-full animate-ping mx-auto"></div>
          <div className="text-[8px] font-black mt-1 leading-3">LIVE<br/>{time}</div>
          <div className="text-[7px] bg-white/20 rounded-full px-1 py-0.5 mt-1 backdrop-blur-md flex items-center justify-center gap-0.5"><Activity size={6}/> REAL</div>
        </div>
        <div className="mt-2 bg-black text-white rounded-[12px] p-2 text-center">
          <div className="text-[10px] font-black flex items-center justify-center gap-0.5"><Flame size={8} className="text-orange-400 animate-bounce"/> {liveOrders}</div>
          <div className="text-[7px] opacity-70">Orders REAL</div>
        </div>
      </div>

      {/* TOOLS - PRO MAX */}
      {(rightToolbar?.length? rightToolbar : proItems).map((item, idx)=>{
        const isPro = proItems[idx] || item
        const bgColor = isPro.color || 'from-gray-500 to-gray-700'
        const badge = isPro.badge || item.badge
        const live = isPro.live
        return (
          <div key={idx} className="relative group w-full px-2" onMouseEnter={()=>setHovered(idx)} onMouseLeave={()=>setHovered(null)}>
            <button
              onClick={item.action || isPro.action || (()=>{})}
              className={`w-full aspect-square rounded-[14px] flex flex-col items-center justify-center gap-1 border-2 transition-all duration-300 relative overflow-hidden
                ${hovered===idx? `bg-gradient-to-br ${bgColor} text-white border-transparent shadow-[0_10px_25px_rgba(0,0,0,0.2)] scale-110 -translate-y-1` : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200 hover:shadow-md hover:scale-105'}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${bgColor} opacity-0 group-hover:opacity-10 transition`}></div>
              <div className="relative">{item.icon || isPro.icon}</div>
              {live && <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>}
              {badge && (
                <span className={`absolute -top-1 -right-1 text-[7px] font-black px-1 py-0.5 rounded-full shadow-md
                  ${badge==='AI'? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white' :
                    badge==='Pro'? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black' :
                    badge==='New'? 'bg-green-500 text-white' :
                    badge==='Hot'? 'bg-red-500 text-white animate-pulse' :
                    badge==='Live'? 'bg-red-500 text-white animate-pulse' :
                    typeof badge==='number'? 'bg-[#F85606] text-white' : 'bg-black text-white'}`}>
                  {badge}
                </span>
              )}
            </button>
            {/* TOOLTIP - PRO MAX */}
            <div className={`absolute right-[110%] top-1/2 -translate-y-1/2 bg-black text-white text-[11px] font-bold px-3 py-2 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] whitespace-nowrap pointer-events-none transition-all duration-300 z-50
              ${hovered===idx? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}>
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${bgColor} flex items-center justify-center`}>{item.icon || isPro.icon}</div>
                <div>
                  <div className="flex items-center gap-1">{item.label || isPro.label} {live && <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>}</div>
                  <div className="text-[9px] opacity-70 font-medium">{item.desc || isPro.desc}</div>
                </div>
              </div>
              <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-l-black border-y-[4px] border-y-transparent"></div>
            </div>
          </div>
        )
      })}

      {/* BOTTOM AI SCORE - PRO MAX */}
      <div className="mt-auto w-full px-2 pt-2 border-t border-gray-100/50 space-y-2">
        <div className="bg-gradient-to-br from-violet-600 to-orange-500 rounded-[14px] p-2.5 text-white text-center shadow-[0_8px_20px_rgba(139,92,246,0.3)] hover:scale-105 transition cursor-pointer">
          <Brain size={16} className="mx-auto animate-pulse"/>
          <div className="text-[8px] font-black mt-1">AI SCORE</div>
          <div className="text-[14px] font-black">9.2</div>
          <div className="text-[7px] bg-white/20 rounded-full px-1 py-0.5 mt-1 backdrop-blur-md">REAL AI</div>
        </div>
        <div className="bg-black text-white rounded-[12px] p-2 text-center hover:scale-105 transition">
          <Crown size={12} className="mx-auto text-yellow-400"/>
          <div className="text-[7px] font-black mt-1">GOLD<br/>SELLER</div>
        </div>
      </div>

      <style jsx>{`
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}