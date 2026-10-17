"use client"
import Link from "next/link"
import { useState } from "react"
import { Search, MessageCircle, Phone, Mail, Sparkles, Clock, Users, Package, ShieldCheck, Zap, Star, HelpCircle, ChevronRight } from "lucide-react"

export default function HelpCenter(){
  const [q,setQ]=useState('')
  const cats=[
    {href:'/help/faq',icon:'❓',title:'FAQ & General',desc:'Common questions about shopping, orders and more',col:'bg-[#8b5cf6]',badge:'POPULAR'},
    {href:'/help/secure-pin',icon:'🔐',title:'Secure PIN Help',desc:'Set up and manage secure PIN for safe checkout',col:'bg-[#ec4899]',badge:'SECURE'},
    {href:'/track-order',icon:'📦',title:'Track Your Order',desc:'Follow your order from confirmation to doorstep',col:'bg-[#06b6d4]',badge:'LIVE'},
    {href:'/shipping-info',icon:'🚚',title:'Shipping & Delivery',desc:'Delivery charge, time, 64 districts coverage',col:'bg-[#10b981]',badge:'ALL BD'},
    {href:'/help/returns-refunds',icon:'↩️',title:'Return & Refund',desc:'Easy 7 day returns and fast refunds',col:'bg-[#f59e0b]',badge:'EASY'},
    {href:'/payment-methods',icon:'💳',title:'Payment Methods',desc:'COD, bKash, Nagad, card - all safe',col:'bg-[#6366f1]',badge:'SAFE'},
    {href:'/help/how-to-buy',icon:'🛒',title:'How to Order',desc:'New to Baharaz? 4 simple steps guide',col:'bg-[#f97316]',badge:'GUIDE'},
    {href:'/help/contact-us',icon:'💬',title:'Contact Us',desc:'Chat, call or email - we are here 24/7',col:'bg-[#ec4899]',badge:'24/7'},
    {href:'/seller',icon:'🏪',title:'Become a Seller',desc:'Start business with Baharaz, earn ৳50k+',col:'bg-[#14b8a6]',badge:'BUSINESS'},
  ]

  const popularSearches = ['Secure PIN', 'Track Order', 'Return', 'Payment', 'Shipping']
  const quickStats = [
    {icon:<Clock size={16}/>, label:'Avg Reply', value:'2 min'},
    {icon:<Users size={16}/>, label:'Happy Customers', value:'1M+'},
    {icon:<Package size={16}/>, label:'Orders Delivered', value:'5M+'},
    {icon:<ShieldCheck size={16}/>, label:'Safe & Secure', value:'100%'},
  ]

  const filtered=cats.filter(c=>c.title.toLowerCase().includes(q.toLowerCase()) || c.desc.toLowerCase().includes(q.toLowerCase()))

  return(
    <div className='min-h-screen bg-[#f6f6f9]'>
      <div className='bg-[#f85606] text-white relative overflow-hidden'>
        <div className='max-w-[1200px] mx-auto px-4 py-8 md:py-14 relative z-10'>
          <div className='inline-flex items-center gap-2 bg-white text-[#f85606] px-3 py-1.5 rounded-full text-[10px] font-black shadow'><Sparkles size={12}/> BAHARAZ HELP CENTER - 24/7 SUPPORT</div>
          <h1 className='text-[26px] md:text-[48px] font-black tracking-tight mt-4 leading-[1]'>How can we<br/>help you today?</h1>
          <p className='text-[12px] md:text-[14px] opacity-90 mt-3 max-w-[500px] leading-[18px]'>Welcome to Baharaz Support. Find guides, track orders, and get help anytime.</p>

          <div className='mt-6 max-w-[600px] relative'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={18}/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder='Search for help - PIN, order, return...' className='w-full pl-11 pr-[88px] py-[14px] rounded-full text-black text-[13px] outline-none shadow-lg focus:ring-2 focus:ring-white font-medium'/>
            <button className='absolute right-1.5 top-1/2 -translate-y-1/2 bg-black text-white px-4 py-2 rounded-full text-[11px] font-black flex items-center'><Zap size={12} className="mr-1"/>Search</button>
          </div>

          <div className='mt-4 flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1'>
            <span className='text-[10px] font-bold opacity-80 shrink-0 flex items-center gap-1'><Star size={10}/>Popular:</span>
            {popularSearches.map(tag=>(
              <button key={tag} onClick={()=>setQ(tag)} className='shrink-0 px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold border border-white/10 hover:bg-white hover:text-[#f85606] transition'>{tag}</button>
            ))}
          </div>
        </div>
      </div>

      <div className='max-w-[1200px] mx-auto px-3 md:px-4 -mt-4 relative z-20'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
          {quickStats.map((s,i)=>(
            <div key={i} className='bg-white rounded-[12px] border p-3 flex items-center gap-2.5 shadow-sm'>
              <div className='w-8 h-8 rounded-full bg-[#fff2ed] flex items-center justify-center text-[#f85606]'>{s.icon}</div>
              <div><p className='text-[11px] font-black leading-none'>{s.value}</p><p className='text-[9px] text-gray-500 mt-0.5'>{s.label}</p></div>
            </div>
          ))}
        </div>
      </div>

      <div className='max-w-[1200px] mx-auto px-3 md:px-4 py-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
          {filtered.length > 0 ? filtered.map(c=>(
            <Link key={c.href} href={c.href} className='bg-white rounded-[16px] border p-4 flex gap-3 items-center hover:shadow-md hover:border-[#f85606]/30 hover:-translate-y-0.5 transition-all group'>
              <div className={`w-[48px] h-[48px] rounded-[12px] ${c.col} flex items-center justify-center text-[22px] text-white shrink-0`}>{c.icon}</div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2'><h3 className='font-black text-[13px] truncate'>{c.title}</h3><span className='text-[7px] font-black bg-black text-white px-2 py-0.5 rounded-full'>{c.badge}</span></div>
                <p className='text-[11px] text-gray-500 mt-0.5 truncate'>{c.desc}</p>
              </div>
              <ChevronRight size={16} className='text-gray-300 group-hover:text-[#f85606] transition shrink-0'/>
            </Link>
          )) : (
            <div className="col-span-3 bg-white rounded-[16px] border p-8 text-center">
              <p className="text-[14px] font-black">No results for "{q}"</p>
              <p className="text-[11px] text-gray-500 mt-1">Try Popular searches above</p>
              <button onClick={()=>setQ('')} className="mt-3 px-4 py-1.5 bg-black text-white rounded-full text-[11px] font-bold">Clear Search</button>
            </div>
          )}
        </div>

        <div className='mt-6 bg-black rounded-[16px] p-4 md:p-6 text-white flex flex-col md:flex-row items-center justify-between gap-3'>
          <div><h3 className='font-black text-[14px] flex items-center gap-2'><HelpCircle size={16} className='text-[#f85606]'/> Quick Help - Most Asked</h3><p className='text-[11px] opacity-60 mt-1'>90% customers find answer here</p></div>
          <div className='flex gap-2 w-full md:w-auto overflow-x-auto scrollbar-hide'>
            <Link href="/help/secure-pin" className='shrink-0 px-4 py-2 bg-white/10 rounded-full text-[10px] font-bold border border-white/10 hover:bg-white/20'>🔐 PIN?</Link>
            <Link href="/track-order" className='shrink-0 px-4 py-2 bg-white/10 rounded-full text-[10px] font-bold border border-white/10 hover:bg-white/20'>📦 Track?</Link>
            <Link href="/seller" className='shrink-0 px-4 py-2 bg-[#f85606] rounded-full text-[10px] font-black'>🏪 Seller →</Link>
          </div>
        </div>

        <div className='mt-6 bg-white rounded-[16px] border p-4 md:p-8'>
          <h3 className='font-black text-[15px]'>Still need help? We are here</h3>
          <div className='mt-4 grid md:grid-cols-3 gap-3'>
            <div className='rounded-[12px] bg-[#f0fdf4] border border-green-100 p-4 flex gap-3'><div className='w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shrink-0'><MessageCircle size={18}/></div><div><p className='font-black text-[13px]'>Live Chat</p><p className='text-[11px] text-gray-600 mt-1'>Reply in 2 min - 24/7</p><Link href="/help/contact-us" className='inline-block mt-2 bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-black'>Start Chat</Link></div></div>
            <div className='rounded-[12px] bg-[#eff6ff] border border-blue-100 p-4 flex gap-3'><div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shrink-0'><Phone size={18}/></div><div><p className='font-black text-[13px]'>Call Us</p><p className='text-[11px] text-gray-600 mt-1'>09613-800800<br/>9AM - 9PM</p><p className='mt-2 text-[10px] font-bold text-blue-600'>Free Call</p></div></div>
            <div className='rounded-[12px] bg-[#fff7ed] border border-orange-100 p-4 flex gap-3'><div className='w-10 h-10 bg-[#f85606] rounded-full flex items-center justify-center text-white shrink-0'><Mail size={18}/></div><div><p className='font-black text-[13px]'>Email</p><p className='text-[11px] text-gray-600 mt-1'>support@baharaz.com<br/>6 hours reply</p><p className='mt-2 text-[10px] font-bold text-[#f85606]'>24/7 Support</p></div></div>
          </div>
        </div>
      </div>
    </div>
  )
}