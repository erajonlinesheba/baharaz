import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Script from 'next/script'

export const revalidate = 60
export const dynamic = 'force-dynamic'

// ================= GOOGLE SEO #1 =================
export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug || 'all')
  const cleanName = decodedSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const categoryName = decodedSlug.toLowerCase() === 'all' ? 'All Categories' : cleanName
  const sParams = await searchParams
  const sortBy = sParams?.sort || 'newest'

  const title = `${categoryName} Price in Bangladesh - Buy ${categoryName} Online | Baharaz`
  const description = `Buy ${categoryName} at lowest price in Bangladesh. ${categoryName} - 100+ products. Shop Mini Fan, Power Bank, Mobiles, Fashion, Electronics & more. ✓ Fast Delivery ✓ Cash on Delivery ✓ Best Deals - Baharaz.com`
  const keywords = `${categoryName}, buy ${categoryName} online, ${categoryName} price in Bangladesh, ${categoryName} BD, cheap ${categoryName}, Baharaz ${categoryName}, ${categoryName} online shopping BD, best ${categoryName}`
  const url = `https://www.baharaz.com/category/${encodeURIComponent(decodedSlug)}`

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Baharaz - Best Online Shopping in Bangladesh',
      locale: 'en_BD',
      type: 'website',
      images: [{ url: 'https://www.baharaz.com/og-image.jpg', width: 1200, height: 630, alt: `${categoryName} - Baharaz` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://www.baharaz.com/og-image.jpg'],
    },
  }
}

