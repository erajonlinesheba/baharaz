'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from "@/lib/supabase/client"

export default function Categories(){
  const [cats, setCats] = useState([])
  const supabase = createClient()

  useEffect(()=>{
    const load = async()=>{
      // STEP 1 - categories table থেকে
      const { data } = await supabase.from('categories').select('*').order('name').limit(10)
      if(data && data.length>0){
        const mapped = data.map(c=>({
         ...c,
          slug: c.slug || c.name.toLowerCase().replace(/\s+/g,'-').replace(/&/g,'and').replace(/[^a-z0-9-]/g,'')
        }))
        setCats(mapped)
      }else{
        // STEP 2 - FALLBACK - products table থেকে - status filter remove করলাম যাতে তোমার 5 টা product এর category আসে
        const { data: prod } = await supabase.from('products').select('category')
        const unique = [...new Set((prod||[]).map(p=>p.category).filter(Boolean))].slice(0,10).map((name,i)=>({
          id:i,
          name: name.trim(),
          slug: name.toLowerCase().replace(/\s+/g,'-').replace(/&/g,'and').replace(/[^a-z0-9-]/g,''),
          image_url: null
        }))
        setCats(unique.length>0?unique:[
          {id:1,name:'Electronics', slug:'electronics', image_url: null},
          {id:2,name:'Fashion', slug:'fashion', image_url: null},
          {id:3,name:'Health & Beauty', slug:'health-beauty', image_url: null},
          {id:4,name:'Home & Living', slug:'home-living', image_url: null},
          {id:5,name:'Mobiles', slug:'mobiles', image_url: null},
          {id:6,name:'Groceries', slug:'groceries', image_url: null},
          {id:7,name:'Kids & Toys', slug:'kids-toys', image_url: null},
          {id:8,name:'Sports', slug:'sports', image_url: null}
        ])
      }
    }
    load()
  },[])

  const getIcon = (name) => {
    const n = (name||'').toLowerCase()
    if(n.includes('elect')) return '🔌'
    if(n.includes('fash')) return '👗'
    if(n.includes('mobile')||n.includes('phone')) return '📱'
    if(n.includes('home')||n.includes('living')) return '🏠'
    if(n.includes('health')||n.includes('beauty')) return '💄'
    if(n.includes('groce')||n.includes('food')) return '🛒'
    if(n.includes('kid')||n.includes('toy')||n.includes('baby')) return '🧸'
    if(n.includes('sport')) return '⚽'
    if(n.includes('book')) return '📚'
    if(n.includes('car')||n.includes('motor')) return '🚗'
    return '🛍️'
  }

  return (
    <div className="bg-white rounded-[12px] p-3 md:p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-gray-100">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-black text-[15px] flex items-center gap-2">Categories <span className="bg-[#F85606] text-white text-[8px] px-1.5 py-0.5 rounded-full">NEW</span></h2>
        <Link href="/category" className="text-[11px] text-[#1a9cb7] font-bold border border-[#1a9cb7]/20 px-3 py-1 rounded-full hover:bg-[#1a9cb7] hover:text-white transition">View All →</Link>
      </div>
      <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
        {cats.map(c=>(
          <Link key={c.id} href={`/category/${c.slug||c.name.toLowerCase().replace(/\s+/g,'-')}`} className="flex flex-col items-center gap-1.5 group">
            <div className="w-[48px] h-[48px] md:w-[56px] md:h-[56px] rounded-full bg-[#fff6f0] border border-[#ffe1d2] overflow-hidden flex items-center justify-center group-hover:bg-[#F85606] group-hover:border-[#F85606] group-hover:shadow-[0_6px_16px_rgba(248,86,6,0.3)] group-hover:-translate-y-1 transition-all duration-300 shadow-sm text-[22px]">
              {c.image_url? <img src={c.image_url} alt={c.name} className="w-full h-full object-cover" /> : <span className="group-hover:scale-125 transition-transform duration-300">{getIcon(c.name)}</span>}
            </div>
            <p className="text-[10px] md:text-[11px] text-center line-clamp-2 leading-[12px] group-hover:text-[#F85606] font-medium h-[24px]">{c.name}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}