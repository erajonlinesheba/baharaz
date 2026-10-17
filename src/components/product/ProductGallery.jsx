'use client'
import { useState } from 'react'

export default function ProductGallery({ images }) {
  const [active, setActive] = useState(0)
  const allImages = images && images.length > 0? images : ["https://via.placeholder.com/600x600?text=No+Image"]

  return (
    <div className="flex gap-3">
      <div className="flex flex-col gap-2 w-[60px]">
        {allImages.map((img, i) => (
          <div key={i} onClick={() => setActive(i)} className={`w-[54px] h-[54px] border-2 cursor-pointer flex items-center justify-center ${active === i? 'border-[#f85606]' : 'border-gray-200'}`}>
            <img src={img} alt="thumb" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      <div className="flex-1 border rounded bg-white aspect-square flex items-center justify-center overflow-hidden">
        <img src={allImages[active]} alt="main" className="w-full h-full object-contain" />
      </div>
    </div>
  )
}