export default async function Page({ params, searchParams }) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug || 'all')
  const sParams = await searchParams
  const sortBy = sParams?.sort || 'newest'
  const priceMin = Number(sParams?.min || 0)
  const priceMax = Number(sParams?.max || 0)
  const supabase = await createClient()

  let products = []
  let categoryName = decodedSlug.replace(/-/g, ' ')
  let relatedCats = []
  let totalCount = 0
  let allCategories = []

  try {
    // Get all categories for filter
    const { data: catList } = await supabase.from('categories').select('id,name,slug').limit(20)
    if (catList) allCategories = catList

    if (decodedSlug.toLowerCase() === 'all') {
      let query = supabase.from('products').select('id, title, name, price, original_price, discount_percent, image_url, images, slug, category, rating, sold_count, created_at', { count: 'exact' })
      
      if (priceMin > 0) query = query.gte('price', priceMin)
      if (priceMax > 0) query = query.lte('price', priceMax)

      if (sortBy === 'price_low') query = query.order('price', { ascending: true })
      else if (sortBy === 'price_high') query = query.order('price', { ascending: false })
      else if (sortBy === 'popular') query = query.order('sold_count', { ascending: false })
      else query = query.order('created_at', { ascending: false })

      const { data, count } = await query.limit(60)
      products = data || []
      totalCount = count || products.length
      categoryName = 'All Products'
    } else {
      // SAFE QUERY - No Injection
      let data = null
      let count = 0

      // Try 1: exact category ilike
      const res1 = await supabase.from('products').select('id, title, name, price, original_price, discount_percent, image_url, images, slug, category, rating, sold_count, created_at', { count: 'exact' }).ilike('category', `%${categoryName}%`).limit(60)
      data = res1.data
      count = res1.count

      // Try 2: slug to name
      if (!data || data.length === 0) {
        const try2 = decodedSlug.replace(/-/g, ' ')
        const res2 = await supabase.from('products').select('id, title, name, price, original_price, discount_percent, image_url, images, slug, category, rating, sold_count, created_at', { count: 'exact' }).ilike('category', `%${try2}%`).limit(60)
        data = res2.data
        count = res2.count
        if (data?.length) categoryName = try2
      }

      // Try 3: categories table safe search
      const { data: catData } = await supabase.from('categories').select('id, name, slug').eq('slug', decodedSlug).maybeSingle()
      let finalCatName = categoryName
      if (catData) {
        finalCatName = catData.name
        categoryName = catData.name
        if (!data || data.length === 0) {
          const res3 = await supabase.from('products').select('id, title, name, price, original_price, discount_percent, image_url, images, slug, category, rating, sold_count, created_at', { count: 'exact' }).ilike('category', `%${catData.name}%`).limit(60)
          if (res3.data?.length) { data = res3.data; count = res3.count }
        }
      }

      // Apply price & sort filter
      let filtered = data || []
      if (priceMin > 0) filtered = filtered.filter(p => Number(p.price) >= priceMin)
      if (priceMax > 0) filtered = filtered.filter(p => Number(p.price) <= priceMax)

      if (sortBy === 'price_low') filtered = filtered.sort((a,b) => Number(a.price) - Number(b.price))
      else if (sortBy === 'price_high') filtered = filtered.sort((a,b) => Number(b.price) - Number(a.price))
      else if (sortBy === 'popular') filtered = filtered.sort((a,b) => Number(b.sold_count||0) - Number(a.sold_count||0))

      products = filtered
      totalCount = count || filtered.length

      // Capitalize display name
      categoryName = categoryName.replace(/\b\w/g, l => l.toUpperCase())
    }

    // Related Categories
    const { data: rel } = await supabase.from('products').select('category').limit(100)
    if (rel) {
      const uniq = [...new Set(rel.map(r=>r.category).filter(Boolean).filter(c=>c.toLowerCase()!== categoryName.toLowerCase()))].slice(0,12)
      relatedCats = uniq.map(n=>({ name: n, slug: n.toLowerCase().replace(/\s+/g,'-').replace(/&/g,'and').replace(/[^a-z0-9-]/g,'') }))
    }
  } catch (e) {
    console.log("Category Error:", e?.message)
    products = []
  }

  const getDiscount = (p) => {
    if(p.discount_percent) return p.discount_percent
    if(p.original_price && p.price && p.original_price > p.price) return Math.round(((p.original_price - p.price)/p.original_price)*100)
    return 0
  }

  const getImage = (p) => {
    try {
      if (Array.isArray(p.images) && p.images[0]) return typeof p.images[0] === 'string' ? p.images[0] : p.images[0]?.url
      if (typeof p.images === 'string') {
        const parsed = JSON.parse(p.images)
        if (Array.isArray(parsed) && parsed[0]) return parsed[0]
      }
      return p.image_url || '/placeholder.png'
    } catch { return p.image_url || '/placeholder.png' }
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
    description: `Shop ${categoryName} at best price in Bangladesh - ${totalCount} products`,
    url: `https://www.baharaz.com/category/${decodedSlug}`,
    isPartOf: { '@type': 'WebSite', name: 'Baharaz', url: 'https://www.baharaz.com' },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.slice(0, 20).map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `https://www.baharaz.com/product/${p.slug || p.id}`,
        name: p.title || p.name,
        image: getImage(p)
      }))
    }
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: `What is the price of ${categoryName} in Bangladesh?`, acceptedAnswer: { '@type': 'Answer', text: `${categoryName} price in Bangladesh starts from ৳99 to ৳5000. You can buy best quality ${categoryName} from Baharaz with cash on delivery.` } },
      { '@type': 'Question', name: `Where to buy ${categoryName} online?`, acceptedAnswer: { '@type': 'Answer', text: `You can buy ${categoryName} online from Baharaz.com - best online shopping in Bangladesh with fast delivery.` } }
    ]
  }

  return (
    <>
      <Script id="breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="itemlist-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className='bg-[#f5f5f7] min-h-screen'>
        {/* Breadcrumb */}
        <div className='bg-white border-b sticky top-0 z-20 shadow-sm'>
          <div className='max-w-[1320px] mx-auto px-4 h-[48px] flex items-center justify-between'>
            <div className='flex items-center gap-2 text-[13px]'>
              <Link href="/" className='text-[#666] hover:text-[#f85606]'>Home</Link>
              <span className='text-[#ccc]'>›</span>
              <Link href="/category" className='text-[#666] hover:text-[#f85606]'>Categories</Link>
              <span className='text-[#ccc]'>›</span>
              <span className='font-bold text-[#111] capitalize'>{categoryName}</span>
              <span className='ml-2 bg-[#f5f5f5] px-2 py-0.5 rounded-full text-[11px] font-bold'>{totalCount} items</span>
            </div>
            <div className='hidden md:flex items-center gap-2 text-[11px] text-[#666]'>
              <span>✓ Free Delivery</span><span className='w-1 h-1 bg-gray-300 rounded-full'></span><span>✓ Cash on Delivery</span>
            </div>
          </div>
        </div>

        <div className='max-w-[1320px] mx-auto p-2 md:p-4'>
          <div className='grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4'>
            {/* LEFT SIDEBAR - NEW FEATURE */}
            <div className='hidden lg:block space-y-3'>
              <div className='bg-white rounded-2xl border p-4'>
                <h3 className='font-black text-[13px] mb-3'>Categories</h3>
                <div className='space-y-1'>
                  <Link href="/category/all" className={`block text-[12px] px-3 py-2 rounded-xl ${decodedSlug==='all'?'bg-[#111] text-white font-bold':'hover:bg-gray-50'}`}>All Products</Link>
                  {allCategories.slice(0,10).map(c=>(
                    <Link key={c.slug} href={`/category/${c.slug}`} className={`block text-[12px] px-3 py-2 rounded-xl capitalize ${c.slug===decodedSlug?'bg-[#f85606] text-white font-bold':'hover:bg-gray-50'}`}>{c.name}</Link>
                  ))}
                </div>
              </div>

              <div className='bg-white rounded-2xl border p-4'>
                <h3 className='font-black text-[13px] mb-3'>Price Range</h3>
                <div className='grid grid-cols-2 gap-2'>
                  <Link href={`/category/${slug}?min=0&max=500`} className='text-[11px] border rounded-full px-3 py-2 text-center hover:border-black'>৳0 - 500</Link>
                  <Link href={`/category/${slug}?min=500&max=1000`} className='text-[11px] border rounded-full px-3 py-2 text-center hover:border-black'>৳500 - 1000</Link>
                  <Link href={`/category/${slug}?min=1000&max=2000`} className='text-[11px] border rounded-full px-3 py-2 text-center hover:border-black'>৳1000 - 2000</Link>
                  <Link href={`/category/${slug}?min=2000&max=10000`} className='text-[11px] border rounded-full px-3 py-2 text-center hover:border-black'>৳2000+</Link>
                </div>
                <Link href={`/category/${slug}`} className='mt-3 block text-[11px] text-center text-[#f85606] font-bold'>Clear Filter</Link>
              </div>

              <div className='bg-gradient-to-br from-[#111] to-[#333] rounded-2xl p-4 text-white'>
                <p className='font-black text-[13px]'>Why Baharaz?</p>
                <ul className='mt-2 space-y-1.5 text-[11px] opacity-80'>
                  <li>✓ Best Price Guaranteed</li>
                  <li>✓ Cash on Delivery</li>
                  <li>✓ 7 Days Return</li>
                  <li>✓ Fast Delivery All BD</li>
                  <li>✓ 100% Authentic</li>
                </ul>
              </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className='space-y-3'>
              {/* HERO - NEW DESIGN */}
              <div className="bg-gradient-to-r from-[#0f0f0f] via-[#2a2a2a] to-[#f85606] rounded-[20px] p-5 md:p-6 text-white relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-black/20 rounded-full -ml-20 -mb-20 blur-2xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex gap-4 items-center">
                    <div className="w-[56px] h-[56px] bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center text-[26px] border border-white/20">{categoryName.charAt(0).toUpperCase()}</div>
                    <div>
                      <h1 className="font-black text-[22px] md:text-[26px] capitalize leading-none">{categoryName}</h1>
                      <p className="text-[12px] opacity-70 mt-1.5">{totalCount} Products Found • Best Price in Bangladesh • Daraz Alternative</p>
                      <div className='flex gap-2 mt-2'>
                        <span className='text-[10px] bg-white/15 px-2.5 py-1 rounded-full border border-white/20'>Free Delivery</span>
                        <span className='text-[10px] bg-white/15 px-2.5 py-1 rounded-full border border-white/20'>Cash on Delivery</span>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Link href="/category" className="bg-white text-black px-5 py-2.5 rounded-full text-[12px] font-black hover:bg-black hover:text-white transition">All Categories</Link>
                  </div>
                </div>
              </div>

              {/* FILTER BAR - NEW */}
              <div className="bg-white rounded-2xl p-3 border shadow-sm flex flex-col md:flex-row justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-black tracking-widest">SORT BY:</span>
                  <Link href={`/category/${slug}?sort=newest`} className={`text-[11px] px-4 py-2 rounded-full border-2 font-bold transition ${sortBy==='newest'? 'bg-black text-white border-black':'bg-white hover:border-black'}`}>Newest</Link>
                  <Link href={`/category/${slug}?sort=popular`} className={`text-[11px] px-4 py-2 rounded-full border-2 font-bold transition ${sortBy==='popular'? 'bg-black text-white border-black':'bg-white hover:border-black'}`}>Popular</Link>
                  <Link href={`/category/${slug}?sort=price_low`} className={`text-[11px] px-4 py-2 rounded-full border-2 font-bold transition ${sortBy==='price_low'? 'bg-black text-white border-black':'bg-white hover:border-black'}`}>Low to High</Link>
                  <Link href={`/category/${slug}?sort=price_high`} className={`text-[11px] px-4 py-2 rounded-full border-2 font-bold transition ${sortBy==='price_high'? 'bg-black text-white border-black':'bg-white hover:border-black'}`}>High to Low</Link>
                </div>
                <div className='flex items-center gap-2'>
                  <span className="text-[11px] bg-[#fff4e5] text-[#ff6a00] px-3 py-1.5 rounded-full font-black border">{totalCount} Products</span>
                  <span className='text-[11px] text-[#666] hidden md:block'>All over Bangladesh</span>
                </div>
              </div>

              {/* SEO TEXT */}
              <div className='bg-white rounded-2xl border p-4'>
                <h2 className='font-black text-[14px]'>Buy {categoryName} Online at Best Price in Bangladesh - Baharaz</h2>
                <p className='text-[12px] text-[#555] mt-1.5 leading-5'>Looking for {categoryName} price in Bangladesh? Baharaz offers huge collection of {categoryName} with best deals, fast delivery, cash on delivery. Shop {categoryName} like Mobile, Fashion, Electronics & more at lowest price. #1 Daraz alternative in Bangladesh.</p>
              </div>

              {/* PRODUCTS */}
              {products.length === 0? (
                <div className='bg-white p-10 md:p-16 text-center rounded-[20px] shadow-sm border'>
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-[40px]">📦</div>
                  <p className='font-black text-[20px] capitalize mt-4'>No Products in {categoryName} Yet</p>
                  <p className='text-[13px] text-[#666] mt-2 max-w-[480px] mx-auto'>This category is empty now. But you can explore other trending categories. This page will never show 404.</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-8 max-w-[600px] mx-auto">
                    {relatedCats.slice(0,8).map(rc=>(
                      <Link key={rc.slug} href={`/category/${rc.slug}`} className="bg-[#fafafa] border-2 rounded-2xl p-4 hover:border-black hover:bg-white hover:shadow-lg transition group">
                        <p className="font-black text-[12px] capitalize group-hover:text-[#f85606]">{rc.name}</p>
                        <p className="text-[10px] text-gray-500 mt-1">Explore →</p>
                      </Link>
                    ))}
                  </div>
                  <div className="flex gap-3 justify-center mt-8">
                    <Link href="/category" className='bg-[#f5f5f5] border-2 px-6 py-3 rounded-full text-[13px] font-black hover:bg-black hover:text-white transition'>Browse Categories</Link>
                    <Link href="/" className='bg-[#f85606] text-white px-8 py-3 rounded-full text-[13px] font-black hover:bg-black transition'>Go to Home</Link>
                  </div>
                </div>
              ) : (
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
                  {products.map(p => {
                    const discount = getDiscount(p)
                    const img = getImage(p)
                    return (
                      <Link key={p.id} href={`/product/${p.slug || p.id}`} className='bg-white p-3 rounded-[16px] block hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 border-2 border-transparent hover:border-black group relative overflow-hidden'>
                        {discount>0 && <span className="absolute top-3 left-3 z-10 bg-[#ff3b30] text-white text-[10px] font-black px-2 py-1 rounded-full shadow">-{discount}%</span>}
                        <span className='absolute top-3 right-3 z-10 bg-black text-white text-[9px] font-bold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition'>TRENDING</span>
                        <div className="h-[180px] md:h-[190px] flex items-center justify-center bg-[#fafafa] rounded-[12px] p-3 overflow-hidden">
                          <img src={img} alt={`${p.title || p.name} - ${categoryName}`} loading="lazy" className='max-h-full max-w-full object-contain group-hover:scale-110 transition duration-700'/>
                        </div>
                        <p className='text-[12px] mt-3 line-clamp-2 h-[34px] leading-[17px] font-medium group-hover:text-[#f85606] transition'>{p.title || p.name}</p>
                        <div className='flex items-baseline gap-2 mt-2'>
                          <p className='text-[#111] font-black text-[16px]'>৳{Number(p.price).toLocaleString()}</p>
                          {p.original_price> p.price && <p className='text-[11px] text-[#999] line-through'>৳{Number(p.original_price).toLocaleString()}</p>}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[11px] bg-[#fff7e6] text-[#ff8c00] px-2 py-0.5 rounded-full font-bold">★ {p.rating || '4.8'}</span>
                          <span className="text-[10px] text-[#888]">{p.sold_count || 120}+ Sold</span>
                        </div>
                        <div className='mt-2.5 h-[32px] bg-[#111] text-white rounded-full flex items-center justify-center text-[11px] font-black opacity-0 group-hover:opacity-100 transition'>View Details →</div>
                      </Link>
                    )
                  })}
                </div>
              )}

              {/* BOTTOM SEO */}
              <div className='bg-white rounded-2xl border p-5 mt-4'>
                <h3 className='font-black text-[14px]'>Why Buy {categoryName} from Baharaz?</h3>
                <div className='grid md:grid-cols-3 gap-4 mt-4 text-[12px]'>
                  <div className='bg-[#fafafa] p-3 rounded-xl'><p className='font-bold'>Best Price</p><p className='text-[#666] mt-1 text-[11px]'>Lowest {categoryName} price in BD guaranteed.</p></div>
                  <div className='bg-[#fafafa] p-3 rounded-xl'><p className='font-bold'>Fast Delivery</p><p className='text-[#666] mt-1 text-[11px]'>Delivery all over Bangladesh in 2-3 days.</p></div>
                  <div className='bg-[#fafafa] p-3 rounded-xl'><p className='font-bold'>Authentic Product</p><p className='text-[#666] mt-1 text-[11px]'>100% authentic {categoryName} with warranty.</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}