'use client'
import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from "@/lib/supabase/client"

export default function FlashSalePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(5 * 60 * 60 + 23 * 60 + 45)
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('popular')
  const [liveViewers, setLiveViewers] = useState(3421)
  const [wishlist, setWishlist] = useState([])
  const [toast, setToast] = useState('')
  const [search, setSearch] = useState('')
  const [couponCopied, setCouponCopied] = useState(false)
  const [livePurchase, setLivePurchase] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const supabase = createClient()

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data, error } = await supabase.from('products').select('*').eq('status','approved').order('created_at', { ascending: false }).limit(80)
      if(error){
        console.log(error)
        setProducts([])
        setLoading(false)
        return
      }
      const enriched = (data || []).map(p => {
        let img = '/placeholder.png'
        try {
          if(Array.isArray(p.images) && p.images[0]) img = typeof p.images[0] === 'string' ? p.images[0] : p.images[0]?.url || p.image_url
          else if(typeof p.images === 'string'){ const parsed = JSON.parse(p.images); if(Array.isArray(parsed) && parsed[0]) img = parsed[0] }
          else if(p.image_url) img = p.image_url
          else if(p.image) img = p.image
        } catch { img = p.image_url || p.image || '/placeholder.png' }

        const disc = p.discount_percent || p.discount || Math.floor(Math.random() * 60) + 20
        return {
          ...p,
          _img: img,
          discount_percent: disc,
          sold_percent: p.sold_percent || Math.floor(Math.random() * 75) + 15,
          stock: p.stock || Math.floor(Math.random() * 30) + 5,
          original_price: p.original_price || Math.round(Number(p.price) * (1 + disc / 100)),
          rating: p.rating || (4 + Math.random()).toFixed(1),
          viewers: Math.floor(Math.random() * 200) + 50,
          free_delivery: p.free_delivery ?? (Number(p.price) > 500),
          category_name: (p.category || 'General').toLowerCase()
        }
      })
      setProducts(enriched)
      setLoading(false)
    }
    load()
    try {
      const wish = JSON.parse(localStorage.getItem('baharaz_wishlist') || '[]')
      setWishlist(wish.map(w => w.id))
    } catch {}
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft(s => s > 0? s - 1 : 5 * 3600)
      setLiveViewers(v => Math.max(2000, v + Math.floor(Math.random() * 11) - 5))
    }, 1000)
    return () => clearInterval(t)
  }, [])

  // Fake Live Purchase Notification
  useEffect(() => {
    const names = ['Rahim from Dhaka', 'Karim from Rajshahi', 'Sakib from Chittagong', 'Anika from Sylhet', 'Tania from Khulna']
    const iv = setInterval(() => {
      if(products.length===0) return
      const p = products[Math.floor(Math.random()*products.length)]
      const n = names[Math.floor(Math.random()*names.length)]
      setLivePurchase(`${n} just bought ${p.name || p.title}`)
      setTimeout(()=>setLivePurchase(null), 3500)
    }, 8000)
    return () => clearInterval(iv)
  }, [products])

  const h = String(Math.floor(timeLeft / 3600)).padStart(2, '0')
  const m = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0')
  const s = String(timeLeft % 60).padStart(2, '0')

  const categories = useMemo(() => {
    const uniq = [...new Set(products.map(p=>p.category).filter(Boolean))].slice(0,8)
    return uniq
  }, [products])

  const filtered = useMemo(() => {
    let list = [...products]
    if(search) list = list.filter(p => (p.name||p.title||'').toLowerCase().includes(search.toLowerCase()))
    if(selectedCategory!=='all') list = list.filter(p => (p.category||'').toLowerCase() === selectedCategory.toLowerCase())
    if (filter === '80') list = list.filter(p => (p.discount_percent || 0) >= 70)
    if (filter === '60') list = list.filter(p => (p.discount_percent || 0) >= 50 && (p.discount_percent || 0) < 70)
    if (filter === 'ending') list = list.filter(p => p.sold_percent > 65)
    if (filter === 'free') list = list.filter(p => p.free_delivery)
    if (sort === 'price_low') list.sort((a, b) => Number(a.price) - Number(b.price))
    if (sort === 'price_high') list.sort((a, b) => Number(b.price) - Number(a.price))
    if (sort === 'discount_high') list.sort((a, b) => (b.discount_percent || 0) - (a.discount_percent || 0))
    if (sort === 'popular') list.sort((a, b) => b.sold_percent - a.sold_percent)
    if (sort === 'newest') list.sort((a,b) => new Date(b.created_at) - new Date(a.created_at))
    return list
  }, [products, filter, sort, search, selectedCategory])

  const addToCart = (p) => {
    try {
      let cart = JSON.parse(localStorage.getItem('baharaz_cart') || '[]')
      const idx = cart.findIndex(c => c.id === p.id)
      if (idx >= 0) cart[idx].quantity += 1
      else cart.push({ id: p.id, name: p.name || p.title, price: p.price, image: p._img, quantity: 1 })
      localStorage.setItem('baharaz_cart', JSON.stringify(cart))
      window.dispatchEvent(new Event('cartUpdated'))
      if (navigator.vibrate) navigator.vibrate(50)
      showToast(`${p.name || p.title} Added to Cart! 🛒`)
    } catch(e){ console.log(e) }
  }

  const toggleWishlist = (p) => {
    try {
      let wish = JSON.parse(localStorage.getItem('baharaz_wishlist') || '[]')
      const exists = wish.find(w => w.id === p.id)
      if (exists) wish = wish.filter(w => w.id!== p.id)
      else wish.push(p)
      localStorage.setItem('baharaz_wishlist', JSON.stringify(wish))
      setWishlist(wish.map(w => w.id))
      showToast(exists? 'Removed from Wishlist' : 'Added to Wishlist ❤️')
      window.dispatchEvent(new Event('wishlistUpdated'))
    } catch(e){ console.log(e) }
  }

  const shareProduct = async (p) => {
    const url = `${window.location.origin}/product/${p.slug || p.id}`
    if (navigator.share) {
      try { await navigator.share({ title: p.name || p.title, url }) } catch {}
    } else {
      try { await navigator.clipboard.writeText(url); showToast('Link Copied! Share Now ↗️') } catch {}
    }
  }

  const copyCoupon = () => {
    navigator.clipboard.writeText('FLASH100')
    setCouponCopied(true)
    showToast('Coupon FLASH100 Copied! Extra ৳100 OFF')
    setTimeout(()=>setCouponCopied(false), 3000)
  }

  return (
    <div className="w-full bg-[#f5f5f5] flex justify-center">
      <div className="w-[1188px] max-w-full pb-[80px] md:pb-4 px-2 md:px-2 pt-[12px] relative z-0">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Flash Sale - Baharaz Mall',
          description: 'Up to 80% OFF Flash Sale - Limited Time, Daraz Alternative',
          url: 'https://www.baharaz.com/flash-sale',
          isPartOf: { '@type': 'WebSite', name: 'Baharaz', url: 'https://www.baharaz.com' }
        })}} />

        {toast && <div className="fixed bottom-20 md:bottom-5 left-1/2 -translate-x-1/2 bg-black text-white px-5 py-2.5 rounded-full text-[12px] font-black z-[9999] shadow-2xl animate-bounce border border-white/20">{toast}</div>}
        {livePurchase && <div className="fixed bottom-32 md:bottom-20 left-3 md:left-5 bg-white text-black border-2 border-black px-4 py-3 rounded-2xl text-[11px] font-bold z-[9998] shadow-[0_12px_24px_rgba(0,0,0,0.2)] animate-pulse flex items-center gap-2 max-w-[300px]"><span className="w-8 h-8 bg-[#f85606] text-white rounded-full flex items-center justify-center text-[12px]">🛒</span><span className="line-clamp-2 leading-[14px]">{livePurchase}</span></div>}

        {/* HERO */}
        <div className="bg-gradient-to-r from-[#f85606] via-[#ff6a00] to-[#ff3c00] rounded-[16px] p-4 flex flex-col md:flex-row justify-between items-center gap-3 text-white shadow-[0_12px_32px_rgba(248,86,6,0.4)] relative overflow-hidden border border-white/20 z-0">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-yellow-300/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
          <div className="flex items-center gap-3 relative z-10 w-full">
            <div className="bg-white text-[#f85606] w-[52px] h-[52px] rounded-full flex items-center justify-center font-black text-[24px] animate-pulse shadow-[0_4px_12px_rgba(0,0,0,0.2)] shrink-0">⚡</div>
            <div className="flex-1">
              <h1 className="font-black text-[20px] md:text-[26px] leading-none flex items-center gap-2">Flash Sale <span className="bg-white text-[#f85606] text-[10px] px-2.5 py-1 rounded-full animate-bounce shadow">LIVE NOW</span><span className="bg-yellow-300 text-black text-[9px] px-2 py-1 rounded-full font-black hidden md:block">UPTO 80% OFF</span></h1>
              <p className="text-[11px] md:text-[12px] font-bold opacity-90 flex items-center gap-2 mt-1.5 flex-wrap"><span className="bg-black/30 px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur border border-white/20">🔴 {liveViewers.toLocaleString()} Live Watching</span> <span className="bg-white/20 px-2 py-1 rounded-full border border-white/10">🚚 Free Delivery Over ৳1000</span><span className="bg-black text-white px-2 py-1 rounded-full text-[9px]">64 Districts</span></p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-black/30 px-4 py-2.5 rounded-[12px] backdrop-blur-md border border-white/20 relative z-10 w-full md:w-auto justify-center">
            <span className="text-[11px] font-black tracking-widest opacity-90">ENDS IN</span>
            <div className="flex gap-1.5 items-center">
              <div className="bg-white text-black min-w-[46px] h-[46px] rounded-[10px] flex flex-col items-center justify-center font-mono font-black text-[18px] leading-none shadow-lg"> {h} <span className="text-[8px] font-black opacity-50 mt-0.5">HRS</span></div>
              <span className="font-black text-[18px] animate-pulse">:</span>
              <div className="bg-white text-black min-w-[46px] h-[46px] rounded-[10px] flex flex-col items-center justify-center font-mono font-black text-[18px] leading-none shadow-lg"> {m} <span className="text-[8px] font-black opacity-50 mt-0.5">MIN</span></div>
              <span className="font-black text-[18px] animate-pulse">:</span>
              <div className="bg-yellow-300 text-black min-w-[46px] h-[46px] rounded-[10px] flex flex-col items-center justify-center font-mono font-black text-[18px] leading-none shadow-lg animate-pulse"> {s} <span className="text-[8px] font-black opacity-60 mt-0.5">SEC</span></div>
            </div>
          </div>
        </div>

        {/* COUPON BANNER */}
        <div className="bg-white border-2 border-dashed border-[#f85606] rounded-[12px] p-3 mt-3 flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-[12px]"><span className="bg-[#f85606] text-white px-2.5 py-1 rounded-full font-black text-[10px]">COUPON</span><span className="font-black">Use FLASH100 & Get Extra ৳100 OFF on ৳1000+ Order</span><span className="text-[10px] bg-[#fff4e5] text-[#ff6a00] px-2 py-1 rounded-full font-bold hidden md:block">Limited Time</span></div>
          <button onClick={copyCoupon} className={`px-5 py-2 rounded-full text-[11px] font-black border-2 transition ${couponCopied? 'bg-black text-white border-black' : 'bg-[#f85606] text-white border-[#f85606] hover:bg-black hover:border-black'}`}>{couponCopied? '✓ Copied!' : 'Copy Code: FLASH100'}</button>
        </div>

        {/* SEARCH + FILTER BAR */}
        <div className="bg-white rounded-[12px] border p-2.5 mt-3 flex flex-col gap-2 sticky top-[12px] z-[10] shadow-sm backdrop-blur">
          <div className="flex flex-wrap justify-between gap-2">
            <div className="flex gap-1.5 overflow-auto scrollbar-hide flex-1">
              {[
                { id: 'all', label: `All Deals (${products.length})` },
                { id: '80', label: '80% OFF 🔥' },
                { id: '60', label: '50% OFF' },
                { id: 'ending', label: 'Ending Soon ⏳' },
                { id: 'free', label: 'Free Delivery 🚚' },
              ].map(f => (
                <button key={f.id} onClick={() => setFilter(f.id)} className={`px-4 py-2 rounded-full text-[12px] font-black border whitespace-nowrap transition-all ${filter === f.id? 'bg-[#f85606] text-white border-[#f85606] shadow scale-105' : 'bg-[#f5f5f5] hover:bg-black hover:text-white border-transparent'}`}>{f.label}</button>
              ))}
            </div>
            <div className="flex gap-2 items-center shrink-0">
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search in Flash Sale..." className="border rounded-full px-4 py-2 text-[12px] w-[180px] md:w-[220px] outline-none focus:border-[#f85606] bg-[#fafafa]" />
              <select value={sort} onChange={e => setSort(e.target.value)} className="border rounded-full px-3 py-2 text-[12px] font-bold outline-none bg-[#f9f9f9] shrink-0">
                <option value="popular">🔥 Most Popular</option>
                <option value="discount_high">💥 Biggest Discount</option>
                <option value="price_low">💰 Low to High</option>
                <option value="price_high">💰 High to Low</option>
                <option value="newest">🆕 Newest</option>
              </select>
            </div>
          </div>
          {categories.length>0 && (
            <div className="flex gap-1.5 overflow-auto scrollbar-hide pt-1 border-t">
              <button onClick={()=>setSelectedCategory('all')} className={`px-3 py-1.5 rounded-full text-[11px] font-bold border whitespace-nowrap ${selectedCategory==='all'?'bg-black text-white border-black':'bg-white hover:bg-[#f5f5f5] border-gray-200'}`}>All Categories</button>
              {categories.map(c=>(
                <button key={c} onClick={()=>setSelectedCategory(c)} className={`px-3 py-1.5 rounded-full text-[11px] font-bold border whitespace-nowrap capitalize ${selectedCategory===c?'bg-[#f85606] text-white border-[#f85606]':'bg-white hover:bg-[#f5f5f5] border-gray-200'}`}>{c}</button>
              ))}
            </div>
          )}
        </div>

        {/* PRODUCTS GRID */}
        <div className="bg-white rounded-[12px] border p-2 md:p-3 mt-3 min-h-[400px] relative z-0">
          {loading? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
              {Array.from({ length: 12 }).map((_, i) => <div key={i} className="h-[260px] bg-[#f5f5f5] animate-pulse rounded-[12px]" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-3">
              {filtered.map(p => (
                <div key={p.id} className="border rounded-[12px] overflow-hidden hover:shadow-[0_12px_32px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 group bg-white relative">
                  <Link href={`/product/${p.slug || p.id}`} className="relative block">
                    <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                      <span className="bg-[#f85606] text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow">-{p.discount_percent}% OFF</span>
                      {p.sold_percent > 65 && <span className="bg-black text-yellow-300 text-[8px] font-black px-2 py-0.5 rounded-full animate-pulse">⚡ ENDING SOON</span>}
                      {p.free_delivery && <span className="bg-[#10b981] text-white text-[8px] font-black px-2 py-0.5 rounded-full">FREE DELIVERY</span>}
                    </div>
                    <div className="absolute top-2 right-2 z-10 flex gap-1">
                      <button onClick={e => { e.preventDefault(); toggleWishlist(p) }} className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md backdrop-blur transition active:scale-90 ${wishlist.includes(p.id)? 'bg-red-500 text-white scale-110' : 'bg-white/90 hover:bg-white'}`}>♥</button>
                    </div>
                    <div className="h-[160px] md:h-[170px] bg-[#fafafa] p-2 relative overflow-hidden">
                      <img src={p._img} alt={p.name || p.title} loading="lazy" className="w-full h-full object-contain group-hover:scale-110 transition duration-700" />
                      {p.stock <= 10 && <div className="absolute bottom-2 left-2 right-2 bg-red-500 text-white text-[9px] font-black text-center py-0.5 rounded-full animate-pulse">Only {p.stock} left! Hurry</div>}
                    </div>
                  </Link>
                  <div className="p-2.5">
                    <Link href={`/product/${p.slug || p.id}`}><p className="text-[12px] leading-[16px] line-clamp-2 h-[32px] hover:text-[#f85606] font-medium">{p.name || p.title}</p></Link>
                    <div className="flex items-baseline gap-1.5 mt-1.5">
                      <p className="text-[#f85606] font-black text-[15px]">৳{Number(p.price).toLocaleString()}</p>
                      <p className="text-[11px] line-through opacity-50">৳{Number(p.original_price).toLocaleString()}</p>
                    </div>
                    <div className="mt-2.5">
                      <div className="flex justify-between text-[10px] font-bold opacity-70 mb-1"><span>🔥 {p.sold_percent}% Sold</span><span className="text-[#f85606]">{p.stock} left</span></div>
                      <div className="h-2 bg-[#f0f0f0] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#f85606] to-[#ff8a00] rounded-full transition-all duration-1000" style={{ width: `${p.sold_percent}%` }} /></div>
                    </div>
                    <div className="flex gap-1.5 mt-3">
                      <button onClick={() => addToCart(p)} className="flex-1 bg-[#ffe1d2] text-[#f85606] py-2 rounded-full text-[11px] font-black hover:bg-[#f85606] hover:text-white transition active:scale-95">Add to Cart</button>
                      <button onClick={() => shareProduct(p)} className="w-9 h-9 bg-[#f5f5f5] rounded-full text-[14px] hover:bg-black hover:text-white transition active:scale-90">↗</button>
                    </div>
                    <p className="text-[10px] opacity-60 mt-2 flex items-center gap-1 font-medium">👁 {p.viewers} viewing • ⭐ {p.rating} • {p.sold_percent > 50? 'Trending' : 'New'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-[40px]">🔍</div>
              <p className="font-black mt-3">No products in this filter</p>
              <p className="text-[12px] opacity-60 mt-1">Try All Deals or check back later!</p>
              <div className="flex gap-2 justify-center mt-4">
                <button onClick={()=>{setFilter('all'); setSelectedCategory('all'); setSearch('')}} className="bg-black text-white px-6 py-2 rounded-full text-[12px] font-black hover:scale-105 transition">Clear All Filters</button>
                <Link href="/category" className="bg-[#f5f5f5] border px-6 py-2 rounded-full text-[12px] font-black hover:bg-black hover:text-white transition">Browse Categories</Link>
              </div>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-3 mt-3">
          <div className="bg-white rounded-[12px] border p-4 flex gap-3 items-center"><div className="w-12 h-12 bg-[#e8f5e9] rounded-full flex items-center justify-center text-[20px]">🚚</div><div><p className="font-black text-[13px]">Free Delivery</p><p className="text-[11px] text-[#666]">On orders over ৳1000 all over BD</p></div></div>
          <div className="bg-white rounded-[12px] border p-4 flex gap-3 items-center"><div className="w-12 h-12 bg-[#fff4e5] rounded-full flex items-center justify-center text-[20px]">↩️</div><div><p className="font-black text-[13px]">14 Days Return</p><p className="text-[11px] text-[#666]">Easy return with no questions</p></div></div>
          <div className="bg-white rounded-[12px] border p-4 flex gap-3 items-center"><div className="w-12 h-12 bg-[#f3e5f5] rounded-full flex items-center justify-center text-[20px]">🛡️</div><div><p className="font-black text-[13px]">100% Authentic</p><p className="text-[11px] text-[#666]">All products are verified original</p></div></div>
        </div>

        <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] rounded-[12px] p-4 mt-3 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-[#f85606]/20 rounded-full blur-2xl"></div>
          <p className="text-[11px] leading-[18px] opacity-80 relative z-10">
            <b className="text-white">⚡ Flash Sale Tips:</b> Products sell fast! Add to cart now. Free delivery over ৳1000 in all 64 districts. 14 days easy return. 100% authentic guarantee. Share with friends to get extra ৳100 voucher with code FLASH100. Live viewers: {liveViewers} people shopping now! Hurry up, sale ends in {h}:{m}:{s}
          </p>
          <div className="flex gap-2 mt-3 relative z-10 flex-wrap">
            <Link href="/category/all" className="bg-white text-black px-4 py-2 rounded-full text-[11px] font-black hover:bg-[#f85606] hover:text-white transition">Shop All Products</Link>
            <Link href="/category" className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-[11px] font-bold hover:bg-white hover:text-black transition">All Categories</Link>
            <button onClick={copyCoupon} className="bg-yellow-300 text-black px-4 py-2 rounded-full text-[11px] font-black hover:bg-white transition">Get Extra ৳100 OFF</button>
          </div>
        </div>
      </div>
    </div>
  )
}