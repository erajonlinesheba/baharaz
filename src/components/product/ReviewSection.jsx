// src/components/ReviewSection.jsx - FULL CODE
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Star, ThumbsUp, Image as ImageIcon } from 'lucide-react'

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState({ avg: 4.8, total: 0, five: 80 })

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('reviews').select('*').eq('product_id', productId).order('created_at', { ascending: false }).limit(10)
      if (data) {
        setReviews(data)
        setStats({ avg: data.length? (data.reduce((s, r) => s + r.rating, 0) / data.length).toFixed(1) : 4.8, total: data.length, five: 75 })
      }
    }
    load()
  }, [productId])

  return (
    <div className="bg-white rounded-xl p-4 lg:p-5 mt-4">
      <h3 className="font-bold text-[16px] mb-4">Ratings & Reviews of {productId}</h3>

      {/* Summary */}
      <div className="flex gap-8 border-b pb-4">
        <div className="text-center">
          <p className="text-[32px] font-bold">{stats.avg}<span className="text-[16px] text-gray-400">/5</span></p>
          <div className="flex justify-center"><Star size={14} className="fill-[#ffca28] text-[#ffca28]" /><Star size={14} className="fill-[#ffca28] text-[#ffca28]" /><Star size={14} className="fill-[#ffca28] text-[#ffca28]" /><Star size={14} className="fill-[#ffca28] text-[#ffca28]" /><Star size={14} className="fill-[#ffca28] text-[#ffca28]" /></div>
          <p className="text-[11px] text-gray-500 mt-1">{stats.total} Ratings</p>
        </div>
        <div className="flex-1 space-y-1">
          {[5,4,3,2,1].map(star => (
            <div key={star} className="flex items-center gap-2 text-[11px]">
              <span className="w-8">{star} Star</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-[#ffca28]" style={{ width: `${star === 5? stats.five : star === 4? 15 : 5}%` }}></div></div>
              <span className="w-8 text-gray-500">{star === 5? stats.five : star === 4? 15 : 5}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-4 mt-4">
        {reviews.length === 0? <p className="text-[12px] text-gray-500">No reviews yet. Be the first to review!</p> : reviews.map(r => (
          <div key={r.id} className="border-b pb-4 last:border-0">
            <div className="flex gap-1">{[...Array(r.rating)].map((_, i) => <Star key={i} size={12} className="fill-[#ffca28] text-[#ffca28]" />)}</div>
            <p className="text-[12px] text-[#212121] mt-1">{r.review_text || 'Excellent product, highly recommended!'}</p>
            {r.images?.length > 0 && <div className="flex gap-2 mt-2">{r.images.map((img, i) => <img key={i} src={img} className="w-14 h-14 rounded border object-cover" />)}</div>}
            <p className="text-[11px] text-gray-400 mt-2">by User • {new Date(r.created_at).toLocaleDateString()} • <span className="flex inline-flex items-center gap-1"><ThumbsUp size={10} /> Helpful (12)</span></p>
          </div>
        ))}
      </div>
    </div>
  )
}