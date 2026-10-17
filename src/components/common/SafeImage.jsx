'use client'
import { useState } from 'react'
import Image from 'next/image'

export default function SafeImage({ src, alt, width = 300, height = 300, className = "", fill = false }) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  const fallback = `https://placehold.co/${width}x${height}/f57224/ffffff?text=Baharaz`

  // Supabase / glitch image check
  const isValidSrc = src && typeof src === 'string' && src.startsWith('http') &&!src.includes('wa_image') && src.length > 10
  const finalSrc = error ||!isValidSrc? fallback : src

  return (
    <div className={`relative bg-[#fafafa] overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-[#f0f0f0] animate-pulse flex items-center justify-center z-10">
          <span className="text-[10px] font-black text-gray-400">Baharaz</span>
        </div>
      )}
      <Image
        src={finalSrc}
        alt={alt || 'Baharaz Product'}
        width={fill? undefined : width}
        height={fill? undefined : height}
        fill={fill}
        className={`w-full h-full object-contain transition duration-500 ${loading? 'opacity-0' : 'opacity-100'}`}
        onError={() => { setError(true); setLoading(false) }}
        onLoad={() => setLoading(false)}
        unoptimized
      />
    </div>
  )
}