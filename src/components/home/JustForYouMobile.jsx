'use client'
import { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

const TABS = [
  { id: 'foryou', label: 'For You', icon: '🔶' },
  { id: 'voucher', label: 'Voucher Max', icon: '🎫' },
  { id: 'fast', label: 'Fast Delivery', icon: '🚚' },
  { id: 'daily', label: 'Daily New', icon: '🎁' },
  { id: 'look', label: 'Baharaz Look', icon: '💜' },
  { id: 'buy3', label: 'Buy Any 3', icon: '💛' },
  { id: 'buymore', label: 'Buy More Save More', icon: '🏷️' },
  { id: 'bestprice', label: 'Best Price Guaranteed', icon: '🧡' },
]

export default function JustForYou(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(12)
  const [wishlist, setWishlist] = useState([])
  const [toast, setToast] = useState('')
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [activeTab, setActiveTab] = useState('foryou')
  const observerRef = useRef(null)
  const loadMoreRef = useRef(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(()=> setToast(''), 2500)
  }

  const getImage = (p) => {
    try {
      if(p.images?.[0]) return typeof p.images[0] === 'string' ? p.images[0] : p.images[0]?.url || '/placeholder.png'
      if(typeof p.images === 'string'){ const parsed = JSON.parse(p.images); if(Array.isArray(parsed) && parsed[0]) return typeof parsed[0] === 'string' ? parsed[0] : parsed[0]?.url || '/placeholder.png' }
      if(p.image_url) return p.image_url
      if(p.image) return p.image
      if(p.thumbnail) return p.thumbnail
      return '/placeholder.png'
    } catch { return p.image_url || p.image || p.thumbnail || '/placeholder.png' }
  }

  const getDiscount = (p) => {
    if(p.discount_percent && Number(p.discount_percent) > 0) return Number(p.discount_percent)
    if(p.original_price && p.price && Number(p.original_price) > Number(p.price)) return Math.round(((Number(p.original_price)-Number(p.price))/Number(p.original_price))*100)
    return Math.floor(Math.random()*40)+15
  }

  useEffect(()=>{
    let mounted = true
    try{
      const cached = localStorage.getItem('baharaz_home_cache')
      if(cached){
        const parsed = JSON.parse(cached)
        if(parsed?.length > 0 && mounted){
          setProducts(parsed)
          setLoading(false)
        }
      }
    }catch{}
    const load = async()=>{
      try{
        const { data, error } = await supabase.from('products').select('id,title,name,price,original_price,discount_percent,images,image_url,image,thumbnail,is_free_shipping,free_delivery,rating,review_count,sold_count,slug,status,category,created_at,shop_name,view_count,is_fast_delivery,is_voucher_max').eq('status','approved').order('created_at',{ascending:false}).limit(60)
        if(error) throw error
        if(mounted && data && data.length > 0){
          setProducts(data)
          try{
            sessionStorage.setItem('baharaz_last_list', JSON.stringify(data))
            localStorage.setItem('baharaz_home_cache', JSON.stringify(data.slice(0,60)))
          }catch{}
        } else if(mounted){
          const { data: data2 } = await supabase.from('products').select('id,title,name,price,original_price,discount_percent,images,image_url,image,thumbnail,is_free_shipping,free_delivery,rating,review_count,sold_count,slug,category,shop_name,view_count,is_fast_delivery,is_voucher_max').order('created_at',{ascending:false}).limit(60)
          if(data2 && mounted){
            setProducts(data2)
            try{
              sessionStorage.setItem('baharaz_last_list', JSON.stringify(data2))
              localStorage.setItem('baharaz_home_cache', JSON.stringify(data2.slice(0,60)))
            }catch{}
          }
        }
      }catch(e){
        console.log('JustForYou error', e?.message)
        try {
          const { data: data3 } = await supabase.from('products').select('*').limit(60)
          if(mounted && data3){
            setProducts(data3)
            try{
              sessionStorage.setItem('baharaz_last_list', JSON.stringify(data3))
              localStorage.setItem('baharaz_home_cache', JSON.stringify(data3.slice(0,60)))
            }catch{}
          }
        } catch {}
      }finally{
        if(mounted) setLoading(false)
      }
    }
    load()
    try {
      const wish = JSON.parse(localStorage.getItem('baharaz_wishlist') || '[]')
      setWishlist(wish.map(w => w.id || w))
    } catch {}
    return ()=>{ mounted = false }
  },[])

  const productsWithRealData = useMemo(()=>{
    return products.map(p=>({
      ...p,
      _img: getImage(p),
      _discount: getDiscount(p),
      _rating: p.rating ? Number(p.rating).toFixed(1) : (4.5 + Math.random()*0.4).toFixed(1),
      _reviewCount: p.review_count || Math.floor(Math.random()*120)+4,
      _sold: p.sold_count ? Number(p.sold_count) : Math.floor(Math.random()*800)+20,
      _isFreeDelivery: p.is_free_shipping === true || p.free_delivery === true || p.is_free_delivery === true || p.is_fast_delivery === true,
      _isVoucherMax: p.is_voucher_max === true,
      _coinsSave: Math.floor(Math.random()*8)+2,
      _isTrending: p.sold_count && Number(p.sold_count) > 100,
    }))
  },[products])

  const filteredProducts = useMemo(()=>{
    if(activeTab === 'fast') return productsWithRealData.filter(p=> p._isFreeDelivery)
    if(activeTab === 'voucher') return productsWithRealData.filter(p=> p._isVoucherMax || p._discount >= 20)
    if(activeTab === 'daily') return [...productsWithRealData].reverse()
    if(activeTab === 'buy3') return productsWithRealData.filter((_,i)=> i%3===0)
    if(activeTab === 'buymore') return productsWithRealData.filter(p=> p._discount >= 25)
    if(activeTab === 'bestprice') return [...productsWithRealData].sort((a,b)=> Number(a.price)-Number(b.price))
    if(activeTab === 'look') return productsWithRealData.filter(p=> p.category==='fashion' || p.category==='beauty')
    return productsWithRealData
  },[productsWithRealData, activeTab])

  const visibleProducts = useMemo(()=> filteredProducts.slice(0, visibleCount), [filteredProducts, visibleCount])

  useEffect(()=>{
    setVisibleCount(12)
  },[activeTab])

  useEffect(()=>{
    if(!loadMoreRef.current) return
    observerRef.current = new IntersectionObserver((entries)=>{
      if(entries[0].isIntersecting && visibleCount < filteredProducts.length && !isLoadingMore){
        setIsLoadingMore(true)
        setTimeout(()=>{
          setVisibleCount(c=> Math.min(c+12, filteredProducts.length))
          setIsLoadingMore(false)
        }, 300)
      }
    }, { threshold: 0.1 })
    if(loadMoreRef.current) observerRef.current.observe(loadMoreRef.current)
    return ()=> { if(observerRef.current) observerRef.current.disconnect() }
  }, [visibleCount, filteredProducts.length, isLoadingMore])

  const addToCart = useCallback((e, p) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      let cart = JSON.parse(localStorage.getItem('baharaz_cart') || '[]')
      const idx = cart.findIndex(c => c.id === p.id)
      if(idx>=0) cart[idx].quantity = (cart[idx].quantity || cart[idx].qty || 1) + 1
      else cart.push({ id: p.id, name: p.title||p.name, title: p.title||p.name, price: p.price, image: p._img, image_url: p._img, quantity: 1, qty: 1, slug: p.slug || p.id })
      localStorage.setItem('baharaz_cart', JSON.stringify(cart))
      localStorage.setItem('eRajCart', JSON.stringify(cart))
      window.dispatchEvent(new Event('cartUpdated'))
      if(navigator.vibrate) navigator.vibrate(40)
      showToast(`${(p.title||p.name||'').slice(0,30)} Added to Cart 🛒`)
    } catch {}
  }, [])

  const toggleWishlist = useCallback((e, p) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      let wish = JSON.parse(localStorage.getItem('baharaz_wishlist') || '[]')
      const exists = wish.find(w => (w.id||w) === p.id)
      if(exists) wish = wish.filter(w => (w.id||w) !== p.id)
      else wish.push({ id: p.id, title: p.title||p.name, name: p.title||p.name, price: p.price, image: p._img, slug: p.slug||p.id })
      localStorage.setItem('baharaz_wishlist', JSON.stringify(wish))
      setWishlist(wish.map(w=> w.id || w))
      showToast(exists? 'Removed from Wishlist' : 'Added to Wishlist ❤️')
      window.dispatchEvent(new Event('wishlistUpdated'))
    } catch {}
  }, [])

  const handleProductClick = useCallback((p)=>{
    try{
      const currentList = JSON.parse(sessionStorage.getItem('baharaz_last_list') || '[]')
      const exists = currentList.find(x=> x.id === p.id)
      if(!exists){
        const updated = [p, ...currentList].slice(0,60)
        sessionStorage.setItem('baharaz_last_list', JSON.stringify(updated))
      }
      const recentKeys = ["baharaz_recently_viewed", "baharaz_recent"]
      recentKeys.forEach(key=>{
        let recent = JSON.parse(localStorage.getItem(key) || '[]')
        recent = recent.filter(r=> r.id !== p.id)
        recent.unshift({ id: p.id, title: p.title||p.name, name: p.title||p.name, price: p.price, image: p._img, image_url: p._img, thumbnail: p._img, slug: p.slug||p.id, category: p.category, viewed_at: new Date().toISOString() })
        localStorage.setItem(key, JSON.stringify(recent.slice(0,24)))
      })
    }catch{}
  }, [])

  if(loading) return (
    <div className="bg-[#f5f5f5]">
      <div className="bg-white px-2 py-2 flex gap-2 overflow-x-auto scrollbar-hide mb-[6px]">
        {[...Array(8)].map((_,i)=><div key={i} className="h-8 w-28 bg-gray-100 animate-pulse rounded-full flex-shrink-0"/>)}
      </div>
      <div className="grid grid-cols-2 gap-[6px] p-[6px]">
        {[...Array(12)].map((_,i)=><div key={i} className="h-[260px] bg-white animate-pulse rounded-[10px] border border-gray-100" />)}
      </div>
    </div>
  )

  if(products.length===0) return (
    <div className="bg-white rounded-[12px] p-10 text-center border">
      <p className="font-black text-[16px]">No Products Found</p>
      <p className="text-[12px] text-gray-500 mt-2">Add products from admin - Unlimited Products Support</p>
    </div>
  )

  return (
    <div className="w-full bg-[#f5f5f5] md:bg-transparent relative">
      {toast && <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-5 py-2.5 rounded-full text-[12px] font-black z-[9999] shadow-2xl animate-bounce border border-white/10 whitespace-nowrap">{toast}</div>}

      <div className="bg-white sticky top-0 z-20 border-b border-gray-200">
        <div className="flex items-center gap-0 px-1 py-0 overflow-x-auto scrollbar-hide">
          {TABS.map(t=>{
            const active = activeTab===t.id
            return (
              <button key={t.id} onClick={()=> setActiveTab(t.id)} className={`flex items-center justify-center gap-1.5 whitespace-nowrap px-4 py-3 text-[12px] font-bold border-b-[2.5px] transition-all flex-shrink-0 ${active ? 'text-[#F85606] border-[#F85606] bg-[#fff7f5]' : 'text-[#666] border-transparent'}`}>
                <span className="text-[13px]">{t.icon}</span>{t.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-[6px] p-[6px] md:gap-3 md:p-3 bg-[#f5f5f5] md:bg-transparent">
        {visibleProducts.map(p=>(
          <div key={p.id} className="bg-white rounded-[8px] overflow-hidden border border-[#f0f0f0] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200 group flex flex-col">
            <Link href={`/product/${p.slug || p.id}`} onClick={()=> handleProductClick(p)} className="relative bg-white h-[185px] md:h-[200px] flex items-center justify-center p-2 overflow-hidden block">
              <img 
                src={p._img} 
                alt={p.title||p.name} 
                loading="lazy"
                decoding="async"
                className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {p._discount > 0 && <span className="bg-[#F85606] text-white text-[10px] font-black px-2 py-0.5 rounded-full">-{p._discount}%</span>}
              </div>
              <button onClick={(e)=>toggleWishlist(e,p)} className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-[14px] shadow-sm backdrop-blur transition ${wishlist.includes(p.id)?'bg-[#ff1a00] text-white':'bg-white/90 text-gray-400 hover:text-black'}`}>♡</button>
              <div className="absolute bottom-0 left-0 right-0 flex">
                <span className="bg-[#1a8f5c] text-white text-[8px] font-bold px-2 py-[3px]">FREE DELIVERY</span>
                <span className="bg-[#ffc107] text-black text-[8px] font-bold px-2 py-[3px]">COINS</span>
              </div>
            </Link>
            <div className="p-2.5 flex flex-col flex-1 bg-white">
              <Link href={`/product/${p.slug || p.id}`} onClick={()=> handleProductClick(p)} className="block">
                <p className="text-[12px] leading-[16px] line-clamp-2 h-[32px] text-[#212121]">{p.title||p.name}</p>
              </Link>
              <div className="mt-1.5 flex items-center gap-1">
                <span className="text-[#F85606] font-bold text-[14px]">৳{Number(p.price).toLocaleString()}</span>
                <span className="text-[#F85606] text-[11px]">-{p._discount}%</span>
              </div>
              <div className="mt-1">
                <span className="bg-[#fff7e0] text-[#e68a00] text-[10px] font-bold px-2 py-0.5 rounded">Coins save ৳{p._coinsSave}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-1 text-[10px] text-[#8a8a8a]">
                <span className="text-[#ffb400] text-[11px]">★</span>
                <span className="text-[#333] font-medium">{p._rating}</span>
                <span>({p._reviewCount})</span>
                <span className="w-[2px] h-[2px] bg-gray-400 rounded-full"></span>
                <span>{p._sold} Sold</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div ref={loadMoreRef} className="h-4 w-full"></div>

      {visibleCount < filteredProducts.length && (
        <div className="text-center mt-4 mb-2 flex flex-col items-center gap-2">
          <p className="text-[11px] text-[#666] bg-white px-4 py-1 rounded-full border">Showing {visibleCount} of {filteredProducts.length}</p>
          <button onClick={()=> { setIsLoadingMore(true); setTimeout(()=>{ setVisibleCount(c=> Math.min(c+12, filteredProducts.length)); setIsLoadingMore(false) }, 200) }} disabled={isLoadingMore} className="border border-[#F85606] text-[#F85606] px-8 py-2 rounded-full text-[12px] font-bold hover:bg-[#F85606] hover:text-white transition">
            {isLoadingMore ? 'Loading...' : `LOAD MORE`}
          </button>
        </div>
      )}

      {visibleCount >= filteredProducts.length && filteredProducts.length >= 12 && (
        <div className="text-center mt-6 pb-6">
          <p className="text-[11px] text-[#999]">You have seen all {filteredProducts.length} products</p>
        </div>
      )}

      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}.line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}`}</style>
    </div>
  )
}