'use client'
import { useEffect, useState, useCallback } from 'react'
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
  const [cats, setCats] = useState(FALLBACK_CATS)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    let mounted = true
    const load = async()=>{
      try{
        // ✅ Try cache first - Zero Second
        try{
          const cached = sessionStorage.getItem('baharaz_categories_cache')
          if(cached){
            const parsed = JSON.parse(cached)
            if(parsed?.length > 0 && mounted){
              setCats(parsed)
              setLoading(false)
            }
          }
        }catch{}

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
          try{
            sessionStorage.setItem('baharaz_categories_cache', JSON.stringify(mapped))
          }catch{}
        } else if(mounted && data?.length === 0){
          // Try without is_active filter
          const { data: data2 } = await supabase
            .from('categories')
            .select('id,name,slug,image_url')
            .order('name')
            .limit(10)
          if(data2 && data2.length>0 && mounted){
            const mapped2 = data2.map(c=>({ ...c, slug: c.slug || toSlug(c.name) }))
            setCats(mapped2)
          }
        }
      }catch(e){
        console.log('Categories load error', e?.message)
      }finally{
        if(mounted) setLoading(false)
      }
    }
    load()
    return ()=>{ mounted = false }
  },[])

  const handleCategoryClick = useCallback((cat)=>{
    try{
      // Save for instant next page
      sessionStorage.setItem('baharaz_last_category', JSON.stringify(cat))
      // Prefetch products for this category
      localStorage.setItem('baharaz_prefetch_category', cat.slug)
    }catch{}
  }, [])

  if(loading){
    return (
      <div className="bg-white rounded-[12px] p-3 md:p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div className="h-5 w-28 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-6 w-20 bg-gray-100 animate-pulse rounded-full"></div>
        </div>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
          {[...Array(10)].map((_,i)=>(
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-[48px] h-[48px] md:w-[56px] md:h-[56px] rounded-full bg-gray-100 animate-pulse"></div>
              <div className="h-3 w-12 bg-gray-100 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[12px] p-3 md:p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-gray-100 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-black text-[15px] md:text-[16px] flex items-center gap-2 tracking-tight">
          Categories
          <span className="bg-gradient-to-r from-[#F85606] to-[#ff8a00] text-white text-[8px] px-2 py-0.5 rounded-full font-black shadow-sm">NEW • {cats.length}</span>
        </h2>
        <Link href="/category" className="text-[11px] text-[#1a9cb7] font-bold border-2 border-[#1a9cb7]/20 px-4 py-1.5 rounded-full hover:bg-[#1a9cb7] hover:text-white hover:border-[#1a9cb7] transition-all shadow-sm">View All →</Link>
      </div>
      <div className="grid grid-cols-5 md:grid-cols-10 gap-3 md:gap-4">
        {cats.map(c=>(
          <Link key={c.id} href={`/category/${c.slug}`} onClick={()=> handleCategoryClick(c)} className="flex flex-col items-center gap-2 group">
            <div className="w-[52px] h-[52px] md:w-[60px] md:h-[60px] rounded-[16px] md:rounded-full bg-gradient-to-br from-[#fff6f0] to-[#fff1e6] border-2 border-[#ffe1d2] overflow-hidden flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-[#F85606] group-hover:to-[#ff6a00] group-hover:border-[#F85606] group-hover:-translate-y-1 group-hover:shadow-[0_8px_16px_rgba(248,86,6,0.25)] transition-all duration-300 shadow-sm text-[22px] md:text-[24px] relative">
              {c.image_url? <img src={c.image_url} alt={c.name} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition duration-300" /> : <span className="group-hover:scale-110 transition duration-300">{getIcon(c.name)}</span>}
              {c.count > 100 && <span className="absolute -top-1 -right-1 bg-black text-white text-[7px] font-black px-1 py-0.5 rounded-full hidden md:block">{c.count > 1000 ? `${Math.floor(c.count/1000)}k+` : c.count}</span>}
            </div>
            <p className="text-[10px] md:text-[11px] text-center line-clamp-2 leading-[12px] md:leading-[13px] group-hover:text-[#F85606] font-semibold md:font-medium h-[24px] md:h-[26px] px-1">{c.name}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}