'use client'
import { useEffect, useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export default function FlashSale(){
  const [products, setProducts] = useState([])
  const [timeLeft, setTimeLeft] = useState(5*3600+23*60+45)
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

  const getDiscount = useCallback((p)=>{
    if(p.discount_percent && Number(p.discount_percent) > 0) return Number(p.discount_percent)
    if(p.original_price && p.price && Number(p.original_price) > Number(p.price)){
      return Math.round(((Number(p.original_price)-Number(p.price))/Number(p.original_price))*100)
    }
    return 0
  }, [])

  useEffect(()=>{
    let mounted = true
    
    const load = async()=>{
      try{
        let { data } = await supabase
          .from('products')
          .select('id,title,name,price,original_price,discount_percent,images,image_url,image,thumbnail,slug,sold_count,stock,status,created_at')
          .eq('is_flash_sale', true)
          .eq('status','approved')
          .order('created_at',{ascending:false})
          .limit(6)

        if(!data || data.length===0){
          const { data: fb } = await supabase
            .from('products')
            .select('id,title,name,price,original_price,discount_percent,images,image_url,image,thumbnail,slug,sold_count,stock,status,created_at')
            .eq('status','approved')
            .order('created_at',{ascending:false})
            .limit(6)
          data = fb
        }
        if(mounted && data){
          setProducts(data)
          try{
            sessionStorage.setItem('baharaz_flash_cache', JSON.stringify(data))
          }catch{}
        }
      }catch(e){
        console.log('flash sale error', e?.message)
        try{
          const cached = sessionStorage.getItem('baharaz_flash_cache')
          if(cached && mounted){
            setProducts(JSON.parse(cached))
          }
        }catch{}
      }finally{
        if(mounted) setLoading(false)
      }
    }
    load()

    const t = setInterval(()=> setTimeLeft(s=> s>0? s-1 : 5*3600+23*60), 1000)
    return ()=>{ mounted = false; clearInterval(t) }
  },[])

  const productsWithRealData = useMemo(()=>{
    return products.map(p=>({
      ...p,
      _img: getImage(p),
      _discount: getDiscount(p),
      _soldPercent: p.stock ? Math.min(90, Math.round((Number(p.sold_count||0) / (Number(p.stock)+Number(p.sold_count||0)))*100)) : 0,
    }))
  }, [products, getImage, getDiscount])

  const handleClick = useCallback((p)=>{
    try{
      const current = JSON.parse(sessionStorage.getItem('baharaz_last_list') || '[]')
      if(!current.find(x=> x.id === p.id)){
        sessionStorage.setItem('baharaz_last_list', JSON.stringify([p, ...current].slice(0,60)))
      }
    }catch{}
  }, [])

  const h = String(Math.floor(timeLeft/3600)).padStart(2,'0')
  const m = String(Math.floor((timeLeft%3600)/60)).padStart(2,'0')
  const s = String(timeLeft%60).padStart(2,'0')

  if(loading) return (
    <div className="bg-white rounded-[12px] p-3 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <div className="h-6 w-28 bg-gray-200 animate-pulse rounded" />
          <div className="flex gap-1">
            <div className="h-6 w-8 bg-gray-800 animate-pulse rounded"></div>
            <div className="h-6 w-8 bg-gray-800 animate-pulse rounded"></div>
            <div className="h-6 w-8 bg-[#f85606]/30 animate-pulse rounded"></div>
          </div>
        </div>
        <div className="h-6 w-20 bg-gray-100 animate-pulse rounded-full"></div>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {[...Array(6)].map((_,i)=><div key={i} className="h-[170px] bg-gray-100 animate-pulse rounded-[8px]" />)}
      </div>
    </div>
  )
  if(products.length===0) return null

  return (
    <div className="bg-white rounded-[12px] p-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <h2 className="font-black text-[16px] md:text-[18px] text-[#1a1a1a] flex items-center gap-2">
            ⚡ Flash Sale
            <span className="text-[10px] bg-[#ffefef] text-[#ff1a00] px-2 py-0.5 rounded-full font-bold border border-[#ffcccc] hidden md:inline">Limited Time</span>
          </h2>
          <div className="flex items-center gap-1">
            <span className="bg-[#111] text-white text-[11px] font-bold px-2 py-1.5 rounded-[6px] min-w-[26px] text-center">{h}</span>
            <span className="font-black text-[12px]">:</span>
            <span className="bg-[#111] text-white text-[11px] font-bold px-2 py-1.5 rounded-[6px] min-w-[26px] text-center">{m}</span>
            <span className="font-black text-[12px]">:</span>
            <span className="bg-[#F85606] text-white text-[11px] font-bold px-2 py-1.5 rounded-[6px] min-w-[26px] text-center animate-pulse">{s}</span>
          </div>
        </div>
        <Link href="/flash-sale" className="text-[#F85606] text-[11px] border-2 border-[#F85606] px-4 py-1.5 rounded-full font-black hover:bg-[#F85606] hover:text-white transition shadow-sm">SHOP ALL →</Link>
      </div>
      
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
        {productsWithRealData.map(p=>(
          <Link key={p.id} href={`/product/${p.slug || p.id}`} onClick={()=> handleClick(p)} className="group block border border-gray-100 hover:border-[#ffd6c8] rounded-[10px] p-2 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-all bg-white hover:-translate-y-1 duration-300">
            <div className="h-[110px] md:h-[130px] bg-[#fcfcfc] rounded-[8px] flex items-center justify-center overflow-hidden relative">
              {p._discount > 0 && <span className="absolute top-1.5 left-1.5 bg-[#F85606] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">-{p._discount}%</span>}
              <img src={p._img} alt={p.title || p.name} loading="lazy" decoding="async" className="h-full w-full object-contain group-hover:scale-105 transition duration-500 p-1"/>
              {p.stock && Number(p.stock) < 10 && <span className="absolute bottom-1 right-1 bg-black text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">Only {p.stock} left!</span>}
            </div>
            <p className="text-[11px] line-clamp-2 h-[30px] mt-2 leading-[14px] text-[#212121] group-hover:text-[#F85606] font-medium">{p.title || p.name}</p>
            <div className="mt-1.5">
              <p className="text-[#F85606] font-black text-[15px]">৳{Number(p.price).toLocaleString()}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {p.original_price && Number(p.original_price) > Number(p.price) && <p className="text-[10px] text-gray-400 line-through">৳{Number(p.original_price).toLocaleString()}</p>}
                {p._discount > 0 && <span className="text-[9px] font-bold text-[#f85606] bg-[#fff1e6] px-1 rounded">-{p._discount}% OFF</span>}
              </div>
            </div>
            {/* ✅ Real Stock Progress */}
            <div className="mt-2">
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#F85606] to-[#ff8a00] rounded-full" style={{width: `${p._soldPercent || 20}%`}}></div>
              </div>
              <p className="text-[9px] text-[#666] mt-1 font-bold">{p.sold_count ? `${p.sold_count} Sold` : 'Selling Fast'} • {p._soldPercent}% Claimed</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}