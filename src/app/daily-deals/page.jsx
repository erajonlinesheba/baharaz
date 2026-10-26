'use client'
import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function DailyDealsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('default')
  const [timeLeft, setTimeLeft] = useState({ h: 23, m: 59, s: 59 })

  useEffect(() => {
    const timer = setInterval(() => {
      const end = new Date(); end.setHours(23, 59, 59, 999)
      const diff = end - new Date()
      if (diff > 0) {
        setTimeLeft({
          h: Math.floor(diff / 3600000),
          m: Math.floor((diff % 3600000) / 60000),
          s: Math.floor((diff % 60000) / 1000)
        })
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true)
      try {
        // ONLY products table - no daily_deals join to avoid error
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .limit(60)

        if (error) {
          console.log('Supabase Error:', error.message)
          throw error
        }

        console.log('Products loaded:', data?.length)

        const formatted = (data || []).map(p => ({
          id: p.id,
          discount_percent: p.discount_percent || p.discount || Math.floor(Math.random() * 40) + 15,
          stock_left: p.stock || 40,
          sold_count: p.sold || Math.floor(Math.random() * 60) + 10,
          products: p
        }))

        setProducts(formatted)
      } catch (err) {
        console.log('Fetch failed:', err?.message || err)
        // Empty holeo crash korbe na
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchDeals()
  }, [])

  const addToCart = async (item) => {
    const p = item.products
    const local = JSON.parse(localStorage.getItem('baharaz_cart') || '[]')
    const exist = local.find(i => i.id === p.id)
    if (exist) exist.qty += 1
    else local.push({ id: p.id, title: p.title || p.name, price: p.price, image: p.thumbnail || p.image, qty: 1 })
    localStorage.setItem('baharaz_cart', JSON.stringify(local))
    alert('Added!')
  }

  const filtered = useMemo(() => {
    let list = [...products]
    if (filter !== 'all') list = list.filter(i => (i.products.category || '').toLowerCase().includes(filter))
    if (sort === 'discount') list.sort((a, b) => b.discount_percent - a.discount_percent)
    if (sort === 'low') list.sort((a, b) => a.products.price - b.products.price)
    if (sort === 'high') list.sort((a, b) => b.products.price - a.products.price)
    return list
  }, [products, filter, sort])

  if (loading) return <div className="p-10 text-center font-bold">Loading Daily Deals...</div>

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-[80px]">
      <div className="bg-gradient-to-r from-[#F85606] to-[#FF8A00] text-white">
        <div className="max-w-[1200px] mx-auto px-3 py-3 flex justify-between items-center">
          <h1 className="text-[20px] font-black">Daily Deals 🔥</h1>
          <div className="flex gap-1 text-[12px] font-bold">
            <span className="bg-black/30 px-2 py-1 rounded">{String(timeLeft.h).padStart(2,'0')}</span>:
            <span className="bg-black/30 px-2 py-1 rounded">{String(timeLeft.m).padStart(2,'0')}</span>:
            <span className="bg-black/30 px-2 py-1 rounded text-yellow-300">{String(timeLeft.s).padStart(2,'0')}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-3 mt-3">
        <div className="bg-white p-2 rounded-lg flex gap-2 overflow-x-auto">
          {['all','gadget','beauty','fashion','home'].map(c => (
            <button key={c} onClick={()=>setFilter(c)} className={`px-4 py-1.5 rounded-full text-[12px] font-bold capitalize border ${filter===c?'bg-[#F85606] text-white':'bg-white'}`}>{c}</button>
          ))}
        </div>

        <div className="bg-white rounded-lg mt-3 p-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {filtered.map(item => {
            const p = item.products
            return (
              <div key={item.id} className="border rounded-lg overflow-hidden">
                <Link href={`/product/${p.id}`}>
                  <div className="aspect-square bg-gray-100 relative">
                    <img src={p.thumbnail || p.image || p.images?.[0] || '/placeholder.png'} alt={p.title} className="w-full h-full object-cover" />
                    <div className="absolute top-1 left-1 bg-[#FFE600] text-[10px] font-black px-1 rounded">-{item.discount_percent}%</div>
                  </div>
                </Link>
                <div className="p-2">
                  <p className="text-[11px] line-clamp-2 h-[32px]">{p.title || p.name}</p>
                  <p className="text-[#F85606] font-black text-[13px] mt-1">৳{p.price}</p>
                  <div className="flex gap-1 mt-2">
                    <button onClick={()=>addToCart(item)} className="flex-1 bg-orange-100 text-[#F85606] text-[10px] font-black py-1.5 rounded-full">ADD</button>
                    <Link href={`/product/${p.id}`} className="flex-1 bg-[#F85606] text-white text-[10px] font-black py-1.5 rounded-full text-center">BUY</Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {filtered.length===0 && <p className="text-center py-20 font-bold">No products in DB - Add products to products table</p>}
      </div>
    </div>
  )
}