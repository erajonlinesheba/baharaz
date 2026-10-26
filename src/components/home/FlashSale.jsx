'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from "@/lib/supabase/client"
const supabase = createClient()

export default function FlashSale(){
  const [products,setProducts]=useState([])
  const [loading,setLoading]=useState(true)
  const getImg = useCallback((p)=>{
    try{
      if(p.images?.[0]) return typeof p.images[0]==='string'?p.images[0]:p.images[0]?.url||'/placeholder.png'
      if(typeof p.images==='string'){const j=JSON.parse(p.images);if(Array.isArray(j)&&j[0]) return typeof j[0]==='string'?j[0]:j[0]?.url}
      return p.image_url||p.image||'/placeholder.png'
    }catch{return p.image_url||'/placeholder.png'}
  },[])
  const getDis = useCallback((p)=>{
    if(p.discount_percent) return Number(p.discount_percent)
    if(p.original_price&&p.price&&Number(p.original_price)>Number(p.price)) return Math.round(((Number(p.original_price)-Number(p.price))/Number(p.original_price))*100)
    return 0
  },[])
  useEffect(()=>{
    let m=true
    const load=async()=>{
      try{
        const {data}=await supabase.from('products').select('*').eq('status','approved').order('created_at',{ascending:false}).limit(6)
        if(m&&data) setProducts(data)
      }catch{}finally{if(m) setLoading(false)}
    }
    load()
    return()=>{m=false}
  },[])
  if(loading) return <div className="bg-white p-3"><div className="h-5 w-32 bg-gray-200 animate-pulse mb-3"></div><div className="grid grid-cols-3 gap-2">{[...Array(3)].map((_,i)=><div key={i} className="h-[140px] bg-gray-100 animate-pulse"></div>)}</div></div>
  return (
    <div className="bg-white py-3">
      <div className="flex justify-between items-center px-3 mb-2">
        <h2 className="font-bold text-[18px] text-[#111]">Flash Sale</h2>
        <Link href="/flash-sale" className="text-[12px] font-medium">Shop More &gt;</Link>
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-3">
        {products.slice(0,6).map(p=>{
          const img=getImg(p); const dis=getDis(p)
          return (
            <Link key={p.id} href={`/product/${p.slug||p.id}`} className="min-w-[110px] w-[110px] md:min-w-[140px] md:w-[140px] bg-white block">
              <div className="bg-[#f5f5f5] h-[110px] md:h-[140px] flex items-center justify-center overflow-hidden rounded-[4px]">
                <img src={img} alt={p.title||p.name} className="w-full h-full object-contain"/>
              </div>
              <div className="flex items-center justify-between mt-1 bg-[#fff9e2] px-1 py-1 rounded-b-[4px]">
                <span className="text-[#d70000] font-bold text-[13px]">৳{Number(p.price).toFixed(0)}</span>
                {dis>0&&<span className="bg-[#ffe97a] text-[#111] text-[11px] font-bold px-2 py-0.5 rounded-[10px] rounded-l-none" style={{clipPath:'polygon(15% 0%,100% 0%,100% 100%,15% 100%,0% 50%)'}}>-{dis}%</span>}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}