import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Script from 'next/script'

export const revalidate = 3600
export const dynamic = 'force-static'
export const fetchCache = 'force-cache'
export const dynamicParams = true

export async function generateStaticParams(){
  return [
    {slug:'all'},{slug:'electronics'},{slug:'fashion'},{slug:'mobiles'},
    {slug:'home-living'},{slug:'health-beauty'},{slug:'groceries'},
    {slug:'kids-toys'},{slug:'sports'},{slug:'automotive'},{slug:'books'},
    {slug:'watches'},{slug:'shoes'},{slug:'bags'}
  ]
}

export async function generateMetadata({ params }) {
  const p = await params
  const slug = p?.slug || 'all'
  const decodedSlug = decodeURIComponent(slug || 'all')
  const cleanName = decodedSlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  const categoryName = decodedSlug.toLowerCase() === 'all' ? 'All Products' : cleanName

  const title = `${categoryName} - Buy Online at Best Price in Bangladesh | Baharaz`
  const description = `Buy ${categoryName} at best price in Bangladesh. Shop from huge collection of ${categoryName} with Cash on Delivery, fast delivery, easy return. Trusted by 10,000+ customers.`
  const url = `https://www.baharaz.com/category/${encodeURIComponent(decodedSlug)}`

  return {
    title,
    description,
    metadataBase: new URL('https://www.baharaz.com'),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Baharaz',
      type: 'website',
    },
  }
}

