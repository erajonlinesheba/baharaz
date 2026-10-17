'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import ProductCard from './ProductCard'

export default function RelatedProducts({ currentProduct }) {
  const [realProducts, setRealProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReal = async () => {
      if (!currentProduct?.id) return
      setLoading(true)
      let query = supabase.from('products').select('*').neq('id', currentProduct.id)
      if (currentProduct.category) {
        query = query.eq('category', currentProduct.category)
      }
      const { data, error } = await query.limit(20)
      if (data && data.length > 0) {
        const sorted = data.sort((a, b) => {
          const ra = parseFloat(a.rating || 0)
          const rb = parseFloat(b.rating || 0)
          if (rb!== ra) return rb - ra
          return (b.review_count || 0) - (a.review_count || 0)
        })
        setRealProducts(sorted)
      } else {
        const { data: allData } = await supabase.from('products').select('*').neq('id', currentProduct.id).order('rating', { ascending: false }).limit(12)
        if (allData) setRealProducts(allData)
      }
      setLoading(false)
    }
    fetchReal()
  }, [currentProduct])

  if (loading) return <div className="bg-white mt-3 p-3 rounded text-[12px]">Loading real suggested products...</div>
  if (realProducts.length === 0) return null

  return (
    <div className="bg-white mt-3 p-3 rounded">
      <h2 className="font-bold text-[14px] mb-3">You May Also Like - Real Products - Valo Rating Age Sajano</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {realProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}