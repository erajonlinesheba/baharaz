'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'

function OrderSuccessContent(){
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [order,setOrder]=useState(null)
  const [loading,setLoading]=useState(true)
  const [showConfetti,setShowConfetti]=useState(true)
  const [copyText,setCopyText]=useState('Copy')
  const [suggested,setSuggested]=useState([])
  const [countdown,setCountdown]=useState({ d:1, h:23, m:59, s:59 })

  useEffect(()=>{
    const fetchOrder = async()=>{
      setLoading(true)
      let foundOrder = null
      if(orderId){
        try{
          const { data } = await supabase.from('orders').select('*').eq('id', orderId).single()
          if(data){
            foundOrder = {
              id: data.id,
              items: data.items || [],
              total: data.total || data.total_amount || 0,
              subtotal: data.subtotal || 0,
              deliveryCharge: data.delivery_charge || 55,
              couponDiscount: data.coupon_discount || data.discount || 0,
              address: data.shipping_address || data.address || {},
              paymentMethod: data.payment_method || 'Cash on Delivery',
              date: data.created_at,
              status: data.status || 'confirmed'
            }
          }
        }catch(e){}
      }
      if(!foundOrder){
        try{
          const keys = ["baharaz_orders","eraj_all_orders","eraj_last_order"]
          for(let k of keys){
            const raw = localStorage.getItem(k)
            if(!raw) continue
            const parsed = JSON.parse(raw)
            const list = Array.isArray(parsed)? parsed : [parsed]
            const f = list.find(o=> o.id===orderId || o.orderId===orderId) || list[0]
            if(f){
              foundOrder = { id: f.id||f.orderId, items: f.items||[], total: f.total||0, subtotal: f.subtotal||0, deliveryCharge: f.delivery_charge||f.deliveryCharge||55, couponDiscount: f.discount||0, address: f.address||f.shipping_address||{}, paymentMethod: f.payment||'Cash on Delivery', date: f.date||f.created_at, status: 'confirmed' }
              if(foundOrder.id) break
            }
          }
        }catch(e){}
      }
      if(foundOrder) setOrder(foundOrder)
      setLoading(false)
      setTimeout(()=>setShowConfetti(false),7000)
      const { data } = await supabase.from('products').select('*').limit(6)
      if(data) setSuggested(data)
    }
    fetchOrder()
  },[orderId])

  useEffect(()=>{
    const t = setInterval(()=> setCountdown(p=>{
      let {d,h,m,s}=p
      if(s>0) s--
      else if(m>0){ m--; s=59 }
      else if(h>0){ h--; m=59; s=59 }
      else if(d>0){ d--; h=23; m=59; s=59 }
      else { d=1; h=23; m=59; s=59 }
      return {d,h,m,s}
    }),1000)
    return ()=>clearInterval(t)
  },[])

  const handleCopy = ()=>{
    if(!order?.id) return
    navigator.clipboard.writeText(order.id)
    setCopyText('Copied!')
    setTimeout(()=>setCopyText('Copy'),2000)
  }

  const handleInvoice = ()=>{
    if(!order) return
    const addr = order.address || {}
    const txt = `E-RAJ - INVOICE\nOrder ID: ${order.id}\nDate: ${new Date(order.date).toLocaleString()}\nName: ${addr.fullName||addr.full_name||''}\nPhone: ${addr.phone}\nAddress: ${addr.full_address||addr.address}, ${addr.upazila}, ${addr.district}\nTotal: ৳${order.total}\nPayment: ${order.paymentMethod}\nThank you for shopping at E-RAJ!`
    const blob = new Blob([txt], {type:'text/plain'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href=url
    a.download=`Invoice-${order.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if(loading){
    return <div className="min-h-[80vh] bg-[#f8fafc] flex items-center justify-center"><div className="w-10 h-10 border-[3px] border-[#f85606] border-t-transparent rounded-full animate-spin"></div></div>
  }

  if(!order){
    return (
      <div className="min-h-[80vh] bg-[#f8fafc] flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[20px] p-10 text-center shadow-[0_8px_40px_rgba(0,0,0,0.06)] max-w-[380px] w-full">
          <p className="text-[40px]">📦</p>
          <h2 className="font-black text-[18px] mt-2">Order Not Found</h2>
          <Link href="/account/orders" className="mt-5 inline-block bg-[#0f172a] text-white px-6 py-2.5 rounded-full text-[12px] font-bold">View My Orders</Link>
        </div>
      </div>
    )
  }

  const addr = order.address || {}
  const saved = order.couponDiscount || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#fff5f2] to-[#fef3ec] pb-10 relative overflow-hidden">
      {/* Colorful Glass Background Blurs - Professional */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-[200px] -left-[200px] w-[600px] h-[600px] bg-gradient-to-br from-[#ff8a4d]/30 via-[#f85606]/20 to-[#ff6b9d]/20 rounded-full blur-[100px]"></div>
        <div className="absolute top-[300px] -right-[200px] w-[500px] h-[500px] bg-gradient-to-br from-[#a78bfa]/20 via-[#60a5fa]/20 to-[#34d399]/20 rounded-full blur-[90px]"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-[#fde68a]/20 to-transparent rounded-full blur-[80px]"></div>
      </div>

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(30)].map((_,i)=>(
            <div key={i} className="absolute animate-[fall_4s_ease-in_infinite]" style={{ left: `${Math.random()*100}%`, top: `-20px`, animationDelay: `${Math.random()*4}s` }}>
              <div className="w-2 h-2 rounded-full" style={{ background: ['#f85606','#ff8a4d','#f59e0b','#10b981','#8b5cf6','#ec4899'][i%6] }}></div>
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes fall { 0%{ transform: translateY(-20px) rotate(0deg); opacity:1 } 100%{ transform: translateY(110vh) rotate(360deg); opacity:0 } }`}</style>

      {/* Main Content - No Extra Header, So No Overlap */}
      <div className="relative max-w-[1120px] mx-auto px-3 lg:px-6 pt-6 lg:pt-10">

        {/* Top Success Glass Card */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.06),0_1px_0_1px_rgba(255,255,255,0.8)_inset] overflow-hidden">
          <div className="p-6 lg:p-8">
            <div className="flex gap-4 lg:gap-6">
              <div className="w-[56px] h-[56px] lg:w-[64px] lg:h-[64px] bg-gradient-to-br from-[#10b981] to-[#059669] rounded-full flex items-center justify-center shrink-0 shadow-[0_8px_20px_rgba(16,185,129,0.3)]">
                <span className="text-white text-[28px] lg:text-[32px]">✓</span>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-[20px] lg:text-[28px] font-black text-[#0f172a] tracking-tight leading-tight">Order placed successfully!</h1>
                <p className="text-[12px] lg:text-[13px] text-[#475569] mt-2 leading-[18px]">Thank you! Your order <span className="font-mono font-bold text-[#0f172a] bg-[#f1f5f9] border border-[#e2e8f0] px-2 py-0.5 rounded-[6px]">{String(order.id).slice(0,18)}</span> has been confirmed. A confirmation SMS will be sent shortly.</p>

                <div className="mt-5 flex flex-wrap gap-2.5">
                  <div className="bg-white/90 backdrop-blur border border-[#e2e8f0] rounded-full pl-4 pr-1.5 py-1.5 flex items-center gap-2 shadow-sm">
                    <div className="text-left">
                      <p className="text-[9px] font-black tracking-[0.1em] text-[#94a3b8] uppercase leading-none">Order Number</p>
                      <p className="font-mono font-bold text-[12px] text-[#0f172a] leading-none mt-1">{order.id}</p>
                    </div>
                    <button onClick={handleCopy} className="ml-2 bg-[#0f172a] hover:bg-black text-white text-[11px] font-bold px-4 py-2 rounded-full transition">{copyText}</button>
                  </div>
                  <button onClick={handleInvoice} className="bg-white border border-[#e2e8f0] text-[#0f172a] text-[12px] font-bold px-5 py-2.5 rounded-full hover:bg-[#f8fafc] shadow-sm transition">📄 Download Invoice</button>
                </div>
              </div>
            </div>

            {/* Steps - Colorful Glass */}
            <div className="mt-8 bg-[#f8fafc]/80 backdrop-blur border border-[#f1f5f9] rounded-[16px] p-4 lg:p-6">
              <div className="relative">
                <div className="absolute top-[16px] left-[5%] right-[5%] h-[4px] bg-[#e2e8f0] rounded-full hidden lg:block">
                  <div className="h-full bg-gradient-to-r from-[#10b981] to-[#06b6d4] rounded-full w-[25%]"></div>
                </div>
                <div className="grid grid-cols-4 gap-2 relative z-10">
                  {[
                    { label:'Confirmed', sub:'Today', active:true },
                    { label:'Packed', sub:'Tomorrow', active:false },
                    { label:'Shipped', sub:'On the way', active:false },
                    { label:'Delivered', sub: addr.district? addr.district : 'Soon', active:false },
                  ].map((s,i)=>(
                    <div key={i} className="flex flex-col items-center text-center">
                      <div className={`w-[36px] h-[36px] rounded-full flex items-center justify-center border-2 bg-white shadow-sm ${s.active? 'border-[#10b981] text-[#10b981]' : 'border-[#e2e8f0] text-[#94a3b8]'}`}>
                        <span className="text-[14px] font-black">{s.active? '✓' : i+1}</span>
                      </div>
                      <p className={`text-[11px] lg:text-[12px] font-bold mt-2 ${s.active? 'text-[#0f172a]' : 'text-[#64748b]'}`}>{s.label}</p>
                      <p className="text-[10px] text-[#94a3b8] hidden lg:block">{s.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 lg:gap-6 mt-4 lg:mt-6">

          {/* Left */}
          <div className="space-y-4">
            <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="p-4 lg:p-5 border-b border-[#f1f5f9] flex justify-between items-center bg-white/50">
                <h2 className="font-bold text-[14px] text-[#0f172a]">Items in this order • {order.items?.length}</h2>
                <span className="text-[11px] font-bold text-[#059669] bg-[#ecfdf5] border border-[#a7f3d0] px-2.5 py-1 rounded-full">Delivery ৳{order.deliveryCharge}</span>
              </div>
              <div className="divide-y divide-[#f8fafc]">
                {order.items?.map((item,idx)=>{
                  const qty = Number(item.qty||item.quantity)||1
                  return (
                    <div key={idx} className="p-4 flex gap-4 hover:bg-white/60 transition">
                      <div className="w-[80px] h-[80px] bg-white rounded-[12px] border border-[#f1f5f9] relative overflow-hidden shrink-0 shadow-sm">
                        <Image src={item.image || item.image_url || 'https://via.placeholder.com/80'} alt="" fill className="object-contain p-2.5" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-[#0f172a] leading-[18px] line-clamp-2">{item.title || item.name}</p>
                        <p className="text-[11px] text-[#64748b] mt-1">Qty: {qty} • {item.color||'Standard'}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-[14px] font-black text-[#0f172a]">৳{Number(item.price)*qty}</span>
                          <span className="text-[11px] text-[#10b981] font-bold bg-[#ecfdf5] px-2 py-0.5 rounded-full">In Stock</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[20px] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
                <h3 className="font-bold text-[13px] text-[#0f172a]">Delivery Address</h3>
                <div className="mt-3 text-[12px] leading-[18px] text-[#334155]">
                  <p className="font-bold text-[#0f172a]">{addr.fullName || addr.full_name || 'Customer'}</p>
                  <p className="mt-1">{addr.full_address || addr.address}</p>
                  <p>{addr.upazila}, {addr.district}, {addr.division}</p>
                  <p className="mt-2 font-medium">📞 {addr.phone}</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] rounded-[20px] p-5 text-white shadow-[0_8px_32px_rgba(15,23,42,0.25)] border border-white/10">
                <h3 className="font-bold text-[13px]">Premium Protection</h3>
                <div className="mt-4 space-y-3 text-[11px]">
                  <p className="flex gap-2"><span className="text-[#34d399]">✓</span> 14 Days Free Return Policy</p>
                  <p className="flex gap-2"><span className="text-[#34d399]">✓</span> 100% Authentic Products</p>
                  <p className="flex gap-2"><span className="text-[#34d399]">✓</span> Secure Cash on Delivery</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary - Glass Colorful */}
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[20px] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.06)] lg:sticky lg:top-[90px]">
              {/* Countdown Glass */}
              <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-[14px] p-4 text-white shadow-lg border border-white/10">
                <p className="text-[10px] font-black tracking-[0.15em] opacity-70 uppercase">Estimated Delivery Time</p>
                <div className="flex gap-2 mt-3">
                  {[
                    {v:countdown.d, l:'Days'},
                    {v:countdown.h, l:'Hrs'},
                    {v:countdown.m, l:'Mins'},
                    {v:countdown.s, l:'Sec'},
                  ].map((t,i)=>(
                    <div key={i} className="bg-white/10 backdrop-blur border border-white/20 rounded-[10px] min-w-[52px] py-2 text-center">
                      <p className="text-[18px] font-black leading-none">{String(t.v).padStart(2,'0')}</p>
                      <p className="text-[8px] font-bold opacity-60 mt-1 tracking-widest">{t.l}</p>
                    </div>
                  ))}
                </div>
              </div>

              <h3 className="font-bold text-[14px] mt-6 text-[#0f172a]">Price Details</h3>
              <div className="mt-4 space-y-2.5 text-[12px] bg-[#f8fafc]/80 backdrop-blur rounded-[12px] p-4 border border-[#f1f5f9]">
                <div className="flex justify-between"><span className="text-[#64748b]">Subtotal</span><span className="font-medium text-[#0f172a]">৳{order.subtotal}</span></div>
                <div className="flex justify-between"><span className="text-[#64748b]">Delivery</span><span className="font-medium text-[#0f172a]">৳{order.deliveryCharge}</span></div>
                {saved>0 && <div className="flex justify-between text-[#059669]"><span>Discount</span><span className="font-bold">-৳{saved}</span></div>}
                <div className="h-[1px] bg-[#e2e8f0]"></div>
                <div className="flex justify-between font-black text-[16px] text-[#0f172a]"><span>Total Paid</span><span className="text-[#f85606]">৳{order.total}</span></div>
              </div>

              <div className="mt-4 bg-gradient-to-r from-[#fff7ed] to-[#ffedd5] border border-[#fed7aa] rounded-[12px] p-3 flex gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-[#f85606] to-[#fb923c] rounded-full flex items-center justify-center text-white text-[14px] shrink-0">🎁</div>
                <div>
                  <p className="text-[12px] font-bold text-[#9a3412]">You saved ৳{saved}!</p>
                  <p className="text-[11px] text-[#c2410c]">Earned {Math.round(Number(order.total)/10)} reward points</p>
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                <Link href="/account/orders" className="w-full h-[44px] bg-[#0f172a] hover:bg-black text-white rounded-full font-bold text-[13px] flex items-center justify-center shadow-[0_6px_16px_rgba(15,23,42,0.2)] transition">View My Orders</Link>
                <Link href="/" className="w-full h-[44px] bg-white border border-[#e2e8f0] hover:bg-[#f8fafc] text-[#0f172a] rounded-full font-bold text-[13px] flex items-center justify-center shadow-sm transition">Continue Shopping</Link>
              </div>
            </div>

            {suggested.length>0 && (
              <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[20px] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
                <h4 className="font-bold text-[12px] text-[#0f172a]">You may also like</h4>
                <div className="grid grid-cols-3 gap-2.5 mt-3">
                  {suggested.map(p=>(
                    <Link key={p.id} href={`/product/${p.id}`} className="group bg-white border border-[#f1f5f9] rounded-[12px] overflow-hidden hover:shadow-md transition">
                      <div className="aspect-square bg-[#f8fafc] relative"><Image src={p.image_url || p.image} alt="" fill className="object-contain p-2 group-hover:scale-105 transition" unoptimized /></div>
                      <div className="p-2"><p className="text-[10px] font-medium line-clamp-2 leading-[12px] h-[24px]">{p.name||p.title}</p><p className="text-[11px] font-black mt-1">৳{p.price}</p></div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage(){
  return (
    <Suspense fallback={<div className="min-h-[80vh] bg-[#f8fafc] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#f85606] border-t-transparent rounded-full animate-spin"></div></div>}>
      <OrderSuccessContent />
    </Suspense>
  )
}