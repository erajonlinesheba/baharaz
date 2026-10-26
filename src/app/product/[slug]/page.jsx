'use client'
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

const DELIVERY_CHARGES = {
  Rajshahi: 55, Dhaka: 80, Chittagong: 100, Chattogram: 100, Khulna: 80, Sylhet: 100, Barisal: 95, Barishal: 95, Rangpur: 60, Mymensingh: 85, Bogura: 60, Bogra: 60, Comilla: 90, Cumilla: 90, Rajbari: 90, Natore: 60, Pabna: 65, Sirajganj: 70, CoxBazar: 110, CoxsBazar: 110, Jessore: 75, Jashore: 75, Kushtia: 70, Dinajpur: 70, Feni: 100, Noakhali: 100, Tangail: 85, Gazipur: 80, Narayanganj: 80
}

const getInstantCache = (slug) => {
  try {
    const prodCache = sessionStorage.getItem(`baharaz_prod_${slug}`)
    if (prodCache) {
      const parsed = JSON.parse(prodCache)
      if (parsed?.id) return parsed
    }
    const lastList = JSON.parse(sessionStorage.getItem('baharaz_last_list') || '[]')
    const found = lastList.find(x => x.slug === slug || x.id === slug || x.id?.toString() === slug)
    if (found) return found
    const homeCache = JSON.parse(localStorage.getItem('baharaz_home_cache') || '[]')
    const f2 = homeCache.find(x => x.slug === slug || x.id === slug)
    if (f2) return f2
  } catch {}
  return null
}

