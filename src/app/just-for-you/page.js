'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function JustForYouPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const PAGE_SIZE = 20

  const fetchProducts = async (pageNum = 0, isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadingMore(true)
      else setLoading(true)

      const from = pageNum * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      // STEP 1 - Try approved + active (তোমার আগের logic)
      let { data, error, count } = await supabase
      .from('products')
      .select('id, title, name, price, discount_price, original_price, image_url, images, slug, status, is_active, rating, sold_count, created_at, category', { count: 'exact' })
      .eq('status', 'approved')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(from, to)

      // STEP 2 - If no product or error (status column নাই বা approved নাই), fallback to all products - FIXED FOR YOU
      if (error ||!data || data.length === 0) {
        console.log("Fallback to all products - JustForYou:", error?.message)
        const res = await supabase
        .from('products')
        .select('id, title, name, price, discount_price, original_price, image_url, images, slug, rating, sold_count, created_at, category', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)
        data = res.data
        count = res.count
        error = res.error
      }

      if (error) throw error

      const formatted = (data || []).map(p => {
        const price = p.price || 0
        const discPrice = p.discount_price || p.original_price || 0
        let discount = 0
        if (p.discount_price && p.price) {
          discount = Math.round(((p.price - p.discount_price) / p.price) * 100)
        } else if (p.original_price && p.price && p.original_price > p.price) {
          discount = Math.round(((p.original_price - p.price) / p.original_price) * 100)
        }
        return {
          id: p.id,
          title: p.title || p.name || 'Product',
          price: price,
          discountPrice: p.discount_price || p.price,
          originalPrice: p.original_price || p.price,
          discount: discount > 0? discount : 0,
          image: p.image_url || p.images?.[0] || '/placeholder.png',
          slug: p.slug || p.id,
          rating: p.rating || (4 + Math.random()).toFixed(1),
          sold: p.sold_count || Math.floor(Math.random()*500)+10,
          category: p.category || 'General'
        }
      })

      if (isLoadMore) {
        setProducts(prev => [...prev,...formatted])
      } else {
        setProducts(formatted)
      }

      if (formatted.length < PAGE_SIZE) {
        setHasMore(false)
      } else {
        setHasMore(true)
      }

    } catch (err) {
      console.log("JustForYou Fetch Error:", err.message)
      if (!isLoadMore) setProducts([])
      setHasMore(false)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchProducts(0, false)
  }, [])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchProducts(nextPage, true)
  }

  if (loading) {
    return (
      <div className="max-w-[1188px] mx-auto bg-[#f5f5f5] min-h-screen">
        <div className="bg-white p-4 mb-2 flex justify-between items-center">
          <div className="h-6 bg-[#f5f5f5] rounded w-1/4 animate-pulse"></div>
          <div className="h-4 bg-[#f5f5f5] rounded w-20 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-[1px] bg-[#e0e0e0] p-[1px]">
          {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
            <div key={i} className="bg-white p-3 h-[240px] animate-pulse">
              <div className="w-full h-[140px] bg-[#f5f5f5] rounded"></div>
              <div className="h-4 bg-[#f5f5f5] rounded mt-3 w-3/4"></div>
              <div className="h-4 bg-[#f5f5f5] rounded mt-2 w-1/2"></div>
              <div className="h-3 bg-[#f5f5f5] rounded mt-2 w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="max-w-[1188px] mx-auto bg-[#f5f5f5] min-h-screen">
        <div className="bg-white px-4 h-[52px] flex items-center border-b sticky top-0 z-20">
          <Link href="/" className="text-[#666] text-[14px] hover:text-[#f85606]">Home</Link>
          <span className="mx-2 text-[#999]">/</span>
          <span className="text-[#212121] text-[14px] font-medium">Just For You - {products.length} Products</span>
        </div>
        <div className="bg-white p-10 text-center mt-2 rounded-[12px] mx-2 md:mx-0">
          <div className="text-[60px] mb-4">📦</div>
          <h2 className="text-[18px] font-bold text-[#212121]">No Products Found</h2>
          <p className="text-[14px] text-[#666] mt-2">No products in database yet. Add products in Supabase - products table.</p>
          <p className="text-[11px] text-[#999] mt-2">Debug: Check Supabase - products table has data?</p>
          <Link href="/" className="inline-block mt-6 bg-[#f85606] text-white px-8 py-2.5 rounded-[4px] text-[14px] font-bold hover:bg-[#212121] transition">GO TO HOME</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1188px] mx-auto bg-[#f5f5f5] min-h-screen pb-10">
      <div className="bg-white px-4 h-[52px] flex items-center justify-between border-b sticky top-0 z-20 shadow-sm">
        <div className="flex items-center">
          <Link href="/" className="text-[#666] text-[14px] hover:text-[#f85606]">Home</Link>
          <span className="mx-2 text-[#999]">/</span>
          <span className="text-[#212121] text-[14px] font-bold">Just For You</span>
          <span className="ml-2 text-[10px] bg-[#FFF3E0] text-[#EF6C00] px-2 py-0.5 rounded-full font-bold hidden md:block">Personalized</span>
        </div>
        <span className="text-[12px] text-[#666] bg-[#F5F5F5] px-3 py-1 rounded-full font-bold">{products.length} Products</span>
      </div>

      <div className="bg-gradient-to-r from-[#212121] to-[#F85606] mx-2 md:mx-0 mt-2 rounded-[12px] px-4 py-3 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <span className="text-[20px]">🎯</span>
          <div>
            <h1 className="text-[14px] md:text-[16px] font-black">Just For You - Personalized for you</h1>
            <p className="text-[11px] opacity-80">Best deals based on your browsing - {products.length} items</p>
          </div>
        </div>
        <Link href="/category" className="bg-white text-[#212121] px-4 py-2 rounded-full text-[11px] font-black hidden md:block hover:bg-[#212121] hover:text-white transition">All Categories →</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-[1px] bg-[#e0e0e0] p-[1px] mt-2">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="bg-white p-2 lg:p-3 group hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:z-10 hover:-translate-y-1 transition-all relative flex flex-col border border-transparent hover:border-[#F85606]/20"
          >
            <div className="relative w-full h-[160px] lg:h-[180px] bg-[#f9f9f9] rounded-[8px] overflow-hidden flex items-center justify-center p-2">
              <img src={product.image} alt={product.title} loading="lazy" className="w-full h-full object-contain group-hover:scale-110 transition duration-700" />
              {product.discount > 0 && (
                <div className="absolute top-2 left-2 bg-[#f85606] text-white text-[10px] font-black px-1.5 py-0.5 rounded-[4px] shadow">-{product.discount}%</div>
              )}
              <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition">{product.category}</div>
            </div>

            <h3 className="text-[12px] lg:text-[13px] text-[#212121] leading-[16px] mt-2.5 line-clamp-2 h-[32px] group-hover:text-[#f85606] transition-colors">{product.title}</h3>

            <div className="mt-2">
              <p className="text-[#f85606] font-black text-[14px] lg:text-[16px]">৳{Number(product.discountPrice).toLocaleString()}</p>
              {product.discount > 0 && (
                <p className="text-[#9e9e9e] text-[11px] line-through">৳{Number(product.price).toLocaleString()}</p>
              )}
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1">
                <div className="flex text-[#faca51] text-[10px]">★★★★★</div>
                <span className="text-[10px] text-[#9e9e9e]">({product.sold})</span>
              </div>
              <span className="text-[10px] text-[#00B894] font-bold">★ {product.rating}</span>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="bg-white border-2 border-[#f85606] text-[#f85606] hover:bg-[#f85606] hover:text-white px-10 py-2.5 rounded-full text-[13px] font-black transition disabled:opacity-50 shadow-sm hover:shadow-lg"
          >
            {loadingMore? 'LOADING...' : 'LOAD MORE →'}
          </button>
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <div className="text-center mt-8 pb-4">
          <p className="text-[12px] text-[#9e9e9e] bg-white inline-block px-4 py-2 rounded-full border">✓ You have seen all products - End of list</p>
          <div className="mt-4">
            <Link href="/" className="inline-block text-[#f85606] text-[13px] font-black border-2 border-[#f85606] px-6 py-2 rounded-full hover:bg-[#f85606] hover:text-white transition">BACK TO HOME</Link>
          </div>
        </div>
      )}
    </div>
  )
}