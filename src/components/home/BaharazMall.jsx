'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function BaharazMall(){
  const [products, setProducts] = useState([])
  const supabase = createClient()
  useEffect(()=>{
    const load = async()=>{
      const { data } = await supabase.from('products').select('*').eq('is_baharaz_mall', true).eq('status','approved').limit(8)
      if(data) setProducts(data)
    }
    load()
    window.addEventListener('adminUpdated', load)
    return ()=> window.removeEventListener('adminUpdated', load)
  },[])
  if(products.length===0) return null
  return (
    <div className="bg-white rounded-[8px] p-3">
      <h2 className="font-bold text-[16px] mb-3">Baharaz Mall</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {products.map(p=>(
          <Link key={p.id} href={`/product/${p.id}`} className="border rounded p-2 hover:shadow"><img src={p.images?.[0] || p.image_url} alt="" className="h-[120px] mx-auto object-contain"/><p className="text-[12px] mt-2 truncate">{p.title}</p><p className="text-[#F85606] font-bold text-[13px]">৳{p.price}</p></Link>
        ))}
      </div>
    </div>
  )
}