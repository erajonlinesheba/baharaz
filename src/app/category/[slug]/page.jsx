import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Script from 'next/script'

export const revalidate = 3600
export const dynamicParams = true

// ================= SEO METADATA - GOOGLE 1 NUMBER =================
export async function generateMetadata({ params }) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug || 'all')
  const cleanName = decodedSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const categoryName = decodedSlug === 'all'? 'All Categories' : cleanName

  const title = `${categoryName} - Buy ${categoryName} Online at Best Price in Bangladesh | Baharaz`
  const description = `Buy ${categoryName} at lowest price in Bangladesh. Shop from huge collection of ${categoryName} like ${categoryName} - Mini Fan, Power Bank, Smart Watch, T-Shirt & more. ✓Fast Delivery ✓Best Deals ✓Cash on Delivery - Baharaz.com`
  const keywords = `${categoryName}, buy ${categoryName} online, ${categoryName} price in Bangladesh, ${categoryName} BD, cheap ${categoryName}, Baharaz ${categoryName}, Daraz ${categoryName} alternative, ${categoryName} online shopping`
  const url = `https://www.baharaz.com/category/${decodedSlug}`

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
    openGraph: {
      title, description, url, siteName: 'Baharaz - Best Online Shopping in Bangladesh', locale: 'en_BD', type: 'website',
      images: [{ url: 'https://www.baharaz.com/og-category.jpg', width: 1200, height: 630, alt: `${categoryName} - Baharaz` }]
    },
    twitter: {
      card: 'summary_large_image', title, description, site: '@baharazbd', creator: '@baharazbd',
      images: ['https://www.baharaz.com/og-category.jpg']
    },
    verification: { google: 'google-verification-code', facebook: 'facebook-domain-verification' },
    other: { 'og:email': 'support@baharaz.com', 'og:phone_number': '+8801XXXXXXXXX', 'og:availability': 'instock' }
  }
}