export default async function Page({ params, searchParams }) {
  const p = await params
  const slug = p?.slug || 'all'
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
  let categoryMeta = null

  try {
    const isAll = decodedSlug.toLowerCase() === 'all'
    
    const [catListRes, catMetaRes] = await Promise.all([
      supabase.from('categories').select('id,name,slug,product_count').order('product_count', { ascending: false }).limit(24),
      !isAll ? supabase.from('categories').select('id, name, slug, description').eq('slug', decodedSlug).maybeSingle() : Promise.resolve({ data: null })
    ])
    
    if (catListRes.data) allCategories = catListRes.data
    if (catMetaRes.data) {
      categoryMeta = catMetaRes.data
      categoryName = catMetaRes.data.name
    } else {
      categoryName = categoryName.replace(/\b\w/g, (l) => l.toUpperCase())
    }

    if (isAll) {
      let query = supabase.from('products').select('id, title, name, price, original_price, discount_percent, image_url, images, slug, category, rating, sold_count, created_at')
      if (priceMin > 0) query = query.gte('price', priceMin)
      if (priceMax > 0) query = query.lte('price', priceMax)
      if (sortBy === 'price_low') query = query.order('price', { ascending: true })
      else if (sortBy === 'price_high') query = query.order('price', { ascending: false })
      else if (sortBy === 'popular') query = query.order('sold_count', { ascending: false })
      else query = query.order('created_at', { ascending: false })
      const { data } = await query.limit(32)
      products = data || []
    } else {
      let query = supabase.from('products').select('id, title, name, price, original_price, discount_percent, image_url, images, slug, category, rating, sold_count, created_at').eq('category_slug', decodedSlug)
      if (priceMin > 0) query = query.gte('price', priceMin)
      if (priceMax > 0) query = query.lte('price', priceMax)
      if (sortBy === 'price_low') query = query.order('price', { ascending: true })
      else if (sortBy === 'price_high') query = query.order('price', { ascending: false })
      else if (sortBy === 'popular') query = query.order('sold_count', { ascending: false })
      else query = query.order('created_at', { ascending: false })
      let { data } = await query.limit(32)

      if (!data || data.length === 0) {
        const slugToName = decodedSlug.replace(/-/g, ' ').trim()
        let q2 = supabase.from('products').select('id, title, name, price, original_price, discount_percent, image_url, images, slug, category, rating, sold_count, created_at').ilike('category', `%${slugToName}%`)
        if (priceMin > 0) q2 = q2.gte('price', priceMin)
        if (priceMax > 0) q2 = q2.lte('price', priceMax)
        q2 = q2.order('created_at', { ascending: false })
        const r2 = await q2.limit(32)
        data = r2.data
      }
      products = data || []
    }

    totalCount = products.length
    relatedCats = allCategories.filter(r => r.slug !== decodedSlug).slice(0, 8)
  } catch (e) {
    console.log("Category Error:", e?.message)
  }

  const getDiscount = (pr) => {
    if(pr.discount_percent) return pr.discount_percent
    if(pr.original_price && pr.price && pr.original_price > pr.price) return Math.round(((pr.original_price - pr.price)/pr.original_price)*100)
    return 0
  }

  const getImage = (pr) => {
    try {
      if (Array.isArray(pr.images) && pr.images[0]) return typeof pr.images[0] === 'string' ? pr.images[0] : pr.images[0]?.url
      if (typeof pr.images === 'string') {
        const parsed = JSON.parse(pr.images)
        if (Array.isArray(parsed) && parsed[0]) return parsed[0]
      }
      return pr.image_url || '/placeholder.png'
    } catch { return pr.image_url || '/placeholder.png' }
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

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryName} - Baharaz`,
    url: `https://www.baharaz.com/category/${decodedSlug}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.slice(0, 30).map((pr, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `https://www.baharaz.com/product/${pr.slug || pr.id}`,
        name: pr.title || pr.name,
      }))
    }
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: `What is the price of ${categoryName} in Bangladesh?`, acceptedAnswer: { '@type': 'Answer', text: `${categoryName} price starts from ৳99 at Baharaz with Cash on Delivery and fast delivery.` } },
      { '@type': 'Question', name: `Where to buy ${categoryName} online?`, acceptedAnswer: { '@type': 'Answer', text: `You can buy ${categoryName} online from Baharaz.com with warranty and easy return.` } }
    ]
  }

  return (
    <>
      <Script id="breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="collection-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className='bg-[#FAFAFB] min-h-screen text-[#111827]'>
        {/* BREADCRUMB - AAA Contrast */}
        <div className='bg-white border-b border-gray-200 sticky top-0 z-20'>
          <div className='max-w-[1320px] mx-auto px-4 h-[56px] flex items-center justify-between'>
            <nav aria-label="Breadcrumb" className='flex items-center gap-2 text-[13px]'>
              <Link prefetch href="/" className='text-[#4B5563] hover:text-[#111827] font-medium focus:ring-2 focus:ring-black rounded px-1'>Home</Link>
              <span className='text-[#9CA3AF]' aria-hidden>›</span>
              <Link prefetch href="/category" className='text-[#4B5563] hover:text-[#111827] font-medium focus:ring-2 focus:ring-black rounded px-1'>Categories</Link>
              <span className='text-[#9CA3AF]' aria-hidden>›</span>
              <span className='font-semibold text-[#111827] capitalize' aria-current="page">{categoryName}</span>
              <span className='ml-2 bg-[#F3F4F6] border border-gray-200 text-[#111827] px-2.5 py-0.5 rounded-full text-[11px] font-medium'>{totalCount} items</span>
            </nav>
            <div className='hidden md:flex items-center gap-3 text-[11px] text-[#4B5563]'>
              <span className='flex items-center gap-1.5'><span className='w-2 h-2 bg-[#059669] rounded-full'></span> Cash on Delivery</span>
              <span className='flex items-center gap-1.5'><span className='w-2 h-2 bg-[#0EA5E9] rounded-full'></span> Free Delivery</span>
            </div>
          </div>
        </div>

        <div className='max-w-[1320px] mx-auto p-3 md:p-4'>
          <div className='grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4'>
            {/* SIDEBAR - NEW FEATURES */}
            <div className='hidden lg:block space-y-3'>
              <div className='bg-white rounded-[16px] border border-gray-200 p-4'>
                <h3 className='font-semibold text-[13px] text-[#111827] mb-3'>All Categories</h3>
                <div className='space-y-1'>
                  <Link prefetch href="/category/all" className={`block text-[12px] px-3 py-2.5 rounded-[10px] font-medium transition focus:ring-2 focus:ring-black ${decodedSlug==='all'?'bg-[#111827] text-white':'bg-[#F9FAFB] text-[#374151] hover:bg-[#111827] hover:text-white border border-gray-200'}`}>All Products</Link>
                  {allCategories.slice(0,12).map((c)=>(
                    <Link prefetch key={c.slug} href={`/category/${c.slug}`} className={`flex justify-between items-center text-[12px] px-3 py-2.5 rounded-[10px] capitalize transition focus:ring-2 focus:ring-black ${c.slug===decodedSlug?'bg-[#111827] text-white':'text-[#374151] hover:bg-[#F9FAFB] border border-transparent hover:border-gray-200'}`}>
                      <span>{c.name}</span>
                      <span className='text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full'>{c.product_count || 0}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className='bg-white rounded-[16px] border border-gray-200 p-4'>
                <h3 className='font-semibold text-[13px] text-[#111827] mb-3'>Filter by Price</h3>
                <div className='grid grid-cols-2 gap-2'>
                  <Link prefetch href={`/category/${slug}?min=0&max=500`} className='text-[11px] border border-gray-200 bg-white rounded-full px-3 py-2.5 text-center font-medium text-[#111827] hover:bg-[#111827] hover:text-white hover:border-black transition focus:ring-2 focus:ring-black'>৳0 - 500</Link>
                  <Link prefetch href={`/category/${slug}?min=500&max=1000`} className='text-[11px] border border-gray-200 bg-white rounded-full px-3 py-2.5 text-center font-medium text-[#111827] hover:bg-[#111827] hover:text-white transition focus:ring-2 focus:ring-black'>৳500 - 1000</Link>
                  <Link prefetch href={`/category/${slug}?min=1000&max=2000`} className='text-[11px] border border-gray-200 bg-white rounded-full px-3 py-2.5 text-center font-medium text-[#111827] hover:bg-[#111827] hover:text-white transition focus:ring-2 focus:ring-black'>৳1000 - 2000</Link>
                  <Link prefetch href={`/category/${slug}?min=2000&max=10000`} className='text-[11px] border border-gray-200 bg-white rounded-full px-3 py-2.5 text-center font-medium text-[#111827] hover:bg-[#111827] hover:text-white transition focus:ring-2 focus:ring-black'>৳2000+</Link>
                </div>
                <Link prefetch href={`/category/${slug}`} className='mt-3 block text-[11px] text-center text-[#4B5563] font-medium hover:text-[#111827] underline'>Clear all filters</Link>
              </div>

              <div className='bg-white border border-gray-200 rounded-[16px] p-4'>
                <h3 className='font-semibold text-[13px] text-[#111827] mb-3'>Trust & Safety</h3>
                <div className='space-y-3'>
                  <div className='flex gap-3'><div className='w-8 h-8 bg-[#F3F4F6] rounded-full flex items-center justify-center text-[14px]'>💵</div><div><p className='text-[12px] font-medium text-[#111827]'>Cash on Delivery</p><p className='text-[11px] text-[#4B5563]'>Pay when you receive</p></div></div>
                  <div className='flex gap-3'><div className='w-8 h-8 bg-[#F3F4F6] rounded-full flex items-center justify-center text-[14px]'>🚚</div><div><p className='text-[12px] font-medium text-[#111827]'>Fast Delivery</p><p className='text-[11px] text-[#4B5563]'>2-3 days across BD</p></div></div>
                  <div className='flex gap-3'><div className='w-8 h-8 bg-[#F3F4F6] rounded-full flex items-center justify-center text-[14px]'>↩️</div><div><p className='text-[12px] font-medium text-[#111827]'>Easy Return</p><p className='text-[11px] text-[#4B5563]'>7 days return policy</p></div></div>
                  <div className='flex gap-3'><div className='w-8 h-8 bg-[#F3F4F6] rounded-full flex items-center justify-center text-[14px]'>🛡️</div><div><p className='text-[12px] font-medium text-[#111827]'>Secure Payment</p><p className='text-[11px] text-[#4B5563]'>100% secure checkout</p></div></div>
                </div>
              </div>

              <div className='bg-[#111827] rounded-[16px] p-5 text-white'>
                <p className='font-semibold text-[13px]'>Need Help Choosing?</p>
                <p className='text-[11px] text-[#D1D5DB] mt-2 leading-5'>Our team can help you find the best {categoryName} for your needs.</p>
                <div className='mt-4 space-y-2'>
                  <span className='block text-[11px] bg-white/10 border border-white/10 px-3 py-2 rounded-full'>Support: 10AM - 10PM</span>
                </div>
              </div>
            </div>

            {/* MAIN */}
            <div className='space-y-3'>
              {/* HERO - Professional AAA */}
              <div className="bg-white border border-gray-200 rounded-[20px] p-6 text-[#111827] relative overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-[56px] h-[56px] bg-[#111827] text-white rounded-[14px] flex items-center justify-center text-[24px] font-bold">{categoryName.charAt(0).toUpperCase()}</div>
                    <div>
                      <h1 className="font-bold text-[22px] md:text-[24px] capitalize leading-tight">{categoryName}</h1>
                      <p className="text-[12px] text-[#4B5563] mt-1.5">{totalCount} products found • Best price in Bangladesh</p>
                      <p className="text-[12px] text-[#6B7280] mt-2 max-w-[520px] leading-5">{categoryMeta?.description || `Shop ${categoryName} from Baharaz - best price, Cash on Delivery, fast delivery, easy return across Bangladesh.`}</p>
                    </div>
                  </div>
                  <div className='flex items-start gap-2'>
                    <Link prefetch href="/category" className="bg-[#111827] text-white px-5 py-2.5 rounded-full text-[12px] font-medium hover:bg-black transition focus:ring-2 focus:ring-black">All Categories</Link>
                  </div>
                </div>
              </div>

              {/* SORT BAR - AAA */}
              <div className="bg-white rounded-[14px] p-3 border border-gray-200 flex flex-col md:flex-row justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-semibold tracking-wide text-[#6B7280]">SORT BY:</span>
                  <Link prefetch href={`/category/${slug}?sort=newest`} className={`text-[11px] px-4 py-2 rounded-full border font-medium transition focus:ring-2 focus:ring-black ${sortBy==='newest'? 'bg-[#111827] text-white border-[#111827]':'bg-white text-[#111827] border-gray-200 hover:border-[#111827]'}`}>Newest</Link>
                  <Link prefetch href={`/category/${slug}?sort=popular`} className={`text-[11px] px-4 py-2 rounded-full border font-medium transition focus:ring-2 focus:ring-black ${sortBy==='popular'? 'bg-[#111827] text-white border-[#111827]':'bg-white text-[#111827] border-gray-200 hover:border-[#111827]'}`}>Popular</Link>
                  <Link prefetch href={`/category/${slug}?sort=price_low`} className={`text-[11px] px-4 py-2 rounded-full border font-medium transition focus:ring-2 focus:ring-black ${sortBy==='price_low'? 'bg-[#111827] text-white border-[#111827]':'bg-white text-[#111827] border-gray-200 hover:border-[#111827]'}`}>Price Low to High</Link>
                  <Link prefetch href={`/category/${slug}?sort=price_high`} className={`text-[11px] px-4 py-2 rounded-full border font-medium transition focus:ring-2 focus:ring-black ${sortBy==='price_high'? 'bg-[#111827] text-white border-[#111827]':'bg-white text-[#111827] border-gray-200 hover:border-[#111827]'}`}>Price High to Low</Link>
                </div>
                <div className='flex items-center gap-2'>
                  <span className="text-[11px] bg-[#F3F4F6] border border-gray-200 text-[#111827] px-3 py-2 rounded-full font-medium">{totalCount} Products</span>
                </div>
              </div>

              {/* PRODUCTS GRID - Professional */}
              {products.length === 0? (
                <div className='bg-white p-12 text-center rounded-[20px] border border-gray-200'>
                  <div className="w-16 h-16 bg-[#F9FAFB] border border-gray-200 rounded-full flex items-center justify-center mx-auto text-[28px]">📦</div>
                  <p className='font-semibold text-[18px] capitalize mt-4 text-[#111827]'>No products in {categoryName}</p>
                  <p className='text-[13px] text-[#4B5563] mt-2 max-w-[460px] mx-auto'>This category is currently empty. Explore other categories to find what you need.</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 max-w-[560px] mx-auto">
                    {relatedCats.slice(0,8).map((rc)=>(
                      <Link prefetch key={rc.slug} href={`/category/${rc.slug}`} className="bg-[#F9FAFB] border border-gray-200 rounded-[12px] p-3 hover:border-[#111827] hover:bg-white transition text-left focus:ring-2 focus:ring-black">
                        <p className="font-medium text-[12px] capitalize text-[#111827]">{rc.name}</p>
                        <p className="text-[10px] text-[#6B7280] mt-1">{rc.product_count || 0} items • Explore</p>
                      </Link>
                    ))}
                  </div>
                  <div className="flex gap-3 justify-center mt-8">
                    <Link prefetch href="/category" className='bg-white border border-gray-300 px-6 py-2.5 rounded-full text-[13px] font-medium text-[#111827] hover:bg-[#111827] hover:text-white transition focus:ring-2 focus:ring-black'>Browse Categories</Link>
                    <Link prefetch href="/" className='bg-[#111827] text-white px-6 py-2.5 rounded-full text-[13px] font-medium hover:bg-black transition focus:ring-2 focus:ring-black'>Go to Home</Link>
                  </div>
                </div>
              ) : (
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
                  {products.map((pr) => {
                    const discount = getDiscount(pr)
                    const img = getImage(pr)
                    return (
                      <Link prefetch key={pr.id} href={`/product/${pr.slug || pr.id}`} className='bg-white p-3 rounded-[16px] block hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border border-gray-200 hover:border-gray-300 group focus:outline-none focus:ring-2 focus:ring-black relative'>
                        {discount>0 && <span className="absolute top-3 left-3 z-10 bg-[#DC2626] text-white text-[10px] font-bold px-2 py-1 rounded-full">-{discount}%</span>}
                        <div className="h-[180px] md:h-[200px] flex items-center justify-center bg-[#FAFAFB] rounded-[12px] p-3 overflow-hidden border border-gray-100 group-hover:bg-white transition">
                          <img src={img} alt={`${pr.title || pr.name}`} loading="lazy" className='max-h-full max-w-full object-contain group-hover:scale-105 transition duration-500'/>
                        </div>
                        <p className='text-[12px] mt-3 line-clamp-2 h-[32px] leading-[16px] font-medium text-[#111827] group-hover:text-black'>{pr.title || pr.name}</p>
                        <div className='flex items-baseline gap-2 mt-2'>
                          <p className='text-[#111827] font-bold text-[15px]'>৳{Number(pr.price).toLocaleString()}</p>
                          {pr.original_price> pr.price && <p className='text-[11px] text-[#9CA3AF] line-through'>৳{Number(pr.original_price).toLocaleString()}</p>}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[11px] bg-[#F3F4F6] border border-gray-200 text-[#111827] px-2 py-0.5 rounded-full font-medium">★ {pr.rating || '4.8'}</span>
                          <span className="text-[10px] text-[#6B7280]">{pr.sold_count || 120}+ sold</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}

              {/* NEW FEATURE: WHY BUY + SHIPPING */}
              <div className='grid md:grid-cols-3 gap-3'>
                <div className='md:col-span-2 bg-white rounded-[16px] border border-gray-200 p-5'>
                  <h3 className='font-semibold text-[14px] text-[#111827]'>Why buy {categoryName} from Baharaz?</h3>
                  <div className='grid md:grid-cols-3 gap-3 mt-4'>
                    <div className='bg-[#FAFAFB] border border-gray-200 p-4 rounded-[12px]'><p className='font-medium text-[12px] text-[#111827]'>Best Price</p><p className='text-[11px] text-[#4B5563] mt-1 leading-5'>Lowest price guaranteed with price match support.</p></div>
                    <div className='bg-[#FAFAFB] border border-gray-200 p-4 rounded-[12px]'><p className='font-medium text-[12px] text-[#111827]'>Authentic Products</p><p className='text-[11px] text-[#4B5563] mt-1 leading-5'>100% authentic products with warranty.</p></div>
                    <div className='bg-[#FAFAFB] border border-gray-200 p-4 rounded-[12px]'><p className='font-medium text-[12px] text-[#111827]'>Fast Delivery</p><p className='text-[11px] text-[#4B5563] mt-1 leading-5'>Delivery across 64 districts in 2-3 days.</p></div>
                  </div>
                </div>
                <div className='bg-white border border-gray-200 rounded-[16px] p-5'>
                  <h3 className='font-semibold text-[13px] text-[#111827]'>Popular in {categoryName}</h3>
                  <div className='mt-3 space-y-2'>
                    {products.slice(0, 4).map(pr => (
                      <Link prefetch key={`pop-${pr.id}`} href={`/product/${pr.slug || pr.id}`} className='flex gap-3 p-2 rounded-[10px] hover:bg-[#F9FAFB] border border-transparent hover:border-gray-200 transition focus:ring-2 focus:ring-black'>
                        <img src={getImage(pr)} alt="" className='w-10 h-10 object-contain bg-[#FAFAFB] rounded-[8px] border border-gray-100'/>
                        <div className='flex-1 min-w-0'><p className='text-[11px] font-medium text-[#111827] line-clamp-1'>{pr.title || pr.name}</p><p className='text-[11px] font-bold text-[#111827]'>৳{Number(pr.price).toLocaleString()}</p></div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* SEO FOOTER - Professional */}
              <div className='bg-white rounded-[16px] border border-gray-200 p-5'>
                <h2 className='font-semibold text-[14px] text-[#111827]'>Buy {categoryName} Online in Bangladesh</h2>
                <p className='text-[12px] text-[#4B5563] mt-2 leading-6'>Looking for {categoryName} price in Bangladesh? Baharaz offers a wide collection of {categoryName} at best price with Cash on Delivery, free delivery, and easy return. Shop {categoryName} online and get fast delivery across Bangladesh.</p>
                <div className='flex flex-wrap gap-2 mt-3'>
                  {relatedCats.map(c => (
                    <Link prefetch key={c.slug} href={`/category/${c.slug}`} className='text-[11px] bg-[#F9FAFB] border border-gray-200 px-3 py-1.5 rounded-full text-[#374151] hover:bg-[#111827] hover:text-white hover:border-black transition focus:ring-2 focus:ring-black'>{c.name}</Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}