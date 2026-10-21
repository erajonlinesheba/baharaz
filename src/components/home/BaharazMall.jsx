'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export default function BaharazMall(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const getImage = useCallback((p)=>{
    try{
      if(p.images?.[0]) return typeof p.images[0] === 'string' ? p.images[0] : p.images[0]?.url || '/placeholder.png'
      if(typeof p.images === 'string'){ const parsed = JSON.parse(p.images); if(Array.isArray(parsed) && parsed[0]) return typeof parsed[0] === 'string' ? parsed[0] : parsed[0]?.url || '/placeholder.png' }
      if(p.image_url) return p.image_url
      if(p.image) return p.image
      if(p.thumbnail) return p.thumbnail
      return '/placeholder.png'
    }catch{ return p.image_url || p.image || '/placeholder.png' }
  }, [])

  useEffect(()=>{
    let mounted = true
    const load = async()=>{
      try{
        // ✅ Cache first - Zero Second
        try{
          const cached = sessionStorage.getItem('baharaz_mall_cache')
          if(cached){
            const parsed = JSON.parse(cached)
            if(parsed?.length > 0 && mounted){
              setProducts(parsed)
              setLoading(false)
            }
          }
        }catch{}

        const { data, error } = await supabase
          .from('products')
          .select('id,title,name,price,original_price,discount_percent,images,image_url,image,thumbnail,slug,is_baharaz_mall,rating,sold_count,shop_name,brand')
          .eq('is_baharaz_mall', true)
          .eq('status','approved')
          .order('created_at', {ascending:false})
          .limit(8)

        if(error) throw error

        if(mounted && data && data.length > 0){
          setProducts(data)
          try{ sessionStorage.setItem('baharaz_mall_cache', JSON.stringify(data)) }catch{}
        } else if(mounted && (!data || data.length === 0)){
          // Fallback - Best rated products as Mall
          const { data: fallback } = await supabase
            .from('products')
            .select('id,title,name,price,original_price,discount_percent,images,image_url,image,thumbnail,slug,rating,sold_count,shop_name,brand')
            .eq('status','approved')
            .gte('rating', 4.5)
            .order('rating', {ascending:false})
            .limit(8)
          if(fallback && mounted){
            setProducts(fallback)
          }
        }
      }catch(e){
        console.log('BaharazMall error', e?.message)
      }finally{
        if(mounted) setLoading(false)
      }
    }
    load()
    return ()=>{ mounted = false }
  },[])

  const productsWithImage = useMemo(()=>{
    return products.map(p=>({
      ...p,
      _img: getImage(p),
      _discount: p.discount_percent || (p.original_price && Number(p.original_price) > Number(p.price) ? Math.round(((Number(p.original_price)-Number(p.price))/Number(p.original_price))*100) : 0)
    }))
  }, [products, getImage])

  const handleClick = useCallback((p)=>{
    try{
      const current = JSON.parse(sessionStorage.getItem('baharaz_last_list') || '[]')
      if(!current.find(x=> x.id === p.id)){
        sessionStorage.setItem('baharaz_last_list', JSON.stringify([p, ...current].slice(0,60)))
      }
    }catch{}
  }, [])

  if(loading){
    return (
      <div className="bg-white rounded-[12px] p-3 md:p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-6 w-24 bg-gray-100 animate-pulse rounded-full"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(8)].map((_,i)=> <div key={i} className="h-[170px] bg-gray-100 animate-pulse rounded-[8px]"></div>)}
        </div>
      </div>
    )
  }

  if(products.length===0) return null
  
  return (
    <div className="bg-white rounded-[12px] p-3 md:p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-black text-[16px] md:text-[18px] flex items-center gap-2 tracking-tight">
          <span className="w-8 h-8 bg-gradient-to-br from-[#7b1fa2] to-[#4a148c] rounded-full flex items-center justify-center text-white text-[14px]">🏬</span>
          Baharaz Mall
          <span className="bg-[#7b1fa2] text-white text-[8px] px-2 py-0.5 rounded-full font-black">OFFICIAL</span>
          <span className="bg-[#e8f5e9] text-[#2e7d32] text-[9px] px-2 py-0.5 rounded-full font-bold border border-[#c8e6c9] hidden md:inline">✓ 100% Authentic</span>
        </h2>
        <Link href="/mall" className="text-[11px] font-black text-[#7b1fa2] border-2 border-[#7b1fa2]/20 px-4 py-1.5 rounded-full hover:bg-[#7b1fa2] hover:text-white transition-all shadow-sm">View All Mall →</Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {productsWithImage.map(p=>(
          <Link key={p.id} href={`/product/${p.slug || p.id}`} onClick={()=> handleClick(p)} className="border border-gray-100 rounded-[10px] p-2.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:border-[#e1bee7] hover:-translate-y-1 transition-all duration-300 bg-white group relative overflow-hidden">
            {/* Mall Badge */}
            <div className="absolute top-0 left-0 bg-gradient-to-r from-[#7b1fa2] to-[#9c27b0] text-white text-[8px] font-black px-2.5 py-1 rounded-br-[8px] rounded-tl-[10px] z-10 shadow">MALL</div>
            {p._discount > 0 && <div className="absolute top-0 right-0 bg-[#ff1a00] text-white text-[9px] font-black px-2 py-1 rounded-bl-[8px] rounded-tr-[10px] z-10">-{p._discount}%</div>}
            
            <div className="h-[120px] md:h-[140px] flex items-center justify-center bg-gradient-to-br from-[#fafafa] to-[#f5f5f5] rounded-[8px] overflow-hidden mt-5 relative">
              <img src={p._img} alt={p.title||p.name} loading="lazy" decoding="async" className="h-full w-full object-contain group-hover:scale-110 transition duration-500 p-2"/>
            </div>
            
            <div className="mt-3">
              <p className="text-[11px] font-bold text-[#7b1fa2] truncate">{p.shop_name || p.brand || 'Official Store'}</p>
              <p className="text-[12px] mt-1 line-clamp-2 h-[32px] leading-[15px] text-[#212121] group-hover:text-[#7b1fa2] font-medium">{p.title||p.name}</p>
              <div className="flex items-baseline gap-1.5 mt-2">
                <p className="text-[#7b1fa2] font-black text-[14px] md:text-[15px]">৳{Number(p.price).toLocaleString()}</p>
                {p.original_price && Number(p.original_price) > Number(p.price) && <p className="text-[10px] text-gray-400 line-through">৳{Number(p.original_price).toLocaleString()}</p>}
              </div>
              <div className="flex items-center gap-1 mt-1.5">
                <span className="text-[10px] text-[#2e7d32] bg-[#e8f5e9] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1">✓ Authentic</span>
                {p.rating && <span className="text-[10px] text-[#666]">⭐ {Number(p.rating).toFixed(1)}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 bg-gradient-to-r from-[#f3e5f5] to-[#ede7f6] rounded-[10px] p-3 flex items-center justify-between border border-[#e1bee7]">
        <div className="flex items-center gap-2">
          <span className="text-[14px]">🛡️</span>
          <p className="text-[11px] font-bold text-[#4a148c]">Baharaz Mall - 100% Authentic Brands • Free Returns • Official Warranty</p>
        </div>
        <Link href="/mall" className="text-[10px] font-black text-[#7b1fa2] bg-white px-3 py-1 rounded-full border shadow-sm hover:bg-[#7b1fa2] hover:text-white transition">Shop Mall</Link>
      </div>
    </div>
  )
}