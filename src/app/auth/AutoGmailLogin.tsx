'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
export default function AutoGmailLogin() {
  const [show, setShow] = useState(false)
  useEffect(()=>{
    const u = localStorage.getItem('baharaz_user')
    if(!u){ const t=setTimeout(()=>setShow(true),1500); return ()=>clearTimeout(t) }
  },[])
  if(!show) return null
  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-[360px] p-6 relative">
        <button onClick={()=>setShow(false)} className="absolute top-3 right-3">✕</button>
        <div className="text-center"><h2 className="font-black text-[18px]">Welcome to Baharaz!</h2><p className="text-[12px] text-[#666]">Please login with Gmail</p>
        <Link href="/login" onClick={()=>setShow(false)} className="mt-4 w-full bg-[#f85606] text-white h-11 rounded-full flex items-center justify-center font-bold">Continue with Gmail</Link></div>
      </div>
    </div>
  )
}