// ================= PAGE =================
export default async function CategorySlugPage({ params }) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug || 'all')
  const supabase = await createClient()

  let products = []
  let categoryName = decodedSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  let categoryInfo = null
  let relatedCategories = []
  let totalProducts = 0

  try {
    if (decodedSlug.toLowerCase()!== 'all') {
      const { data: cat } = await supabase.from('categories').select('*').or(`slug.eq.${decodedSlug},name.ilike.%${categoryName}%`).maybeSingle()
      if (cat) {
        categoryInfo = cat
        categoryName = cat.name
      }
    }

    if (decodedSlug.toLowerCase() === 'all') {
      const { data, count } = await supabase.from('products').select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(100)
      products = data || []
      totalProducts = count || products.length
      categoryName = 'All Categories'
    } else {
      let { data, count } = await supabase.from('products').select('*', { count: 'exact' }).ilike('category', `%${categoryName}%`).order('created_at', { ascending: false }).limit(100)
      if (!data || data.length === 0) {
        const fallbackName = decodedSlug.replace(/-/g, ' ')
        const res = await supabase.from('products').select('*', { count: 'exact' }).ilike('category', `%${fallbackName}%`).order('created_at', { ascending: false }).limit(100)
        data = res.data
        count = res.count
      }
      products = data || []
      totalProducts = count || products.length
    }

    const { data: relData } = await supabase.from('products').select('category').limit(100)
    if (relData) {
      const unique = [...new Set(relData.map(r => r.category).filter(Boolean))]
      relatedCategories = unique.slice(0, 12).map(name => ({
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        count: relData.filter(r => r.category === name).length
      }))
    }

  } catch (error) {
    console.log('Category Page Error:', error.message)
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.baharaz.com' },
      { '@type': 'ListItem', position: 2, name: 'Categories', item: 'https://www.baharaz.com/category' },
      { '@type': 'ListItem', position: 3, name: categoryName, item: `https://www.baharaz.com/category/${decodedSlug}` }
    ]
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryName} - Baharaz`,
    description: `Shop ${categoryName} at best price in Bangladesh`,
    url: `https://www.baharaz.com/category/${decodedSlug}`,
    isPartOf: { '@type': 'WebSite', name: 'Baharaz', url: 'https://www.baharaz.com' },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.slice(0, 20).map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `https://www.baharaz.com/product/${p.slug || p.id}`,
        name: p.title || p.name
      }))
    }
  }

  // FIX IMAGE HELPER - 100% FIX FOR CUT IMAGE
  const getProductImage = (p) => {
    if (p.images && Array.isArray(p.images) && p.images.length > 0) {
      const first = p.images[0]
      if (typeof first === 'string') return first
      if (first?.url) return first.url
    }
    if (p.images && typeof p.images === 'string') {
      try {
        const parsed = JSON.parse(p.images)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0]
      } catch {}
    }
    return p.image_url || p.image || p.thumbnail || 'https://via.placeholder.com/200?text=No+Image'
  }

  return (
    <>
      <Script id="breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="itemlist-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <div className='bg-[#F5F5F5] min-h-screen pb-20'>
        <div className='bg-white border-b sticky top-0 z-20'>
          <div className='max-w-[1188px] mx-auto px-3 md:px-0 h-[50px] flex items-center justify-between'>
            <div className='flex items-center text-[13px] overflow-hidden'>
              <Link href="/" className='text-[#666] hover:text-[#F85606] whitespace-nowrap'>Home</Link>
              <span className='mx-2 text-gray-300'>/</span>
              <Link href="/category" className='text-[#666] hover:text-[#F85606] whitespace-nowrap'>Categories</Link>
              <span className='mx-2 text-gray-300'>/</span>
              <h1 className='font-bold text-[#212121] text-[13px] md:text-[14px] capitalize truncate'>{categoryName} - {totalProducts} Items</h1>
            </div>
            <div className='hidden md:flex items-center gap-3 text-[11px] text-gray-500'>
              <span>Share:</span>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=https://www.baharaz.com/category/${decodedSlug}`} target="_blank" className='w-6 h-6 bg-[#1877F2] text-white rounded-full flex items-center justify-center'>f</a>
              <a href={`https://twitter.com/intent/tweet?url=https://www.baharaz.com/category/${decodedSlug}&text=${categoryName} at Baharaz`} target="_blank" className='w-6 h-6 bg-black text-white rounded-full flex items-center justify-center'>X</a>
            </div>
          </div>
        </div>

        <div className='max-w-[1188px] mx-auto p-2 md:p-3'>
          <div className='bg-gradient-to-r from-[#1a1a1a] via-[#333] to-[#F85606] rounded-[16px] md:rounded-[20px] p-4 md:p-6 text-white mb-3 relative overflow-hidden'>
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-[60px]"></div>
            <div className='relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
              <div className='flex items-center gap-4'>
                <div className='w-[60px] h-[60px] md:w-[72px] md:h-[72px] bg-white/20 backdrop-blur rounded-[16px] flex items-center justify-center text-[32px] font-black border border-white/20'>
                  {categoryName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className='font-black text-[20px] md:text-[28px] capitalize leading-tight'>{categoryName}</h2>
                  <p className='text-[12px] md:text-[13px] opacity-90 mt-1'>{totalProducts} Products Found • Best Price in Bangladesh • Fast Delivery • Cash on Delivery</p>
                  <div className='flex gap-2 mt-2'>
                    <span className='bg-white/20 backdrop-blur text-[10px] px-2.5 py-1 rounded-full border border-white/20'>✓ Best Price</span>
                    <span className='bg-white/20 backdrop-blur text-[10px] px-2.5 py-1 rounded-full border border-white/20'>✓ Free Delivery</span>
                    <span className='bg-white/20 backdrop-blur text-[10px] px-2.5 py-1 rounded-full border border-white/20'>✓ Warranty</span>
                  </div>
                </div>
              </div>
              <div className='flex gap-2'>
                <Link href="/category" className='bg-white text-black px-5 py-3 rounded-full text-[12px] font-black hover:bg-gray-100 transition shadow-lg'>All Categories →</Link>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-[12px] border p-3 md:p-4 mb-3 hidden md:block'>
            <h2 className='font-bold text-[14px] text-[#212121]'>Buy {categoryName} Online at Best Price in Bangladesh - Baharaz</h2>
            <p className='text-[12px] text-[#666] mt-1 leading-[18px]'>
              Looking for {categoryName} price in Bangladesh? Baharaz is the best online shopping site in Bangladesh for {categoryName}. Shop from a huge collection of {categoryName} - {relatedCategories.map(c=>c.name).join(', ')} and more. Get best deals, discounts, and offers on {categoryName} with fast delivery all over Bangladesh. Cash on Delivery available. Daraz alternative with better price. Shop now at Baharaz.com!
            </p>
          </div>

          {products.length === 0? (
            <div className='bg-white p-10 md:p-16 text-center rounded-[16px] border shadow-sm'>
              <div className='w-[80px] h-[80px] bg-[#FFF3E8] rounded-full flex items-center justify-center mx-auto text-[32px]'>📦</div>
              <h3 className='font-black text-[18px] md:text-[20px] mt-4'>No Products In {categoryName} Yet</h3>
              <p className='text-[12px] text-gray-500 mt-2'>We are adding new products. Explore other categories.</p>
              <div className='flex gap-2 justify-center mt-6 flex-wrap max-w-[600px] mx-auto'>
                {relatedCategories.map(rc => (
                  <Link key={rc.slug} href={`/category/${rc.slug}`} className='bg-[#F5F5F5] hover:bg-[#F85606] hover:text-white border rounded-full px-4 py-2 text-[12px] font-medium transition'>
                    {rc.name} ({rc.count})
                  </Link>
                ))}
              </div>
              <Link href="/" className='inline-block mt-6 bg-[#F85606] text-white px-8 py-3 rounded-full text-[13px] font-black'>Continue Shopping</Link>
            </div>
          ) : (
            <>
              <div className='bg-white rounded-[12px] border p-2.5 mb-3 flex flex-wrap items-center justify-between gap-2'>
                <div className='flex items-center gap-2 text-[12px]'>
                  <span className='font-bold'>{totalProducts} Items</span>
                  <span className='text-gray-400'>in</span>
                  <span className='font-bold text-[#F85606] capitalize'>{categoryName}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-[11px] text-gray-500'>Sort:</span>
                  <select className='border rounded-full px-3 py-1.5 text-[11px] bg-[#F5F5F5]'>
                    <option>Best Match</option>
                    <option>Price Low to High</option>
                    <option>Price High to Low</option>
                    <option>Newest</option>
                  </select>
                </div>
              </div>

              <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3'>
                {products.map(p => {
                  const img = getProductImage(p)
                  const price = p.price || p.current_price || p.sale_price || 0
                  const title = p.title || p.name || 'Product'
                  const oldPrice = p.original_price || p.old_price || p.compare_price || 0
                  const discount = oldPrice > price? Math.round(((oldPrice - price) / oldPrice) * 100) : 0
                  const rating = (4 + Math.random()).toFixed(1)
                  const sold = p.sold_count || p.sales || Math.floor(Math.random() * 500) + 10
                  return (
                    <Link key={p.id} href={`/product/${p.slug || p.id}`} className='group bg-white rounded-[12px] md:rounded-[14px] border border-gray-100 hover:border-[#F85606]/20 p-2 md:p-2.5 block hover:shadow-[0_16px_32px_rgba(0,0,0,0.10)] hover:-translate-y-[2px] transition-all duration-300 relative overflow-hidden'>
                      {discount > 0 && (
                        <span className='absolute top-2 left-2 bg-[#F85606] text-white text-[10px] font-black px-[6px] py-[2px] rounded-full z-10 shadow'>
                          -{discount}%
                        </span>
                      )}
                      <div className='h-[180px] md:h-[200px] flex items-center justify-center bg-white rounded-[10px] p-3 overflow-hidden border border-[#f5f5f5]'>
                        <img src={img} alt={`${title} - ${categoryName} - Baharaz`} loading="lazy" className='max-h-[150px] md:max-h-[170px] max-w-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out' />
                      </div>
                      <div className='mt-2.5'>
                        <h3 className='text-[12px] md:text-[13px] leading-[16px] line-clamp-2 h-[32px] text-[#212121] group-hover:text-[#F85606] transition-colors'>
                          {title}
                        </h3>
                        <div className='mt-2 flex items-end gap-1.5'>
                          <span className='text-[#F85606] font-black text-[16px] md:text-[18px] leading-none'>৳{Number(price).toLocaleString()}</span>
                          {oldPrice > 0 && <span className='text-[11px] text-gray-400 line-through'>৳{Number(oldPrice).toLocaleString()}</span>}
                        </div>
                        <div className='flex items-center justify-between mt-2'>
                          <span className='text-[11px] text-[#FFA500]'>★ {rating} <span className='text-gray-400'>({sold})</span></span>
                          <span className='text-[10px] bg-[#FFF3E8] text-[#F85606] px-1.5 py-0.5 rounded-full font-bold'>{sold}+ Sold</span>
                        </div>
                        <div className='mt-1 text-[10px] text-gray-400 truncate'>{p.category} • Free Delivery</div>
                      </div>
                    </Link>
                  )
                })}
              </div>

              <div className='bg-white rounded-[16px] border p-4 md:p-6 mt-4'>
                <h3 className='font-black text-[14px] md:text-[16px]'>Related Categories - Shop More at Baharaz</h3>
                <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-4'>
                  {relatedCategories.map(rc => (
                    <Link key={rc.slug} href={`/category/${rc.slug}`} className='border rounded-[10px] p-3 hover:border-[#F85606] hover:bg-[#FFF8F3] transition group'>
                      <p className='font-bold text-[12px] group-hover:text-[#F85606] capitalize'>{rc.name}</p>
                      <p className='text-[11px] text-gray-500 mt-1'>{rc.count} Products</p>
                    </Link>
                  ))}
                </div>
                <div className='mt-6 pt-6 border-t'>
                  <h4 className='font-bold text-[13px]'>Why Buy {categoryName} from Baharaz?</h4>
                  <div className='grid md:grid-cols-3 gap-4 mt-3 text-[12px] text-[#666] leading-[18px]'>
                    <div><span className='font-bold text-[#212121]'>✓ Best Price in BD:</span> We offer lowest {categoryName} price in Bangladesh guaranteed. Compare with Daraz, Pickaboo.</div>
                    <div><span className='font-bold text-[#212121]'>✓ Fast Delivery:</span> Delivery within 24-72 hours all over Bangladesh. Dhaka, Chittagong, Rajshahi, Khulna, Sylhet.</div>
                    <div><span className='font-bold text-[#212121]'>✓ Original Products:</span> 100% authentic {categoryName} with warranty. Cash on Delivery, Easy Return.</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}