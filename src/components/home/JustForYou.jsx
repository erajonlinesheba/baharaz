'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from "@/lib/supabase/client"

export default function JustForYou(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(()=>{
    const load = async()=>{
      setLoading(true)
      const { data } = await supabase.from('products').select('*').eq('status','approved').order('created_at',{ascending:false}).limit(18)
      if(data) setProducts(data)
      setLoading(false)
    }
    load()
    window.addEventListener('productAdded', load)
    return ()=> window.removeEventListener('productAdded', load)
  },[])

  if(loading) return <div className="bg-white rounded-[12px] p-4 text-center text-[12px]">Loading Just For You...</div>

  return (
    <div className="bg-transparent">
      <h2 className="font-black text-[16px] mb-3 px-1">Just For You</h2>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-3">
        {products.map(p=>(
          <Link key={p.id} href={`/product/${p.id}`} className="bg-white rounded-[8px] overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 group border border-gray-100">
            <div className="h-[160px] bg-white flex items-center justify-center p-2 relative overflow-hidden">
              <img src={p.images?.[0] || p.image_url || p.image} alt={p.title||p.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-500"/>
              {p.free_delivery && <span className="absolute bottom-1 left-1 bg-[#10b981] text-white text-[8px] font-black px-1.5 py-0.5 rounded">FREE DELIVERY</span>}
            </div>
            <div className="p-2.5">
              <p className="text-[12px] line-clamp-2 h-[34px] leading-[16px] text-[#212121]">{p.title||p.name}</p>
              <p className="text-[#F85606] font-black text-[16px] mt-2">৳{p.price}</p>
              <div className="flex items-center gap-1 mt-1"><p className="text-[11px] text-gray-400 line-through">৳{p.original_price||''}</p><p className="text-[10px] text-[#212121]">-{p.discount_percent||20}%</p></div>
              <div className="flex items-center gap-1 mt-2 text-[10px] text-[#9e9e9e]"><span>⭐ {(4+Math.random()).toFixed(1)}</span><span>•</span><span>{Math.floor(Math.random()*500)+50} Sold</span></div>
            </div>
          </Link>
        ))}
      </div>
      <div className="text-center mt-6"><button className="border border-[#F85606] text-[#F85606] px-12 py-2 rounded-[4px] text-[13px] font-black hover:bg-[#F85606] hover:text-white transition">LOAD MORE</button></div>
    </div>
  )
}