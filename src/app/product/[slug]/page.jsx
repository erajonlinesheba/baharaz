'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

const DELIVERY_CHARGES = {
  Rajshahi: 55, Dhaka: 80, Chittagong: 100, Chattogram: 100, Khulna: 80, Sylhet: 100, Barisal: 95, Barishal: 95, Rangpur: 60, Mymensingh: 85, Bogura: 60, Bogra: 60, Comilla: 90, Cumilla: 90, Rajbari: 90, Natore: 60, Pabna: 65, Sirajganj: 70, CoxBazar: 110, CoxsBazar: 110, Jessore: 75, Jashore: 75, Kushtia: 70, Dinajpur: 70, Feni: 100, Noakhali: 100, Tangail: 85, Gazipur: 80, Narayanganj: 80
}

export default function ProductDetailsPage(){
  const params = useParams()
  const slug = params?.slug
  const router = useRouter()
  const [product,setProduct]=useState(null)
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

  const getImageUrl = (p, index = 0) => {
    try {
      if (p.images && Array.isArray(p.images) && p.images.length > 0) {
        let img = p.images[index] || p.images[0]
        if (typeof img === 'string') return img
        if (img?.url) return img.url
      }
      if (p.images && typeof p.images === 'string') {
        const parsed = JSON.parse(p.images)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[index] || parsed[0]
        if (typeof parsed === 'string') return parsed
      }
      if (p.image) return p.image
      if (p.image_url) return p.image_url
      if (p.thumbnail) return p.thumbnail
    } catch {}
    return 'https://via.placeholder.com/800x800?text=No+Image'
  }

  useEffect(()=>{
    if(!slug) return
    const fetchAll = async()=>{
      try{
        setLoading(true)
        let productData = null
        let { data: p1 } = await supabase.from('products').select('*').or(`slug.eq.${slug},id.eq.${slug}`).maybeSingle()
        if(p1) productData = p1
        if(!productData){
          let { data: p2 } = await supabase.from('products').select('*').eq('slug', slug).maybeSingle()
          productData = p2
        }
        if(!productData){
          let { data: p3 } = await supabase.from('products').select('*').eq('id', slug).maybeSingle()
          productData = p3
        }
        if(!productData){ setLoading(false); return }

        let sellerData = null
        const allIds = [productData.seller_id, productData.seller_user_id, productData.user_id, productData.seller_table_id].filter(Boolean)
        if(allIds.length>0){
          for(let sid of allIds){
            if(sellerData) break
            const { data: s0 } = await supabase.from('sellers').select('*').or(`id.eq.${sid},user_id.eq.${sid}`).maybeSingle()
            if(s0){
              const logo = s0.shop_logo || s0.logo_url || s0.avatar || s0.shop_banner || s0.banner_url || s0.hero_image || s0.logo || ''
              sellerData = {
                id: s0.id,
                user_id: s0.user_id,
                shop_name: s0.shop_name || s0.name || s0.shopName || 'E-RAJ SHOP',
                full_name: s0.shop_name || s0.name,
                business_name: s0.shop_name || s0.name,
                store_name: s0.shop_name || s0.name,
                district: s0.district || s0.city || 'Rajshahi',
                is_verified: s0.is_verified?? true,
                is_mall: s0.is_mall === true || s0.is_baharaz_mall === true || false,
                slug: s0.shop_slug || s0.slug || '',
                logo_url: logo,
                avatar: logo,
                shop_logo: logo,
                logo: logo,
                created_at: s0.created_at,
              }
            }
          }
        }
        if(!sellerData){
          const logo3 = productData.shop_logo || productData.store_logo || productData.seller_logo || productData.logo || ''
          sellerData = {
            shop_name: productData.shop_name || productData.store_name || productData.seller_name || 'E-RAJ SHOP',
            full_name: productData.seller_name || productData.shop_name || 'E-RAJ SHOP',
            district: productData.district || 'Rajshahi',
            is_verified: true,
            is_mall: false,
            slug: productData.store_slug || '',
            logo_url: logo3,
            avatar: logo3,
            logo: logo3,
            created_at: productData.created_at
          }
        }
        setSellerInfo(sellerData)

        if(productData.is_flash_sale || productData.discount_price || productData.discount){
          setFlashSale({ discount: productData.discount_price? Math.round(((productData.price - productData.discount_price)/productData.price)*100) : (productData.discount || 0) })
        }

        const { data: reviewData } = await supabase.from('reviews').select('*').eq('product_id', productData.id).order('created_at',{ascending:false}).limit(20)
        if(reviewData) setReviews(reviewData)

        if(productData.category){
          const { data: rel } = await supabase.from('products').select('id, title, name, slug, price, discount_price, image, image_url, images, rating, sold_count, category').eq('category', productData.category).neq('id', productData.id).limit(24)
          if(rel) setRelatedProducts(rel)
          const { data: qual } = await supabase.from('products').select('id, title, name, slug, price, discount_price, image, image_url, images, rating, category').eq('category', productData.category).neq('id', productData.id).order('rating',{ascending:false}).limit(24)
          if(qual) setQualityProducts(qual)
        }

        if(sellerData?.id || productData.seller_id){
          const sellerIdForQuery = sellerData?.id || productData.seller_id
          const sellerUserId = sellerData?.user_id || productData.seller_user_id
          let sameStore = []
          if(sellerUserId){
            const { data: ss1 } = await supabase.from('products').select('id, title, name, slug, price, discount_price, image, image_url, images, rating').or(`seller_id.eq.${sellerUserId},seller_user_id.eq.${sellerUserId},user_id.eq.${sellerUserId}`).neq('id', productData.id).limit(24)
            if(ss1) sameStore = ss1
          }
          if(sameStore.length===0 && sellerIdForQuery){
            const { data: ss2 } = await supabase.from('products').select('id, title, name, slug, price, discount_price, image, image_url, images, rating').eq('seller_id', sellerIdForQuery).neq('id', productData.id).limit(24)
            if(ss2) sameStore = ss2
          }
          setSameStoreProducts(sameStore)
        }

        const { data: trend } = await supabase.from('products').select('id, title, name, slug, price, discount_price, image, image_url, images, sold_count, rating').order('created_at',{ascending:false}).limit(24)
        if(trend) setTrendingProducts(trend)

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

        const price = Number(productData.discount_price || productData.price) || 0
        const original_price = Number(productData.price) || 0
        const realShopName = sellerData?.shop_name || sellerData?.store_name || productData.shop_name || 'E-RAJ SHOP'
        const isReallyMall = productData.is_mall === true || productData.is_baharaz_mall === true || sellerData?.is_mall === true

        setProduct({
          id: productData.id,
          slug: productData.slug || productData.id,
          title: productData.title || productData.name,
          brand: productData.brand || 'No Brand',
          rating: Number(productData.rating)||4.5,
          review_count: Number(productData.review_count)||10,
          price, original_price,
          discount: original_price>price? Math.round(((original_price-price)/original_price)*100) : 0,
          images, video: productData.video_url || '', colors, sizes,
          description: productData.description || '',
          short_desc: productData.short_description || '',
          category: productData.category || 'Electronics',
          main_category: productData.main_category || '',
          sub_category: productData.sub_category || '',
          stock: productData.stock || 1000,
          sku: productData.sku || `BHZ-${productData.id?.slice(0,8)}`,
          material: productData.material || 'N/A',
          is_mall: isReallyMall,
          seller: {
            id: sellerData?.id || productData.seller_id,
            name: realShopName,
            slug: sellerData?.slug || '',
            district: sellerData?.district || 'Rajshahi',
            is_verified: sellerData?.is_verified?? true,
            is_mall: sellerData?.is_mall || false,
            logo: sellerData?.logo_url || sellerData?.avatar || sellerData?.logo || '',
            joined: sellerData?.created_at? new Date(sellerData.created_at).getFullYear() : '2026'
          }
        })
        if(colors.length>0) setSelectedColor(colors[0])
        if(sizes.length>0) setSelectedSize(sizes[0])

      } catch(e){ console.log(e?.message) } finally{ setLoading(false) }
    }
    fetchAll()
  },[slug])

  const handleMouseMove = (e)=>{
    if(!mainImageRef.current) return
    const rect = mainImageRef.current.getBoundingClientRect()
    setZoomPos({ x:((e.clientX-rect.left)/rect.width)*100, y:((e.clientY-rect.top)/rect.height)*100, show:true })
  }

  const handleAddToCart = ()=>{
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
    window.dispatchEvent(new Event('cartUpdated'))
    alert('Added to Cart ✅')
  }

  // ✅ 100% FIXED: Buy Now - Cart Clear না, কিন্তু Checkout Overwrite - নতুন Product ই আসবে
  const handleBuyNowDirect = ()=>{
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

    // ✅ পুরানো Checkout Data Delete করে নতুন টা Force Save
    localStorage.removeItem('baharaz_checkout_items')
    localStorage.removeItem('baharaz_checkout_summary')
    localStorage.removeItem('baharaz_buy_now')

    localStorage.setItem('baharaz_checkout_items', JSON.stringify([checkoutItem]))
    localStorage.setItem('baharaz_checkout_summary', JSON.stringify({
      subtotal,
      deliveryFee,
      discount: 0,
      total,
      deliveryLocation,
      isGift: false,
      type: 'buy_now'
    }))
    localStorage.setItem('baharaz_buy_now', JSON.stringify(checkoutItem))
    localStorage.setItem('baharaz_checkout_type', 'buy_now')

    // ✅ Cache Bust -?buy_now=1 দিলে Checkout Page বুঝবে এটা Buy Now Order
    router.push(`/checkout?buy_now=1&t=${Date.now()}`)
  }

  const handleChat = ()=>{
    if(product?.seller?.id) router.push(`/chat?seller=${product.seller.id}&product=${product.id}`)
    else router.push(`/chat?store=${product?.seller?.slug || product?.seller?.name}`)
  }

  const handleWishlist = ()=>{
    setWishlisted(!wishlisted)
    const w = JSON.parse(localStorage.getItem('baharaz_wishlist')||'[]')
    if(!wishlisted){ w.push(product.id); localStorage.setItem('baharaz_wishlist', JSON.stringify(w)) }
    else { localStorage.setItem('baharaz_wishlist', JSON.stringify(w.filter(id=>id!==product.id))) }
    window.dispatchEvent(new Event('wishlistUpdated'))
  }
  const handleShare = async()=>{
    if(navigator.share){ await navigator.share({ title: product.title, url: window.location.href }) }
    else { navigator.clipboard.writeText(window.location.href); alert('Link Copied!') }
  }

  if(loading) return <div className="max-w-[1320px] mx-auto p-6"><div className="h-[700px] bg-gray-100 animate-pulse rounded-2xl mt-4"></div></div>
  if(!product) return <div className="p-20 text-center">Product Not Found - {slug}<br/><Link href="/" className="text-orange-600 underline mt-4 inline-block">Go Home</Link></div>

  const safeColors = Array.isArray(product.colors)? product.colors : []
  const safeSizes = Array.isArray(product.sizes)? product.sizes : []
  const safeImages = Array.isArray(product.images)? product.images : [product.images]
  const avgRating = reviews.length>0? (reviews.reduce((a,b)=>a+Number(b.rating||0),0)/reviews.length).toFixed(1) : (product.rating>0? product.rating.toFixed(1) : '4.5')
  const totalPrice = product.price*quantity + deliveryCharge

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": safeImages,
    "description": product.description?.substring(0, 500) || product.title,
    "sku": product.sku || product.id,
    "brand": { "@type": "Brand", "name": product.brand || product.seller?.name },
    "category": product.category,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "BDT",
      "price": product.price,
      "availability": product.stock>0? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": { "@type": "Organization", "name": product.seller?.name }
    },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": avgRating, "reviewCount": reviews.length || 10 }
  }

  return (
    <div className="bg-[#f5f5f7] min-h-screen pb-[80px] lg:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

      {flashSale && flashSale.discount>0 && (
        <div className="bg-gradient-to-r from-[#ff1a00] to-[#ff6a00] text-white sticky top-[115px] z-30 shadow">
          <div className="max-w-[1320px] mx-auto px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3"><span className="font-black text-[14px]">FLASH SALE • {flashSale.discount}% OFF - {product.title}</span></div>
            <div className="flex items-center gap-1.5 text-[12px] font-black"><span className="bg-black px-2 py-1 rounded">{String(timeLeft.h).padStart(2,'0')}</span>:<span className="bg-black px-2 py-1 rounded">{String(timeLeft.m).padStart(2,'0')}</span>:<span className="bg-black px-2 py-1 rounded">{String(timeLeft.s).padStart(2,'0')}</span></div>
          </div>
        </div>
      )}

      <div className="max-w-[1320px] mx-auto bg-white lg:rounded-2xl overflow-hidden shadow-sm mt-0">
        <nav aria-label="Breadcrumb" className="flex px-4 lg:px-6 py-3 text-[12px] text-[#757575] gap-2 border-b bg-[#fcfcfc] items-center justify-between">
          <div className="flex gap-2 items-center flex-wrap">
            <Link href="/" className="hover:text-[#1a9cb7] hover:underline">Home</Link>
            {breadcrumbData.map((cat, idx)=>(
              <span key={idx} className="flex items-center gap-2">
                <span className="text-[10px]">›</span>
                <Link href={`/search?category=${encodeURIComponent(cat)}`} className="hover:text-[#1a9cb7] hover:underline capitalize">{cat}</Link>
              </span>
            ))}
            <span className="text-[10px]">›</span>
            <span className="text-[#212121] font-normal truncate max-w-[300px]">{product.title}</span>
          </div>
          <div className="hidden lg:flex gap-2 shrink-0"><button onClick={handleWishlist} className={`px-3 py-1 rounded-full border text-[11px] font-black ${wishlisted?'bg-red-500 text-white border-red-500':'bg-white'}`}>{wishlisted?'♥ Wishlisted':'♡ Wishlist'}</button><button onClick={handleShare} className="px-3 py-1 rounded-full border bg-white text-[11px] font-black">Share</button></div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[520px_1fr_360px] gap-0">
          <div className="bg-white p-0 lg:p-5">
            <div className="relative w-full aspect-[4/5] lg:aspect-square bg-white overflow-hidden lg:rounded-2xl border" ref={mainImageRef} onMouseMove={handleMouseMove} onMouseLeave={()=>setZoomPos(p=>({...p,show:false}))}>
              {showVideo && product.video? <video src={product.video} controls autoPlay className="w-full h-full object-contain bg-black"/> : <><Image src={safeImages[activeImage]} alt={product.title} fill className="object-contain p-4" unoptimized priority /><div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>{zoomPos.show && <div className="hidden lg:block absolute inset-0 z-10 pointer-events-none" style={{ backgroundImage:`url(${safeImages[activeImage]})`, backgroundPosition:`${zoomPos.x}% ${zoomPos.y}%`, backgroundSize:'250%', backgroundRepeat:'no-repeat' }}></div>}</>}
              {product.is_mall && <div className="absolute top-4 left-4 bg-[#7b1fa2] text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">BAHARAZ MALL</div>}
              {product.discount>0 && <div className="absolute top-4 right-4 bg-[#ff1a00] text-white text-[12px] font-black px-3 py-1 rounded-full">-{product.discount}%</div>}
              <button onClick={handleWishlist} className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full shadow flex items-center justify-center text-[18px] border">{wishlisted?'❤️':'🤍'}</button>
            </div>
            <div className="flex gap-3 p-4 overflow-x-auto scrollbar-hide">
              {safeImages.map((img,i)=><button key={i} onClick={()=>{setActiveImage(i); setShowVideo(false)}} className={`min-w-[72px] h-[72px] rounded-xl border-2 overflow-hidden flex-shrink-0 bg-white ${activeImage===i &&!showVideo?'border-[#ff1a00] shadow':'border-gray-200'}`}><Image src={img} alt={`${product.title} ${i+1}`} width={72} height={72} className="object-contain w-full h-full p-1" unoptimized /></button>)}
            </div>
            <div className="hidden lg:grid grid-cols-3 gap-2 px-4 pb-2">
              <div className="bg-[#fafafa] border rounded-xl p-3 text-center"><p className="text-[16px]">🚚</p><p className="text-[10px] font-black mt-1">Fast Delivery</p></div>
              <div className="bg-[#fafafa] border rounded-xl p-3 text-center"><p className="text-[16px]">↩️</p><p className="text-[10px] font-black mt-1">14 Days Return</p></div>
              <div className="bg-[#fafafa] border rounded-xl p-3 text-center"><p className="text-[16px]">🛡️</p><p className="text-[10px] font-black mt-1">100% Original</p></div>
            </div>
          </div>

          <div className="px-5 lg:px-7 py-5 border-r">
            <h1 className="text-[19px] lg:text-[23px] font-black leading-[28px] text-[#111] tracking-tight break-words">{product.title}</h1>
            <p className="text-[11px] text-[#888] mt-1">SKU: {product.sku} • Brand: {product.brand} • Category: <Link href={`/search?category=${encodeURIComponent(product.category)}`} className="text-[#1a9cb7] hover:underline">{product.category}</Link> • {product.stock} in Stock</p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-[#ffb400] text-[14px]">★★★★★</span>
              <span className="text-[13px] font-black">{avgRating}</span>
              <span className="text-[12px] text-[#666]">({reviews.length>0? reviews.length : product.review_count||10} Ratings)</span>
              <span className="text-[11px] bg-[#e8f5e9] text-[#2e7d32] px-2 py-0.5 rounded-full font-bold">In Stock</span>
              {product.seller.is_verified && <span className="text-[11px] bg-[#e3f2fd] text-[#1565c0] px-2 py-0.5 rounded-full font-black">Verified Seller</span>}
              {product.is_mall && <span className="text-[11px] bg-[#f3e5f5] text-[#7b1fa2] px-2 py-0.5 rounded-full font-black">Baharaz Mall</span>}
            </div>

            <div className="mt-6 bg-gradient-to-br from-[#fff8f0] to-[#fff] border-2 border-[#ffe0cc] p-5 rounded-2xl">
              <div className="flex items-baseline gap-3"><span className="text-[32px] font-black text-[#ff1a00]">৳{product.price.toLocaleString()}</span>{product.discount>0 && <><span className="text-[15px] text-[#999] line-through">৳{product.original_price.toLocaleString()}</span><span className="bg-[#ff1a00] text-white text-[11px] font-black px-2.5 py-1 rounded-full">-{product.discount}%</span></>}</div>
              <div className="mt-3 pt-3 border-t border-dashed flex justify-between text-[11px] font-bold bg-[#fffaf5] p-2 rounded"><span>Product: ৳{(product.price*quantity).toLocaleString()}</span><span className="text-[#ff1a00]">+ Delivery ৳{deliveryCharge} = ৳{totalPrice.toLocaleString()}</span></div>
            </div>

            {safeColors.length>0 && <div className="mt-7"><p className="text-[13px] font-black mb-3">Color: <span className="font-bold text-[#ff1a00]">{selectedColor}</span></p><div className="flex gap-2.5 flex-wrap">{safeColors.map(c=><button key={c} onClick={()=>setSelectedColor(c)} className={`px-5 py-2.5 border-2 rounded-xl text-[12px] font-bold ${selectedColor===c?'border-[#ff1a00] bg-[#fff1eb] text-[#ff1a00]':'border-gray-200 bg-white'}`}>{c}</button>)}</div></div>}
            {safeSizes.length>0 && <div className="mt-6"><p className="text-[13px] font-black mb-3">Size: <span className="font-bold text-[#ff1a00]">{selectedSize}</span></p><div className="flex gap-2.5 flex-wrap">{safeSizes.map(s=><button key={s} onClick={()=>setSelectedSize(s)} className={`min-w-[48px] h-[44px] border-2 rounded-xl text-[12px] font-black ${selectedSize===s?'bg-black text-white border-black':'bg-white border-gray-200'}`}>{s}</button>)}</div></div>}

            <div className="mt-7 flex items-center gap-4"><p className="text-[13px] font-black">Quantity:</p><div className="flex items-center border-2 rounded-xl overflow-hidden"><button onClick={()=>setQuantity(Math.max(1,quantity-1))} className="w-11 h-11 hover:bg-gray-100 font-black text-[20px]">-</button><span className="w-14 text-center font-black text-[16px]">{quantity}</span><button onClick={()=>setQuantity(Math.min(product.stock,quantity+1))} className="w-11 h-11 hover:bg-gray-100 font-black text-[20px]">+</button></div><span className="text-[11px] text-[#666] font-bold">{product.stock} available</span></div>

            <div className="hidden lg:flex gap-3 mt-8">
              <button onClick={handleAddToCart} className="flex-1 h-[52px] bg-[#fff1e6] text-[#ff1a00] border-2 border-[#ff1a00] font-black rounded-xl hover:bg-[#ffe1cc] text-[15px]">Add to Cart</button>
              <button onClick={handleBuyNowDirect} className="flex-1 h-[52px] bg-gradient-to-r from-[#ff1a00] to-[#ff6a00] text-white font-black rounded-xl shadow-xl text-[15px] hover:scale-[1.02] transition">Buy Now</button>
            </div>

            <div className="mt-10">
              <h2 className="font-black text-[15px] border-b pb-3">Product Details of {product.title}</h2>
              <p className="text-[13px] leading-7 mt-4 whitespace-pre-wrap text-[#222]">{product.description || 'This product is 100% authentic from Baharaz.'}</p>
              <div className="mt-6 bg-[#fafafa] rounded-xl p-4 border">
                <h3 className="font-black text-[12px] mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-3 text-[12px]">
                  <div className="flex justify-between border-b pb-2"><span className="text-[#666]">Material</span><span className="font-bold">{product.material}</span></div>
                  <div className="flex justify-between border-b pb-2"><span className="text-[#666]">Category</span><span className="font-bold">{product.category}</span></div>
                  <div className="flex justify-between border-b pb-2"><span className="text-[#666]">Brand</span><span className="font-bold">{product.brand}</span></div>
                  <div className="flex justify-between border-b pb-2"><span className="text-[#666]">Stock</span><span className="font-bold text-green-600">{product.stock} In Stock</span></div>
                  <div className="flex justify-between border-b pb-2"><span className="text-[#666]">Seller</span><span className="font-bold">{product.seller.name}</span></div>
                  <div className="flex justify-between border-b pb-2"><span className="text-[#666]">Delivery</span><span className="font-bold">All Over Bangladesh</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#f9fafb] p-3 space-y-3">
            <div className="bg-white rounded-2xl border shadow-sm p-5">
              <h3 className="text-[11px] font-black tracking-widest text-[#111]">DELIVERY OPTIONS</h3>
              <div className="mt-5 space-y-4">
                <div className="flex gap-3"><div className="w-10 h-10 bg-[#e3f2fd] rounded-full flex items-center justify-center flex-shrink-0">📍</div><div className="flex-1"><label className="text-[11px] font-bold text-[#666]">YOUR LOCATION</label><div className="mt-1"><select value={deliveryLocation} onChange={e=>setDeliveryLocation(e.target.value)} className="w-full font-black text-[13px] bg-[#f5f7ff] border-2 border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-black"><option value={deliveryLocation}>{deliveryLocation} - ৳{deliveryCharge}</option>{Object.keys(DELIVERY_CHARGES).filter(c=>c!==deliveryLocation).map(loc=><option key={loc} value={loc}>{loc} - ৳{DELIVERY_CHARGES[loc]}</option>)}</select></div><div className="mt-3 bg-[#f0f7ff] border-2 border-[#1a9cb7]/20 p-3 rounded-xl"><p className="text-[12px] font-black text-[#111]">Standard Delivery • ৳{deliveryCharge}</p><p className="text-[11px] text-[#333] mt-1">Guaranteed by {new Date(Date.now()+2*86400000).toLocaleDateString()}</p><p className="text-[11px] text-[#0a8a00] font-black mt-2">Cash on Delivery Available All BD</p></div></div></div>
                <div className="pt-4 border-t flex gap-3"><div className="w-10 h-10 bg-[#fff3e0] rounded-full flex items-center justify-center flex-shrink-0">↩️</div><div><p className="text-[12px] font-black">Return & Warranty - 14 Days Free Return</p><p className="text-[11px] text-[#555] mt-1 leading-5">14 Days Free Return - 100% Authentic - Baharaz Guarantee</p></div></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border shadow-sm p-5">
              <div className="flex justify-between items-center"><h3 className="text-[11px] font-black tracking-widest">SOLD BY - {product.seller.name}</h3>{product.seller.slug && <Link href={`/store/${product.seller.slug}`} className="text-[11px] text-[#1a9cb7] font-black hover:underline">Visit Store →</Link>}</div>
              <div className="flex gap-3 mt-5 items-center">
                <div className="w-[56px] h-[56px] rounded-2xl bg-white border-2 border-gray-100 flex items-center justify-center overflow-hidden shadow flex-shrink-0">
                  {product.seller.logo? (
                    <img src={product.seller.logo} alt={`${product.seller.name} Logo`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#ff6a00] to-[#ff1a00] flex items-center justify-center text-white font-black text-[22px]">{product.seller.name?.charAt(0)?.toUpperCase() || 'E'}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-black flex items-center gap-1.5 leading-tight truncate">{product.seller.name} {product.seller.is_verified && <span className="bg-[#1a9cb7] text-white text-[9px] px-1.5 py-0.5 rounded-full font-black">✓ Verified</span>}</p>
                  <p className="text-[11px] text-[#666] font-bold mt-0.5 truncate">{product.seller.district} • Since {product.seller.joined} • Baharaz Seller</p>
                  <p className="text-[10px] text-[#1a9cb7] font-bold mt-1">{product.seller.name} - Rajshahi</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-5 bg-[#fafafa] p-3 rounded-xl text-center border"><div><p className="font-black text-[13px]">4.5★</p><p className="text-[9px] text-[#666] font-bold">Rating</p></div><div className="border-x"><p className="font-black text-[13px]">98%</p><p className="text-[9px] text-[#666] font-bold">On Time</p></div><div><p className="font-black text-[13px]">Verified</p><p className="text-[9px] text-[#666] font-bold">Baharaz Store</p></div></div>
              <div className="flex gap-2.5 mt-5">
                <button onClick={handleChat} className="flex-1 h-[42px] border-2 border-[#1a9cb7] text-[#1a9cb7] font-black rounded-xl text-[11px] hover:bg-[#e3f2fd]">Live Chat</button>
                <Link href={product.seller.slug? `/store/${product.seller.slug}` : `/store/${product.seller.id || ''}`} className="flex-1 h-[42px] bg-black text-white font-black rounded-xl text-[11px] flex items-center justify-center hover:bg-gray-800">View Shop</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-t p-6">
          <h2 className="font-black text-[16px] flex items-center gap-2">Customer Reviews for {product.title} <span className="text-[12px] font-normal text-[#666]">({reviews.length || 0} Reviews)</span> <span className="bg-[#fff8e1] px-2.5 py-1 rounded-full text-[12px]">{avgRating} ★</span></h2>
          {reviews.length===0? <div className="text-center py-12 bg-[#fafafa] rounded-2xl mt-4 border-2 border-dashed"><p className="text-[14px] font-bold">No reviews yet for {product.title} - Be the first to review on Baharaz.com</p><p className="text-[12px] text-[#666] mt-2">Buy {product.title} from {product.seller.name} - {product.category} - Best Price in Bangladesh</p></div> : <div className="mt-6 space-y-4">{reviews.map((r,i)=><div key={i} className="border-b pb-4"><div className="flex gap-2 items-center"><span className="text-[#ffb400] text-[13px]">{'★'.repeat(Number(r.rating)||5)}</span><span className="text-[11px] bg-[#e8f5e9] text-[#2e7d32] px-2.5 py-0.5 rounded-full font-bold">Verified Purchase</span></div><p className="text-[13px] mt-2 leading-7 text-[#222]">{r.comment||r.review_text||'Excellent product!'}</p></div>)}</div>}
        </div>

        {sameStoreProducts.length>0 && (
          <div className="bg-[#f9fafb] border-t p-6">
            <div className="flex justify-between items-center">
              <h2 className="font-black text-[18px]">More from {product.seller.name} - Same Store Products</h2>
              <Link href={product.seller.slug? `/store/${product.seller.slug}` : `/search?seller=${product.seller.id}`} className="hidden lg:flex text-[12px] font-black text-white bg-black px-4 py-2 rounded-full hover:bg-gray-800">View Store →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-5">
              {sameStoreProducts.map(p=>(
                <Link key={`store-${p.id}`} href={`/product/${p.slug||p.id}`} className="bg-white border-2 rounded-2xl overflow-hidden hover:shadow-xl hover:border-black transition group">
                  <div className="aspect-square bg-white overflow-hidden relative">
                    <img src={getImageUrl(p,0)} alt={p.name || p.title} className="w-full h-full object-contain p-2 group-hover:scale-110 transition duration-500" loading="lazy"/>
                    {p.discount_price && <span className="absolute top-2 right-2 bg-[#ff1a00] text-white text-[10px] font-black px-2 py-1 rounded-full">-{Math.round(((p.price - p.discount_price)/p.price)*100)}%</span>}
                  </div>
                  <div className="p-3">
                    <p className="text-[11px] line-clamp-2 h-[34px] font-medium leading-4">{p.name || p.title}</p>
                    <p className="text-[14px] font-black text-[#ff1a00] mt-2">৳{Number(p.discount_price||p.price).toLocaleString()}</p>
                    <p className="text-[10px] text-[#666] mt-1 truncate">{product.seller.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {qualityProducts.length>0 && (
          <div className="bg-white border-t p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-black text-[18px]">Similar Products - You May Also Like - {product.category}</h2>
                <p className="text-[12px] text-[#666] mt-1">More <Link href={`/search?category=${encodeURIComponent(product.category)}`} className="text-[#1a9cb7] font-bold hover:underline">{product.category}</Link> - Best Price on Baharaz.com</p>
              </div>
              <Link href={`/search?category=${encodeURIComponent(product.category)}`} className="hidden lg:flex text-[12px] font-black text-[#1a9cb7] border-2 px-4 py-2 rounded-full bg-white hover:bg-black hover:text-white">View All →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-5">
              {qualityProducts.map(p=>(
                <Link key={`similar-${p.id}`} href={`/product/${p.slug||p.id}`} className="bg-white border-2 rounded-2xl overflow-hidden hover:shadow-xl hover:border-black transition group">
                  <div className="aspect-square bg-white overflow-hidden relative">
                    <img src={getImageUrl(p,0)} alt={p.name || p.title} className="w-full h-full object-contain p-2 group-hover:scale-110 transition duration-500" loading="lazy"/>
                    {p.discount_price && <span className="absolute top-2 right-2 bg-[#ff1a00] text-white text-[10px] font-black px-2 py-1 rounded-full">-{Math.round(((p.price - p.discount_price)/p.price)*100)}%</span>}
                  </div>
                  <div className="p-3">
                    <p className="text-[11px] line-clamp-2 h-[34px] font-medium leading-4">{p.name || p.title}</p>
                    <p className="text-[14px] font-black text-[#111] mt-2">৳{Number(p.discount_price||p.price).toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-1"><span className="text-[#ffb400] text-[10px]">★</span><span className="text-[10px] text-[#666]">{p.rating || 4.5} • Sold</span></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {trendingProducts.length>0 && (
          <div className="bg-[#f9fafb] border-t p-6">
            <h2 className="font-black text-[18px]">Trending Products - Customers Also Viewed</h2>
            <p className="text-[12px] text-[#666] mt-1">Top products from Baharaz - Best Selling in Bangladesh</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-5">
              {trendingProducts.slice(0,18).map(p=>(
                <Link key={`trend-${p.id}`} href={`/product/${p.slug||p.id}`} className="bg-white border-2 rounded-2xl overflow-hidden hover:shadow-xl hover:border-black transition group">
                  <div className="aspect-square bg-white overflow-hidden relative">
                    <img src={getImageUrl(p,0)} alt={p.name || p.title} className="w-full h-full object-contain p-2 group-hover:scale-110 transition duration-500" loading="lazy"/>
                    <span className="absolute top-2 left-2 bg-black text-white text-[9px] font-black px-2 py-1 rounded-full">TRENDING</span>
                  </div>
                  <div className="p-3">
                    <p className="text-[11px] line-clamp-2 h-[34px] font-medium leading-4">{p.name || p.title}</p>
                    <p className="text-[14px] font-black text-[#ff1a00] mt-2">৳{Number(p.discount_price||p.price).toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 flex h-[64px] z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        <button onClick={handleAddToCart} className="flex-1 bg-[#fff1e6] text-[#ff1a00] font-black text-[14px] border-r-2 border-[#ffe0cc]">Add to Cart</button>
        <button onClick={handleBuyNowDirect} className="flex-[1.6] bg-gradient-to-r from-[#ff1a00] to-[#ff6a00] text-white font-black text-[14px]">Buy Now • ৳{totalPrice.toLocaleString()}</button>
      </div>
    </div>
  )
}