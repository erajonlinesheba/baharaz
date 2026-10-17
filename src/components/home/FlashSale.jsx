'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from "@/lib/supabase/client"

export default function FlashSale(){
  const [products, setProducts] = useState([])
  const [timeLeft, setTimeLeft] = useState(5*3600+23*60+45)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(()=>{
    const load = async()=>{
      setLoading(true)
      let { data } = await supabase.from('products').select('*').eq('is_flash_sale', true).eq('status','approved').order('created_at',{ascending:false}).limit(6)
      if(!data || data.length===0){
        const { data: fb } = await supabase.from('products').select('*').eq('status','approved').order('created_at',{ascending:false}).limit(6)
        data = fb
      }
      if(data) setProducts(data)
      setLoading(false)
    }
    load()
    const t = setInterval(()=> setTimeLeft(s=> s>0? s-1 : 5*3600), 1000)
    window.addEventListener('productAdded', load)
    return ()=>{ clearInterval(t); window.removeEventListener('productAdded', load) }
  },[])

  const h = String(Math.floor(timeLeft/3600)).padStart(2,'0')
  const m = String(Math.floor((timeLeft%3600)/60)).padStart(2,'0')
  const s = String(timeLeft%60).padStart(2,'0')

  if(loading) return <div className="bg-white rounded-[8px] p-4 text-center text-[12px] animate-pulse">Loading Flash Sale...</div>
  if(products.length===0) return null

  return (
    <div className="bg-white rounded-[12px] p-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-gray-100">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <h2 className="font-black text-[16px] text-[#1a1a1a]">Flash Sale</h2>
          <div className="flex items-center gap-1">
            <span className="bg-[#111] text-white text-[11px] font-bold px-1.5 py-1 rounded min-w-[22px] text-center">{h}</span><span className="font-bold">:</span>
            <span className="bg-[#111] text-white text-[11px] font-bold px-1.5 py-1 rounded min-w-[22px] text-center">{m}</span><span className="font-bold">:</span>
            <span className="bg-[#F85606] text-white text-[11px] font-bold px-1.5 py-1 rounded min-w-[22px] text-center animate-pulse">{s}</span>
          </div>
        </div>
        <Link href="/flash-sale" className="text-[#F85606] text-[11px] border border-[#F85606] px-3 py-1 rounded-full font-black hover:bg-[#F85606] hover:text-white transition">SHOP ALL</Link>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
        {products.map(p=>(
          <Link key={p.id} href={`/product/${p.id}`} className="group block border border-transparent hover:border-gray-200 rounded-[8px] p-2 hover:shadow-md transition-all bg-white">
            <div className="h-[110px] md:h-[130px] bg-[#fafafa] rounded-[6px] flex items-center justify-center overflow-hidden relative">
              <span className="absolute top-1 left-1 bg-[#F85606] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">-{p.discount_percent||20}%</span>
              <img src={p.images?.[0] || p.image_url || p.image} alt={p.title || p.name} className="h-full w-full object-contain group-hover:scale-110 transition duration-500"/>
            </div>
            <p className="text-[11px] line-clamp-2 h-[30px] mt-2 leading-[14px] text-[#212121] group-hover:text-[#F85606]">{p.title || p.name}</p>
            <p className="text-[#F85606] font-black text-[14px] mt-1">৳{p.price}</p>
            <div className="flex items-center gap-1 mt-1">
              <p className="text-[10px] text-gray-400 line-through">৳{p.original_price || p.price+300}</p>
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden ml-1"><div className="h-full bg-[#F85606] rounded-full" style={{width: `${Math.floor(Math.random()*70)+20}%`}}></div></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}