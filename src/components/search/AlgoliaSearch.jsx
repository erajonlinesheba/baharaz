'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
export default function AlgoliaSearch({ placeholder }){
  const [q, setQ] = useState('')
  const router = useRouter()
  return (
    <div className="flex bg-white rounded-[4px] overflow-hidden h-[40px]">
      <input
        value={q}
        onChange={e=>setQ(e.target.value)}
        onKeyDown={e=>{ if(e.key==='Enter' && q.trim()) router.push(`/search?q=${encodeURIComponent(q)}`) }}
        placeholder={placeholder || "Search in Baharaz"}
        className="flex-1 px-3 text-[14px] text-black outline-none"
      />
      <button onClick={()=> q.trim() && router.push(`/search?q=${encodeURIComponent(q)}`)} className="px-4 bg-[#ffe1d2] text-[#f85606]">🔍</button>
    </div>
  )
}