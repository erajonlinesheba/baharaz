'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function ProductCard({ product, allProducts }) {
  if (!product) return null

  const slug = product.slug || product.id
  const title = product.title || product.name || 'Product'
  const price = Number(product.discount_price || product.price) || 0
  const originalPrice = Number(product.price) || 0
  const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0
  
  const getImg = () => {
    try {
      if (Array.isArray(product.images) && product.images.length > 0) {
        const first = product.images[0]
        return typeof first === 'string' ? first : first?.url || product.image_url || product.image
      }
      if (typeof product.images === 'string') {
        const parsed = JSON.parse(product.images)
        if (Array.isArray(parsed)) return parsed[0]
      }
      return product.image_url || product.image || product.thumbnail || 'https://via.placeholder.com/300x300?text=No+Image'
    } catch {
      return product.image_url || product.image || 'https://via.placeholder.com/300x300?text=No+Image'
    }
  }
  const img = getImg()

  // 0 SECOND LOAD - Click করার সাথে সাথে Cache
  const handleFastLoad = () => {
    try {
      // Single Product Cache
      sessionStorage.setItem(`baharaz_prod_${slug}`, JSON.stringify(product))
      
      // Full List Cache - Next Product ফাস্ট হবে
      if (allProducts && Array.isArray(allProducts)) {
        sessionStorage.setItem('baharaz_last_list', JSON.stringify(allProducts))
      } else {
        // যদি allProducts না থাকে, তাহলে এই একটা দিয়েই cache বানাও
        const existing = JSON.parse(sessionStorage.getItem('baharaz_last_list') || '[]')
        const merged = [product, ...existing.filter(p => p.id !== product.id)].slice(0, 100)
        sessionStorage.setItem('baharaz_last_list', JSON.stringify(merged))
      }

      // Prefetch hint for browser
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = `/product/${slug}`
      document.head.appendChild(link)
    } catch {}
  }

  return (
    <Link
      href={`/product/${slug}`}
      onClick={handleFastLoad}
      onMouseEnter={handleFastLoad}
      prefetch={true}
      className="group flex flex-col h-full rounded-[20px] overflow-hidden relative transition-all duration-500 active:scale-[0.98] hover:-translate-y-1"
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '0.5px solid rgba(255,255,255,0.8)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)'
      }}
    >
      {/* iOS 26 Top Shine - তোমার MobileHeader এর মতো */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent z-20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none z-10 rounded-[20px]"></div>

      <div className="aspect-square bg-gradient-to-b from-white to-[#f8f7f5] overflow-hidden relative p-2">
        <div className="w-full h-full rounded-[16px] overflow-hidden bg-white relative">
          <img
            src={img}
            alt={title}
            className="w-full h-full object-contain group-hover:scale-110 transition duration-700"
            loading="lazy"
          />
        </div>
        {discount > 0 && (
          <span className="absolute top-3 right-3 text-white text-[10px] font-black px-2.5 py-1 rounded-full z-20 backdrop-blur-[10px] border border-white/20"
                style={{
                  background: 'linear-gradient(135deg, #FF7A45, #F85606)',
                  boxShadow: '0 4px 12px rgba(248,86,6,0.35), inset 0 1px 0 rgba(255,255,255,0.3)'
                }}>
            -{discount}%
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1 relative z-10">
        <p className="text-[11px] lg:text-[12px] line-clamp-2 leading-[16px] h-[32px] font-[600] text-[#1a1a1a] tracking-[-0.1px]"
           style={{ fontFamily: '-apple-system, SF Pro Display, sans-serif' }}>
          {title}
        </p>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-[15px] font-black tracking-[-0.3px]"
                style={{
                  background: 'linear-gradient(135deg, #F85606, #E84500)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: '-apple-system, SF Pro Display, sans-serif'
                }}>৳{price.toLocaleString()}</span>
          {discount > 0 && (
            <span className="text-[11px] text-[#999] line-through font-[500]">৳{originalPrice.toLocaleString()}</span>
          )}
        </div>
        <div className="mt-1.5 flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-[#FFB400]/15 flex items-center justify-center">
            <span className="text-[#FFB400] text-[10px]">★</span>
          </div>
          <span className="text-[11px] text-[#666] font-[600] tracking-[-0.1px]">{product.rating || 4.5} • {product.sold_count || 100}+ Sold</span>
        </div>

        {/* Bottom Hairline - iOS 26 */}
        <div className="absolute bottom-0 left-3 right-3 h-[0.5px] bg-gradient-to-r from-transparent via-black/[0.06] to-transparent md:opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      {/* Hover Glow - তোমার MobileHeader এর F85606 Glow এর মতো */}
      <div className="absolute -inset-px rounded-[20px] bg-gradient-to-b from-[#F85606]/0 via-transparent to-transparent opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none"></div>
    </Link>
  )
}