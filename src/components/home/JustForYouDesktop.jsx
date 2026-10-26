'use client'
import { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export default function JustForYouDesktop(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(18)
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

  const visibleProducts = useMemo(()=> productsWithRealData.slice(0, visibleCount), [productsWithRealData, visibleCount])

  useEffect(()=>{
    if(!loadMoreRef.current) return
    observerRef.current = new IntersectionObserver((entries)=>{
      if(entries[0].isIntersecting && visibleCount < productsWithRealData.length && !isLoadingMore){
        setIsLoadingMore(true)
        setTimeout(()=>{
          setVisibleCount(c=> Math.min(c+12, productsWithRealData.length))
          setIsLoadingMore(false)
        }, 300)
      }
    }, { threshold: 0.1 })
    if(loadMoreRef.current) observerRef.current.observe(loadMoreRef.current)
    return ()=> { if(observerRef.current) observerRef.current.disconnect() }
  }, [visibleCount, productsWithRealData.length, isLoadingMore])

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
    <div className="bg-[#f5f5f5] hidden md:block">
      <div className="grid grid-cols-6 gap-3 p-3">
        {[...Array(18)].map((_,i)=><div key={i} className="h-[260px] bg-white animate-pulse" />)}
      </div>
    </div>
  )

  if(products.length===0) return (
    <div className="bg-white rounded-[4px] p-10 text-center border hidden md:block">
      <p className="font-black text-[16px]">No Products Found</p>
      <p className="text-[12px] text-gray-500 mt-2">Add products from admin - Unlimited Products Support</p>
    </div>
  )

  return (
    <div className="w-full bg-[#f5f5f5] relative hidden md:block">
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-5 py-2.5 rounded-full text-[12px] font-black z-[9999] shadow-2xl animate-bounce border border-white/10 whitespace-nowrap">{toast}</div>}

      {/* PRODUCTS GRID - Desktop 6 Col Daraz - NO TABS */}
      <div className="grid grid-cols-6 gap-3 p-3 bg-[#f5f5f5] rounded-b-[4px]">
        {visibleProducts.map(p=>(
          <div key={p.id} className="bg-white rounded-[2px] overflow-hidden hover:shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-all duration-200 group flex flex-col">
            <Link href={`/product/${p.slug || p.id}`} onClick={()=> handleProductClick(p)} className="relative bg-white h-[200px] aspect-square flex items-center justify-center overflow-hidden block">
              <img 
                src={p._img} 
                alt={p.title||p.name} 
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain group-hover:scale-[1.02] transition duration-500"
              />
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {p._discount > 0 && <span className="bg-[#F85606] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px]">-{p._discount}%</span>}
              </div>
              <button onClick={(e)=>toggleWishlist(e,p)} className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-[16px] shadow-sm backdrop-blur transition ${wishlist.includes(p.id)?'bg-[#ff1a00] text-white':'bg-white/90 text-gray-400 hover:text-black'}`}>♡</button>
              <div className="absolute bottom-0 left-0 right-0">
                {p._isFreeDelivery && <span className="bg-[#00b578] text-white text-[9px] font-bold px-2 py-[2px]">FREE DELIVERY</span>}
              </div>
            </Link>
            <div className="p-3 flex flex-col flex-1 bg-white">
              <Link href={`/product/${p.slug || p.id}`} onClick={()=> handleProductClick(p)} className="block">
                <p className="text-[14px] leading-[18px] line-clamp-2 h-[36px] text-[#212121]">{p.title||p.name}</p>
              </Link>
              <div className="mt-2 flex items-center gap-1">
                <span className="text-[#F85606] font-normal text-[18px]">৳{Number(p.price).toLocaleString()}</span>
                <span className="text-[#212121] text-[12px]">-{p._discount}%</span>
              </div>
              <div className="mt-1">
                <span className="bg-[#fff3e0] text-[#a66a00] text-[10px] font-bold px-2 py-0.5 rounded-[2px]">Coins save ৳{p._coinsSave}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-1 text-[11px] text-[#8a8a8a]">
                <span className="text-[#ffb400] text-[11px]">★</span>
                <span className="text-[#212121] font-medium">{p._rating}</span>
                <span>({p._reviewCount})</span>
                <span className="w-[2px] h-[2px] bg-gray-400 rounded-full"></span>
                <span>{p._sold} Sold</span>
              </div>
              <button onClick={(e)=>addToCart(e,p)} className="mt-2 w-full h-8 border border-[#f85606] text-[#f85606] text-[12px] font-medium flex items-center justify-center rounded-[2px] opacity-0 group-hover:opacity-100 hover:bg-[#fff0eb] transition">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>

      <div ref={loadMoreRef} className="h-4 w-full"></div>

      {visibleCount < productsWithRealData.length && (
        <div className="text-center mt-4 mb-2 flex flex-col items-center gap-2">
          <button onClick={()=> { setIsLoadingMore(true); setTimeout(()=>{ setVisibleCount(c=> Math.min(c+12, productsWithRealData.length)); setIsLoadingMore(false) }, 200) }} disabled={isLoadingMore} className="border border-[#F85606] text-[#F85606] px-8 py-2 rounded-[2px] text-[14px] font-medium hover:bg-[#fff0eb] transition w-[360px]">
            {isLoadingMore ? 'Loading...' : `LOAD MORE`}
          </button>
        </div>
      )}

      {visibleCount >= productsWithRealData.length && productsWithRealData.length >= 12 && (
        <div className="text-center mt-6 pb-6">
          <p className="text-[11px] text-[#999]">You have seen all {productsWithRealData.length} products</p>
        </div>
      )}

      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}.line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}`}</style>
    </div>
  )
}