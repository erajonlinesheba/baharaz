'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from "@/lib/supabase/client"
const supabase = createClient()

export default function DailySheraDeals(){
  const [products,setProducts]=useState([])
  const getImg = useCallback((p)=>{
    try{
      if(p.images?.[0]) return typeof p.images[0]==='string'?p.images[0]:p.images[0]?.url||'/placeholder.png'
      return p.image_url||'/placeholder.png'
    }catch{return '/placeholder.png'}
  },[])
  const getDis = useCallback((p)=>{
    if(p.discount_percent) return Number(p.discount_percent)
    if(p.original_price&&p.price) return Math.round(((p.original_price-p.price)/p.original_price)*100)
    return 18
  },[])
  useEffect(()=>{
    const load=async()=>{
      const {data}=await supabase.from('products').select('*').eq('status','approved').order('sold_count',{ascending:false}).limit(6)
      if(data) setProducts(data)
    }
    load()
  },[])
  return (
    <div className="bg-white py-3 mt-[6px]">
      <div className="flex justify-between items-center px-3 mb-2">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-[18px] text-[#111]">Daily Shera Deals</h2>
          <span className="bg-[#ffe500] text-black text-[10px] font-black px-2 py-0.5 rounded">CHOICE</span>
        </div>
        <Link href="/daily-deals" className="text-[12px]">Shop Now | Free Gift! &gt;</Link>
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-3">
        {products.map(p=>{
          const dis=getDis(p)
          return (
            <Link key={p.id} href={`/product/${p.slug||p.id}`} className="min-w-[110px] w-[110px] block">
              <div className="bg-white border border-gray-100 h-[110px] flex items-center justify-center">
                <img src={getImg(p)} alt="" className="w-full h-full object-contain"/>
              </div>
              <div className="flex items-center justify-between bg-[#fff9e2] px-2 py-1">
                <span className="font-bold text-[13px]">৳{Number(p.price).toFixed(0)}</span>
                <span className="bg-[#ffe97a] text-[11px] font-bold px-2 py-0.5 rounded-full">-{dis}%</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}