export default function ProductDetailsPage(){
  const params = useParams()
  const slug = params?.slug
  const router = useRouter()

  const [isClient, setIsClient] = useState(false)
  const [product,setProduct] = useState(null)
  const [sellerInfo,setSellerInfo]=useState(null)
  const [loading,setLoading]=useState(true)
  const [activeImage,setActiveImage]=useState(0)
  const [showVideo,setShowVideo]=useState(false)
  const [zoomPos,setZoomPos]=useState({ x:0, y:0, show:false })
  const [selectedColor,setSelectedColor]=useState(null)
  const [selectedSize,setSelectedSize]=useState(null)
  const [quantity,setQuantity]=useState(1)
  const [deliveryLocation,setDeliveryLocation]=useState('Rajshahi')
  const [relatedProducts,setRelatedProducts]=useState([])
  const [sameStoreProducts,setSameStoreProducts]=useState([])
  const [qualityProducts,setQualityProducts]=useState([])
  const [trendingProducts,setTrendingProducts]=useState([])
  const [reviews,setReviews]=useState([])
  const [flashSale,setFlashSale]=useState(null)
  const [timeLeft,setTimeLeft]=useState({h:2,m:15,s:30})
  const [wishlisted,setWishlisted]=useState(false)
  const [guaranteedDate, setGuaranteedDate] = useState('')
  const mainImageRef=useRef(null)

  const deliveryCharge = useMemo(()=> DELIVERY_CHARGES[deliveryLocation] || 55, [deliveryLocation])

  const breadcrumbData = useMemo(()=>{
    if(!product) return []
    const cat = product.category || ''
    if(cat.includes('>')) return cat.split('>').map(c=>c.trim()).filter(Boolean)
    if(cat.includes('/')) return cat.split('/').map(c=>c.trim()).filter(Boolean)
    const parts = []
    if(product.main_category) parts.push(product.main_category)
    if(product.category) parts.push(product.category)
    if(product.sub_category) parts.push(product.sub_category)
    const uniq = [...new Set(parts)].filter(Boolean)
    return uniq.length>0? uniq : [cat].filter(Boolean)
  },[product])

  useEffect(()=>{
    setIsClient(true)
    setGuaranteedDate(new Date(Date.now()+2*86400000).toLocaleDateString())
    if(slug){
      const cache = getInstantCache(slug)
      if(cache){
        const tempImgs = []
        try{
          if(Array.isArray(cache.images)) cache.images.forEach(i=> typeof i==='string'? tempImgs.push(i) : i?.url && tempImgs.push(i.url))
          if(cache.image_url) tempImgs.push(cache.image_url)
          if(cache.image) tempImgs.push(cache.image)
          if(cache.thumbnail) tempImgs.push(cache.thumbnail)
          if(cache.images && typeof cache.images === 'string'){
            const p = JSON.parse(cache.images)
            if(Array.isArray(p)) p.forEach(i=> typeof i==='string' && tempImgs.push(i))
          }
        }catch{}
        const fImgs = [...new Set(tempImgs)].filter(Boolean)
        setProduct({
          id: cache.id,
          slug: cache.slug || cache.id,
          title: cache.title||cache.name||'Premium Product',
          brand: cache.brand||'No Brand',
          rating: Number(cache.rating)||4.8,
          review_count: cache.review_count||12,
          price: Number(cache.price)||0,
          original_price: Number(cache.original_price||cache.price)||0,
          discount: cache.discount_percent || cache.discount || 0,
          images: fImgs.length? fImgs : [cache.image || cache.image_url || cache.thumbnail || 'https://via.placeholder.com/800x800?text=Baharaz'],
          colors: cache.colors || [], sizes: cache.sizes || [],
          description: cache.description||'',
          category: cache.category||'General',
          main_category: cache.main_category||'',
          sub_category: cache.sub_category||'',
          stock: cache.stock||1000,
          sku: cache.sku || `BAH-${cache.id?.slice(0,8)}`,
          material: cache.material||'Premium',
          is_mall: cache.is_mall||false,
          seller: { id: cache.seller_id, name: cache.shop_name||cache.seller_name||cache.seller?.name||'Baharaz Store', district: 'Rajshahi', is_verified: true, logo: cache.shop_logo||'', slug: '', joined: '2024' }
        })
        setLoading(false)
      }
    }
  },[slug])

  useEffect(()=>{
    const detectLocation = async()=>{
      try{
        const saved = localStorage.getItem('baharaz_delivery_location')
        if(saved && DELIVERY_CHARGES[saved]){
          setDeliveryLocation(saved)
          return
        }
        try{
          const res = await fetch('https://ipapi.co/json/').then(r=>r.json())
          if(res && res.city){
            let city = res.city
            const keys = Object.keys(DELIVERY_CHARGES)
            const found = keys.find(k=> city.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(city.toLowerCase()))
            if(found){
              setDeliveryLocation(found)
              localStorage.setItem('baharaz_delivery_location', found)
              return
            }
            if(city.toLowerCase().includes('dhaka')){ setDeliveryLocation('Dhaka'); localStorage.setItem('baharaz_delivery_location','Dhaka'); return }
            if(city.toLowerCase().includes('rajshahi')){ setDeliveryLocation('Rajshahi'); localStorage.setItem('baharaz_delivery_location','Rajshahi'); return }
            if(city.toLowerCase().includes('chittagong') || city.toLowerCase().includes('chattogram')){ setDeliveryLocation('Chittagong'); localStorage.setItem('baharaz_delivery_location','Chittagong'); return }
            if(city.toLowerCase().includes('khulna')){ setDeliveryLocation('Khulna'); localStorage.setItem('baharaz_delivery_location','Khulna'); return }
            if(city.toLowerCase().includes('sylhet')){ setDeliveryLocation('Sylhet'); localStorage.setItem('baharaz_delivery_location','Sylhet'); return }
          }
        }catch{}
      }catch{}
    }
    detectLocation()
  },[])

  useEffect(()=>{
    const timer = setInterval(()=>{
      setTimeLeft(prev=>{
        let {h,m,s}=prev
        if(s>0) s--
        else if(m>0){ m--; s=59 }
        else if(h>0){ h--; m=59; s=59 }
        else { h=2; m=15; s=30 }
        return {h,m,s}
      })
    },1000)
    return ()=>clearInterval(timer)
  },[])

  const getImageUrl = useCallback((p, index = 0) => {
    try {
      if (p?.images && Array.isArray(p.images) && p.images.length > 0) {
        let img = p.images[index] || p.images[0]
        if (typeof img === 'string') return img
        if (img?.url) return img.url
      }
      if (p?.images && typeof p.images === 'string') {
        const parsed = JSON.parse(p.images)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[index] || parsed[0]
        if (typeof parsed === 'string') return parsed
      }
      if (p?.image) return p.image
      if (p?.image_url) return p.image_url
      if (p?.thumbnail) return p.thumbnail
    } catch {}
    return 'https://via.placeholder.com/800x800?text=No+Image'
  }, [])

  useEffect(()=>{
    if(!slug || !isClient) return
    let cancelled = false

    const fetchAll = async()=>{
      try{
        try{
          const cached = sessionStorage.getItem(`baharaz_prod_${slug}`)
          if(cached){
            const c = JSON.parse(cached)
            if(c?.id && !cancelled && !product){
              setProduct(c)
              setSellerInfo(c.sellerInfo || null)
              if(c.colors?.length) setSelectedColor(c.colors[0])
              if(c.sizes?.length) setSelectedSize(c.sizes[0])
            }
          }
        }catch{}

        const decoded = decodeURIComponent(slug).trim()
        let productData = null
        
        const { data: byId } = await supabase.from('products').select('*').eq('id', decoded).maybeSingle()
        if(byId) productData = byId
        
        if(!productData){
          const { data: bySlug } = await supabase.from('products').select('*').eq('slug', decoded).maybeSingle()
          if(bySlug) productData = bySlug
        }

        if(!productData || cancelled){ 
          setLoading(false)
          return 
        }

        let sellerData = null
        if(productData.seller_id){
          const { data: s0 } = await supabase.from('sellers').select('id,user_id,shop_name,name,shop_slug,slug,shop_logo,logo_url,avatar,district,city,created_at').eq('id', productData.seller_id).maybeSingle()
          if(s0){
            const logo = s0.shop_logo || s0.logo_url || s0.avatar || ''
            sellerData = {
              id: s0.id,
              user_id: s0.user_id,
              shop_name: s0.shop_name || s0.name || 'Baharaz Store',
              full_name: s0.shop_name || s0.name,
              district: s0.district || s0.city || 'Rajshahi',
              is_verified: true,
              is_mall: false,
              slug: s0.shop_slug || s0.slug || '',
              logo_url: logo, avatar: logo, logo: logo,
              created_at: s0.created_at,
            }
          }
        }
        if(!sellerData){
          const logo3 = productData.shop_logo || ''
          sellerData = {
            shop_name: productData.shop_name || 'Baharaz Store',
            full_name: productData.shop_name || 'Baharaz Store',
            district: 'Rajshahi',
            is_verified: true, is_mall: false,
            slug: '',
            logo_url: logo3, avatar: logo3, logo: logo3,
            created_at: productData.created_at
          }
        }
        if(cancelled) return
        setSellerInfo(sellerData)
        if(productData.is_flash_sale) setFlashSale({ discount: productData.discount_percent || 20 })

        const selectLight = '*'
        
        const [reviewRes, relRes, storeRes] = await Promise.allSettled([
          supabase.from('reviews').select('*').eq('product_id', productData.id).order('created_at',{ascending:false}).limit(10),
          supabase.from('products').select(selectLight).eq('category', productData.category).neq('id', productData.id).limit(12),
          productData.seller_id ? supabase.from('products').select(selectLight).eq('seller_id', productData.seller_id).neq('id', productData.id).limit(6) : Promise.resolve({data:[]})
        ])

        if(!cancelled){
          if(reviewRes.status==='fulfilled' && reviewRes.value.data) setReviews(reviewRes.value.data)
          if(relRes.status==='fulfilled' && relRes.value.data){
            const relData = relRes.value.data || []
            setRelatedProducts(relData.slice(0,6))
            setQualityProducts(relData.slice(0,6))
            setTrendingProducts(relData.slice(0,6))
          }
          if(storeRes.status==='fulfilled' && storeRes.value.data) setSameStoreProducts(storeRes.value.data)
        }

        const allImgs = []
        try {
          if (productData.images && Array.isArray(productData.images)) {
            productData.images.forEach(i => {
              if (typeof i === 'string') allImgs.push(i)
              else if (i?.url) allImgs.push(i.url)
            })
          }
          if (productData.images && typeof productData.images === 'string') {
            const parsed = JSON.parse(productData.images)
            if (Array.isArray(parsed)) parsed.forEach(i => typeof i === 'string' && allImgs.push(i))
          }
        } catch {}
        if (productData.image_url) allImgs.push(productData.image_url)
        if (productData.image) allImgs.push(productData.image)
        const finalImages = [...new Set(allImgs)].filter(Boolean)
        const images = finalImages.length > 0? finalImages : ['https://via.placeholder.com/800x800?text=No+Image']

        let colors = []
        if(productData.colors){ if(Array.isArray(productData.colors)) colors=productData.colors; else if(typeof productData.colors==='string'){ try{ const p=JSON.parse(productData.colors); colors=Array.isArray(p)?p:[p] } catch{ colors=[productData.colors] } } }
        let sizes = []
        if(productData.sizes){ if(Array.isArray(productData.sizes)) sizes=productData.sizes; else if(typeof productData.sizes==='string'){ try{ const p=JSON.parse(productData.sizes); sizes=Array.isArray(p)?p:[p] } catch{ sizes=[productData.sizes] } } }

        const price = Number(productData.price) || 0
        const original_price = Number(productData.original_price || productData.price) || 0
        const realShopName = sellerData?.shop_name || productData.shop_name || 'Baharaz Store'
        const isReallyMall = productData.is_baharaz_mall === true || sellerData?.is_mall === true

        const finalProduct = {
          id: productData.id,
          slug: productData.slug || productData.id,
          title: productData.title || productData.name,
          brand: productData.brand || 'No Brand',
          rating: Number(productData.rating)||4.8,
          review_count: Number(productData.review_count)||12,
          price, original_price,
          discount: productData.discount_percent || (original_price>price? Math.round(((original_price-price)/original_price)*100) : 0),
          images, video: productData.video_url || '', colors, sizes,
          description: productData.description || '',
          short_desc: productData.short_description || '',
          category: productData.category || 'General',
          main_category: productData.main_category || '',
          sub_category: productData.sub_category || '',
          stock: productData.stock || 1000,
          sku: productData.sku || `BAH-${productData.id?.slice(0,8)}`,
          material: productData.material || 'Premium',
          is_mall: isReallyMall,
          seller: {
            id: sellerData?.id || productData.seller_id,
            name: realShopName,
            slug: sellerData?.slug || '',
            district: sellerData?.district || 'Rajshahi',
            is_verified: true, is_mall: false,
            logo: sellerData?.logo_url || '',
            joined: sellerData?.created_at? new Date(sellerData.created_at).getFullYear() : '2024'
          }
        }

        if(cancelled) return
        setProduct(finalProduct)

        try {
          const saveKeys = ["baharaz_recently_viewed", "baharaz_recent"];
          saveKeys.forEach(key => {
            let recent = JSON.parse(localStorage.getItem(key) || '[]');
            recent = recent.filter(r => r.id !== finalProduct.id);
            recent.unshift({
              id: finalProduct.id,
              name: finalProduct.title,
              title: finalProduct.title,
              price: finalProduct.price,
              original_price: finalProduct.original_price,
              image: finalProduct.images[0],
              image_url: finalProduct.images[0],
              thumbnail: finalProduct.images[0],
              slug: finalProduct.slug,
              category: finalProduct.category,
              viewed_at: new Date().toISOString()
            });
            localStorage.setItem(key, JSON.stringify(recent.slice(0, 24)));
          });
        } catch {}

        try{
          sessionStorage.setItem(`baharaz_prod_${slug}`, JSON.stringify({...finalProduct, sellerInfo: sellerData, colors, sizes}))
        }catch{}
        if(colors.length>0) setSelectedColor(prev=> prev || colors[0])
        if(sizes.length>0) setSelectedSize(prev=> prev || sizes[0])

      } catch(e){ console.log(e?.message) } finally{ if(!cancelled) setLoading(false) }
    }
    fetchAll()
    return ()=> { cancelled = true }
  },[slug, getImageUrl, isClient])

  const handleMouseMove = useCallback((e)=>{
    if(!mainImageRef.current) return
    const rect = mainImageRef.current.getBoundingClientRect()
    setZoomPos({ x:((e.clientX-rect.left)/rect.width)*100, y:((e.clientY-rect.top)/rect.height)*100, show:true })
  }, [])

  const handleAddToCart = useCallback(()=>{
    if(!product) return
    const cart = JSON.parse(localStorage.getItem('baharaz_cart')||'[]')
    const existing = cart.findIndex(i=>i.id===product.id && i.color===selectedColor && i.size===selectedSize)
    if(existing>=0) cart[existing].qty += quantity
    else cart.push({
      id:product.id,
      slug:product.slug,
      title:product.title,
      price:product.price,
      image:product.images[0],
      qty:quantity,
      color:selectedColor,
      size:selectedSize,
      seller_name: product.seller?.name,
      stock: product.stock
    })
    localStorage.setItem('baharaz_cart', JSON.stringify(cart))
    localStorage.setItem('eRajCart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))
  }, [product, selectedColor, selectedSize, quantity])

  const handleBuyNowDirect = useCallback(()=>{
    if(!product) return
    const checkoutItem = {
      id:product.id,
      slug:product.slug,
      title:product.title,
      price:product.price,
      image:product.images[0],
      qty:quantity,
      color:selectedColor,
      size:selectedSize,
      seller_name: product.seller?.name,
      stock: product.stock
    }
    const subtotal = product.price * quantity
    const deliveryFee = deliveryCharge
    const total = subtotal + deliveryFee
    localStorage.removeItem('baharaz_checkout_items')
    localStorage.removeItem('baharaz_checkout_summary')
    localStorage.removeItem('baharaz_buy_now')
    localStorage.setItem('baharaz_checkout_items', JSON.stringify([checkoutItem]))
    localStorage.setItem('baharaz_checkout_summary', JSON.stringify({
      subtotal, deliveryFee, discount: 0, total, deliveryLocation, isGift: false, type: 'buy_now'
    }))
    localStorage.setItem('baharaz_buy_now', JSON.stringify(checkoutItem))
    localStorage.setItem('baharaz_checkout_type', 'buy_now')
    router.push(`/checkout?buy_now=1&t=${Date.now()}`)
  }, [product, quantity, selectedColor, selectedSize, deliveryCharge, deliveryLocation, router])

  const handleChat = useCallback(()=>{
    if(product?.seller?.id) router.push(`/chat?seller=${product.seller.id}&product=${product.id}`)
    else router.push(`/chat?store=${product?.seller?.slug || product?.seller?.name}`)
  }, [product, router])

  const handleWishlist = useCallback(()=>{
    setWishlisted(v=>!v)
    const w = JSON.parse(localStorage.getItem('baharaz_wishlist')||'[]')
    if(!wishlisted){ w.push(product.id); localStorage.setItem('baharaz_wishlist', JSON.stringify(w)) }
    else { localStorage.setItem('baharaz_wishlist', JSON.stringify(w.filter(id=>id!==product.id))) }
    window.dispatchEvent(new Event('wishlistUpdated'))
  }, [wishlisted, product])

  const handleShare = async()=>{
    if(navigator.share){ await navigator.share({ title: product.title, url: window.location.href }) }
    else { navigator.clipboard.writeText(window.location.href); }
  }

  if(!isClient){
    return (
      <div className="w-full bg-[#f5f5f7] min-h-screen pb-[80px] lg:pb-0 overflow-x-hidden">
        <div className="w-full max-w-[1188px] mx-auto px-0 md:px-4">
          <div className="bg-white md:rounded-[12px] p-4 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] xl:grid-cols-[380px_1fr_320px] gap-4">
              <div className="h-[380px] bg-gray-100 rounded-[12px]"></div>
              <div className="space-y-4"><div className="h-8 bg-gray-100 rounded"></div><div className="h-6 bg-gray-100 rounded w-2/3"></div><div className="h-[120px] bg-gray-100 rounded-[12px]"></div></div>
              <div className="hidden xl:block h-[400px] bg-gray-100 rounded-[12px]"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if(loading && !product) return (
    <div className="w-full bg-[#f5f5f7] min-h-screen pb-[80px] lg:pb-0 overflow-x-hidden">
      <div className="w-full max-w-[1188px] mx-auto px-0 md:px-4">
        <div className="bg-white md:rounded-[12px] p-4 animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] xl:grid-cols-[380px_1fr_320px] gap-4">
            <div className="h-[380px] bg-gray-100 rounded-[12px]"></div>
            <div className="space-y-4"><div className="h-8 bg-gray-100 rounded"></div><div className="h-6 bg-gray-100 rounded w-2/3"></div><div className="h-[120px] bg-gray-100 rounded-[12px]"></div></div>
            <div className="hidden xl:block h-[400px] bg-gray-100 rounded-[12px]"></div>
          </div>
        </div>
      </div>
    </div>
  )
  if(!product) return <div className="p-20 text-center font-bold">Product Not Found - {slug}<br/><Link prefetch={false} href="/" className="text-orange-600 underline mt-4 inline-block">Go Home</Link></div>

  const safeColors = Array.isArray(product.colors)? product.colors : []
  const safeSizes = Array.isArray(product.sizes)? product.sizes : []
  const safeImages = Array.isArray(product.images)? product.images : [product.images]
  const avgRating = reviews.length>0? (reviews.reduce((a,b)=>a+Number(b.rating||0),0)/reviews.length).toFixed(1) : (product.rating>0? product.rating.toFixed(1) : '4.8')
  const totalPrice = product.price*quantity + deliveryCharge

  return (
    <div className="w-full bg-[#f5f5f7] min-h-screen pb-[80px] lg:pb-0 overflow-x-hidden">
      {flashSale && flashSale.discount>0 && (
        <div className="bg-gradient-to-r from-[#ff1a00] to-[#ff6a00] text-white relative z-20 shadow">
          <div className="w-full max-w-[1188px] mx-auto px-2 md:px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3"><span className="font-black text-[12px] md:text-[13px] truncate">FLASH SALE • {flashSale.discount}% OFF - {product.title}</span></div>
            <div className="flex items-center gap-1 text-[11px] md:text-[12px] font-black shrink-0"><span className="bg-black px-2 py-1 rounded">{String(timeLeft.h).padStart(2,'0')}</span>:<span className="bg-black px-2 py-1 rounded">{String(timeLeft.m).padStart(2,'0')}</span>:<span className="bg-black px-2 py-1 rounded">{String(timeLeft.s).padStart(2,'0')}</span></div>
          </div>
        </div>
      )}

      {/* ✅ FIXED SIZE - 1188px - Desktop Phone Same - কাটবে না */}
      <div className="w-full max-w-[1188px] mx-auto bg-white md:rounded-[12px] overflow-hidden shadow-sm mt-0 md:mt-3 border-0 md:border">
        <nav aria-label="Breadcrumb" className="flex px-3 md:px-5 py-3 text-[11px] md:text-[12px] text-[#757575] gap-2 border-b bg-[#fcfcfc] items-center justify-between overflow-hidden" suppressHydrationWarning>
          <div className="flex gap-1.5 md:gap-2 items-center flex-wrap overflow-hidden">
            <Link prefetch={false} href="/" className="hover:text-[#1a9cb7] hover:underline shrink-0">Home</Link>
            {breadcrumbData.map((cat, idx)=>(
              <span key={idx} className="flex items-center gap-1.5 md:gap-2 shrink-0">
                <span className="text-[10px]">›</span>
                <Link prefetch={false} href={`/search?category=${encodeURIComponent(cat)}`} className="hover:text-[#1a9cb7] hover:underline capitalize truncate max-w-[80px] md:max-w-none">{cat}</Link>
              </span>
            ))}
            <span className="text-[10px] shrink-0">›</span>
            <span className="text-[#212121] font-normal truncate max-w-[120px] md:max-w-[300px]">{product.title}</span>
          </div>
          <div className="hidden lg:flex gap-2 shrink-0"><button onClick={handleWishlist} className={`px-3 py-1 rounded-full border text-[11px] font-black ${wishlisted?'bg-red-500 text-white border-red-500':'bg-white'}`}>{wishlisted?'♥ Wishlisted':'♡ Wishlist'}</button><button onClick={handleShare} className="px-3 py-1 rounded-full border bg-white text-[11px] font-black">Share</button></div>
        </nav>

        {/* ✅ FIXED GRID - Laptop এ কাটবে না - 1024px এ 2 কলাম, 1280px এ 3 কলাম */}
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] xl:grid-cols-[380px_1fr_320px] gap-0">
          <div className="bg-white p-2 md:p-4 border-b lg:border-b-0 lg:border-r">
            <div className="relative w-full h-[300px] md:h-[380px] bg-white overflow-hidden rounded-[12px] border flex items-center justify-center" ref={mainImageRef} onMouseMove={handleMouseMove} onMouseLeave={()=>setZoomPos(p=>({...p,show:false}))}>
              {showVideo && product.video? <video src={product.video} controls autoPlay className="w-full h-full object-contain bg-black"/> : <>
                <Image src={safeImages[activeImage]} alt={product.title} fill className="object-contain p-2 md:p-4" unoptimized priority fetchPriority="high" sizes="(max-width:768px) 100vw, 380px" />
                {zoomPos.show && <div className="hidden xl:block absolute inset-0 z-10 pointer-events-none" style={{ backgroundImage:`url(${safeImages[activeImage]})`, backgroundPosition:`${zoomPos.x}% ${zoomPos.y}%`, backgroundSize:'250%', backgroundRepeat:'no-repeat' }}></div>}
              </>}
              {product.is_mall && <div className="absolute top-3 left-3 bg-[#7b1fa2] text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow">BAHARAZ MALL</div>}
              {product.discount>0 && <div className="absolute top-3 right-3 bg-[#ff1a00] text-white text-[11px] font-black px-2.5 py-1 rounded-full">-{product.discount}%</div>}
              <button onClick={handleWishlist} className="absolute bottom-3 right-3 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center text-[16px] border"> {wishlisted?'❤️':'🤍'} </button>
            </div>
            <div className="flex gap-2 p-2 md:p-3 overflow-x-auto scrollbar-hide">
              {safeImages.map((img,i)=><button key={i} onClick={()=>{setActiveImage(i); setShowVideo(false)}} className={`min-w-[56px] md:min-w-[64px] h-[56px] md:h-[64px] rounded-[10px] border-2 overflow-hidden flex-shrink-0 bg-white ${activeImage===i &&!showVideo?'border-[#ff1a00] shadow':'border-gray-200'}`}><Image src={img} alt={`${product.title} ${i+1}`} width={64} height={64} className="object-contain w-full h-full p-1" unoptimized /></button>)}
            </div>
          </div>

          <div className="px-3 md:px-6 py-4 lg:py-5">
            <h1 className="text-[16px] md:text-[20px] xl:text-[22px] font-bold xl:font-black leading-[20px] md:leading-[26px] text-[#111] tracking-tight break-words">{product.title}</h1>
            <p className="text-[11px] text-[#888] mt-2 line-clamp-2">SKU: {product.sku} • Brand: {product.brand} • Category: <Link prefetch={false} href={`/search?category=${encodeURIComponent(product.category)}`} className="text-[#1a9cb7] hover:underline">{product.category}</Link> • {product.stock} in Stock</p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-[#ffb400] text-[13px]">★★★★★</span>
              <span className="text-[12px] md:text-[13px] font-black">{avgRating}</span>
              <span className="text-[11px] md:text-[12px] text-[#666]">({reviews.length>0? reviews.length : product.review_count||12} Ratings)</span>
              <span className="text-[10px] md:text-[11px] bg-[#e8f5e9] text-[#2e7d32] px-2 py-0.5 rounded-full font-bold">In Stock</span>
              {product.seller.is_verified && <span className="text-[10px] md:text-[11px] bg-[#e3f2fd] text-[#1565c0] px-2 py-0.5 rounded-full font-black">Verified Seller</span>}
              {product.is_mall && <span className="text-[10px] md:text-[11px] bg-[#f3e5f5] text-[#7b1fa2] px-2 py-0.5 rounded-full font-black">Baharaz Mall</span>}
            </div>

            <div className="mt-4 bg-gradient-to-br from-[#fff8f0] to-[#fff] border border-[#ffe0cc] md:border-2 p-3 md:p-4 rounded-[12px]">
              <div className="flex items-baseline gap-2 md:gap-3 flex-wrap"><span className="text-[24px] md:text-[32px] font-black text-[#ff1a00]">৳{product.price.toLocaleString()}</span>{product.discount>0 && <><span className="text-[13px] md:text-[15px] text-[#999] line-through">৳{product.original_price.toLocaleString()}</span><span className="bg-[#ff1a00] text-white text-[10px] md:text-[11px] font-black px-2 py-1 rounded-full">-{product.discount}%</span></>}</div>
              <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-dashed flex justify-between text-[10px] md:text-[11px] font-bold bg-[#fffaf5] p-2 rounded"><span>Product: ৳{(product.price*quantity).toLocaleString()}</span><span className="text-[#ff1a00]">+ Delivery ৳{deliveryCharge} = ৳{totalPrice.toLocaleString()}</span></div>
            </div>

            {safeColors.length>0 && <div className="mt-5"><p className="text-[12px] md:text-[13px] font-black mb-2.5">Color: <span className="font-bold text-[#ff1a00]">{selectedColor}</span></p><div className="flex gap-2 flex-wrap">{safeColors.map(c=><button key={c} onClick={()=>setSelectedColor(c)} className={`px-4 py-2 border-2 rounded-[10px] text-[11px] md:text-[12px] font-bold ${selectedColor===c?'border-[#ff1a00] bg-[#fff1eb] text-[#ff1a00]':'border-gray-200 bg-white'}`}>{c}</button>)}</div></div>}
            {safeSizes.length>0 && <div className="mt-4"><p className="text-[12px] md:text-[13px] font-black mb-2.5">Size: <span className="font-bold text-[#ff1a00]">{selectedSize}</span></p><div className="flex gap-2 flex-wrap">{safeSizes.map(s=><button key={s} onClick={()=>setSelectedSize(s)} className={`min-w-[44px] h-[40px] border-2 rounded-[10px] text-[11px] md:text-[12px] font-black ${selectedSize===s?'bg-black text-white border-black':'bg-white border-gray-200'}`}>{s}</button>)}</div></div>}

            <div className="mt-5 flex items-center gap-3"><p className="text-[12px] md:text-[13px] font-black">Quantity:</p><div className="flex items-center border-2 rounded-[10px] overflow-hidden"><button onClick={()=>setQuantity(Math.max(1,quantity-1))} className="w-10 h-10 hover:bg-gray-100 font-black text-[18px]">-</button><span className="w-12 text-center font-black text-[15px]">{quantity}</span><button onClick={()=>setQuantity(Math.min(product.stock,quantity+1))} className="w-10 h-10 hover:bg-gray-100 font-black text-[18px]">+</button></div><span className="text-[11px] text-[#666] font-bold">{product.stock} available</span></div>

            <div className="hidden lg:flex gap-3 mt-6">
              <button onClick={handleAddToCart} className="flex-1 h-[48px] bg-[#fff1e6] text-[#ff1a00] border-2 border-[#ff1a00] font-black rounded-[12px] hover:bg-[#ffe1cc] text-[14px]">Add to Cart</button>
              <button onClick={handleBuyNowDirect} className="flex-1 h-[48px] bg-gradient-to-r from-[#ff1a00] to-[#ff6a00] text-white font-black rounded-[12px] shadow text-[14px] hover:scale-[1.02] transition">Buy Now</button>
            </div>

            <div className="mt-6">
              <h2 className="font-black text-[14px] md:text-[15px] border-b pb-2.5">Product Details of {product.title}</h2>
              <p className="text-[12px] md:text-[13px] leading-6 md:leading-7 mt-3 whitespace-pre-wrap text-[#222]">{product.description || 'This product is 100% authentic from Baharaz.'}</p>
              <div className="mt-5 bg-[#fafafa] rounded-[12px] p-3 md:p-4 border">
                <h3 className="font-black text-[11px] md:text-[12px] mb-2.5">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-[11px] md:text-[12px]">
                  <div className="flex justify-between border-b pb-2"><span className="text-[#666]">Material</span><span className="font-bold">{product.material}</span></div>
                  <div className="flex justify-between border-b pb-2"><span className="text-[#666]">Category</span><span className="font-bold truncate ml-2">{product.category}</span></div>
                  <div className="flex justify-between border-b pb-2"><span className="text-[#666]">Brand</span><span className="font-bold">{product.brand}</span></div>
                  <div className="flex justify-between border-b pb-2"><span className="text-[#666]">Stock</span><span className="font-bold text-green-600">{product.stock} In Stock</span></div>
                  <div className="flex justify-between border-b pb-2"><span className="text-[#666]">Seller</span><span className="font-bold truncate ml-2">{product.seller.name}</span></div>
                  <div className="flex justify-between border-b pb-2"><span className="text-[#666]">Delivery</span><span className="font-bold">All Bangladesh</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ RIGHT SIDEBAR - Laptop এ কাটবে না - xl এ দেখাবে, lg তে নিচে */}
          <div className="bg-[#f9fafb] lg:bg-[#f9fafb] xl:bg-[#f9fafb] p-3 space-y-3 border-t lg:border-t-0 xl:border-l">
            <div className="bg-white rounded-[12px] border shadow-sm p-4">
              <h3 className="text-[11px] font-black tracking-widest text-[#111]">DELIVERY OPTIONS</h3>
              <div className="mt-4 space-y-4">
                <div className="flex gap-2.5"><div className="w-9 h-9 bg-[#e3f2fd] rounded-full flex items-center justify-center flex-shrink-0 text-[14px]">📍</div><div className="flex-1 min-w-0"><label className="text-[11px] font-bold text-[#666]">Delivery Location - Instant</label><div className="mt-1.5"><select value={deliveryLocation} onChange={e=>{ setDeliveryLocation(e.target.value); localStorage.setItem('baharaz_delivery_location', e.target.value)}} className="w-full font-black text-[12px] bg-[#f5f7ff] border-2 border-gray-200 rounded-[10px] px-2.5 py-2.5 outline-none focus:border-black truncate"><option value={deliveryLocation}>{deliveryLocation} - ৳{deliveryCharge}</option>{Object.keys(DELIVERY_CHARGES).filter(c=>c!==deliveryLocation).map(loc=><option key={loc} value={loc}>{loc} - ৳{DELIVERY_CHARGES[loc]}</option>)}</select></div><div className="mt-3 bg-[#f0f7ff] border border-[#1a9cb7]/20 p-2.5 rounded-[10px]"><p className="text-[11px] font-black text-[#111]">Standard Delivery • ৳{deliveryCharge} • Zero Second</p><p className="text-[11px] text-[#333] mt-1" suppressHydrationWarning>Guaranteed by {guaranteedDate || '2 days'}</p><p className="text-[11px] text-[#0a8a00] font-black mt-1.5">Cash on Delivery Available</p></div></div></div>
                <div className="pt-3 border-t flex gap-2.5"><div className="w-9 h-9 bg-[#fff3e0] rounded-full flex items-center justify-center flex-shrink-0 text-[14px]">↩️</div><div><p className="text-[11px] font-black">Return & Warranty - 14 Days Free Return</p><p className="text-[11px] text-[#555] mt-1 leading-5">14 Days Free Return - 100% Authentic</p></div></div>
              </div>
            </div>

            <div className="bg-white rounded-[12px] border shadow-sm p-4">
              <div className="flex justify-between items-center"><h3 className="text-[11px] font-black tracking-widest">SOLD BY</h3>{product.seller.slug && <Link prefetch={false} href={`/store/${product.seller.slug}`} className="text-[11px] text-[#1a9cb7] font-black hover:underline">Visit Store →</Link>}</div>
              <div className="flex gap-3 mt-4 items-center">
                <div className="w-[48px] h-[48px] rounded-[12px] bg-white border-2 border-gray-100 flex items-center justify-center overflow-hidden shadow flex-shrink-0">
                  {product.seller.logo? (
                    <img src={product.seller.logo} alt={`${product.seller.name} Logo`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#ff6a00] to-[#ff1a00] flex items-center justify-center text-white font-black text-[20px]">{product.seller.name?.charAt(0)?.toUpperCase() || 'B'}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-black flex items-center gap-1 leading-tight truncate">{product.seller.name} {product.seller.is_verified && <span className="bg-[#1a9cb7] text-white text-[8px] px-1 py-0.5 rounded-full font-black">✓</span>}</p>
                  <p className="text-[11px] text-[#666] font-bold mt-0.5 truncate">{product.seller.district} • Since {product.seller.joined}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 bg-[#fafafa] p-2.5 rounded-[10px] text-center border"><div><p className="font-black text-[12px]">4.9★</p><p className="text-[9px] text-[#666] font-bold">Rating</p></div><div className="border-x"><p className="font-black text-[12px]">98%</p><p className="text-[9px] text-[#666] font-bold">Ship on Time</p></div><div><p className="font-black text-[12px]">100%</p><p className="text-[9px] text-[#666] font-bold">Authentic</p></div></div>
              <div className="flex gap-2 mt-4">
                <button onClick={handleChat} className="flex-1 h-[40px] border-2 border-[#1a9cb7] text-[#1a9cb7] font-black rounded-[10px] text-[11px] hover:bg-[#e3f2fd]">Chat</button>
                <Link prefetch={false} href={product.seller.slug? `/store/${product.seller.slug}` : `/store/${product.seller.id || ''}`} className="flex-1 h-[40px] bg-black text-white font-black rounded-[10px] text-[11px] flex items-center justify-center hover:bg-gray-800">View Shop</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-t p-4 md:p-5">
          <h2 className="font-black text-[14px] md:text-[16px] flex items-center gap-2 flex-wrap">Ratings & Reviews of {product.title} <span className="text-[11px] md:text-[12px] font-normal text-[#666]">({reviews.length || 0})</span> <span className="bg-[#fff8e1] px-2 py-1 rounded-full text-[11px] md:text-[12px]">{avgRating} ★</span></h2>
          {reviews.length===0? <div className="text-center py-10 bg-[#fafafa] rounded-[12px] mt-4 border-2 border-dashed"><p className="text-[13px] font-bold">No reviews yet - Be First!</p><p className="text-[11px] text-[#666] mt-1">Be the first to review this product</p></div> : <div className="mt-4 space-y-3">{reviews.map((r,i)=><div key={i} className="border-b pb-3"><div className="flex gap-2 items-center"><span className="text-[#ffb400] text-[12px]">{'★'.repeat(Number(r.rating)||5)}</span><span className="text-[10px] bg-[#e8f5e9] text-[#2e7d32] px-2 py-0.5 rounded-full font-bold">Verified Purchase</span></div><p className="text-[12px] md:text-[13px] mt-2 leading-6 text-[#222]">{r.comment||r.review_text||'Excellent product!'}</p></div>)}</div>}
        </div>

        {sameStoreProducts.length>0 && (
          <div className="bg-[#f9fafb] border-t p-4 md:p-5">
            <div className="flex justify-between items-center">
              <h2 className="font-black text-[14px] md:text-[16px]">From Same Store - Unlimited</h2>
              <Link prefetch={false} href={product.seller.slug? `/store/${product.seller.slug}` : `/search?seller=${product.seller.id}`} className="hidden md:flex text-[11px] font-black text-white bg-black px-3 py-1.5 rounded-full hover:bg-gray-800">View Store →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3 mt-4">
              {sameStoreProducts.map(p=>(
                <Link prefetch={false} key={`store-${p.id}`} href={`/product/${p.slug||p.id}`} className="bg-white border rounded-[12px] overflow-hidden hover:shadow-lg hover:border-black transition group" onClick={()=>{try{sessionStorage.setItem('baharaz_last_list', JSON.stringify(sameStoreProducts))}catch{}}}>
                  <div className="aspect-square bg-white overflow-hidden relative">
                    <img src={getImageUrl(p,0)} alt={p.name || p.title} className="w-full h-full object-contain p-2 group-hover:scale-105 transition duration-300" loading="lazy"/>
                    {p.discount_price && <span className="absolute top-2 right-2 bg-[#ff1a00] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">-{Math.round(((p.price - p.discount_price)/p.price)*100)}%</span>}
                  </div>
                  <div className="p-2.5">
                    <p className="text-[11px] line-clamp-2 h-[32px] font-medium leading-4">{p.name || p.title}</p>
                    <p className="text-[13px] font-black text-[#ff1a00] mt-1.5">৳{Number(p.discount_price||p.price).toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {qualityProducts.length>0 && (
          <div className="bg-white border-t p-4 md:p-5">
            <h2 className="font-black text-[14px] md:text-[16px]">Similar Products - Unlimited Collection</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3 mt-4">
              {qualityProducts.map(p=>(
                <Link prefetch={false} key={`similar-${p.id}`} href={`/product/${p.slug||p.id}`} className="bg-white border rounded-[12px] overflow-hidden hover:shadow-lg transition group" onClick={()=>{try{sessionStorage.setItem('baharaz_last_list', JSON.stringify(qualityProducts))}catch{}}}>
                  <div className="aspect-square bg-white overflow-hidden relative">
                    <img src={getImageUrl(p,0)} alt={p.name || p.title} className="w-full h-full object-contain p-2 group-hover:scale-105 transition duration-300" loading="lazy"/>
                  </div>
                  <div className="p-2.5">
                    <p className="text-[11px] line-clamp-2 h-[32px]">{p.name || p.title}</p>
                    <p className="text-[13px] font-black mt-1.5">৳{Number(p.discount_price||p.price).toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {trendingProducts.length>0 && (
          <div className="bg-[#f9fafb] border-t p-4 md:p-5">
            <h2 className="font-black text-[14px] md:text-[16px]">Customers Also Viewed - Trending</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3 mt-4">
              {trendingProducts.slice(0,6).map(p=>(
                <Link prefetch={false} key={`trend-${p.id}`} href={`/product/${p.slug||p.id}`} className="bg-white border rounded-[12px] overflow-hidden hover:shadow-lg transition group" onClick={()=>{try{sessionStorage.setItem('baharaz_last_list', JSON.stringify(trendingProducts))}catch{}}}>
                  <div className="aspect-square bg-white overflow-hidden relative">
                    <img src={getImageUrl(p,0)} alt={p.name || p.title} className="w-full h-full object-contain p-2" loading="lazy"/>
                    <span className="absolute top-2 left-2 bg-black text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">TRENDING</span>
                  </div>
                  <div className="p-2.5">
                    <p className="text-[11px] line-clamp-2 h-[32px]">{p.name || p.title}</p>
                    <p className="text-[13px] font-black text-[#ff1a00] mt-1.5">৳{Number(p.discount_price||p.price).toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 flex h-[60px] z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        <button onClick={handleAddToCart} className="flex-1 bg-[#fff1e6] text-[#ff1a00] font-black text-[13px] border-r-2 border-[#ffe0cc]">Add to Cart</button>
        <button onClick={handleBuyNowDirect} className="flex-[1.5] bg-gradient-to-r from-[#ff1a00] to-[#ff6a00] text-white font-black text-[13px]" suppressHydrationWarning>Buy Now • ৳{totalPrice.toLocaleString()}</button>
      </div>
    </div>
  )
}