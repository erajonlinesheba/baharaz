import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Script from 'next/script'

export const dynamic = 'force-dynamic'

// ================= 100% SEO PREMIUM - GOOGLE 1st PAGE =================
export async function generateMetadata() {
  const title = 'All Categories - Shop 100+ Categories at Best Price in Bangladesh | Baharaz'
  const description = 'Browse all categories at Baharaz - Electronics, Fashion, Mobiles, Home & Living, Health & Beauty, Groceries, Kids & Toys, Sports. Best price in Bangladesh. Fast delivery, Cash on Delivery, Daraz alternative #1. Trusted by 10,000+ customers.'
  const keywords = 'all categories, baharaz categories, online shopping categories Bangladesh, electronics price BD, fashion BD, mobiles, daraz categories, baharaz.com, best online shopping BD, cheap price BD'
  const url = 'https://www.baharaz.com/category'

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
      images: [{ url: 'https://www.baharaz.com/og-banner.jpg', width: 1200, height: 630, alt: 'All Categories - Baharaz' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://www.baharaz.com/og-banner.jpg'],
    },
  }
}

export default async function CategoriesPage(){
  const supabase = await createClient()
  let cats = []
  let productCounts = {}
  let totalProducts = 0
  let featuredCats = []

  try{
    // FAST COUNT - Unlimited products er jonno slow hobe na
    const [countRes, prodRes, catTableRes] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('products').select('category').limit(10000),
      supabase.from('categories').select('id, name, slug, image_url, description, is_featured').order('name')
    ])

    if(countRes.count) totalProducts = countRes.count

    const prod = prodRes.data
    if(prod){
      prod.forEach(p=>{
        if(p.category){
          const key = p.category.toLowerCase().trim()
          productCounts[key] = (productCounts[key]||0)+1
        }
      })
      const unique = [...new Set(prod.map(p=>p.category).filter(Boolean))]
      cats = unique.map((name,i)=>({id:i+100, name: name.trim(), slug: name.toLowerCase().replace(/\s+/g,'-').replace(/&/g,'and').replace(/[^a-z0-9-]/g,''), image_url: null, description: `${name} - Best deals in Baharaz` }))
    }

    const catTable = catTableRes.data
    if(catTable && catTable.length>0){
      const tableMap = {}
      catTable.forEach(c=>{ tableMap[c.name.toLowerCase()] = c })
      cats.forEach(c=>{
        if(!tableMap[c.name.toLowerCase()]){
          tableMap[c.name.toLowerCase()] = c
        }
      })
      cats = Object.values(tableMap).map(c=>({
      ...c,
        count: productCounts[c.name?.toLowerCase()] || productCounts[c.name?.toLowerCase().trim()] || 0,
        is_featured: c.is_featured || (productCounts[c.name?.toLowerCase()] > 2)
      }))
      cats = cats.sort((a,b)=> b.count - a.count)
      featuredCats = cats.filter(c=>c.is_featured).slice(0,4)
      if(featuredCats.length===0) featuredCats = cats.slice(0,4)
    }else{
      cats = cats.map(c=>({...c, count: productCounts[c.name?.toLowerCase()] || 0, is_featured: (productCounts[c.name?.toLowerCase()] > 1) }))
      cats = cats.sort((a,b)=> b.count - a.count)
      featuredCats = cats.slice(0,4)
    }
  }catch(e){ console.log('CategoriesPage Error:', e.message) }

  if(cats.length===0){
    cats = [
      {id:1, name:'Electronics', slug:'electronics', count: 12, is_featured: true, description: 'Mobiles, Laptops, Gadgets', image_url: null},
      {id:2, name:'Fashion', slug:'fashion', count: 25, is_featured: true, description: 'Men, Women, Kids Fashion', image_url: null},
      {id:3, name:'Mobiles', slug:'mobiles', count: 18, is_featured: true, description: 'Smartphones & Accessories', image_url: null},
      {id:4, name:'Home & Living', slug:'home-living', count: 9, is_featured: false, description: 'Furniture, Decor, Kitchen', image_url: null},
      {id:5, name:'Health & Beauty', slug:'health-beauty', count: 15, is_featured: true, description: 'Beauty, Health, Personal Care', image_url: null},
      {id:6, name:'Groceries', slug:'groceries', count: 30, is_featured: false, description: 'Daily Needs & Food', image_url: null},
      {id:7, name:'Kids & Toys', slug:'kids-toys', count: 8, is_featured: false, description: 'Toys, Baby Products', image_url: null},
      {id:8, name:'Sports & Outdoors', slug:'sports', count: 6, is_featured: false, description: 'Sports, Fitness, Travel', image_url: null},
    ]
    featuredCats = cats.filter(c=>c.is_featured)
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.baharaz.com' },
      { '@type': 'ListItem', position: 2, name: 'All Categories', item: 'https://www.baharaz.com/category' }
    ]
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'All Categories - Baharaz',
    description: 'Browse all categories at best price in Bangladesh',
    url: 'https://www.baharaz.com/category',
    isPartOf: { '@type': 'WebSite', name: 'Baharaz', url: 'https://www.baharaz.com' },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: cats.length,
      itemListElement: cats.slice(0, 50).map((c, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `https://www.baharaz.com/category/${c.slug}`,
        name: c.name
      }))
    }
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'How many categories in Baharaz?', acceptedAnswer: { '@type': 'Answer', text: `Baharaz has ${cats.length} categories and ${totalProducts}+ products with best price in Bangladesh.` } },
      { '@type': 'Question', name: 'Which is best online shopping in Bangladesh?', acceptedAnswer: { '@type': 'Answer', text: 'Baharaz.com is best online shopping site in Bangladesh - Daraz alternative with better price and fast delivery.' } }
    ]
  }

  const getIcon = (name) => {
    const n = name.toLowerCase()
    if(n.includes('elect')) return '🔌'
    if(n.includes('fash')) return '👗'
    if(n.includes('mobile')||n.includes('phone')) return '📱'
    if(n.includes('home')||n.includes('living')) return '🏠'
    if(n.includes('health')||n.includes('beauty')) return '💄'
    if(n.includes('groce')||n.includes('food')) return '🛒'
    if(n.includes('kid')||n.includes('toy')||n.includes('baby')) return '🧸'
    if(n.includes('sport')) return '⚽'
    if(n.includes('book')||n.includes('station')) return '📚'
    if(n.includes('car')||n.includes('motor')) return '🚗'
    if(n.includes('watch')) return '⌚'
    if(n.includes('shoe')) return '👟'
    return '🛍️'
  }

  const getGradient = (index) => {
    const gradients = [
      'from-[#FF6B6B] to-[#EE5A24]',
      'from-[#4834D4] to-[#686DE0]',
      'from-[#00D2D3] to-[#01A3A4]',
      'from-[#F0932B] to-[#EB4D4B]',
      'from-[#6C5CE7] to-[#A29BFE]',
      'from-[#00B894] to-[#00CEC9]',
      'from-[#FD79A8] to-[#E84393]',
      'from-[#FDCB6E] to-[#E17055]',
    ]
    return gradients[index % gradients.length]
  }

  return (
    <>
      <Script id="breadcrumb-schema-cat" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="collection-schema-cat" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <Script id="faq-schema-cat" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="bg-[#f5f5f7] min-h-screen">
        <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
          <div className='max-w-[1320px] mx-auto px-4 h-[52px] flex items-center justify-between'>
            <div className='flex items-center gap-2 text-[13px]'>
              <Link href="/" className="text-[#666] hover:text-[#F85606] font-medium">Home</Link>
              <span className="text-[#ccc]">›</span>
              <h1 className="font-black text-[14px] text-[#111]">All Categories - {cats.length} Categories, {totalProducts} Products</h1>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="text-[10px] bg-[#E8F5E9] text-[#2E7D32] px-2.5 py-1 rounded-full font-black border">✓ Live</span>
              <span className="text-[10px] bg-[#111] text-white px-2.5 py-1 rounded-full font-black">{totalProducts}+ Products</span>
            </div>
          </div>
        </div>

        <div className="max-w-[1320px] mx-auto p-3 md:p-4">
          <div className="bg-gradient-to-r from-[#111] via-[#2a2a2a] to-[#F85606] rounded-[20px] p-5 md:p-7 text-white relative overflow-hidden shadow-xl mb-4">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[#F85606]/20 rounded-full -ml-20 -mb-20 blur-2xl"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="font-black text-[22px] md:text-[30px] leading-tight tracking-tight">Explore Baharaz Categories 🛒</h2>
                <p className="text-[12px] md:text-[13px] mt-2 opacity-80">Find everything you need - {cats.length} categories, {totalProducts}+ products, Best prices in Bangladesh</p>
                <div className="flex gap-2 mt-4 flex-wrap">
                  <span className="bg-white/10 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold border border-white/20">🚚 Free Delivery</span>
                  <span className="bg-white/10 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold border border-white/20">↩️ Easy Return</span>
                  <span className="bg-white/10 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold border border-white/20">🛡️ Secure Payment</span>
                  <span className="bg-white text-black px-3 py-1.5 rounded-full text-[10px] font-black">✓ Verified</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href="/category/all" className="bg-white text-black px-6 py-3 rounded-full text-[12px] font-black shadow-lg hover:bg-black hover:text-white transition">SHOP ALL →</Link>
                <Link href="/" className="bg-black/30 backdrop-blur text-white border border-white/20 px-5 py-3 rounded-full text-[12px] font-bold hover:bg-white hover:text-black transition">Home</Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="bg-white rounded-2xl p-4 border-2 border-transparent hover:border-black text-center shadow-sm hover:shadow-lg transition group">
              <p className="font-black text-[22px] text-[#111] group-hover:text-[#F85606]">{cats.length}</p>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Categories</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border-2 border-transparent hover:border-black text-center shadow-sm hover:shadow-lg transition group">
              <p className="font-black text-[22px] text-[#111] group-hover:text-[#1a9cb7]">{totalProducts}+</p>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Products</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border-2 border-transparent hover:border-black text-center shadow-sm hover:shadow-lg transition group">
              <p className="font-black text-[22px] text-[#111] group-hover:text-[#00B894]">24/7</p>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Support</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border-2 border-transparent hover:border-black text-center shadow-sm hover:shadow-lg transition group">
              <p className="font-black text-[22px] text-[#111] group-hover:text-[#6C5CE7]">99%</p>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Happy Clients</p>
            </div>
          </div>

          {featuredCats.length>0 && (
            <div className="bg-white rounded-[20px] p-5 md:p-6 shadow-sm border-2 mb-4">
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-black text-[18px] flex items-center gap-2">🔥 Featured Categories <span className="bg-[#111] text-white text-[9px] px-2.5 py-1 rounded-full font-black">HOT</span></h2>
                <Link href="/category/all" className="text-[11px] bg-black text-white px-4 py-2 rounded-full font-black hover:bg-[#F85606] transition">View All →</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {featuredCats.map((c,i)=>(
                  <Link key={`feat-${c.id}`} href={`/category/${c.slug}`} className={`relative rounded-[16px] p-5 text-white overflow-hidden group hover:scale-[1.02] hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${getGradient(i)}`}>
                    <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-white/10 rounded-full -mr-6 -mt-6 group-hover:scale-125 transition duration-500"></div>
                    <div className="relative z-10">
                      <div className="text-[36px] mb-2 group-hover:rotate-6 transition duration-300">{getIcon(c.name)}</div>
                      <p className="font-black text-[14px] leading-tight">{c.name}</p>
                      <p className="text-[11px] opacity-90 mt-1 line-clamp-1">{c.description}</p>
                      <div className="flex items-center gap-2 mt-4">
                        <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black border border-white/20">{c.count} Items</span>
                        <span className="w-6 h-6 bg-white text-black rounded-full flex items-center justify-center text-[12px] font-bold group-hover:translate-x-1 transition">→</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-[20px] p-5 md:p-6 shadow-sm border-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6">
              <div>
                <h2 className="font-black text-[20px] tracking-tight">Browse All Categories</h2>
                <p className="text-[12px] text-gray-500 mt-1">Discover products by category - Click any category to explore • Sorted by Popular</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] bg-black text-white px-4 py-2 rounded-full font-black">{cats.length} Categories</span>
                <span className="text-[11px] bg-[#E8F5E9] text-[#2E7D32] px-3 py-2 rounded-full font-black border">✓ Verified Store</span>
              </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
              {cats.map((c,i)=>(
                <Link key={c.id} href={`/category/${c.slug}`} className="flex flex-col items-center gap-3 group border-2 border-gray-100 rounded-[18px] p-5 hover:border-black hover:shadow-[0_16px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 bg-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className={`relative z-10 w-[72px] h-[72px] rounded-full bg-[#f9fafb] group-hover:bg-black flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-lg border-2 border-gray-100 group-hover:border-black text-[32px]`}>
                    {c.image_url? <img src={c.image_url} alt={c.name} loading="lazy" className="w-full h-full object-cover rounded-full"/> : <span className="group-hover:text-white group-hover:scale-110 transition-all duration-300">{getIcon(c.name)}</span>}
                  </div>
                  <div className="relative z-10 text-center w-full">
                    <p className="text-[12px] font-black text-center group-hover:text-black leading-[14px] line-clamp-2 min-h-[28px]">{c.name}</p>
                    <div className="flex flex-col items-center gap-1.5 mt-3">
                      <p className="text-[10px] text-white bg-black group-hover:bg-[#F85606] px-3 py-1 rounded-full font-black transition-colors">{c.count || 0} Products</p>
                      {c.is_featured && <span className="text-[8px] bg-[#FFD700] text-black px-2 py-0.5 rounded-full font-black">FEATURED</span>}
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-[12px] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">→</div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border-2 p-5 mt-4">
            <h3 className="font-black text-[15px]">Shop by Category at Baharaz - Best Online Shopping in Bangladesh</h3>
            <p className="text-[12px] text-gray-600 mt-2 leading-6">Baharaz is #1 online shopping site in Bangladesh. Buy electronics, fashion, mobiles, groceries at best price. Fast delivery in Dhaka, Rajshahi, Chittagong, Sylhet. Cash on Delivery, Free Return, Warranty. Daraz alternative with better deals. {cats.slice(0,8).map(c=>c.name).join(', ')} and more - all at lowest price guaranteed. Trusted by 10,000+ customers.</p>
            <div className='flex flex-wrap gap-2 mt-3'>
              {cats.slice(0,12).map(c=>(
                <Link key={`tag-${c.slug}`} href={`/category/${c.slug}`} className='text-[11px] bg-[#f5f5f7] border px-3 py-1.5 rounded-full hover:bg-black hover:text-white transition font-bold'>{c.name}</Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-gradient-to-r from-[#111] to-[#333] rounded-[16px] p-5 text-white flex justify-between items-center relative overflow-hidden group hover:shadow-xl transition-all">
              <div className="relative z-10">
                <p className="font-black text-[15px]">Can't find what you need?</p>
                <p className="text-[11px] opacity-70 mt-1">Browse all products in one place - {totalProducts}+ items</p>
                <Link href="/category/all" className="inline-block mt-3 bg-white text-black px-5 py-2 rounded-full text-[11px] font-black hover:bg-[#F85606] hover:text-white transition">View All Products →</Link>
              </div>
              <div className="text-[48px] opacity-10 group-hover:opacity-20 group-hover:rotate-12 transition-all">🛒</div>
            </div>
            <div className="bg-white border-2 rounded-[16px] p-5 flex justify-between items-center relative overflow-hidden group hover:border-black hover:shadow-xl transition-all">
              <div className="relative z-10">
                <p className="font-black text-[15px]">Become a Seller Today!</p>
                <p className="text-[11px] text-[#666] mt-1">Start selling & earn money with Baharaz</p>
                <Link href="/become-seller" className="inline-block mt-3 bg-black text-white px-5 py-2 rounded-full text-[11px] font-black hover:bg-[#F85606] transition">Start Selling →</Link>
              </div>
              <div className="text-[48px] opacity-10 group-hover:opacity-20 group-hover:rotate-12 transition-all">💼</div>
            </div>
          </div>

          <div className="text-center mt-8 pb-10">
            <p className="text-[11px] text-gray-400 mb-4">Trusted by 10,000+ customers in Bangladesh • 100% Secure Shopping • {cats.length} Categories</p>
            <Link href="/" className="bg-black text-white px-10 py-4 rounded-full text-[13px] font-black inline-block shadow-lg hover:bg-[#F85606] hover:-translate-y-1 transition-all">Go to Homepage 🛍️</Link>
          </div>
        </div>
      </div>
    </>
  )
}