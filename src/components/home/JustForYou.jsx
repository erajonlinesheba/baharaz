'use client'
import { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export default function JustForYou(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(12)
  const [wishlist, setWishlist] = useState([])
  const [toast, setToast] = useState('')
  const [isLoadingMore, setIsLoadingMore] = useState(false)
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
    return 0
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
        const { data, error } = await supabase
          .from('products')
          .select('id,title,name,price,original_price,discount_percent,images,image_url,image,thumbnail,is_free_shipping,free_delivery,rating,review_count,sold_count,slug,status,category,created_at,shop_name,view_count')
          .eq('status','approved')
          .order('created_at',{ascending:false})
          .limit(60)
        
        if(error) throw error
        if(mounted && data && data.length > 0){
          setProducts(data)
          try{
            sessionStorage.setItem('baharaz_last_list', JSON.stringify(data))
            localStorage.setItem('baharaz_home_cache', JSON.stringify(data.slice(0,60)))
          }catch{}
        } else if(mounted){
          const { data: data2 } = await supabase.from('products').select('id,title,name,price,original_price,discount_percent,images,image_url,image,thumbnail,is_free_shipping,free_delivery,rating,review_count,sold_count,slug,category,shop_name,view_count').order('created_at',{ascending:false}).limit(60)
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
      // ✅ REAL DATA ONLY - No Fake
      _rating: p.rating ? Number(p.rating).toFixed(1) : null,
      _reviewCount: p.review_count || 0,
      _sold: p.sold_count ? Number(p.sold_count) : 0,
      _viewCount: p.view_count ? Number(p.view_count) : 0,
      // ✅ REAL FREE DELIVERY - Only if DB says true
      _isFreeDelivery: p.is_free_shipping === true || p.free_delivery === true || p.is_free_delivery === true,
      _isTrending: p.sold_count && Number(p.sold_count) > 100,
    }))
  },[products])

  const visibleProducts = useMemo(()=> productsWithRealData.slice(0, visibleCount), [productsWithRealData, visibleCount])

  useEffect(()=>{
    if(!loadMoreRef.current) return
    observerRef.current = new IntersectionObserver((entries)=>{
      if(entries[0].isIntersecting && visibleCount < products.length && !isLoadingMore){
        setIsLoadingMore(true)
        setTimeout(()=>{
          setVisibleCount(c=> Math.min(c+12, products.length))
          setIsLoadingMore(false)
        }, 300)
      }
    }, { threshold: 0.1 })
    if(loadMoreRef.current) observerRef.current.observe(loadMoreRef.current)
    return ()=> { if(observerRef.current) observerRef.current.disconnect() }
  }, [visibleCount, products.length, isLoadingMore])

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
    <div className="bg-transparent">
      <div className="flex justify-between items-center mb-3 px-1">
        <div className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
        <div className="h-4 w-20 bg-gray-200 animate-pulse rounded-full" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-3">
        {[...Array(12)].map((_,i)=><div key={i} className="h-[240px] bg-white animate-pulse rounded-[8px] border border-gray-100" />)}
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
    <div className="bg-transparent relative">
      {toast && <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-5 py-2.5 rounded-full text-[12px] font-black z-[9999] shadow-2xl animate-bounce border border-white/10 whitespace-nowrap">{toast}</div>}

      <div className="flex justify-between items-center mb-3 px-1">
        <div className="flex items-center gap-2">
          <h2 className="font-black text-[16px] md:text-[18px] tracking-tight">Just For You</h2>
          <span className="text-[10px] bg-[#f3e8ff] text-[#7c3aed] px-2 py-0.5 rounded-full font-black hidden md:block border">For You</span>
        </div>
        <Link href="/just-for-you" className="text-[12px] font-black text-[#f85606] border-2 border-[#f85606] px-4 py-1.5 rounded-full hover:bg-[#f85606] hover:text-white transition shadow-sm">View All →</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-3">
        {visibleProducts.map(p=>(
          <div key={p.id} className="bg-white rounded-[10px] overflow-hidden hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 group border border-gray-100 hover:border-gray-200 relative flex flex-col">
            <Link href={`/product/${p.slug || p.id}`} onClick={()=> handleProductClick(p)} className="h-[168px] bg-[#fcfcfc] flex items-center justify-center p-3 relative overflow-hidden block">
              <img 
                src={p._img} 
                alt={p.title||p.name} 
                loading="lazy"
                decoding="async"
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-500"
              />
              {/* ✅ TOP LEFT - Discount Only if Real */}
              <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                {p._discount > 0 && <span className="bg-[#f85606] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">-{p._discount}%</span>}
                {p._isTrending && <span className="bg-black text-white text-[8px] font-black px-2 py-0.5 rounded-full">🔥 {p._sold} Sold</span>}
              </div>
              {/* ✅ TOP RIGHT - Wishlist - Real Position */}
              <button onClick={(e)=>toggleWishlist(e,p)} className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-md backdrop-blur-sm transition active:scale-90 ${wishlist.includes(p.id)?'bg-[#ff1a00] text-white':'bg-white/90 hover:bg-white text-gray-600 hover:text-black'}`}>♥</button>
              
              {/* ✅ BOTTOM LEFT - Free Delivery - Real Only - Correct Place */}
              {p._isFreeDelivery && <span className="absolute bottom-2 left-2 bg-[#00b578] text-white text-[9px] font-black px-2 py-1 rounded-full shadow flex items-center gap-1">✓ Free Delivery</span>}
            </Link>
            <div className="p-2.5 flex flex-col flex-1">
              <Link href={`/product/${p.slug || p.id}`} onClick={()=> handleProductClick(p)} className="block"><p className="text-[12px] line-clamp-2 h-[32px] leading-[16px] text-[#212121] group-hover:text-[#f85606] transition">{p.title||p.name}</p></Link>
              <div className="mt-2 flex items-baseline gap-1.5">
                <p className="text-[#f85606] font-black text-[16px]">৳{Number(p.price).toLocaleString()}</p>
                {p.original_price && Number(p.original_price) > Number(p.price) && <p className="text-[11px] text-gray-400 line-through">৳{Number(p.original_price).toLocaleString()}</p>}
              </div>
              {/* ✅ REAL RATING & SOLD - No Fake */}
              <div className="flex items-center justify-between mt-2">
                {p._discount > 0 ? <p className="text-[10px] text-[#f85606] font-bold">-{p._discount}% OFF</p> : <div></div>}
                <div className="flex items-center gap-1 text-[10px] text-[#757575]">
                  {p._rating && <span className="flex items-center gap-0.5">⭐ {p._rating}</span>}
                  {p._sold > 0 && <><span>•</span><span>{p._sold} Sold</span></>}
                  {p._sold === 0 && p._reviewCount > 0 && <span>{p._reviewCount} Reviews</span>}
                </div>
              </div>
              <div className="grid grid-cols-[1fr_32px] gap-1.5 mt-3">
                <button onClick={(e)=>addToCart(e,p)} className="bg-[#fff1e6] text-[#f85606] border border-[#ffe0cc] py-2 rounded-full text-[11px] font-black hover:bg-[#f85606] hover:text-white hover:border-[#f85606] transition active:scale-95">Add to Cart</button>
                <Link href={`/product/${p.slug||p.id}`} onClick={()=> handleProductClick(p)} className="bg-[#f5f5f5] rounded-full flex items-center justify-center text-[13px] hover:bg-black hover:text-white transition font-bold">↗</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div ref={loadMoreRef} className="h-4 w-full"></div>

      {visibleCount < products.length && (
        <div className="text-center mt-6 flex flex-col items-center gap-3">
          <p className="text-[11px] text-[#666] bg-white px-4 py-1.5 rounded-full border shadow-sm">Showing {visibleCount} of {products.length} products</p>
          <button onClick={()=> { setIsLoadingMore(true); setTimeout(()=>{ setVisibleCount(c=> Math.min(c+12, products.length)); setIsLoadingMore(false) }, 200) }} disabled={isLoadingMore} className="border-2 border-[#F85606] text-[#F85606] px-10 py-2.5 rounded-full text-[13px] font-black hover:bg-[#F85606] hover:text-white transition shadow-sm hover:shadow-lg active:scale-95 disabled:opacity-50">
            {isLoadingMore ? 'Loading...' : `LOAD MORE (${products.length - visibleCount} MORE)`}
          </button>
        </div>
      )}

      {visibleCount >= products.length && products.length > 0 && products.length >= 12 && (
        <div className="text-center mt-8 pb-2">
          <div className="bg-white border rounded-full inline-flex items-center gap-2 px-5 py-2 shadow-sm">
            <span className="text-[12px]">🎉</span>
            <p className="text-[12px] font-bold text-[#333]">You have seen all {products.length} products</p>
          </div>
          <div className="mt-3">
            <Link href="/search" className="text-[12px] font-bold text-[#f85606] hover:underline">Explore More Categories →</Link>
          </div>
        </div>
      )}
    </div>
  )
}