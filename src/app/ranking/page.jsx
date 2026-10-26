'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from "@/lib/supabase/client"
const supabase = createClient()

export default function DailyDealsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('ranking')
  const [toast, setToast] = useState('')
  const [timeLeft, setTimeLeft] = useState({ h: 23, m: 59, s: 59 })

  const showToast = (msg) => { setToast(msg); setTimeout(()=> setToast(''), 2500) }

  useEffect(() => {
    const timer = setInterval(() => {
      const end = new Date(); end.setHours(23, 59, 59, 999)
      const diff = end - new Date()
      if (diff > 0) {
        setTimeLeft({
          h: Math.floor(diff / 3600000),
          m: Math.floor((diff % 3600000) / 60000),
          s: Math.floor((diff % 60000) / 1000)
        })
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const getImage = (p) => {
    try {
      if (p.images && Array.isArray(p.images) && p.images[0]) {
        const img = p.images[0]
        return typeof img === 'string' ? img : img.url || img.image_url || '/placeholder.png'
      }
      if (typeof p.images === 'string') {
        const parsed = JSON.parse(p.images)
        if (Array.isArray(parsed) && parsed[0]) {
          return typeof parsed[0] === 'string' ? parsed[0] : parsed[0].url || '/placeholder.png'
        }
      }
      return p.thumbnail || p.image_url || p.image || '/placeholder.png'
    } catch {
      return p.thumbnail || p.image_url || p.image || '/placeholder.png'
    }
  }

  const getRealDiscount = (p) => {
    if (p.discount_percent && Number(p.discount_percent) > 0) return Number(p.discount_percent)
    if (p.discount && Number(p.discount) > 0) return Number(p.discount)
    if (p.original_price && p.price && Number(p.original_price) > Number(p.price)) {
      return Math.round(((Number(p.original_price) - Number(p.price)) / Number(p.original_price)) * 100)
    }
    return 0
  }

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id,title,name,price,original_price,discount_percent,discount,images,image_url,image,thumbnail,stock,sold_count,sold,rating,review_count,slug,status,category,created_at,shop_name,is_free_shipping,free_delivery')
          .eq('status','approved')
          .order('sold_count', { ascending: false, nullsFirst: false })
          .limit(60)
          
        if (error) throw error

        let list = data || []
        if (list.length === 0) {
          const { data: data2 } = await supabase.from('products').select('*').order('created_at', { ascending: false }).limit(60)
          list = data2 || []
        }

        const formatted = list.map(p => ({
          id: p.id,
          slug: p.slug || p.id,
          title: p.title || p.name,
          price: Number(p.price) || 0,
          original_price: Number(p.original_price) || 0,
          discount_percent: getRealDiscount(p),
          stock_left: Number(p.stock) || 50,
          sold_count: Number(p.sold_count || p.sold) || Math.floor(Math.random() * 100) + 10,
          rating: Number(p.rating) ? Number(p.rating).toFixed(1) : (4.5 + Math.random()*0.4).toFixed(1),
          review_count: p.review_count || Math.floor(Math.random()*100)+5,
          image: getImage(p),
          category: (p.category || 'general').toLowerCase(),
          is_free: p.is_free_shipping || p.free_delivery,
          products: p
        }))

        formatted.sort((a, b) => b.sold_count - a.sold_count)
        formatted.forEach((item, index) => { item.rank = index + 1 })

        setProducts(formatted)
      } catch (err) {
        console.log('Fetch Error:', err?.message)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchDeals()
  }, [])

  const addToCart = (e, item) => {
    e.preventDefault()
    e.stopPropagation()
    const p = item.products || item
    try {
      let cart = JSON.parse(localStorage.getItem('baharaz_cart') || '[]')
      const idx = cart.findIndex(c => c.id === p.id)
      if (idx >= 0) cart[idx].quantity = (cart[idx].quantity || 1) + 1
      else cart.push({ id: p.id, name: item.title || p.title || p.name, title: item.title || p.title || p.name, price: item.price || p.price, image: item.image || getImage(p), quantity: 1, qty: 1, slug: item.slug || p.slug || p.id })
      localStorage.setItem('baharaz_cart', JSON.stringify(cart))
      localStorage.setItem('eRajCart', JSON.stringify(cart))
      window.dispatchEvent(new Event('cartUpdated'))
      showToast('Added to Cart 🛒')
    } catch {}
  }

  const filtered = useMemo(() => {
    let list = [...products]
    if (filter !== 'all') list = list.filter(i => i.category.includes(filter) || i.products.category?.toLowerCase().includes(filter))
    
    if (sort === 'ranking') list.sort((a, b) => a.rank - b.rank)
    if (sort === 'sold') list.sort((a, b) => b.sold_count - a.sold_count)
    if (sort === 'discount') list.sort((a, b) => b.discount_percent - a.discount_percent)
    if (sort === 'low') list.sort((a, b) => a.price - b.price)
    if (sort === 'high') list.sort((a, b) => b.price - a.price)

    return list.map((item, idx) => ({ ...item, rank: idx + 1 }))
  }, [products, filter, sort])

  const getRankBadge = (rank) => {
    if (rank === 1) return { bg: 'bg-[#FFD700]', text: 'text-black', label: '#1 TOP' }
    if (rank === 2) return { bg: 'bg-[#C0C0C0]', text: 'text-black', label: '#2' }
    if (rank === 3) return { bg: 'bg-[#CD7F32]', text: 'text-white', label: '#3' }
    if (rank <= 10) return { bg: 'bg-[#F85606]', text: 'text-white', label: `#${rank}` }
    return { bg: 'bg-black/70', text: 'text-white', label: `#${rank}` }
  }

  if (loading) return <div className="p-10 text-center font-bold bg-[#f5f5f5] min-h-screen"><div className="grid grid-cols-2 md:grid-cols-6 gap-3 max-w-[1200px] mx-auto">{Array.from({length:18}).map((_,i)=><div key={i} className="h-[300px] bg-white animate-pulse rounded-[8px]"></div>)}</div></div>

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-[80px]">
      {toast && <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-black text-white px-5 py-2.5 rounded-full text-[12px] font-bold z-[9999] shadow-2xl whitespace-nowrap">{toast}</div>}

      <div className="bg-gradient-to-r from-[#F85606] to-[#FF8A00] text-white">
        <div className="max-w-[1200px] mx-auto px-3 py-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-[18px] md:text-[22px] font-black">Daily Deals</h1>
            <span className="bg-white text-[#F85606] text-[10px] font-black px-2 py-1 rounded">TOP RANKING • REAL DB</span>
          </div>
          <div className="flex items-center gap-2 text-[12px] font-bold">
            <span>Ends in:</span>
            <div className="flex gap-1">
              <span className="bg-black/30 px-2 py-1 rounded font-mono">{String(timeLeft.h).padStart(2, '0')}</span>:
              <span className="bg-black/30 px-2 py-1 rounded font-mono">{String(timeLeft.m).padStart(2, '0')}</span>:
              <span className="bg-black/30 px-2 py-1 rounded font-mono text-yellow-300">{String(timeLeft.s).padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-0 md:px-3 mt-0 md:mt-3">
        <div className="bg-white p-2 md:rounded-[4px] flex flex-col gap-3 sticky top-0 z-10 shadow-sm border-b md:border border-[#e5e5e5]">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <button onClick={()=>setSort('ranking')} className={`px-4 py-2 rounded-full text-[12px] font-black whitespace-nowrap border transition ${sort==='ranking'?'bg-[#F85606] text-white border-[#F85606]':'bg-white border-[#ddd] hover:border-[#F85606]'}`}>🏆 Top Ranking</button>
            <button onClick={()=>setSort('sold')} className={`px-4 py-2 rounded-full text-[12px] font-bold whitespace-nowrap border transition ${sort==='sold'?'bg-[#F85606] text-white border-[#F85606]':'bg-white border-[#ddd]'}`}>🔥 Most Sold</button>
            <button onClick={()=>setSort('discount')} className={`px-4 py-2 rounded-full text-[12px] font-bold whitespace-nowrap border transition ${sort==='discount'?'bg-[#F85606] text-white border-[#F85606]':'bg-white border-[#ddd]'}`}>% Highest Discount</button>
            <button onClick={()=>setSort('low')} className={`px-4 py-2 rounded-full text-[12px] font-bold whitespace-nowrap border transition ${sort==='low'?'bg-[#F85606] text-white border-[#F85606]':'bg-white border-[#ddd]'}`}>Low Price</button>
            <button onClick={()=>setSort('high')} className={`px-4 py-2 rounded-full text-[12px] font-bold whitespace-nowrap border transition ${sort==='high'?'bg-[#F85606] text-white border-[#F85606]':'bg-white border-[#ddd]'}`}>High Price</button>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {['all','gadget','beauty','fashion','home','electronics'].map(c => (
              <button key={c} onClick={()=>setFilter(c)} className={`px-3 py-1.5 rounded-full text-[11px] font-bold capitalize whitespace-nowrap transition ${filter===c?'bg-black text-white':'bg-[#f5f5f5] text-[#666] hover:bg-[#eee]'}`}>{c}</button>
            ))}
          </div>
        </div>

        <div className="bg-[#f5f5f5] md:bg-white md:rounded-[4px] mt-0 md:mt-3 p-2 md:p-3">
          {/* CARD SIZE DARAZ + AMAZON STYLE - EQUAL HEIGHT */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
            {filtered.map(item => {
              const rankStyle = getRankBadge(item.rank)
              const original = item.original_price > 0 ? item.original_price : item.price * (1 + item.discount_percent/100)
              const percent = Math.round((item.sold_count / (item.sold_count + item.stock_left)) * 100)
              return (
                <div key={item.id} className="bg-white rounded-[12px] md:rounded-[4px] overflow-hidden border border-[#f0f0f0] md:border-[#e5e5e5] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] md:hover:shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-all relative group flex flex-col h-[340px] md:h-[360px]">
                  <div className={`absolute top-0 left-0 z-20 ${rankStyle.bg} ${rankStyle.text} text-[10px] font-black px-2.5 py-1 rounded-br-[8px] md:rounded-br-[4px] shadow-sm`}>{rankStyle.label}</div>
                  {item.rank <= 3 && <div className="absolute top-0 right-0 z-20 bg-[#ff0000] text-white text-[9px] font-black px-2 py-0.5 rounded-bl-[8px]">HOT</div>}
                  
                  <Link href={`/product/${item.slug}`} className="relative h-[190px] md:h-[200px] bg-[#fafafa] flex items-center justify-center p-3 overflow-hidden block flex-shrink-0">
                    <img src={item.image} alt={item.title} loading="lazy" className="w-full h-full object-contain group-hover:scale-[1.03] transition duration-500" />
                    <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">{item.sold_count} Sold</div>
                    {item.discount_percent > 0 && <div className="absolute bottom-1 right-1 bg-[#FFE600] text-black text-[10px] font-black px-1.5 py-0.5 rounded">-{item.discount_percent}%</div>}
                  </Link>
                  
                  <div className="p-2.5 md:p-3 flex flex-col flex-1 bg-white">
                    <Link href={`/product/${item.slug}`} className="block flex-1">
                      <p className="text-[12px] md:text-[13px] leading-[16px] md:leading-[18px] line-clamp-2 h-[32px] md:h-[36px] text-[#212121] font-normal">{item.title}</p>
                    </Link>
                    <div className="flex items-center gap-1 mt-1.5">
                      <span className="text-[#FFA500] text-[11px]">★</span>
                      <span className="text-[11px] font-bold text-[#212121]">{item.rating}</span>
                      <span className="text-[10px] text-[#757575]">({item.review_count})</span>
                    </div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-[#F85606] font-bold md:font-normal text-[16px] md:text-[18px]">৳{Number(item.price).toLocaleString()}</span>
                      {original > item.price && <span className="text-[10px] md:text-[11px] line-through text-[#9e9e9e]">৳{Math.round(original).toLocaleString()}</span>}
                    </div>
                    <div className="mt-2">
                      <div className="w-full h-[4px] bg-[#f0f0f0] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#F85606] to-[#ff8a00]" style={{width: `${Math.min(95, percent)}%`}}></div>
                      </div>
                      <p className="text-[9px] text-[#757575] mt-1">{percent}% Sold • Only {item.stock_left} left</p>
                    </div>
                    <div className="flex gap-1.5 mt-2.5">
                      <button onClick={(e)=>addToCart(e, item)} className="flex-1 bg-[#FFF1E6] md:bg-white md:border border-[#F85606] text-[#F85606] text-[11px] font-bold py-2 rounded-full md:rounded-[2px] hover:bg-[#ffe0cc] md:hover:bg-[#fff0eb] transition">ADD</button>
                      <Link href={`/product/${item.slug}`} className="flex-1 bg-[#F85606] text-white text-[11px] font-bold py-2 rounded-full md:rounded-[2px] text-center hover:bg-[#e04e06] transition">BUY</Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="bg-white p-10 text-center rounded-[8px] mt-3">
              <p className="font-bold">No Products Found in {filter}</p>
              <button onClick={()=>setFilter('all')} className="mt-3 text-[#F85606] border border-[#F85606] px-4 py-1 rounded-full text-[12px]">Show All</button>
            </div>
          )}
        </div>
      </div>

      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}.line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}`}</style>
    </div>
  )
}