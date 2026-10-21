'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from "@/lib/supabase/client"

export default function JustForYouPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [priceFilter, setPriceFilter] = useState('all')
  const [toast, setToast] = useState('')
  const [wishlist, setWishlist] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const [quickView, setQuickView] = useState(null)
  const [liveViewers, setLiveViewers] = useState(0)
  const [page, setPage] = useState(1)
  const [mounted, setMounted] = useState(false)
  const supabase = createClient()
  const ITEMS_PER_PAGE = 12

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const getImage = (p) => {
    try {
      if (p.image_url) return p.image_url
      if (Array.isArray(p.images) && p.images[0]) return typeof p.images[0] === 'string' ? p.images[0] : p.images[0]?.url || '/placeholder.png'
      if (typeof p.images === 'string') { const parsed = JSON.parse(p.images); if (Array.isArray(parsed) && parsed[0]) return parsed[0] }
      return '/placeholder.png'
    } catch { return p.image_url || '/placeholder.png' }
  }

  // FIXED: Stable value from ID, no Math.random() - Hydration Safe
  const stableNumber = (id, min, max) => {
    const code = String(id).split('').reduce((a,c)=> a + c.charCodeAt(0), 0)
    return min + (code % (max - min + 1))
  }

  useEffect(() => {
    setMounted(true)
    setLiveViewers(1847 + Math.floor(Math.random()*100))
    const load = async () => {
      setLoading(true)
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false }).limit(60)
      const formatted = (data || []).map(p => {
        const sNum = stableNumber(p.id, 0, 1000)
        return {
          id: p.id,
          title: p.title || p.name || 'Product',
          price: Number(p.price || 0),
          originalPrice: Number(p.original_price || p.price * 1.4 || 0),
          discount: p.discount_percent || (p.original_price ? Math.round(((Number(p.original_price) - Number(p.price)) / Number(p.original_price)) * 100) : stableNumber(p.id, 10, 45)),
          image: getImage(p),
          slug: p.slug || p.id,
          rating: p.rating || (4 + (sNum % 10)/10).toFixed(1),
          sold: p.sold_count || stableNumber(p.id, 20, 820),
          category: p.category || 'General',
          created_at: p.created_at,
          stock: p.stock ?? stableNumber(p.id, 5, 25),
          free_delivery: Number(p.price) > 500,
          verified: true,
        }
      })
      setProducts(formatted)
      setLoading(false)
      try {
        const wish = JSON.parse(localStorage.getItem('baharaz_wishlist') || '[]')
        setWishlist(wish.map(w => w.id))
        const cart = JSON.parse(localStorage.getItem('baharaz_cart') || '[]')
        setCartCount(cart.reduce((s,c)=> s + (c.quantity||1),0))
      } catch {}
    }
    load()
    const iv = setInterval(() => setLiveViewers(v => Math.max(1200, v + Math.floor(Math.random()*15)-7)), 4000)
    return () => clearInterval(iv)
  }, [])

  const categories = useMemo(() => [...new Set(products.map(p => p.category).filter(Boolean))], [products])

  const filteredSorted = useMemo(() => {
    let list = [...products]
    if (search) list = list.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
    if (categoryFilter !== 'all') list = list.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase())
    if (priceFilter === 'under500') list = list.filter(p => p.price < 500)
    if (priceFilter === '500to1500') list = list.filter(p => p.price >= 500 && p.price <= 1500)
    if (priceFilter === 'over1500') list = list.filter(p => p.price > 1500)
    if (sort === 'price_low') list.sort((a, b) => a.price - b.price)
    if (sort === 'price_high') list.sort((a, b) => b.price - a.price)
    if (sort === 'popular') list.sort((a, b) => b.sold - a.sold)
    if (sort === 'discount') list.sort((a, b) => b.discount - a.discount)
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    return list
  }, [products, search, sort, categoryFilter, priceFilter])

  const visibleProducts = useMemo(() => filteredSorted.slice(0, page * ITEMS_PER_PAGE), [filteredSorted, page])

  const addToCart = (p) => {
    let cart = JSON.parse(localStorage.getItem('baharaz_cart') || '[]')
    const idx = cart.findIndex(c => c.id === p.id)
    if (idx >= 0) cart[idx].quantity += 1
    else cart.push({ id: p.id, name: p.title, price: p.price, image: p.image, quantity: 1 })
    localStorage.setItem('baharaz_cart', JSON.stringify(cart))
    setCartCount(cart.reduce((s,c)=> s + (c.quantity||1),0))
    window.dispatchEvent(new Event('cartUpdated'))
    if (navigator.vibrate) navigator.vibrate(40)
    showToast(`🛒 ${p.title.slice(0,25)}... Added`)
    setQuickView(null)
  }

  const buyNow = (p) => {
    addToCart(p)
    window.location.href = '/cart'
  }

  const toggleWishlist = (p) => {
    let wish = JSON.parse(localStorage.getItem('baharaz_wishlist') || '[]')
    const exists = wish.find(w => w.id === p.id)
    if (exists) wish = wish.filter(w => w.id !== p.id)
    else wish.push(p)
    localStorage.setItem('baharaz_wishlist', JSON.stringify(wish))
    setWishlist(wish.map(w => w.id))
    showToast(exists ? 'Removed from Wishlist' : '❤️ Added to Wishlist')
  }

  if (loading) {
    return (
      <div className="max-w-[1188px] mx-auto bg-[#f5f5f5] min-h-screen">
        <div className="bg-white px-4 h-[48px] flex items-center"><div className="h-4 w-40 bg-[#f0f0f0] animate-pulse rounded"></div></div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 p-3">
          {[1,2,3,4,5,6].map(i => <div key={i} className="bg-white h-[300px] animate-pulse rounded-[12px]"></div>)}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1188px] mx-auto bg-[#f5f5f5] min-h-screen pb-10">
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#212121] text-white px-6 py-3 rounded-full text-[12px] font-bold z-[9999] shadow-2xl animate-bounce border border-white/20">{toast}</div>}

      {quickView && (
        <div className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-3 backdrop-blur-sm" onClick={() => setQuickView(null)}>
          <div className="bg-white rounded-[20px] max-w-[440px] w-full overflow-hidden relative animate-in fade-in zoom-in" onClick={e => e.stopPropagation()}>
            <button onClick={() => setQuickView(null)} className="absolute top-3 right-3 w-9 h-9 bg-black text-white rounded-full z-10 flex items-center justify-center">✕</button>
            <div className="bg-[#fafafa] p-6 flex items-center justify-center">
              <img src={quickView.image} className="w-full h-[280px] object-contain" alt={quickView.title} />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#f85606] text-white text-[10px] font-black px-2 py-1 rounded-full">-{quickView.discount}% OFF</span>
                {quickView.free_delivery && <span className="bg-[#10b981] text-white text-[10px] font-bold px-2 py-1 rounded-full">FREE DELIVERY</span>}
                {quickView.stock < 10 && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">Only {quickView.stock} Left!</span>}
              </div>
              <h3 className="font-bold text-[16px] leading-[20px]">{quickView.title}</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[#faca51] text-[12px]">★★★★★</span>
                <span className="text-[11px] text-[#666]">{quickView.rating} • {quickView.sold} Sold • {quickView.stock} in stock</span>
                <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full">✓ Verified</span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <p className="text-[#f85606] font-black text-[22px]">৳{Number(quickView.price).toLocaleString()}</p>
                <p className="text-[13px] text-[#999] line-through">৳{Number(quickView.originalPrice).toLocaleString()}</p>
                <p className="text-[11px] text-[#00b894] font-bold ml-auto">{quickView.discount}% OFF</p>
              </div>
              <div className="w-full bg-[#f0f0f0] h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-[#f85606]" style={{width: `${Math.min(90, (quickView.sold/1000)*100)}%`}}></div>
              </div>
              <p className="text-[10px] text-[#999] mt-1">{quickView.sold} Sold • Hurry up!</p>
              <div className="grid grid-cols-2 gap-3 mt-5">
                <button onClick={() => addToCart(quickView)} className="bg-[#ffe1d2] text-[#f85606] py-3.5 rounded-full font-black text-[13px] hover:bg-[#f85606] hover:text-white transition">ADD TO CART</button>
                <button onClick={() => buyNow(quickView)} className="bg-[#f85606] text-white py-3.5 rounded-full font-black text-[13px] shadow-lg hover:bg-black transition">BUY NOW</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white px-4 h-[52px] flex items-center justify-between border-b sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2 text-[13px]">
          <Link href="/" className="text-[#666] hover:text-[#f85606]">Home</Link>
          <span className="text-[#999]">/</span>
          <span className="font-black text-[#212121]">Just For You</span>
          {mounted && liveViewers > 0 && <span suppressHydrationWarning className="hidden md:flex ml-2 bg-black text-white text-[10px] px-3 py-1 rounded-full animate-pulse items-center gap-1">🔴 {liveViewers} Live • {filteredSorted.length} Products</span>}
        </div>
        <div className="flex items-center gap-2">
          <Link href="/cart" className="relative bg-[#f5f5f5] px-3 py-1.5 rounded-full text-[11px] font-black flex items-center gap-1">🛒 {cartCount} <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span></Link>
          <span className="hidden md:block text-[11px] bg-[#FFF3E0] text-[#f85606] px-3 py-1.5 rounded-full font-bold">{visibleProducts.length} / {filteredSorted.length}</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#0f0f0f] via-[#212121] to-[#f85606] mx-2 md:mx-0 mt-3 rounded-[16px] p-5 text-white relative overflow-hidden shadow-[0_10px_30px_rgba(248,86,6,0.3)]">
        <div className="absolute -top-10 -right-10 w-[180px] h-[180px] bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-[180px] h-[180px] bg-[#f85606]/30 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/15 backdrop-blur rounded-[14px] flex items-center justify-center text-[28px] border border-white/20">🎯</div>
            <div>
              <h1 className="font-black text-[18px] md:text-[20px]">Just For You • AI Picks</h1>
              <p className="text-[11px] md:text-[12px] opacity-80 mt-1">🔥 {products.length} Products • ⚡ Free Delivery over ৳500 • ❤️ {wishlist.length} Wishlist • 👁️ {mounted ? liveViewers : 1847} viewing now</p>
              <div className="flex gap-2 mt-2">
                <span className="text-[9px] bg-white/20 px-2 py-1 rounded-full border border-white/20">✓ Verified Sellers</span>
                <span className="text-[9px] bg-white/20 px-2 py-1 rounded-full border border-white/20">↩️ 7 Days Return</span>
                <span className="text-[9px] bg-white/20 px-2 py-1 rounded-full border border-white/20">🛡️ Warranty</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Link href="/flash-sale" className="bg-white text-black px-5 py-2.5 rounded-full text-[11px] font-black hover:bg-[#f85606] hover:text-white transition shadow-lg">⚡ FLASH SALE</Link>
          </div>
        </div>
      </div>

      <div className="bg-white mx-2 md:mx-0 mt-3 rounded-[14px] border shadow-sm p-3 sticky top-[52px] z-10 backdrop-blur">
        <div className="flex flex-col lg:flex-row gap-3 justify-between">
          <div className="flex gap-2 overflow-auto scrollbar-hide">
            <button onClick={() => setCategoryFilter('all')} className={`px-4 py-2 rounded-full text-[12px] font-black border whitespace-nowrap transition-all ${categoryFilter === 'all' ? 'bg-black text-white border-black shadow-md scale-105' : 'bg-[#f5f5f5] border-transparent hover:bg-black hover:text-white'}`}>All ({products.length})</button>
            {categories.map(c => (
              <button key={c} onClick={() => setCategoryFilter(c)} className={`px-4 py-2 rounded-full text-[12px] font-black border whitespace-nowrap capitalize transition-all ${categoryFilter === c ? 'bg-[#f85606] text-white border-[#f85606] shadow-md scale-105' : 'bg-[#f5f5f5] border-transparent hover:bg-black hover:text-white'}`}>{c}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <select value={priceFilter} onChange={e => setPriceFilter(e.target.value)} className="border rounded-full px-3 py-2 text-[11px] font-bold bg-[#fafafa] outline-none">
              <option value="all">All Price</option>
              <option value="under500">Under ৳500</option>
              <option value="500to1500">৳500 - ৳1500</option>
              <option value="over1500">Over ৳1500</option>
            </select>
            <select value={sort} onChange={e => setSort(e.target.value)} className="border rounded-full px-3 py-2 text-[11px] font-bold bg-[#fafafa] outline-none focus:border-black">
              <option value="newest">🆕 Newest</option>
              <option value="popular">🔥 Popular</option>
              <option value="discount">💥 Discount</option>
              <option value="price_low">💰 Low to High</option>
              <option value="price_high">💰 High to Low</option>
              <option value="rating">⭐ Top Rated</option>
            </select>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="border rounded-full px-4 py-2 text-[11px] w-[140px] outline-none focus:border-[#f85606] bg-[#fafafa]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 p-2 md:p-0 md:mt-4">
        {visibleProducts.map(p => (
          <div key={p.id} className="bg-white rounded-[14px] overflow-hidden hover:shadow-[0_16px_32px_rgba(0,0,0,0.15)] hover:-translate-y-1.5 transition-all duration-300 group border border-transparent hover:border-black flex flex-col relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#f85606] to-[#212121] opacity-0 group-hover:opacity-100 transition"></div>
            <div className="relative h-[190px] bg-[#fcfcfc] flex items-center justify-center p-3">
              <Link href={`/product/${p.slug}`} className="w-full h-full flex items-center justify-center">
                <img src={p.image} alt={p.title} loading="lazy" className="max-h-full max-w-full object-contain group-hover:scale-110 transition duration-700" />
              </Link>
              <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                <span className="bg-[#f85606] text-white text-[10px] font-black px-2 py-1 rounded-[6px] shadow-md">-{p.discount}%</span>
                {p.free_delivery && <span className="bg-[#10b981] text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow">FREE DELIVERY</span>}
              </div>
              <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
                <button onClick={() => toggleWishlist(p)} className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md transition-all active:scale-90 ${wishlist.includes(p.id) ? 'bg-red-500 text-white scale-110' : 'bg-white/90 hover:bg-white text-black'}`}>♥</button>
                <button onClick={() => setQuickView(p)} className="w-8 h-8 rounded-full bg-black/75 text-white flex items-center justify-center text-[11px] opacity-0 group-hover:opacity-100 transition-all hover:bg-black backdrop-blur">👁</button>
              </div>
              {p.stock < 10 && <span className="absolute bottom-2 right-2 bg-red-500 text-white text-[8px] font-black px-2 py-1 rounded-full animate-pulse">Only {p.stock} left!</span>}
              <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur text-[8px] font-bold px-2 py-1 rounded-full border shadow-sm">✓ Verified</span>
            </div>
            
            <div className="p-3 flex flex-col flex-1">
              <Link href={`/product/${p.slug}`}><h3 className="text-[12.5px] leading-[16px] text-[#212121] line-clamp-2 h-[32px] group-hover:text-[#f85606] font-medium transition-colors">{p.title}</h3></Link>
              <div className="mt-2.5">
                <div className="flex items-baseline gap-1.5">
                  <p className="text-[#f85606] font-black text-[16px]">৳{Number(p.price).toLocaleString()}</p>
                  <p className="text-[10px] text-[#9e9e9e] line-through">৳{Number(p.originalPrice).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-full bg-[#f0f0f0] h-1 rounded-full overflow-hidden flex-1">
                    <div className="h-full bg-gradient-to-r from-[#f85606] to-[#ff8a50]" style={{width: `${Math.min(90, (p.sold/1000)*100)}%`}}></div>
                  </div>
                  <span className="text-[9px] text-[#f85606] font-bold">{p.sold} sold</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2.5">
                <div className="flex items-center gap-1">
                  <span className="text-[#faca51] text-[10px]">★★★★★</span>
                  <span className="text-[10px] font-bold text-[#212121]">{p.rating}</span>
                  <span className="text-[9px] text-[#999]">({p.sold})</span>
                </div>
                <span className="text-[9px] bg-[#FFF3E0] text-[#EF6C00] px-1.5 py-0.5 rounded-full font-bold">Top Rated</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5 mt-3">
                <button onClick={() => addToCart(p)} className="col-span-3 bg-[#ffe1d2] text-[#f85606] py-2 rounded-full text-[11px] font-black hover:bg-[#f85606] hover:text-white transition active:scale-95 shadow-sm">Add to Cart</button>
                <button onClick={() => buyNow(p)} className="col-span-2 bg-black text-white py-2 rounded-full text-[10px] font-black hover:bg-[#f85606] transition">BUY NOW</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {visibleProducts.length < filteredSorted.length ? (
        <div className="flex flex-col items-center mt-8 gap-3">
          <div className="w-full max-w-[300px] bg-[#e0e0e0] h-1 rounded-full overflow-hidden">
            <div className="h-full bg-[#f85606] transition-all" style={{width: `${(visibleProducts.length/filteredSorted.length)*100}%`}}></div>
          </div>
          <p className="text-[11px] text-[#666] bg-white px-4 py-1 rounded-full border">Showing {visibleProducts.length} of {filteredSorted.length} • {Math.round((visibleProducts.length/filteredSorted.length)*100)}% viewed</p>
          <button onClick={() => setPage(p => p + 1)} className="bg-white border-2 border-[#f85606] text-[#f85606] hover:bg-[#f85606] hover:text-white px-12 py-3 rounded-full text-[13px] font-black transition shadow-md hover:shadow-xl active:scale-95">LOAD MORE ({filteredSorted.length - visibleProducts.length} MORE) →</button>
        </div>
      ) : (
        <div className="text-center mt-10 pb-4">
          <p className="text-[12px] text-[#9e9e9e] bg-white inline-block px-5 py-2.5 rounded-full border shadow-sm">✓ You have seen all {filteredSorted.length} products • Come back tomorrow for new AI picks!</p>
          <div className="mt-4 flex gap-3 justify-center">
            <Link href="/" className="bg-[#f85606] text-white text-[13px] font-black px-8 py-3 rounded-full hover:bg-black transition shadow-lg">BACK TO HOME</Link>
            <Link href="/category" className="bg-white border-2 border-black text-[13px] font-black px-8 py-3 rounded-full hover:bg-black hover:text-white transition">BROWSE CATEGORIES</Link>
          </div>
        </div>
      )}
    </div>
  )
}