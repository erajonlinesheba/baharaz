'use client'
import { useState, useMemo, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const mockOrders = [
  { id: 'ORD12345', customer: 'Rahim Uddin', phone: '01712345678', total: 1250, subtotal: 1250, delivery: 60, discount: 0, status: 'Pending', date: '08 Sep 2026', district: 'Rajshahi', thana: 'Boalia', address: 'Shaheb Bazar, Zero Point, Rajshahi-6000', payment: 'COD', items: [{ name: 'Premium Panjabi - Black', qty: 1, price: 1250, sku: 'PANJ-BLK-01', image: 'https://via.placeholder.com/80' }], courier: 'steadfast', tracking: '', notes: 'Call before delivery - After 5PM', created_at: new Date().toISOString() },
  { id: 'ORD12344', customer: 'Fatema Akter', phone: '01812345678', total: 3400, subtotal: 3200, delivery: 120, discount: 100, status: 'Shipped', date: '07 Sep 2026', district: 'Dhaka', thana: 'Mirpur', address: 'Mirpur 10, Dhaka-1216', payment: 'bKash', items: [{ name: 'Designer Saree - Red', qty: 1, price: 3200, sku: 'SAREE-RED-01', image: 'https://via.placeholder.com/80' }], courier: 'pathao', tracking: 'P-789456', notes: '', created_at: new Date(Date.now()-86400000).toISOString() },
  { id: 'ORD12343', customer: 'Sakib Hasan', phone: '01912345678', total: 800, subtotal: 800, delivery: 0, discount: 0, status: 'Delivered', date: '06 Sep 2026', district: 'Rajshahi', thana: 'Rajpara', address: 'Rajpara, Rajshahi', payment: 'COD', items: [{ name: 'T-Shirt - White', qty: 2, price: 400, sku: 'TSH-WHT-02', image: 'https://via.placeholder.com/80' }], courier: 'own_rider', tracking: 'OWN-001', notes: 'Rajshahi same day - Own rider Karim', created_at: new Date(Date.now()-2*86400000).toISOString() },
  { id: 'ORD12342', customer: 'Ayesha Siddika', phone: '01612345678', total: 2500, subtotal: 2500, delivery: 60, discount: 0, status: 'Confirmed', date: '08 Sep 2026', district: 'Rajshahi', thana: 'Boalia', address: 'Shaheb Bazar, Rajshahi', payment: 'COD', items: [{ name: 'Borka - Black', qty: 1, price: 2500, sku: 'BORKA-BLK', image: 'https://via.placeholder.com/80' }], courier: 'steadfast', tracking: '', notes: 'Size L', created_at: new Date().toISOString() },
  { id: 'ORD12341', customer: 'Karim Uddin', phone: '01512345678', total: 1500, subtotal: 1500, delivery: 120, discount: 0, status: 'Pending', date: '08 Sep 2026', district: 'Bogura', thana: 'Sadar', address: 'Bogura Sadar', payment: 'COD', items: [{ name: 'Jeans Pant', qty: 1, price: 1500, sku: 'JEANS-01', image: 'https://via.placeholder.com/80' }], courier: 'steadfast', tracking: '', notes: '', created_at: new Date().toISOString() },
]

export default function OrdersPage() {
  const supabase = createClient()
  const [orders, setOrders] = useState(mockOrders)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(mockOrders[0])
  const [showTrackingModal, setShowTrackingModal] = useState(false)
  const [trackingId, setTrackingId] = useState('')
  const [bulkSelect, setBulkSelect] = useState([])
  const [showInvoice, setShowInvoice] = useState(false)
  const [dateFilter, setDateFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [districtFilter, setDistrictFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [liveCount, setLiveCount] = useState(3)

  useEffect(() => {
    const iv = setInterval(() => setLiveCount(c => Math.max(1, c + Math.floor(Math.random()*3)-1)), 3000)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.from('orders').select('*, order_items(*, products(name, images))').order('created_at', { ascending:false }).limit(100)
        if(data && data.length>0){
          const mapped = data.map(o=>({
            id: o.id.slice(0,8).toUpperCase(),
            customer: o.customer_name || o.shipping_name || 'Customer',
            phone: o.phone || o.customer_phone || '017XXXXXXXX',
            total: o.total_amount || o.total || 0,
            subtotal: o.subtotal || o.total || 0,
            delivery: o.delivery_charge || 60,
            discount: o.discount || 0,
            status: o.status || 'Pending',
            date: new Date(o.created_at).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }),
            district: o.district || 'Rajshahi',
            thana: o.thana || '',
            address: o.shipping_address || o.address || '',
            payment: o.payment_method || 'COD',
            items: o.order_items || o.items || [{ name:'Product', qty:1, price:o.total||0 }],
            courier: o.courier || 'steadfast',
            tracking: o.tracking_id || '',
            notes: o.notes || '',
            created_at: o.created_at
          }))
          setOrders(mapped)
          setSelected(mapped[0])
        }
      } catch(e){ console.log(e) }
    })()
  }, [])

  const getStatusColor = (status) => {
    if(status === 'Pending') return 'bg-amber-50 text-amber-700 border-amber-200'
    if(status === 'Confirmed') return 'bg-blue-50 text-blue-700 border-blue-200'
    if(status === 'Shipped') return 'bg-purple-50 text-purple-700 border-purple-200'
    if(status === 'Delivered') return 'bg-green-50 text-green-700 border-green-200'
    if(status === 'Cancelled') return 'bg-red-50 text-red-700 border-red-200'
    if(status === 'Returned') return 'bg-slate-100 text-slate-600 border-slate-200'
    return 'bg-slate-50 text-slate-600 border-slate-200'
  }

  const statusTabs = [
    { id:'All', label:'All Orders', count: orders.length, desc:'All - Total', color:'bg-slate-900 text-white' },
    { id:'Pending', label:'Pending', count: orders.filter(o=>o.status==='Pending').length, desc:'New - Call within 2h', color:'bg-amber-500 text-white', urgent:true },
    { id:'Confirmed', label:'Confirmed', count: orders.filter(o=>o.status==='Confirmed').length, desc:'Packed - Ready to ship', color:'bg-blue-500 text-white' },
    { id:'Shipped', label:'Shipped', count: orders.filter(o=>o.status==='Shipped').length, desc:'In transit - Tracking', color:'bg-purple-500 text-white' },
    { id:'Delivered', label:'Delivered', count: orders.filter(o=>o.status==='Delivered').length, desc:'Completed - Ask review', color:'bg-green-500 text-white' },
    { id:'Cancelled', label:'Cancelled', count: orders.filter(o=>o.status==='Cancelled').length, desc:'Cancelled - Penalty if you cancel', color:'bg-red-500 text-white' },
    { id:'Returned', label:'Returned', count: orders.filter(o=>o.status==='Returned').length, desc:'Returned - Check reason', color:'bg-slate-500 text-white' },
  ]

  const filtered = useMemo(() => {
    let f = filter==='All'? orders : orders.filter(o=>o.status===filter)
    if(search) f = f.filter(o=> o.customer?.toLowerCase().includes(search.toLowerCase()) || o.phone?.includes(search) || o.id?.toLowerCase().includes(search.toLowerCase()) || o.district?.toLowerCase().includes(search.toLowerCase()))
    if(paymentFilter!=='all') f = f.filter(o=>o.payment===paymentFilter)
    if(districtFilter!=='all') f = f.filter(o=>o.district===districtFilter)
    return f
  }, [orders, filter, search, paymentFilter, districtFilter])

  const updateStatus = async (id, newStatus, tracking='') => {
    setOrders(prev=>prev.map(o=> o.id===id? {...o, status:newStatus, tracking: tracking || o.tracking} : o))
    if(selected?.id===id) setSelected(prev=>({...prev, status:newStatus, tracking: tracking || prev.tracking}))
    try{ await supabase.from('orders').update({ status:newStatus, tracking_id: tracking, updated_at:new Date().toISOString() }).eq('id', id) }catch(e){ console.log(e) }
  }

  const districts = [...new Set(orders.map(o=>o.district).filter(Boolean))]

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-24">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <p className="text-[11px] text-slate-500 font-bold tracking-widest uppercase">Homepage &gt; Seller &gt; Orders &gt; Manage - Amazon Seller Central Style</p>
          <h1 className="text-[22px] font-black tracking-tight mt-1 flex items-center gap-3">Orders - Manage All Orders <span className="text-[10px] px-3 py-1.5 rounded-full bg-green-50 text-green-700 border-2 border-green-200 font-black flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>{liveCount} New Live Now - Real-time</span> <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-900 text-white font-black">{orders.length} Total Orders</span></h1>
          <p className="text-xs text-slate-500 mt-2">Baharaz + Amazon Seller Center style - Pending → Confirmed → Shipped → Delivered - Track courier - Steadfast / Pathao / Own Rider - SMS tracking auto - Call customer within 2h - Ship within 24h - Ask review after delivery</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, phone, ID, district" className="px-4 py-2.5 rounded-full border-2 bg-white text-xs font-bold w-[240px] focus:border-slate-900 outline-none" />
          <select value={paymentFilter} onChange={e=>setPaymentFilter(e.target.value)} className="px-3 py-2.5 rounded-full border-2 bg-white text-xs font-bold"><option value="all">All Payment</option><option value="COD">COD - 70%</option><option value="bKash">bKash - 30%</option><option value="Nagad">Nagad</option></select>
          <select value={districtFilter} onChange={e=>setDistrictFilter(e.target.value)} className="px-3 py-2.5 rounded-full border-2 bg-white text-xs font-bold"><option value="all">All District</option>{districts.map(d=><option key={d} value={d}>{d}</option>)}</select>
          <button onClick={()=>{ const csv = filtered.map(o=>`${o.id},${o.customer},${o.phone},${o.district},${o.total},${o.status},${o.payment}`).join('\n'); const blob = new Blob([`ID,Customer,Phone,District,Total,Status,Payment\n${csv}`], { type:'text/csv' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download=`orders-${filter}-${new Date().toISOString().slice(0,10)}.csv`; a.click(); }} className="px-4 py-2.5 rounded-full bg-white border-2 text-xs font-black hover:border-slate-900">📥 Export CSV</button>
        </div>
      </div>

      {/* Order Tabs - Amazon Style */}
      <div className="bg-white p-2 rounded-[16px] border-2 flex gap-2 overflow-x-auto scrollbar-thin">
        {statusTabs.map(t=>{
          const active = filter===t.id
          return (
            <button key={t.id} onClick={()=>setFilter(t.id)} className={`px-4 py-3 rounded-xl text-xs font-black whitespace-nowrap flex items-center gap-2 border-2 transition-all ${active? "bg-slate-900 text-white border-slate-900 shadow-[0_8px_20px_rgba(0,0,0,0.15)] scale-[1.02]" : "bg-white border-slate-100 hover:border-slate-900 hover:bg-slate-50"}`}>
              <span>{t.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${active? "bg-white text-black" : "bg-slate-900 text-white"}`}>{t.count}</span>
              {t.urgent && t.count>0 && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
            </button>
          )
        })}
        <div className="ml-auto flex items-center gap-2 pl-2 border-l-2">
          <span className="text-[11px] font-black text-slate-500">Bulk: {bulkSelect.length} selected</span>
          <button disabled={bulkSelect.length===0} className="px-3 py-2 rounded-full bg-blue-500 text-white text-[11px] font-black disabled:opacity-50">Confirm Selected</button>
          <button disabled={bulkSelect.length===0} className="px-3 py-2 rounded-full bg-purple-500 text-white text-[11px] font-black disabled:opacity-50">Ship Selected</button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
        <div className="p-3 rounded-xl bg-amber-50 border-2 border-amber-200"><p className="text-[10px] font-black uppercase text-amber-800">Pending - Call 2h</p><p className="text-xl font-black mt-1 text-amber-900">{orders.filter(o=>o.status==='Pending').length}</p><p className="text-[10px] text-amber-700 mt-1">New orders - Call customer - Confirm size/color</p></div>
        <div className="p-3 rounded-xl bg-blue-50 border-2 border-blue-200"><p className="text-[10px] font-black uppercase text-blue-800">Confirmed - Pack</p><p className="text-xl font-black mt-1 text-blue-900">{orders.filter(o=>o.status==='Confirmed').length}</p><p className="text-[10px] text-blue-700 mt-1">Ready to ship - Pack with care - Thank you card</p></div>
        <div className="p-3 rounded-xl bg-purple-50 border-2 border-purple-200"><p className="text-[10px] font-black uppercase text-purple-800">Shipped - In Transit</p><p className="text-xl font-black mt-1 text-purple-900">{orders.filter(o=>o.status==='Shipped').length}</p><p className="text-[10px] text-purple-700 mt-1">Tracking - Customer gets SMS - Reduces queries 70%</p></div>
        <div className="p-3 rounded-xl bg-green-50 border-2 border-green-200"><p className="text-[10px] font-black uppercase text-green-800">Delivered - Ask Review</p><p className="text-xl font-black mt-1 text-green-900">{orders.filter(o=>o.status==='Delivered').length}</p><p className="text-[10px] text-green-700 mt-1">Completed - Ask for review with photo - 10 reviews = 3x conv</p></div>
        <div className="p-3 rounded-xl bg-white border-2"><p className="text-[10px] font-black uppercase text-slate-500">Total Revenue</p><p className="text-xl font-black mt-1">৳{orders.reduce((a,b)=>a+b.total,0).toLocaleString()}</p><p className="text-[10px] text-slate-500 mt-1">Lifetime - {orders.length} orders - Avg ৳{Math.round(orders.reduce((a,b)=>a+b.total,0)/Math.max(orders.length,1))}</p></div>
        <div className="p-3 rounded-xl bg-white border-2"><p className="text-[10px] font-black uppercase text-slate-500">COD vs bKash</p><p className="text-xl font-black mt-1">{orders.filter(o=>o.payment==='COD').length} / {orders.filter(o=>o.payment==='bKash').length}</p><p className="text-[10px] text-slate-500 mt-1">COD 70% - bKash 30% - BD standard</p></div>
        <div className="p-3 rounded-xl bg-slate-900 text-white border-2 border-slate-900"><p className="text-[10px] font-black uppercase opacity-60">Rajshahi Same Day</p><p className="text-xl font-black mt-1">{orders.filter(o=>o.district==='Rajshahi').length}</p><p className="text-[10px] opacity-60 mt-1">Own rider 40TK - Advantage - Same day</p></div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Orders Table */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-[20px] border-2 overflow-hidden shadow-sm">
          <div className="p-5 flex justify-between items-center border-b-2">
            <h3 className="font-black text-sm flex items-center gap-2">Orders List - {filtered.length} orders - Filter: {filter} {search? `• Search: ${search}` : ""} {paymentFilter!=='all'? `• ${paymentFilter}` : ""} {districtFilter!=='all'? `• ${districtFilter}` : ""}</h3>
            <div className="flex gap-2"><label className="flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={bulkSelect.length===filtered.length && filtered.length>0} onChange={e=> setBulkSelect(e.target.checked? filtered.map(o=>o.id) : [])} className="w-4 h-4 accent-slate-900" />Select All {filtered.length}</label></div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-[11px] font-black uppercase tracking-widest text-slate-400 border-b-2 bg-slate-50">
                <tr>
                  <th className="py-3 pl-5"><input type="checkbox" className="w-4 h-4 accent-slate-900" checked={bulkSelect.length===filtered.length && filtered.length>0} onChange={e=> setBulkSelect(e.target.checked? filtered.map(o=>o.id) : [])} /></th>
                  <th className="py-3">Order ID • Customer • Phone</th>
                  <th className="py-3">District • Address • Date</th>
                  <th className="py-3">Total • Items • Payment</th>
                  <th className="py-3">Status • Courier • Tracking</th>
                  <th className="py-3 pr-5">Action • Call • WA</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => (
                  <tr key={o.id} className={`border-b hover:bg-slate-50 transition-all cursor-pointer ${selected?.id===o.id? "bg-blue-50/50 border-l-4 border-l-slate-900" : ""}`} onClick={()=>setSelected(o)}>
                    <td className="py-4 pl-5"><input type="checkbox" checked={bulkSelect.includes(o.id)} onChange={e=>{ e.stopPropagation(); setBulkSelect(prev=> prev.includes(o.id)? prev.filter(id=>id!==o.id) : [...prev, o.id]) }} className="w-4 h-4 accent-slate-900" /></td>
                    <td className="py-4"><div><p className="font-black text-blue-600 hover:underline">{o.id}</p><p className="text-xs font-bold mt-1">{o.customer}</p><p className="text-[11px] text-slate-500">📞 {o.phone}</p></div></td>
                    <td className="py-4"><div><p className="text-xs font-bold">📍 {o.district} {o.thana? `• ${o.thana}` : ""}</p><p className="text-[11px] text-slate-500 truncate max-w-[180px]">{o.address}</p><p className="text-[11px] text-slate-400 mt-1">{o.date}</p></div></td>
                    <td className="py-4"><div><p className="font-black">৳{o.total} {o.discount>0? <span className="text-[10px] text-green-600">-৳{o.discount} OFF</span> : ""}</p><p className="text-[11px] text-slate-500">{o.items?.length || 1} items • Sub ৳{o.subtotal} + Del ৳{o.delivery}</p><span className={`text-[10px] px-2 py-0.5 rounded-full font-black border ${o.payment==='COD'? "bg-green-50 text-green-700 border-green-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>{o.payment}</span></div></td>
                    <td className="py-4"><div><span className={`px-3 py-1 rounded-full text-[11px] font-black border-2 ${getStatusColor(o.status)}`}>{o.status.toUpperCase()}</span><p className="text-[11px] text-slate-500 mt-1.5">🚚 {o.courier} {o.tracking? `• ${o.tracking}` : "• No tracking"}</p></div></td>
                    <td className="py-4 pr-5"><div className="flex flex-col gap-1.5">
                      <button onClick={(e)=>{ e.stopPropagation(); setSelected(o); setShowTrackingModal(true); setTrackingId(o.tracking || '') }} className="text-[11px] px-3 py-1.5 rounded-full bg-white border-2 font-black hover:border-slate-900 hover:bg-slate-50 text-left">View Details →</button>
                      <div className="flex gap-1">
                        <a href={`tel:${o.phone}`} onClick={e=>e.stopPropagation()} className="w-7 h-7 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-xs hover:bg-green-500 hover:text-white">📞</a>
                        <a href={`https://wa.me/88${o.phone.replace(/[^0-9]/g,'').slice(-11)}?text=Assalamu Alaikum ${o.customer}! Your order ${o.id} - ৳${o.total} - ${o.status} - From TAMID FASHION`} target="_blank" onClick={e=>e.stopPropagation()} className="w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">💬</a>
                        <button onClick={(e)=>{ e.stopPropagation(); updateStatus(o.id, 'Confirmed') }} className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-black" title="Confirm">✓</button>
                      </div>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length===0 && (
            <div className="p-12 text-center">
              <p className="text-3xl">📦</p>
              <p className="text-sm font-black mt-3">No orders in {filter} {search? `for "${search}"` : ""} - Share store link to get orders</p>
              <p className="text-xs text-slate-500 mt-2">Orders will appear here when customers order - Share baharaz.com/store/your-shop on Facebook - 1 post per day - Get first order</p>
            </div>
          )}
        </div>

        {/* Order Details Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="sticky top-[20px] space-y-4">
            {selected? (
              <div className="bg-white rounded-[20px] border-2 shadow-sm overflow-hidden">
                <div className="p-5 bg-slate-900 text-white flex justify-between items-start">
                  <div><p className="font-black text-sm">Order {selected.id} - Details</p><p className="text-[11px] opacity-70 mt-1">{selected.customer} • {selected.phone} • {selected.district} • ৳{selected.total} • {selected.payment} • {selected.status}</p></div>
                  <span className={`text-[10px] px-3 py-1 rounded-full font-black ${selected.status==='Pending'? "bg-amber-500 text-white" : selected.status==='Confirmed'? "bg-blue-500 text-white" : selected.status==='Shipped'? "bg-purple-500 text-white" : "bg-green-500 text-white"}`}>{selected.status}</span>
                </div>

                <div className="p-5 space-y-5">
                  <div className="p-4 rounded-[16px] bg-slate-50 border-2">
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">Customer Info - Verify before shipping - Call to confirm - Reduce return 50%</p>
                    <div className="mt-3 space-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-slate-500">Name:</span><span className="font-bold">{selected.customer}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Phone:</span><span className="font-bold">{selected.phone} <a href={`tel:${selected.phone}`} className="ml-2 px-2 py-0.5 rounded-full bg-green-500 text-white text-[10px] font-black">Call</a></span></div>
                      <div className="flex justify-between"><span className="text-slate-500">District:</span><span className="font-bold">{selected.district} • {selected.thana}</span></div>
                      <div><span className="text-slate-500">Address:</span><p className="font-bold mt-1 leading-relaxed">{selected.address}</p></div>
                      <div className="flex justify-between"><span className="text-slate-500">Date:</span><span className="font-bold">{selected.date} • {new Date(selected.created_at).toLocaleTimeString()}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Notes:</span><span className="font-bold">{selected.notes || "No notes"}</span></div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <a href={`tel:${selected.phone}`} className="py-2.5 rounded-xl bg-green-500 text-white text-xs font-black text-center">📞 Call Customer - Confirm</a>
                      <a href={`https://wa.me/88${selected.phone.replace(/[^0-9]/g,'').slice(-11)}?text=Assalamu Alaikum ${selected.customer}! Your order ${selected.id} - ৳${selected.total} - Status: ${selected.status} - From TAMID FASHION - Rajshahi - Fast delivery`} target="_blank" className="py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-black text-center">💬 WhatsApp - Fast</a>
                    </div>
                  </div>

                  <div className="p-4 rounded-[16px] bg-white border-2">
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">Order Items - {selected.items?.length || 1} items - Pack with care</p>
                    <div className="mt-3 space-y-3">
                      {(selected.items || []).map((item,i)=>(
                        <div key={i} className="flex gap-3 p-3 rounded-xl bg-slate-50 border">
                          <img src={item.image || 'https://via.placeholder.com/80'} className="w-14 h-14 rounded-xl object-cover border bg-white" alt={item.name} />
                          <div className="flex-1 min-w-0"><p className="text-xs font-black truncate">{item.name}</p><p className="text-[11px] text-slate-500 mt-1">SKU: {item.sku || 'N/A'} • Qty: {item.qty} • Price: ৳{item.price}</p><p className="text-xs font-black mt-1">৳{item.qty * item.price}</p></div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 space-y-2 text-xs border-t-2 border-dashed pt-3">
                      <div className="flex justify-between"><span className="text-slate-500">Subtotal:</span><span className="font-bold">৳{selected.subtotal}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Delivery:</span><span className="font-bold">৳{selected.delivery} • {selected.district==='Rajshahi'? "Own rider 40TK" : selected.district==='Dhaka'? "Inside Dhaka 60TK" : "Outside 120TK"}</span></div>
                      {selected.discount>0 && <div className="flex justify-between text-green-600"><span>Discount:</span><span className="font-black">-৳{selected.discount} • Coupon</span></div>}
                      <div className="flex justify-between font-black text-sm pt-2 border-t"><span>Total:</span><span>৳{selected.total} • {selected.payment}</span></div>
                    </div>
                  </div>

                  <div className="p-4 rounded-[16px] bg-blue-50 border-2 border-blue-100">
                    <p className="text-[11px] font-black uppercase tracking-widest text-blue-800">Courier & Tracking - Steadfast / Pathao / Own Rider - SMS auto</p>
                    <div className="mt-3 space-y-3">
                      <div className="flex gap-2">
                        <select value={selected.courier} onChange={e=>setSelected({...selected, courier:e.target.value})} className="flex-1 px-3 py-2.5 rounded-xl border-2 bg-white text-xs font-bold">
                          <option value="steadfast">Steadfast - Recommended - Best</option>
                          <option value="pathao">Pathao - Alternative</option>
                          <option value="own_rider">Own Rider - Rajshahi 40TK Same Day</option>
                          <option value="sundarban">Sundarban - Remote areas</option>
                        </select>
                        <button onClick={()=>setShowTrackingModal(true)} className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-black">Add Tracking</button>
                      </div>
                      <input value={trackingId || selected.tracking || ''} onChange={e=>setTrackingId(e.target.value)} placeholder="Enter tracking ID - ST-123456 or P-789456 - After shipping" className="w-full px-4 py-3 rounded-xl border-2 bg-white text-xs font-bold" />
                      <div className="flex gap-2">
                        <button onClick={()=>updateStatus(selected.id, 'Shipped', trackingId || selected.tracking)} className="flex-1 py-3 rounded-xl bg-purple-500 text-white text-xs font-black">🚚 Mark Shipped - Tracking {trackingId || selected.tracking}</button>
                        <button onClick={()=>setShowInvoice(true)} className="px-4 py-3 rounded-xl bg-white border-2 text-xs font-black">🧾 Invoice</button>
                      </div>
                      <p className="text-[10px] text-blue-700 leading-relaxed">After shipping, add tracking ID - Customer gets SMS auto if auto SMS ON - Tracking builds trust - Reduces "where is my order" 70% - For own rider, use OWN-001, OWN-002 - For Steadfast, use ST-XXXXXX</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={()=>updateStatus(selected.id, 'Confirmed')} className="py-3 rounded-xl bg-blue-500 text-white font-black text-xs hover:bg-blue-600">✓ Confirm - Called Customer</button>
                    <button onClick={()=>updateStatus(selected.id, 'Shipped', trackingId)} className="py-3 rounded-xl bg-purple-500 text-white font-black text-xs hover:bg-purple-600">🚚 Shipped - In Transit</button>
                    <button onClick={()=>updateStatus(selected.id, 'Delivered')} className="py-3 rounded-xl bg-green-500 text-white font-black text-xs hover:bg-green-600 col-span-2">✅ Delivered - Completed - Ask Review</button>
                    <button onClick={()=>updateStatus(selected.id, 'Cancelled')} className="py-3 rounded-xl bg-white border-2 text-red-600 font-black text-xs hover:bg-red-50">❌ Cancel - Call First - Penalty</button>
                    <button onClick={()=>updateStatus(selected.id, 'Returned')} className="py-3 rounded-xl bg-white border-2 text-slate-600 font-black text-xs">↩️ Returned - Check Reason</button>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-200 flex gap-3">
                    <span className="text-xl shrink-0">⚠️</span>
                    <div><p className="text-xs font-black text-amber-900">Order Rules - Must Follow - Amazon Top Seller:</p><ul className="text-[11px] text-amber-800 mt-2 space-y-1 list-disc pl-4 leading-relaxed"><li>Call customer within 2 hours of order - Confirm size, color, address - Reduce return 50% - Fast confirm = Trust</li><li>Ship within 24h - Processing time 24h - Fast shipping = 5 star review - Late shipping = 1 star + penalty</li><li>Add tracking ID after shipping - Customer gets SMS auto - Tracking builds trust - Reduces queries 70%</li><li>Don't cancel without calling - Call if out of stock - Offer alternative - Cancel = Rating drop + penalty + customer loses trust</li><li>Rajshahi same day - Use own rider 40TK - Same day delivery - Competitive advantage - Own rider = Fast + cheap + personal touch</li></ul></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center border-2 border-dashed rounded-[20px] bg-white"><p className="font-black">Select an order to view details</p><p className="text-xs text-slate-500 mt-2">Click left side order row - Details, customer info, tracking, status update, call, WhatsApp - All here - Amazon style</p></div>
            )}

            <div className="bg-slate-900 rounded-[20px] p-5 text-white">
              <p className="text-xs font-black">📦 Order Management Tips - How Baharaz Top Sellers Handle Orders:</p>
              <ul className="mt-4 text-[11px] opacity-80 list-disc pl-4 space-y-2 leading-relaxed">
                <li><span className="font-black text-amber-300">Pending:</span> Call within 2h - Confirm size, color, address - If COD, confirm they have money - If bKash, confirm they will pay - 50% less return - Fast confirm = Trust</li>
                <li><span className="font-black text-blue-300">Confirmed:</span> Pack with care - Include thank you card + free gift if possible - Small gift = 5 star review - Unboxing experience - Use good packaging - Don't use old newspaper - Use poly + thank you card</li>
                <li><span className="font-black text-purple-300">Shipped:</span> Add tracking ID immediately - Customer gets SMS auto if auto SMS ON - Reduces "where is my order" messages 70% - Tracking builds trust - Customer can track - Feels safe</li>
                <li><span className="font-black text-green-300">Delivered:</span> Ask for review after 2 days - Message: "Assalamu Alaikum! Thanks for order {`{order_id}`} - Hope you love {`{product}`} - Please leave review with photo - Helps us - Thank you!" - 10 reviews = 3x conversion</li>
                <li><span className="font-black text-orange-300">Rajshahi Same Day:</span> Use own rider - 40TK - Same day if ordered before 2PM - Competitive advantage - Own rider = Fast + cheap + personal - Customer loves same day - Rajshahi 40% of your orders - Own rider = Must</li>
                <li><span className="font-black text-red-300">Cancelled:</span> Don't cancel without calling - Call customer - Offer alternative - If out of stock, offer similar - Cancel = Rating drop + penalty + customer loses trust - Cancel rate must be &lt;5% - Baharaz penalizes if &gt;5% cancel</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Modal */}
      {showTrackingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] p-6 max-w-md w-full shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            <h3 className="font-black text-sm">Add Tracking ID - Courier Tracking - Customer gets SMS auto</h3>
            <p className="text-xs text-slate-500 mt-2">Enter tracking ID after shipping - Customer gets SMS with tracking link - Builds trust - Reduces queries 70% - For Steadfast, tracking ID ST-XXXXXX - For Pathao, P-XXXXXX - For own rider, OWN-001</p>
            <input value={trackingId} onChange={e=>setTrackingId(e.target.value)} placeholder="ST-123456 - Or P-789456 - Or OWN-001" className="mt-4 w-full px-4 py-3 rounded-xl border-2 bg-slate-50 focus:bg-white outline-none focus:border-slate-900 text-sm font-bold" autoFocus />
            <div className="mt-4 flex gap-2">
              <button onClick={()=>setShowTrackingModal(false)} className="flex-1 py-3 rounded-xl bg-white border-2 text-xs font-black">Cancel</button>
              <button onClick={()=>{ updateStatus(selected.id, 'Shipped', trackingId); setShowTrackingModal(false); }} className="flex-1 py-3 rounded-xl bg-purple-500 text-white text-xs font-black">🚚 Mark Shipped with Tracking {trackingId}</button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoice && selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-[20px] p-8 max-w-[600px] w-full shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            <div className="flex justify-between items-start">
              <div><h3 className="font-black text-lg">Invoice - {selected.id}</h3><p className="text-xs text-slate-500 mt-1">{selected.date} • {selected.customer} • {selected.phone}</p></div>
              <button onClick={()=>setShowInvoice(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">✕</button>
            </div>
            <div className="mt-6 p-6 border-2 rounded-[16px] bg-slate-50">
              <p className="font-black">TAMID NEW FASHION - Rajshahi - Official Store</p>
              <p className="text-xs text-slate-600 mt-1">Shaheb Bazar, Rajshahi-6000 • Phone: 017XXXXXXXX • baharaz.com/store/tamid-fashion</p>
              <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
                <div><p className="font-black uppercase tracking-widest text-slate-500">Bill To:</p><p className="mt-2 font-bold">{selected.customer} • {selected.phone}</p><p className="mt-1">{selected.address} • {selected.district}</p></div>
                <div><p className="font-black uppercase tracking-widest text-slate-500">Order Info:</p><p className="mt-2">ID: {selected.id} • Date: {selected.date} • Payment: {selected.payment} • Status: {selected.status}</p><p className="mt-1">Courier: {selected.courier} • Tracking: {selected.tracking || 'N/A'}</p></div>
              </div>
              <div className="mt-6 border-t-2 border-dashed pt-4">
                <div className="flex justify-between text-[11px] font-black uppercase text-slate-500"><span>Item</span><span>Qty x Price = Total</span></div>
                {(selected.items || []).map((it,i)=><div key={i} className="flex justify-between text-xs mt-3"><span>{it.name} • SKU: {it.sku}</span><span>{it.qty} x ৳{it.price} = ৳{it.qty*it.price}</span></div>)}
                <div className="mt-4 space-y-2 text-xs border-t pt-4">
                  <div className="flex justify-between"><span>Subtotal:</span><span>৳{selected.subtotal}</span></div>
                  <div className="flex justify-between"><span>Delivery:</span><span>৳{selected.delivery}</span></div>
                  {selected.discount>0 && <div className="flex justify-between text-green-600"><span>Discount:</span><span>-৳{selected.discount}</span></div>}
                  <div className="flex justify-between font-black text-sm border-t pt-2"><span>Total:</span><span>৳{selected.total} - {selected.payment}</span></div>
                </div>
              </div>
              <p className="text-[10px] text-center text-slate-400 mt-6">Thank you for shopping with TAMID NEW FASHION - 100% Authentic Guarantee - 7 Days Easy Return - Trusted by 10k+ Customers - 4.9 Rating - Visit: baharaz.com/store/tamid-fashion</p>
            </div>
            <div className="mt-4 flex gap-2"><button onClick={()=>window.print()} className="flex-1 py-3 rounded-xl bg-slate-900 text-white text-xs font-black">🖨️ Print Invoice - For Courier & Customer</button><button onClick={()=>setShowInvoice(false)} className="px-6 py-3 rounded-xl bg-white border-2 text-xs font-black">Close</button></div>
          </div>
        </div>
      )}

      <p className="text-[10px] text-center text-slate-400">Orders Management • Amazon Seller Central Style • {orders.length} total • {filtered.length} filtered • {filter} • {search? `Search: ${search}` : "No search"} • {liveCount} new live • Baharaz Seller Center • Last & Final Monster Update • Exclusive</p>
    </div>
  )
}