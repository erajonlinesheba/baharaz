'use client'
import { useState } from 'react'
import Link from 'next/link'

const STATIC_CATS = [
  { name: 'Electronics', href: '/category/electronics', sub: ['Mobiles', 'Laptops', 'Gadgets', 'Tablets', 'Cameras'] },
  { name: 'Fashion', href: '/category/fashion', sub: ['Men', 'Women', 'Kids', 'Watches', 'Bags'] },
  { name: 'Home & Living', href: '/category/home', sub: ['Kitchen', 'Decor', 'Furniture', 'Lighting'] },
  { name: 'Beauty', href: '/category/beauty', sub: ['Makeup', 'Skincare', 'Hair Care', 'Perfume'] },
  { name: 'Sports', href: '/category/sports', sub: ['Cricket', 'Football', 'Gym', 'Cycling'] },
  { name: 'Toys', href: '/category/toys', sub: ['Kids Toys', 'Games', 'Dolls', 'Cars'] },
]

export default function CategoryMegaMenu({ onClose }){
  const [active, setActive] = useState(STATIC_CATS[0])

  return (
    <div className="w-[750px] max-w-[90vw] bg-white flex rounded-b-lg shadow-[0_8px_20px_rgba(0,0,0,0.15)] overflow-hidden border border-gray-100">
      {/* Left */}
      <div className="w-[220px] bg-[#fafafa] py-2 border-r border-gray-100 shrink-0">
        {STATIC_CATS.map(c=>(
          <Link 
            key={c.name} 
            href={c.href} 
            onMouseEnter={()=> setActive(c)}
            onClick={()=> onClose?.()}
            className={`flex justify-between items-center px-4 py-3 text-[13px] font-medium transition-all ${active.name === c.name ? 'bg-white text-[#F85606] shadow-sm' : 'text-[#444] hover:bg-white hover:text-[#F85606]'}`}
          >
            <span>{c.name}</span> <span className="text-[16px] opacity-60">›</span>
          </Link>
        ))}
      </div>

      {/* Right - Active Category er Sub */}
      <div className="flex-1 p-6 bg-white">
        <Link href={active.href} onClick={()=> onClose?.()} className="font-bold text-[14px] text-black mb-4 block hover:text-[#F85606] border-b pb-2">
          {active.name}
        </Link>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1">
          {active.sub.map(s=>(
            <Link 
              key={s} 
              href={`${active.href}?q=${encodeURIComponent(s)}`} 
              onClick={()=> onClose?.()}
              className="block text-[13px] text-gray-600 hover:text-[#F85606] hover:underline py-2"
            >
              {s}
            </Link>
          ))}
        </div>
        <Link href={active.href} className="mt-6 inline-block text-[12px] text-[#F85606] font-bold hover:underline">
          View All {active.name} ›
        </Link>
      </div>
    </div>
  )
}