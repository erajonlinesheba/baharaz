import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Script from 'next/script'

export const revalidate = 3600
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

// ================= GOOGLE SEO 1st PAGE =================
export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug || 'all')
  const cleanName = decodedSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const categoryName = decodedSlug.toLowerCase() === 'all'? 'All Categories' : cleanName
  const sParams = await searchParams
  const sortBy = sParams?.sort || 'newest'

  const title = `${categoryName} - Buy ${categoryName} Online at Best Price in Bangladesh | Baharaz - ${sortBy}`
  const description = `Buy ${categoryName} at lowest price in Bangladesh. ${categoryName} - ${totalCountText()} products available. Shop ${categoryName} like Mini Fan, Power Bank, Mobiles, Fashion & more. ✓Fast Delivery ✓Best Deals ✓Cash on Delivery - Baharaz.com is Daraz alternative #1`
  const keywords = `${categoryName}, buy ${categoryName} online, ${categoryName} price in Bangladesh, ${categoryName} BD, cheap ${categoryName}, Baharaz ${categoryName}, Daraz ${categoryName} alternative, ${categoryName} online shopping BD, best ${categoryName}`
  const url = `https://www.baharaz.com/category/${decodedSlug}`

  function totalCountText() { return '100+' }

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
      images: [{ url: 'https://www.baharaz.com/og-category.jpg', width: 1200, height: 630, alt: `${categoryName} - Baharaz Best Price in BD` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@baharazbd',
      creator: '@baharazbd',
      images: ['https://www.baharaz.com/og-category.jpg'],
    },
    verification: { google: 'google-verification-code', facebook: 'facebook-domain-verification' },
    other: { 'og:email': 'support@baharaz.com', 'og:phone_number': '+8801XXXXXXXXX', 'og:availability': 'instock', 'fb:app_id': '123456789' }
  }
}

