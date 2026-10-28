'use client'
import { useEffect, useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

const FALLBACK_CATS = [
  {id:1,name:'Electronics', slug:'electronics', count: 1200},
  {id:2,name:'Fashion', slug:'fashion', count: 2500},
  {id:3,name:'Health & Beauty', slug:'health-beauty', count: 800},
  {id:4,name:'Home & Living', slug:'home-living', count: 600},
  {id:5,name:'Mobiles', slug:'mobiles', count: 400},
  {id:6,name:'Groceries', slug:'groceries', count: 900},
  {id:7,name:'Kids & Toys', slug:'kids-toys', count: 500},
  {id:8,name:'Sports', slug:'sports', count: 300},
  {id:9,name:'Automotive', slug:'automotive', count: 200},
  {id:10,name:'Books', slug:'books', count: 150},
]

const getIcon = (name) => {
  const n = (name||'').toLowerCase()
  if(n.includes('elect')) return '🔌'
  if(n.includes('fash') || n.includes('cloth') || n.includes('dress')) return '👗'
  if(n.includes('mobile')||n.includes('phone')) return '📱'
  if(n.includes('home')||n.includes('living')||n.includes('furnit')) return '🏠'
  if(n.includes('health')||n.includes('beauty')||n.includes('makeup')) return '💄'
  if(n.includes('groce')||n.includes('food')||n.includes('grocery')) return '🛒'
  if(n.includes('kid')||n.includes('toy')||n.includes('baby')) return '🧸'
  if(n.includes('sport')||n.includes('fitness')) return '⚽'
  if(n.includes('auto')||n.includes('car')||n.includes('bike')) return '🚗'
  if(n.includes('book')||n.includes('education')) return '📚'
  if(n.includes('shoe')||n.includes('footwear')) return '👟'
  if(n.includes('watch')) return '⌚'
  if(n.includes('bag')) return '👜'
  if(n.includes('jewel')) return '💍'
  if(n.includes('laptop')||n.includes('computer')) return '💻'
  return '🛍️'
}

const toSlug = (str) => (str||'').toLowerCase().replace(/\s+/g,'-').replace(/&/g,'and').replace(/[^a-z0-9-]/g,'')

export default function Categories(){
  // ZERO SECOND - Fallback দিয়েই Instant Render, Loading দেখাবে না
  const [cats, setCats] = useState(()=>{
    try{
      // Try cache sync - zero second
      if(typeof window !== 'undefined'){
        const cached = sessionStorage.getItem('baharaz_categories_cache')
        if(cached){
          const parsed = JSON.parse(cached)
          if(parsed?.length > 0) return parsed
        }
        const localCached = localStorage.getItem('baharaz_categories_cache_v2')
        if(localCached){
          const parsed2 = JSON.parse(localCached)
          if(parsed2?.length > 0) return parsed2
        }
      }
    }catch{}
    return FALLBACK_CATS
  })
  const [isLive, setIsLive] = useState(false)

  useEffect(()=>{
    let mounted = true
    const load = async()=>{
      try{
        // Background update - no loading flicker
        const { data, error } = await supabase
          .from('categories')
          .select('id,name,slug,image_url,product_count,is_active')
          .eq('is_active', true)
          .order('product_count', {ascending:false})
          .limit(10)

        if(error) throw error

        if(mounted && data && data.length>0){
          const mapped = data.map(c=>({
            ...c,
            slug: c.slug || toSlug(c.name),
            count: c.product_count || 0,
          }))
          setCats(mapped)
          setIsLive(true)
          try{
            sessionStorage.setItem('baharaz_categories_cache', JSON.stringify(mapped))
            localStorage.setItem('baharaz_categories_cache_v2', JSON.stringify(mapped))
            localStorage.setItem('baharaz_categories_cache_time', Date.now().toString())
          }catch{}
        } else if(mounted && data?.length === 0){
          const { data: data2 } = await supabase
            .from('categories')
            .select('id,name,slug,image_url')
            .order('name')
            .limit(10)
          if(data2 && data2.length>0 && mounted){
            const mapped2 = data2.map(c=>({ ...c, slug: c.slug || toSlug(c.name), count: 0 }))
            setCats(mapped2)
            setIsLive(true)
            try{
              sessionStorage.setItem('baharaz_categories_cache', JSON.stringify(mapped2))
              localStorage.setItem('baharaz_categories_cache_v2', JSON.stringify(mapped2))
            }catch{}
          }
        }
      }catch(e){
        console.log('Categories load error', e?.message)
      }
    }
    // Load after 50ms - don't block first paint - zero second emotion
    const t = setTimeout(load, 50)
    return ()=>{ mounted = false; clearTimeout(t) }
  },[])

  const handleCategoryClick = useCallback((cat)=>{
    try{
      sessionStorage.setItem('baharaz_last_category', JSON.stringify(cat))
      localStorage.setItem('baharaz_prefetch_category', cat.slug)
      // Prefetch category page data instantly
      if(typeof window !== 'undefined' && window.requestIdleCallback){
        window.requestIdleCallback(()=>{
          fetch(`/category/${cat.slug}`, { priority: 'low' }).catch(()=>{})
        })
      }
    }catch{}
  }, [])

  const handleMouseEnter = useCallback((cat)=>{
    try{
      // Zero second hover prefetch - Daraz/Amazon এর মতো
      localStorage.setItem('baharaz_prefetch_category', cat.slug)
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = `/category/${cat.slug}`
      link.as = 'document'
      document.head.appendChild(link)
      setTimeout(()=>{ try{ link.remove() }catch{} }, 5000)
    }catch{}
  }, [])

  const memoizedCats = useMemo(()=> cats, [cats])

  return (
    <div className="bg-white rounded-[16px] p-3 md:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300">
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-black text-[15px] md:text-[17px] flex items-center gap-2.5 tracking-tight text-[#111827]">
          Categories
          <span className="bg-gradient-to-r from-[#FF4D00] to-[#FF8C00] text-white text-[8px] px-2.5 py-1 rounded-full font-black shadow-[0_4px_12px_rgba(255,77,0,0.3)] tracking-widest flex items-center gap-1">
            <span className={`w-1 h-1 bg-white rounded-full ${isLive ? 'animate-pulse' : ''}`}></span>
            {isLive ? 'LIVE' : 'NEW'} • {memoizedCats.length}
          </span>
        </h2>
        <Link prefetch={true} href="/category" className="text-[11px] text-white bg-[#111827] font-black px-5 py-2 rounded-full hover:bg-[#FF4D00] hover:shadow-[0_4px_12px_rgba(255,77,0,0.3)] hover:-translate-y-0.5 transition-all duration-300 tracking-wide">View All →</Link>
      </div>
      <div className="grid grid-cols-5 md:grid-cols-10 gap-3 md:gap-4">
        {memoizedCats.map(c=>(
          <Link 
            key={c.id} 
            href={`/category/${c.slug}`} 
            prefetch={true}
            onClick={()=> handleCategoryClick(c)} 
            onMouseEnter={()=> handleMouseEnter(c)}
            className="flex flex-col items-center gap-2.5 group"
          >
            <div className="w-[56px] h-[56px] md:w-[64px] md:h-[64px] rounded-[18px] md:rounded-[20px] bg-[#F8F8FC] border border-gray-100 overflow-hidden flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-[#FF4D00] group-hover:via-[#FF6A00] group-hover:to-[#FF8C00] group-hover:border-[#FF4D00] group-hover:-translate-y-1.5 group-hover:shadow-[0_12px_24px_rgba(255,77,0,0.3)] group-hover:rotate-2 transition-all duration-400 shadow-sm text-[24px] md:text-[26px] relative">
              {c.image_url? <img src={c.image_url} alt={c.name} loading="eager" decoding="async" fetchPriority="low" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" /> : <span className="group-hover:scale-110 group-hover:rotate-3 transition duration-500 drop-shadow-sm">{getIcon(c.name)}</span>}
              {c.count > 50 && <span className="absolute -top-1 -right-1 bg-[#111827] group-hover:bg-white group-hover:text-[#FF4D00] text-white text-[7px] font-black px-1.5 py-0.5 rounded-full shadow-md hidden md:block transition-colors">{c.count > 1000 ? `${Math.floor(c.count/1000)}k+` : c.count}</span>}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <p className="text-[10px] md:text-[11px] text-center line-clamp-2 leading-[12px] md:leading-[13px] group-hover:text-[#FF4D00] font-bold text-[#111827] h-[24px] md:h-[26px] px-1 tracking-tight transition-colors">{c.name}</p>
          </Link>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
        <p className="text-[10px] text-[#9CA3AF] font-medium">Zero Second Loading • Better than Daraz Amazon Alibaba • Premium Color</p>
        <p className="text-[10px] text-[#6B7280] font-bold hidden md:block">SEO Ready • FB YT IG Fast Rank</p>
      </div>
    </div>
  )
}