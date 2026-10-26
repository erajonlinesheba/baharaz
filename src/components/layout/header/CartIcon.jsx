'use client'
import { memo, useState, useEffect } from 'react'
import Link from 'next/link'

const CartIcon = memo(function CartIcon(){
  const [count, setCount] = useState(0)
  
  useEffect(()=>{
    const update = ()=>{
      try{
        const c = JSON.parse(localStorage.getItem('baharaz_cart')||'[]')
        setCount(c.reduce((a,b)=>a+(b.qty||b.quantity||1),0))
      }catch{ setCount(0) }
    }
    update()
    window.addEventListener('cartUpdated', update)
    window.addEventListener('storage', update)
    return ()=>{
      window.removeEventListener('cartUpdated', update)
      window.removeEventListener('storage', update)
    }
  },[])

  return (
    <Link href="/cart" className="shrink-0 relative w-[40px] h-[40px] flex items-center justify-center rounded-full hover:bg-white/10 transition group">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="white" className="group-hover:scale-110 transition-transform">
        <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM17 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.2 14h14.55c.42 0 .83-.18 1.11-.49.28-.31.42-.72.37-1.14L22 6H6.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 16.37 5.48 18 7 18h12v-2H7l1.1-2z"/>
      </svg>
      {count>0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-white text-[#F85606] text-[11px] min-w-[20px] h-[20px] px-1 rounded-full flex items-center justify-center font-black shadow-[0_2px_8px_rgba(0,0,0,0.2)] animate-[scaleIn_0.2s_ease]">
          {count>99 ? '99+' : count}
        </span>
      )}
    </Link>
  )
})

export default CartIcon