export default async function Page({ params, searchParams }) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug || 'all')
  const sParams = await searchParams
  const sortBy = sParams?.sort || 'newest'
  const supabase = await createClient()

  let products = []
  let categoryName = decodedSlug.replace(/-/g, ' ')
  let relatedCats = []
  let totalCount = 0

  try {
    // ALL - সব Product
    if (decodedSlug.toLowerCase() === 'all') {
      let query = supabase.from('products').select('id, title, name, price, original_price, discount_percent, image_url, images, slug, category, rating, sold_count, created_at', { count: 'exact' })
      if (sortBy === 'price_low') query = query.order('price', { ascending: true })
      else if (sortBy === 'price_high') query = query.order('price', { ascending: false })
      else query = query.order('created_at', { ascending: false })
      const { data, count } = await query.limit(60)
      products = data || []
      totalCount = count || products.length
      categoryName = 'All Categories'
    } else {
      // STEP 1 - Direct Like Search (NO status filter - যাতে Product থাকলে পায়)
      let { data, count } = await supabase.from('products').select('id, title, name, price, original_price, discount_percent, image_url, images, slug, category, rating, sold_count, created_at', { count: 'exact' }).ilike('category', `%${categoryName}%`).limit(60)

      // STEP 2 - Slug দিয়ে Try
      if (!data || data.length === 0) {
        const try2 = decodedSlug.replace(/-/g, ' ')
        const res = await supabase.from('products').select('id, title, name, price, original_price, discount_percent, image_url, images, slug, category, rating, sold_count, created_at', { count: 'exact' }).ilike('category', `%${try2}%`).limit(60)
        data = res.data
        count = res.count
      }

      // STEP 3 - categories Table থেকে Name বের করা
      const { data: cat } = await supabase.from('categories').select('id, name, slug').or(`slug.eq.${decodedSlug},name.ilike.%${categoryName}%`).maybeSingle()
      if (cat) {
        categoryName = cat.name
        if (!data || data.length === 0) {
          const res = await supabase.from('products').select('id, title, name, price, original_price, discount_percent, image_url, images, slug, category, rating, sold_count, created_at', { count: 'exact' }).ilike('category', `%${cat.name}%`).limit(60)
          if (res.data && res.data.length > 0) { data = res.data; count = res.count }
        }
      }

      products = data || []
      totalCount = count || products.length
    }

    // Related Categories
    const { data: rel } = await supabase.from('products').select('category').limit(40)
    if (rel) {
      const uniq = [...new Set(rel.map(r=>r.category).filter(Boolean).filter(c=>c.toLowerCase()!== categoryName.toLowerCase()))].slice(0,6)
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

  // JSON-LD SCHEMA - GOOGLE RICH RESULT
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
        image: p.image_url || p.images?.[0]
      }))
    }
  }

  return (
    <>
      <Script id="breadcrumb-schema-slug" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="itemlist-schema-slug" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <div className='bg-[#F5F5F5] min-h-screen'>
        {/* Breadcrumb */}
        <div className='bg-white px-4 h-[52px] flex items-center border-b max-w-[1188px] mx-auto sticky top-0 z-20 shadow-sm'>
          <Link href="/" className='text-[#666] text-[13px] hover:text-[#f85606]'>Home</Link>
          <span className='mx-2 text-[#999]'>/</span>
          <Link href="/category" className='text-[#666] text-[13px] hover:text-[#f85606]'>Categories</Link>
          <span className='mx-2 text-[#999]'>/</span>
          <h1 className='font-bold text-[14px] text-[#212121] capitalize truncate'>{categoryName} - {totalCount || products.length} items</h1>
        </div>

        <div className='max-w-[1188px] mx-auto p-2 md:p-3'>
          {/* HERO */}
          <div className="bg-gradient-to-r from-[#212121] via-[#424242] to-[#F85606] rounded-[16px] p-5 text-white relative overflow-hidden shadow-lg mb-3">
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl"></div>
            <div className="relative z-10 flex justify-between items-center gap-3">
              <div className="flex items-center gap-4">
                <div className="w-[56px] h-[56px] bg-white/15 backdrop-blur rounded-[12px] flex items-center justify-center text-[28px] border border-white/20">{categoryName.charAt(0).toUpperCase()}</div>
                <div>
                  <h2 className="font-black text-[22px] capitalize">{categoryName}</h2>
                  <p className="text-[11px] opacity-80 mt-1">{totalCount || products.length} Products • Free Delivery • 7 Days Return • Best Price in BD</p>
                </div>
              </div>
              <Link href="/category" className="bg-white text-[#212121] px-5 py-2.5 rounded-full text-[12px] font-black hover:bg-[#F85606] hover:text-white transition">All Categories →</Link>
            </div>
          </div>

          {/* FILTER */}
          <div className="bg-white rounded-[12px] p-3 border shadow-sm flex justify-between items-center gap-3 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-black">FILTER:</span>
              <Link href={`/category/${slug}?sort=newest`} className={`text-[11px] px-3 py-1.5 rounded-full border font-bold ${sortBy==='newest'? 'bg-[#F85606] text-white border-[#F85606]':'bg-[#F5F5F5] hover:border-[#F85606]'}`}>Newest</Link>
              <Link href={`/category/${slug}?sort=popular`} className={`text-[11px] px-3 py-1.5 rounded-full border font-bold ${sortBy==='popular'? 'bg-[#F85606] text-white border-[#F85606]':'bg-[#F5F5F5] hover:border-[#F85606]'}`}>Popular</Link>
              <Link href={`/category/${slug}?sort=price_low`} className={`text-[11px] px-3 py-1.5 rounded-full border font-bold ${sortBy==='price_low'? 'bg-[#F85606] text-white border-[#F85606]':'bg-[#F5F5F5] hover:border-[#F85606]'}`}>Price Low</Link>
              <Link href={`/category/${slug}?sort=price_high`} className={`text-[11px] px-3 py-1.5 rounded-full border font-bold ${sortBy==='price_high'? 'bg-[#F85606] text-white border-[#F85606]':'bg-[#F5F5F5] hover:border-[#F85606]'}`}>Price High</Link>
            </div>
            <span className="text-[10px] bg-[#FFF3E0] text-[#EF6C00] px-2 py-1 rounded-full font-bold hidden md:block">{totalCount || products.length} Found</span>
          </div>

          {/* SEO CONTENT */}
          <div className='bg-white rounded-[12px] border p-3 mb-3 hidden md:block'>
            <h2 className='font-bold text-[13px]'>Buy {categoryName} Online at Best Price in Bangladesh</h2>
            <p className='text-[11px] text-[#666] mt-1 leading-[16px]'>Looking for {categoryName} price in BD? Baharaz offers huge collection of {categoryName} - Best deals, Fast delivery all over Bangladesh, Cash on Delivery, Daraz alternative. Shop now!</p>
          </div>

          {/* PRODUCTS OR EMPTY - NO 404 */}
          {products.length === 0? (
            <div className='bg-white p-10 text-center rounded-[16px] shadow-sm border'>
              <div className="text-[56px] mb-4">📦</div>
              <p className='font-black text-[20px] capitalize'>No Products in {categoryName} Yet</p>
              <p className='text-[12px] text-[#666] mt-2 max-w-[450px] mx-auto'>এই Category তে এখনো Product Add হয়নি। নিচের Category গুলো দেখো - এই Page এ আর 404 আসবে না! Google SEO Ready.</p>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-6 max-w-[600px] mx-auto">
                {relatedCats.length>0? relatedCats.map(rc=>(
                  <Link key={rc.slug} href={`/category/${rc.slug}`} className="bg-[#F5F5F5] border rounded-[10px] p-3 hover:border-[#F85606] hover:bg-[#FFF3E0] transition">
                    <p className="font-bold text-[11px] capitalize">{rc.name}</p>
                    <p className="text-[10px] text-gray-500 mt-1">View →</p>
                  </Link>
                )) : (
                  <>
                    <Link href="/category/fashion" className="bg-[#F5F5F5] border rounded-[10px] p-3 hover:border-[#F85606] transition"><p className="font-bold text-[11px]">Fashion</p></Link>
                    <Link href="/category/electronics" className="bg-[#F5F5F5] border rounded-[10px] p-3 hover:border-[#F85606] transition"><p className="font-bold text-[11px]">Electronics</p></Link>
                    <Link href="/category/mobiles" className="bg-[#F5F5F5] border rounded-[10px] p-3 hover:border-[#F85606] transition"><p className="font-bold text-[11px]">Mobiles</p></Link>
                    <Link href="/category/all" className="bg-[#F5F5F5] border rounded-[10px] p-3 hover:border-[#F85606] transition"><p className="font-bold text-[11px]">All</p></Link>
                  </>
                )}
              </div>
              <div className="flex gap-2 justify-center mt-6">
                <Link href="/category" className='bg-[#F5F5F5] border px-6 py-2.5 rounded-full text-[13px] font-bold hover:bg-[#212121] hover:text-white transition'>Browse Categories</Link>
                <Link href="/" className='bg-[#f85606] text-white px-8 py-2.5 rounded-full text-[13px] font-black hover:bg-[#212121] transition'>Go Home</Link>
              </div>
            </div>
          ) : (
            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3'>
              {products.map(p => {
                const img = p.images?.[0] || p.image_url || '/placeholder.png'
                const discount = getDiscount(p)
                return (
                  <Link key={p.id} href={`/product/${p.slug || p.id}`} className='bg-white p-2.5 rounded-[12px] block hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all border group relative overflow-hidden'>
                    {discount>0 && <span className="absolute top-2 left-2 z-10 bg-[#F85606] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">-{discount}%</span>}
                    <div className="h-[160px] flex items-center justify-center bg-[#fafafa] rounded-[8px] p-2">
                      <img src={img} alt={`${p.title || p.name} - ${categoryName} - Baharaz`} loading="lazy" className='max-h-full max-w-full object-contain group-hover:scale-110 transition duration-700'/>
                    </div>
                    <p className='text-[12px] mt-2 line-clamp-2 h-[32px] leading-[15px] group-hover:text-[#F85606]'>{p.title || p.name}</p>
                    <p className='text-[#F85606] font-black text-[16px] mt-2'>৳{p.price?.toLocaleString()}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[10px] text-gray-400">★ {p.rating || '4.8'}</span>
                      <span className="text-[10px] text-gray-400">{p.sold_count || 50}+ Sold</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}