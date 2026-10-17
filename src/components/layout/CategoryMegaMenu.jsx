'use client'
import Link from 'next/link'

const STATIC_CATS = [
  { name: 'Electronics', href: '/category/electronics', sub: ['Mobiles', 'Laptops', 'Gadgets'] },
  { name: 'Fashion', href: '/category/fashion', sub: ['Men', 'Women', 'Kids'] },
  { name: 'Home & Living', href: '/category/home', sub: ['Kitchen', 'Decor'] },
  { name: 'Beauty', href: '/category/beauty', sub: ['Makeup', 'Skincare'] },
  { name: 'Sports', href: '/category/sports', sub: ['Cricket', 'Football'] },
  { name: 'Toys', href: '/category/toys', sub: ['Kids Toys', 'Games'] },
]

export default function CategoryMegaMenu(){
  return (
    <div className="w-[720px] bg-white flex">
      <div className="w-[220px] bg-[#f8f8f8] p-2 border-r">
        {STATIC_CATS.map(c=>(
          <Link key={c.name} href={c.href} className="flex justify-between items-center px-3 py-3 hover:bg-white hover:text-[#f85606] text-[13px] font-medium text-black rounded">
            {c.name} <span>›</span>
          </Link>
        ))}
      </div>
      <div className="flex-1 p-5 grid grid-cols-3 gap-4">
        {STATIC_CATS.map(c=>(
          <div key={c.name}>
            <Link href={c.href} className="font-bold text-[13px] text-black mb-2 block hover:text-[#f85606]">{c.name}</Link>
            {c.sub.map(s=>(
              <Link key={s} href={`${c.href}?q=${encodeURIComponent(s)}`} className="block text-[12px] text-gray-600 hover:text-[#f85606] py-1">{s}</Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}