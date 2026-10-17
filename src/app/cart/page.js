'use client'
import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const DELIVERY_CHARGES = {
  Rajshahi: 55, Dhaka: 80, Chittagong: 100, Khulna: 80, Sylhet: 100, Barisal: 95, Rangpur: 60, Mymensingh: 85, Bogura: 60, Comilla: 90, Natore: 60, Pabna: 65, Sirajganj: 70, Gazipur: 80, Tangail: 85, Jessore: 75
}

export default function CartPage(){
  const [cart,setCart]=useState([])
  const [selectedIds,setSelectedIds]=useState([])
  const [coupon,setCoupon]=useState('')
  const [discount,setDiscount]=useState(0)
  const [showCouponDrawer,setShowCouponDrawer]=useState(false)
  const [deliveryLocation,setDeliveryLocation]=useState('Rajshahi')
  const [saveForLater,setSaveForLater]=useState([])
  const [isGift,setIsGift]=useState(false)
  const router = useRouter()
  const deliveryFeeBase = DELIVERY_CHARGES[deliveryLocation] || 55

  useEffect(()=>{
    const savedLoc = localStorage.getItem('baharaz-delivery-loc')
    if(savedLoc) setDeliveryLocation(savedLoc)
    const loadCart = ()=>{
      const c = JSON.parse(localStorage.getItem('baharaz_cart')||'[]')
      const withSel = c.map((item,idx)=>({...item, cartId: `${item.id}-${item.color||'n'}-${item.size||'n'}-${idx}`, stock: item.stock || 100 }))
      setCart(withSel)
      setSelectedIds(withSel.map(i=>i.cartId))
    }
    loadCart()
    const later = JSON.parse(localStorage.getItem('baharaz_save_later')||'[]')
    setSaveForLater(later)

    // === FIX: Order করার পর Cart Clear হলে এই Page ও Clear হবে ===
    const handleCartUpdate = ()=>{
      const c = JSON.parse(localStorage.getItem('baharaz_cart')||'[]')
      if(c.length===0){
        setCart([])
        setSelectedIds([])
      } else {
        const withSel = c.map((item,idx)=>({...item, cartId: `${item.id}-${item.color||'n'}-${item.size||'n'}-${idx}`, stock: item.stock || 100 }))
        setCart(withSel)
      }
    }
    const handleCleared = ()=>{
      setCart([])
      setSelectedIds([])
    }
    window.addEventListener('cartUpdated', handleCartUpdate)
    window.addEventListener('cart-cleared', handleCleared)
    window.addEventListener('storage', handleCartUpdate)
    return ()=>{
      window.removeEventListener('cartUpdated', handleCartUpdate)
      window.removeEventListener('cart-cleared', handleCleared)
      window.removeEventListener('storage', handleCartUpdate)
    }
  },[])

  const saveCart = (newCart)=>{
    setCart(newCart)
    localStorage.setItem('baharaz_cart', JSON.stringify(newCart.map(({cartId,...rest})=>rest)))
    // Header Count Update
    localStorage.setItem('cart', JSON.stringify(newCart.map(({cartId,...rest})=>rest)))
    localStorage.setItem('eRajCart', JSON.stringify(newCart.map(({cartId,...rest})=>rest)))
    window.dispatchEvent(new Event('cartUpdated'))
    window.dispatchEvent(new Event('storage'))
  }
  const updateQty = (cartId, newQty)=>{
    if(newQty<1) return
    const item = cart.find(i=>i.cartId===cartId)
    if(item && newQty > item.stock){ alert(`Only ${item.stock} in stock!`); return }
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
    window.dispatchEvent(new Event('wishlistUpdated'))
    removeItem(item.cartId)
    alert('Moved to Wishlist ❤️')
  }
  const moveToSaveLater = (item)=>{
    const later = [...saveForLater, item]
    setSaveForLater(later)
    localStorage.setItem('baharaz_save_later', JSON.stringify(later))
    removeItem(item.cartId)
  }
  const moveToCartFromLater = (cartId)=>{
    const item = saveForLater.find(i=>i.cartId===cartId)
    if(item){
      saveCart([...cart, item])
      const newLater = saveForLater.filter(i=>i.cartId!==cartId)
      setSaveForLater(newLater)
      localStorage.setItem('baharaz_save_later', JSON.stringify(newLater))
      setSelectedIds(prev=>[...prev, item.cartId])
    }
  }
  const toggleSelect = (cartId)=> setSelectedIds(prev=> prev.includes(cartId)? prev.filter(id=>id!==cartId) : [...prev,cartId])
  const toggleSelectAll = ()=>{
    if(selectedIds.length===cart.length) setSelectedIds([])
    else setSelectedIds(cart.map(i=>i.cartId))
  }
  const groupedBySeller = useMemo(()=>{
    const groups = {}
    cart.forEach(item=>{
      const seller = item.seller_name || item.shop_name || item.store_name || 'Baharaz Mall Official Store'
      if(!groups[seller]) groups[seller]=[]
      groups[seller].push(item)
    })
    return groups
  },[cart])

  const selectedItems = cart.filter(i=>selectedIds.includes(i.cartId))
  const subtotal = selectedItems.reduce((s,i)=>s+i.price*i.qty,0)
  const deliveryFee = selectedItems.length>0? deliveryFeeBase : 0
  const total = subtotal + deliveryFee - discount
  const freeDeliveryThreshold = 2000
  const freeDeliveryRemaining = Math.max(0, freeDeliveryThreshold - subtotal)
  const freeDeliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100)
  const deliveryDate = useMemo(()=> new Date(Date.now()+2*86400000).toLocaleDateString('en-GB', { day:'2-digit', month:'short' }),[])

  const applyCoupon = ()=>{
    const code = coupon.toUpperCase().trim()
    if(code==='BAHARAZ100'){ setDiscount(100); alert('Coupon Applied! ৳100 OFF ✅'); setShowCouponDrawer(false) }
    else if(code==='FREEDEL'){ setDiscount(deliveryFee); alert('Free Delivery Applied! 🚚'); setShowCouponDrawer(false) }
    else if(code==='NEW50'){ setDiscount(50); alert('৳50 OFF Applied!'); setShowCouponDrawer(false) }
    else if(code===''){ alert('Enter Coupon Code!'); }
    else { alert('Invalid Coupon! Try BAHARAZ100 / FREEDEL / NEW50'); setDiscount(0) }
  }
  const handleCheckout = ()=>{
    if(selectedItems.length===0){ alert('Select at least 1 item!'); return }
    localStorage.setItem('baharaz_checkout_items', JSON.stringify(selectedItems))
    localStorage.setItem('baharaz_checkout_summary', JSON.stringify({ subtotal, deliveryFee, discount, total, deliveryLocation, isGift }))
    router.push('/checkout')
  }
  const changeLocation = (loc)=>{
    setDeliveryLocation(loc)
    localStorage.setItem('baharaz-delivery-loc', loc)
  }

  if(cart.length===0 && saveForLater.length===0) return (
    <div className="bg-[#f5f5f7] min-h-[70vh] pt-4">
      <div className="max-w-[1320px] mx-auto bg-white mt-0 lg:rounded-2xl p-10 lg:p-16 text-center shadow-sm border">
        <div className="text-[80px]">🛒</div>
        <p className="font-black text-[20px] mt-4">Your Cart is Empty!</p>
        <p className="text-[13px] text-[#757575] mt-2">Look like you haven't added anything to your cart. Go ahead & explore top categories.</p>
        <Link href="/" className="mt-6 inline-block bg-[#f85606] hover:bg-[#e04e05] text-white px-8 py-3 rounded-xl font-bold text-[14px] shadow">Continue Shopping</Link>
        <div className="mt-10 grid grid-cols-3 lg:grid-cols-6 gap-3 max-w-[600px] mx-auto text-[12px]">
          <Link href="/category/electronics" className="border p-3 rounded-xl hover:border-black">📱 Electronics</Link>
          <Link href="/category/fashion" className="border p-3 rounded-xl hover:border-black">👗 Fashion</Link>
          <Link href="/category/home" className="border p-3 rounded-xl hover:border-black">🏠 Home</Link>
          <Link href="/category/beauty" className="border p-3 rounded-xl hover:border-black">💄 Beauty</Link>
          <Link href="/search?category=groceries" className="border p-3 rounded-xl hover:border-black">🛍️ Groceries</Link>
          <Link href="/category/sports" className="border p-3 rounded-xl hover:border-black">⚽ Sports</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-[#f5f5f7] min-h-screen pb-[80px] lg:pb-6">
      <div className="h-[12px]"></div>
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">
        <div className="bg-white lg:rounded-2xl shadow-sm border">
          {selectedItems.length>0 && freeDeliveryRemaining>0 && (
            <div className="bg-[#fff8e1] border-b px-5 py-3.5 flex items-center gap-3 lg:rounded-t-2xl sticky top-[145px] z-[30]">
              <span className="text-[14px]">🚚</span>
              <div className="flex-1">
                <p className="text-[13px] font-bold">Add ৳{freeDeliveryRemaining.toLocaleString()} more for <span className="text-[#00a650]">FREE Delivery!</span></p>
                <div className="w-full h-[5px] bg-[#ffe082] rounded-full mt-1.5 overflow-hidden"><div className="h-full bg-[#00a650] rounded-full transition-all" style={{ width: `${freeDeliveryProgress}%` }}></div></div>
              </div>
            </div>
          )}
          {selectedItems.length>0 && freeDeliveryRemaining===0 && (
            <div className="bg-[#e8f5e9] border-b px-5 py-3.5 text-[13px] font-bold text-[#2e7d32] lg:rounded-t-2xl sticky top-[145px] z-[30]">🎉 Congratulations! You got FREE Delivery!</div>
          )}

          <div className="flex items-center justify-between px-5 py-4 border-b bg-white sticky top-[190px] z-[20] shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <label className="flex items-center gap-2.5 text-[14px] font-bold cursor-pointer select-none">
              <input type="checkbox" checked={selectedIds.length===cart.length && cart.length>0} onChange={toggleSelectAll} className="w-[20px] h-[20px] accent-[#f85606] rounded" />
              SELECT ALL ({cart.length} ITEMS)
            </label>
            <div className="flex items-center gap-3">
              <select value={deliveryLocation} onChange={e=>changeLocation(e.target.value)} className="text-[12px] border-2 rounded-full px-4 py-2 bg-[#f5f7ff] font-bold outline-none focus:border-black">
                {Object.keys(DELIVERY_CHARGES).map(loc=><option key={loc} value={loc}>{loc} - ৳{DELIVERY_CHARGES[loc]}</option>)}
              </select>
              <button onClick={()=>{ if(confirm('Delete all items?')){ saveCart([]); setSelectedIds([]) } }} className="text-[13px] text-[#9e9e9e] hover:text-red-600 font-bold flex items-center gap-1">🗑️ DELETE</button>
            </div>
          </div>

          {Object.entries(groupedBySeller).map(([sellerName, items])=>(
            <div key={sellerName} className="border-b last:border-0">
              <div className="flex items-center gap-2.5 px-5 py-4 bg-[#fafafa] text-[13px] font-bold sticky top-[250px] z-[10] border-b border-t shadow-sm"><span className="w-6 h-6 bg-[#f85606] text-white rounded-full flex items-center justify-center text-[11px]">M</span>{sellerName} <Link href={`/store/${sellerName}`} className="text-[#1a9cb7] font-normal ml-2 hover:underline">Visit Store ›</Link><span className="ml-auto text-[11px] bg-[#e3f2fd] text-[#1565c0] px-2.5 py-1 rounded-full">{items.length} Items</span></div>
              {items.map(item=>(
                <div key={item.cartId} className="flex gap-4 px-5 py-5 border-t hover:bg-[#fafafa] group">
                  <input type="checkbox" checked={selectedIds.includes(item.cartId)} onChange={()=>toggleSelect(item.cartId)} className="w-[20px] h-[20px] accent-[#f85606] mt-2 shrink-0" />
                  <Link href={`/product/${item.slug||item.id}`} className="w-[90px] h-[90px] bg-[#fafafa] rounded-xl overflow-hidden relative flex-shrink-0 border"><Image src={item.image} alt={item.title} fill className="object-contain p-2 group-hover:scale-105 transition" unoptimized /></Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.slug||item.id}`} className="text-[14px] line-clamp-2 leading-[20px] hover:text-[#1a9cb7] hover:underline font-medium">{item.title}</Link>
                    <p className="text-[12px] text-[#757575] mt-1.5 truncate">Color: {item.color||'Default'}, Size: {item.size||'Free Size'} <span className="text-[#1a9cb7] ml-2 hidden lg:inline">✏️ Edit</span></p>
                    <div className="flex items-center gap-3 mt-2">
                      <button onClick={()=>moveToWishlist(item)} className="text-[12px] text-[#757575] hover:text-[#f85606] font-medium">❤️ Wishlist</button>
                      <span className="text-[11px] text-[#e0e0e0]">|</span>
                      <button onClick={()=>moveToSaveLater(item)} className="text-[12px] text-[#757575] hover:text-black font-medium">Save for Later</button>
                      <span className="text-[11px] text-[#e0e0e0]">|</span>
                      <button onClick={()=>removeItem(item.cartId)} className="text-[12px] text-[#757575] hover:text-red-600 font-medium">🗑️ Remove</button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2"><span className="text-[#f85606] font-black text-[18px]">৳{Number(item.price).toLocaleString()}</span><span className="text-[12px] line-through text-[#9e9e9e]">৳{(Number(item.price)+500).toLocaleString()}</span><span className="bg-[#f85606] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">-{Math.round(500/(item.price+500)*100)}%</span></div>
                      <div className="flex items-center border-2 rounded-xl overflow-hidden h-[36px]">
                        <button onClick={()=>updateQty(item.cartId, item.qty-1)} className="w-9 h-full hover:bg-gray-100 text-[18px] flex items-center justify-center font-bold">-</button>
                        <span className="w-10 text-center text-[13px] font-bold border-x-2 h-full flex items-center justify-center bg-white">{item.qty}</span>
                        <button onClick={()=>updateQty(item.cartId, item.qty+1)} className="w-9 h-full hover:bg-gray-100 text-[18px] flex items-center justify-center font-bold">+</button>
                      </div>
                    </div>
                    {item.stock < 10 && <p className="text-[11px] text-red-600 mt-2 font-bold">Only {item.stock} left in stock! - Order Soon</p>}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {saveForLater.length>0 && (
            <div className="bg-[#f9f9f9] border-t">
              <div className="p-4 font-black text-[14px]">Saved for Later ({saveForLater.length})</div>
              {saveForLater.map(item=>(
                <div key={`later-${item.cartId}`} className="flex gap-4 p-4 border-t bg-white">
                  <div className="w-[70px] h-[70px] bg-[#fafafa] rounded-xl overflow-hidden relative flex-shrink-0"><Image src={item.image} alt={item.title} fill className="object-contain p-2" unoptimized /></div>
                  <div className="flex-1"><p className="text-[13px] line-clamp-1 font-medium">{item.title}</p><p className="text-[#f85606] font-black text-[14px] mt-1">৳{item.price}</p><button onClick={()=>moveToCartFromLater(item.cartId)} className="text-[12px] text-white bg-black px-4 py-1.5 rounded-full mt-2 font-bold hover:bg-gray-800">Move to Cart</button></div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-0 lg:px-0 space-y-4">
          <div className="bg-white lg:rounded-2xl p-5 shadow-sm border sticky top-[155px] z-[15]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-[16px]">Order Summary</h3>
              <button onClick={()=>setShowCouponDrawer(true)} className="text-[12px] text-[#1a9cb7] border-2 border-[#1a9cb7] px-4 py-1.5 rounded-full hover:bg-[#e3f2fd] font-bold">Apply Voucher ›</button>
            </div>
            <div className="space-y-3 text-[13px]">
              <div className="flex justify-between"><span className="text-[#757575]">Subtotal ({selectedIds.length} items)</span><span className="font-bold">৳{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-[#757575]">Delivery Fee ({deliveryLocation})</span><span>৳{deliveryFee}</span></div>
              {discount>0 && <div className="flex justify-between text-[#2e7d32] font-bold"><span>Voucher Discount</span><span>-৳{discount}</span></div>}
              <div className="flex justify-between items-center pt-4 border-t border-dashed">
                <div><p className="font-black text-[16px]">Total</p><p className="text-[11px] text-[#9e9e9e]">VAT included (where applicable)</p></div>
                <span className="text-[#f85606] font-black text-[22px]">৳{total.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-4 bg-[#fafafa] border rounded-xl p-3.5 flex items-center gap-2.5">
              <input type="checkbox" checked={isGift} onChange={e=>setIsGift(e.target.checked)} className="w-5 h-5 accent-[#f85606]" />
              <div><p className="text-[13px] font-bold">🎁 This is a gift</p><p className="text-[11px] text-[#666]">Add gift wrap + message at checkout</p></div>
            </div>
            <button onClick={handleCheckout} disabled={selectedIds.length===0} className="w-full mt-5 h-[50px] bg-[#f85606] disabled:bg-[#e0e0e0] disabled:text-[#9e9e9e] text-white font-black rounded-xl hover:bg-[#e04e05] transition text-[15px] shadow-lg">Proceed to Checkout ({selectedIds.length})</button>
            <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-[#757575]"><span>🔒</span> Secure Checkout <span className="mx-1">•</span> <span>100% Authentic</span></div>
            <div className="mt-4 bg-[#f5f5f5] p-3.5 rounded-xl text-[12px] border">
              <p className="font-bold flex items-center gap-1">📍 Delivery to {deliveryLocation} • Estimated by {deliveryDate}</p>
              <p className="text-[#757575] mt-1.5">Delivery Charge ৳{deliveryFeeBase} • Cash on Delivery Available • 14 Days Free Return</p>
            </div>
          </div>

          <div className="bg-white lg:rounded-2xl p-5 shadow-sm border hidden lg:block">
            <p className="font-bold text-[13px] mb-3">Accepted Payment Methods</p>
            <div className="flex gap-2 text-[22px]">💳 🏦 📱 💵</div>
            <p className="text-[11px] text-[#757575] mt-2">bKash • Nagad • Rocket • Cards • Cash on Delivery</p>
            <div className="mt-4 pt-4 border-t flex gap-3 text-[11px] text-[#666]"><span>✓ 100% Secure</span><span>✓ Buyer Protection</span></div>
          </div>
        </div>
      </div>

      {showCouponDrawer && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-end lg:items-center justify-center p-0 lg:p-4" onClick={()=>setShowCouponDrawer(false)}>
          <div className="bg-white w-full lg:w-[420px] rounded-t-[16px] lg:rounded-2xl p-5 animate-slide-up max-h-[85vh] overflow-auto shadow-2xl" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h3 className="font-black text-[16px]">Apply Voucher</h3><button onClick={()=>setShowCouponDrawer(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">✕</button></div>
            <div className="flex gap-2"><input value={coupon} onChange={e=>setCoupon(e.target.value)} placeholder="Enter Promo Code" className="flex-1 border-2 p-3 rounded-xl text-[13px] uppercase outline-none focus:border-black font-bold" /><button onClick={applyCoupon} className="bg-[#f85606] text-white px-6 rounded-xl font-black text-[13px]">APPLY</button></div>
            <div className="mt-5 space-y-3">
              <p className="text-[12px] font-black">Available Vouchers:</p>
              <div className="border-2 border-dashed border-[#f85606]/30 p-3 rounded-xl flex justify-between items-center bg-[#fff8f5]"><div><p className="font-black text-[13px]">BAHARAZ100 - ৳100 OFF</p><p className="text-[10px] text-[#757575]">Min order ৳500 • New Users</p></div><button onClick={()=>{setCoupon('BAHARAZ100');}} className="text-[#f85606] font-black border border-[#f85606] px-3 py-1 rounded-full text-[11px]">APPLY</button></div>
              <div className="border-2 border-dashed border-green-200 p-3 rounded-xl flex justify-between items-center bg-[#f6fff6]"><div><p className="font-black text-[13px]">FREEDEL - Free Delivery</p><p className="text-[10px] text-[#757575]">Free delivery up to ৳100</p></div><button onClick={()=>{setCoupon('FREEDEL');}} className="text-green-700 font-black border border-green-600 px-3 py-1 rounded-full text-[11px]">APPLY</button></div>
              <div className="border-2 border-dashed p-3 rounded-xl flex justify-between items-center"><div><p className="font-black text-[13px]">NEW50 - ৳50 OFF</p><p className="text-[10px] text-[#757575]">For all users</p></div><button onClick={()=>{setCoupon('NEW50');}} className="text-black font-black border border-black px-3 py-1 rounded-full text-[11px]">APPLY</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}