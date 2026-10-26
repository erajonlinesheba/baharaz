'use client'
import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Price String হলেও Number বানাবে - NaN Fix
const getPrice = (p) => {
  if (typeof p === 'number') return p
  if (!p) return 0
  const num = Number(String(p).replace(/[^0-9.]/g, ''))
  return isNaN(num) ? 0 : num
}

export default function CartPage(){
  const [cart,setCart]=useState([])
  const [selectedIds,setSelectedIds]=useState([])
  const [coupon,setCoupon]=useState('')
  const [discount,setDiscount]=useState(0)
  const [deliveryLocation,setDeliveryLocation]=useState('Rajshahi')
  const [deliveryCharges,setDeliveryCharges]=useState({}) // Admin থেকে আসবে
  const [saveForLater,setSaveForLater]=useState([])
  const router = useRouter()

  // ✅ Admin Delivery Charge Load
  useEffect(()=>{
    const fetchAdminDelivery = async () => {
      try {
        // তোমার supabase client path অনুযায়ী change করো
        const { supabase } = await import('@/lib/supabaseClient').catch(async()=>{
          const mod = await import('@/lib/supabase/client')
          return { supabase: mod.createClient() }
        })
        
        let chargesData = null
        
        // 1. চেষ্টা করবে delivery_settings table থেকে
        let res = await supabase.from('delivery_settings').select('location, charge, district, price')
        if(res.data && res.data.length > 0){
          chargesData = res.data
        } else {
          // 2. চেষ্টা করবে shipping_settings / settings table থেকে
          const res2 = await supabase.from('shipping_settings').select('*')
          if(res2.data && res2.data.length > 0) chargesData = res2.data
          else {
            const res3 = await supabase.from('settings').select('delivery_charges, shipping_fee').limit(1).single()
            if(res3.data?.delivery_charges) {
              setDeliveryCharges(res3.data.delivery_charges)
              return
            }
          }
        }

        if(chargesData && chargesData.length > 0){
          const obj = {}
          chargesData.forEach(row => {
            const loc = row.location || row.district
            const charge = row.charge ?? row.price ?? row.fee
            if(loc && charge != null) obj[loc] = Number(charge)
          })
          if(Object.keys(obj).length > 0) setDeliveryCharges(obj)
        }
      } catch(err){
        console.log('Admin charge load fail, fallback use', err)
      } finally {
        // Fallback যদি Admin Table খালি থাকে
        setDeliveryCharges(prev => Object.keys(prev).length > 0 ? prev : {
          Rajshahi: 55, Dhaka: 80, Chittagong: 100, Khulna: 80, Sylhet: 100, 
          Barisal: 95, Rangpur: 60, Mymensingh: 85, Bogura: 60, Comilla: 90, 
          Natore: 60, Pabna: 65, Sirajganj: 70, Gazipur: 80, Tangail: 85, Jessore: 75
        })
      }
    }
    
    fetchAdminDelivery()

    const savedLoc = localStorage.getItem('baharaz-delivery-loc')
    if(savedLoc) setDeliveryLocation(savedLoc)

    const loadCart = ()=>{
      const c = JSON.parse(localStorage.getItem('baharaz_cart')||'[]')
      const withSel = c.map((item,idx)=>({...item, cartId: `${item.id}-${item.color||'n'}-${item.size||'n'}-${idx}`, stock: item.stock || 100, qty: item.qty || 1 }))
      setCart(withSel)
      setSelectedIds(withSel.map(i=>i.cartId))
    }
    loadCart()
    setSaveForLater(JSON.parse(localStorage.getItem('baharaz_save_later')||'[]'))

    const handleCartUpdate = ()=>{
      const c = JSON.parse(localStorage.getItem('baharaz_cart')||'[]')
      if(c.length===0){ setCart([]); setSelectedIds([]) } else {
        setCart(c.map((item,idx)=>({...item, cartId: `${item.id}-${item.color||'n'}-${item.size||'n'}-${idx}`, stock: item.stock || 100, qty: item.qty || 1 })))
      }
    }
    window.addEventListener('cartUpdated', handleCartUpdate)
    window.addEventListener('cart-cleared', ()=>{ setCart([]); setSelectedIds([]) })
    return ()=> window.removeEventListener('cartUpdated', handleCartUpdate)
  },[])

  const deliveryFeeBase = deliveryCharges[deliveryLocation] || 55

  const saveCart = (newCart)=>{
    setCart(newCart)
    const clean = newCart.map(({cartId,...rest})=>rest)
    localStorage.setItem('baharaz_cart', JSON.stringify(clean))
    localStorage.setItem('cart', JSON.stringify(clean))
    window.dispatchEvent(new Event('cartUpdated'))
  }
  const updateQty = (cartId, newQty)=>{
    if(newQty<1) return
    const item = cart.find(i=>i.cartId===cartId)
    if(item && newQty > item.stock){ alert(`Only ${item.stock} left!`); return }
    saveCart(cart.map(i=> i.cartId===cartId? {...i, qty:newQty} : i))
  }
  const removeItem = (cartId)=>{
    saveCart(cart.filter(i=>i.cartId!==cartId))
    setSelectedIds(prev=>prev.filter(id=>id!==cartId))
  }
  const moveToWishlist = (item)=>{
    const wish = JSON.parse(localStorage.getItem('baharaz_wishlist')||'[]')
    if(!wish.includes(item.id)) wish.push(item.id)
    localStorage.setItem('baharaz_wishlist', JSON.stringify(wish))
    removeItem(item.cartId)
  }
  const moveToSaveLater = (item)=>{
    const later = [...saveForLater, item]
    setSaveForLater(later)
    localStorage.setItem('baharaz_save_later', JSON.stringify(later))
    removeItem(item.cartId)
  }
  const toggleSelect = (cartId)=> setSelectedIds(prev=> prev.includes(cartId)? prev.filter(id=>id!==cartId) : [...prev,cartId])
  const toggleSelectAll = ()=> setSelectedIds(selectedIds.length===cart.length? [] : cart.map(i=>i.cartId))

  const groupedBySeller = useMemo(()=>{
    const groups = {}
    cart.forEach(item=>{
      const seller = item.seller_name || 'Baharaz Mall Official Store'
      if(!groups[seller]) groups[seller]=[]
      groups[seller].push(item)
    })
    return groups
  },[cart])

  const selectedItems = cart.filter(i=>selectedIds.includes(i.cartId))
  const subtotal = selectedItems.reduce((s,i)=>s + getPrice(i.price) * (i.qty||1), 0)
  const deliveryFee = selectedItems.length>0? deliveryFeeBase : 0
  const total = subtotal + deliveryFee - discount

  const handleCheckout = ()=>{
    if(selectedItems.length===0){ alert('Select item!'); return }
    localStorage.setItem('baharaz_checkout_items', JSON.stringify(selectedItems))
    localStorage.setItem('baharaz_checkout_summary', JSON.stringify({ subtotal, deliveryFee, discount, total, deliveryLocation }))
    router.push('/checkout')
  }

  if(cart.length===0) return (
    <div className="bg-[#f5f5f5] min-h-[80vh] flex items-center justify-center">
      <div className="bg-white max-w-[1188px] w-full mx-auto rounded-none lg:rounded-lg p-16 text-center">
        <div className="text-[70px]">🛒</div>
        <p className="font-bold text-[18px] mt-3">Your cart is empty!</p>
        <Link href="/" className="mt-5 inline-block bg-[#f85606] text-white px-8 py-2.5 rounded text-[14px] font-bold">CONTINUE SHOPPING</Link>
      </div>
    </div>
  )

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-[70px] lg:pb-6 w-full">
      <div className="max-w-[1188px] mx-auto lg:pt-4 w-full flex flex-col lg:flex-row gap-4 px-0">

        {/* LEFT - CART ITEMS */}
        <div className="flex-1 bg-white w-full min-w-0">
          <div className="h-[48px] flex items-center justify-between px-3 lg:px-4 border-b bg-white sticky top-0 lg:top-[152px] z-20">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={selectedIds.length===cart.length && cart.length>0} onChange={toggleSelectAll} className="w-[18px] h-[18px] accent-[#f85606]" />
              <span className="text-[12px] font-medium tracking-wide">SELECT ALL ({cart.length} ITEMS)</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-[12px] border px-2 py-1 rounded">
                <select value={deliveryLocation} onChange={e=>{setDeliveryLocation(e.target.value); localStorage.setItem('baharaz-delivery-loc', e.target.value)}} className="bg-transparent outline-none text-[12px] font-medium max-w-[140px]">
                  {Object.keys(deliveryCharges).map(loc=><option key={loc} value={loc}>{loc} - ৳{deliveryCharges[loc]}</option>)}
                </select>
              </div>
              <button onClick={()=>{ if(confirm('Delete all?')){ saveCart([]); setSelectedIds([]) } }} className="text-[16px] text-[#9e9e9e]">🗑️</button>
            </div>
          </div>

          {Object.entries(groupedBySeller).map(([sellerName, items])=>(
            <div key={sellerName} className="border-b last:border-0">
              <div className="h-[40px] flex items-center gap-2 px-3 lg:px-4 bg-[#fafafa] border-b sticky top-[48px] lg:top-[200px] z-10">
                <span className="w-[20px] h-[20px] bg-[#f85606] text-white rounded-full flex items-center justify-center text-[10px] font-bold">M</span>
                <span className="text-[12px] font-medium">{sellerName}</span>
                <span className="text-[11px] text-[#1a9cb7] ml-1">Visit ›</span>
                <span className="ml-auto text-[11px] text-[#757575]">{items.length} Items</span>
              </div>

              {items.map(item=>(
                <div key={item.cartId} className="flex gap-2 lg:gap-3 px-3 lg:px-4 py-3 lg:py-4 border-b last:border-0 bg-white">
                  <input type="checkbox" checked={selectedIds.includes(item.cartId)} onChange={()=>toggleSelect(item.cartId)} className="w-[18px] h-[18px] accent-[#f85606] mt-3 shrink-0" />
                  <Link href={`/product/${item.slug||item.id}`} className="w-[80px] h-[80px] bg-white border relative shrink-0">
                    <Image src={item.image} alt={item.title} fill className="object-contain p-1" unoptimized />
                  </Link>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <Link href={`/product/${item.slug||item.id}`} className="text-[12px] lg:text-[13px] leading-[16px] line-clamp-2 text-[#212121] hover:text-[#1a9cb7]">{item.title}</Link>
                    <p className="text-[11px] text-[#757575] mt-1">Color: {item.color||'Default'}, Size: Free Size</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <button onClick={()=>moveToWishlist(item)} className="text-[11px] text-[#9e9e9e]">♡ Wishlist</button>
                      <button onClick={()=>moveToSaveLater(item)} className="text-[11px] text-[#9e9e9e]">Later</button>
                      <button onClick={()=>removeItem(item.cartId)} className="text-[11px] text-[#9e9e9e]">Remove</button>
                    </div>
                    <div className="flex items-end justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <span className="text-[#f85606] text-[14px] lg:text-[16px] font-medium">৳{getPrice(item.price).toLocaleString()}</span>
                        <span className="text-[11px] text-[#9e9e9e] line-through">৳{(getPrice(item.price)+500).toLocaleString()}</span>
                        <span className="bg-[#f85606]/10 text-[#f85606] text-[10px] px-1 rounded">-{Math.round(500/(getPrice(item.price)+500)*100)}%</span>
                      </div>
                      <div className="flex items-center border border-[#e0e0e0] h-[28px] rounded-sm">
                        <button onClick={()=>updateQty(item.cartId, (item.qty||1)-1)} className="w-[28px] h-full text-[14px] bg-[#fafafa]">-</button>
                        <span className="w-[32px] text-center text-[12px] border-x">{item.qty||1}</span>
                        <button onClick={()=>updateQty(item.cartId, (item.qty||1)+1)} className="w-[28px] h-full text-[14px] bg-[#fafafa]">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* RIGHT - ORDER SUMMARY */}
        <div className="w-full lg:w-[318px] shrink-0 px-0 lg:px-0">
          <div className="bg-white border shadow-none lg:sticky lg:top-[160px]">
            <div className="px-4 py-3 border-b">
              <h3 className="text-[14px] font-medium">Order Summary</h3>
              <p className="text-[10px] text-[#1a9cb7] mt-1">* Delivery charge from Admin</p>
            </div>
            <div className="p-4 space-y-2.5 text-[12px]">
              <div className="flex justify-between"><span className="text-[#757575]">Subtotal ({selectedIds.length} items)</span><span>৳{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-[#757575]">Shipping Fee ({deliveryLocation})</span><span className="font-bold">৳{deliveryFee}</span></div>
              {discount>0 && <div className="flex justify-between text-[#00a651]"><span>Discount</span><span>-৳{discount}</span></div>}
              <div className="flex gap-2 pt-2">
                <input value={coupon} onChange={e=>setCoupon(e.target.value)} placeholder="Enter Voucher Code" className="flex-1 border px-2 py-2 text-[12px] outline-none" />
                <button onClick={()=>{
                  if(coupon.toUpperCase()==='BAHARAZ100'){ setDiscount(100); alert('Applied!') }
                  else if(coupon.toUpperCase()==='FREEDEL'){ setDiscount(deliveryFee); alert('Free Delivery!') }
                  else alert('Invalid! Try BAHARAZ100')
                }} className="bg-[#1a9cb7] text-white px-4 text-[12px]">APPLY</button>
              </div>
              <div className="flex justify-between pt-3 border-t mt-3">
                <span className="text-[14px] font-medium">Total</span>
                <span className="text-[#f85606] text-[18px] font-medium">৳{total.toLocaleString()}</span>
              </div>
              <button onClick={handleCheckout} disabled={selectedIds.length===0} className="w-full mt-3 h-[40px] bg-[#f85606] disabled:bg-[#dadada] text-white text-[14px] font-medium rounded-sm">PROCEED TO CHECKOUT ({selectedIds.length})</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}