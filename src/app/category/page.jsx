import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const revalidate = 60
export const dynamic = 'force-dynamic'

// SEO - GOOGLE 1st PAGE
export const metadata = {
  title: 'All Categories - Shop 100+ Categories at Best Price in Bangladesh | Baharaz',
  description: 'Browse all categories at Baharaz - Electronics, Fashion, Mobiles, Home & Living, Beauty, Groceries. Best price in Bangladesh. Fast delivery, Cash on Delivery, Daraz alternative.',
  keywords: 'all categories, baharaz categories, online shopping categories Bangladesh, electronics, fashion, mobiles, daraz categories',
  alternates: { canonical: 'https://www.baharaz.com/category' },
  openGraph: {
    title: 'All Categories - Baharaz',
    description: 'Explore 100+ categories at best price in Bangladesh',
    url: 'https://www.baharaz.com/category',
    type: 'website',
    images: [{ url: 'https://www.baharaz.com/og-banner.jpg', width: 1200, height: 630 }],
  },
}

export default async function CategoriesPage(){
  const supabase = await createClient()
  let cats = []
  let productCounts = {}
  let totalProducts = 0
  let featuredCats = []

  try{
    // FIXED - status filter remove korlam, select * korlam speed fast
    const { data: prod } = await supabase.from('products').select('id, category')
    if(prod){
      totalProducts = prod.length
      prod.forEach(p=>{
        if(p.category){
          const key = p.category.toLowerCase().trim()
          productCounts[key] = (productCounts[key]||0)+1
        }
      })
      const unique = [...new Set(prod.map(p=>p.category).filter(Boolean))]
      cats = unique.map((name,i)=>({id:i+100, name: name.trim(), slug: name.toLowerCase().replace(/\s+/g,'-').replace(/&/g,'and').replace(/[^a-z0-9-]/g,''), image_url: null, description: `${name} Collection - Best Price in BD` }))
    }

    const { data: catTable } = await supabase.from('categories').select('id, name, slug, image_url, description, is_featured').order('name')
    if(catTable && catTable.length>0){
      const tableMap = {}
      catTable.forEach(c=>{ tableMap[c.name.toLowerCase()] = c })
      cats.forEach(c=>{ if(!tableMap[c.name.toLowerCase()]){ tableMap[c.name.toLowerCase()] = c } })
      cats = Object.values(tableMap).map(c=>({...c, count: productCounts[c.name?.toLowerCase()] || 0, is_featured: c.is_featured || (productCounts[c.name?.toLowerCase()] > 1) }))
      featuredCats = cats.filter(c=>c.is_featured).slice(0,4)
      if(featuredCats.length===0) featuredCats = cats.slice(0,4)
    }else{
      cats = cats.map(c=>({...c, count: productCounts[c.name?.toLowerCase()] || 0, is_featured: true }))
      featuredCats = cats.slice(0,4)
    }
  }catch(e){ console.log('CategoriesPage Error:', e.message) }

  if(cats.length===0){
    cats = [
      {id:1, name:'Electronics', slug:'electronics', count: productCounts['electronics']||12, is_featured: true, description: 'Mobiles, Laptops, Gadgets'},
      {id:2, name:'Fashion', slug:'fashion', count: productCounts['fashion']||25, is_featured: true, description: 'Men, Women, Kids Fashion'},
      {id:3, name:'Mobiles', slug:'mobiles', count: productCounts['mobiles']||18, is_featured: true, description: 'Smartphones & Accessories'},
      {id:4, name:'Home & Living', slug:'home-living', count: productCounts['home & living']||9, is_featured: false, description: 'Furniture, Decor, Kitchen'},
      {id:5, name:'Health & Beauty', slug:'health-beauty', count: productCounts['health & beauty']||15, is_featured: true, description: 'Beauty, Health, Personal Care'},
      {id:6, name:'Groceries', slug:'groceries', count: productCounts['groceries']||30, is_featured: false, description: 'Daily Needs & Food'},
      {id:7, name:'Kids & Toys', slug:'kids-toys', count: productCounts['kids & toys']||8, is_featured: false, description: 'Toys, Baby Products'},
      {id:8, name:'Sports & Outdoors', slug:'sports', count: productCounts['sports']||6, is_featured: false, description: 'Sports, Fitness, Travel'},
    ]
    featuredCats = cats.filter(c=>c.is_featured)
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
    return '🛍️'
  }

  const getGradient = (index) => {
    const gradients = ['from-[#FF6B6B] to-[#EE5A24]','from-[#4834D4] to-[#686DE0]','from-[#00D2D3] to-[#01A3A4]','from-[#F0932B] to-[#EB4D4B]','from-[#6C5CE7] to-[#A29BFE]','from-[#00B894] to-[#00CEC9]','from-[#FD79A8] to-[#E84393]','from-[#FDCB6E] to-[#E17055]']
    return gradients[index % gradients.length]
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      <div className="bg-white px-4 h-[52px] flex items-center border-b max-w-[1188px] mx-auto sticky top-0 z-20 shadow-sm">
        <Link href="/" className="text-[#666] text-[13px] hover:text-[#F85606] font-medium">Home</Link>
        <span className="mx-2 text-[#999]">/</span>
        <h1 className="font-bold text-[14px] text-[#212121]">All Categories - {cats.length} Categories, {totalProducts} Products</h1>
      </div>

      <div className="max-w-[1188px] mx-auto p-2 md:p-3">
        <div className="bg-gradient-to-r from-[#F85606] via-[#FF8C00] to-[#FF5722] rounded-[16px] p-4 md:p-6 text-white relative overflow-hidden shadow-[0_8px_24px_rgba(248,86,6,0.3)] mb-3">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-[150px] h-[150px] bg-black/10 rounded-full -ml-10 -mb-10 blur-xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <h2 className="font-black text-[20px] md:text-[28px]">Explore Baharaz Categories 🛒</h2>
              <p className="text-[12px] md:text-[13px] mt-1 opacity-90 font-medium">Find everything you need - {cats.length} categories, {totalProducts}+ products - Best Price in BD</p>
            </div>
            <Link href="/category/all" className="bg-white text-[#F85606] px-5 py-2.5 rounded-full text-[12px] font-black shadow-lg hover:bg-[#212121] hover:text-white transition-all">SHOP ALL →</Link>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          <div className="bg-white rounded-[12px] p-3 border text-center shadow-sm hover:shadow-md transition"><p className="font-black text-[18px] text-[#F85606]">{cats.length}</p><p className="text-[10px] text-gray-500 font-bold uppercase">Categories</p></div>
          <div className="bg-white rounded-[12px] p-3 border text-center shadow-sm hover:shadow-md transition"><p className="font-black text-[18px] text-[#1a9cb7]">{totalProducts}+</p><p className="text-[10px] text-gray-500 font-bold uppercase">Products</p></div>
          <div className="bg-white rounded-[12px] p-3 border text-center shadow-sm hover:shadow-md transition"><p className="font-black text-[18px] text-[#00B894]">24/7</p><p className="text-[10px] text-gray-500 font-bold uppercase">Support</p></div>
          <div className="bg-white rounded-[12px] p-3 border text-center shadow-sm hover:shadow-md transition"><p className="font-black text-[18px] text-[#6C5CE7]">99%</p><p className="text-[10px] text-gray-500 font-bold uppercase">Happy</p></div>
        </div>

        {featuredCats.length>0 && (
          <div className="bg-white rounded-[16px] p-4 md:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border mb-3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-black text-[16px] md:text-[18px] flex items-center gap-2">🔥 Featured Categories</h2>
              <Link href="/category/all" className="text-[11px] text-[#F85606] font-bold border border-[#F85606] px-3 py-1 rounded-full hover:bg-[#F85606] hover:text-white transition">View All →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {featuredCats.map((c,i)=>(
                <Link key={`feat-${c.id}`} href={`/category/${c.slug}`} className={`relative rounded-[14px] p-4 text-white overflow-hidden group hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all bg-gradient-to-br ${getGradient(i)}`}>
                  <div className="absolute top-0 right-0 w-[80px] h-[80px] bg-white/10 rounded-full -mr-5 -mt-5"></div>
                  <div className="relative z-10">
                    <div className="text-[32px] mb-2">{getIcon(c.name)}</div>
                    <p className="font-black text-[13px]">{c.name}</p>
                    <p className="text-[10px] opacity-90 mt-1 line-clamp-1">{c.description}</p>
                    <span className="bg-white/20 backdrop-blur px-2 py-1 rounded-full text-[9px] font-bold border border-white/30 mt-3 inline-block">{c.count} Items →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-[16px] p-4 md:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-black text-[18px]">Browse All Categories</h2>
            <span className="text-[11px] bg-[#fff6f0] text-[#F85606] px-3 py-1.5 rounded-full font-bold border">{cats.length} Categories</span>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-3 md:gap-4">
            {cats.map((c)=>(
              <Link key={c.id} href={`/category/${c.slug}`} className="flex flex-col items-center gap-3 group border border-gray-100 rounded-[16px] p-4 hover:border-[#F85606] hover:shadow-[0_12px_28px_rgba(248,86,6,0.15)] hover:-translate-y-1.5 transition-all bg-white relative overflow-hidden">
                <div className="w-[68px] h-[68px] rounded-full bg-gradient-to-br from-[#fff6f0] to-[#ffe1d2] flex items-center justify-center group-hover:from-[#F85606] group-hover:to-[#E04E05] transition-all shadow-[0_4px_12px_rgba(248,86,6,0.15)] border-2 border-white text-[30px]">
                  {c.image_url? <img src={c.image_url} alt={c.name} className="w-full h-full object-cover rounded-full"/> : <span className="group-hover:text-white group-hover:scale-110 transition-all">{getIcon(c.name)}</span>}
                </div>
                <div className="text-center w-full">
                  <p className="text-[12px] font-black group-hover:text-[#F85606] leading-[13px] min-h-[26px]">{c.name}</p>
                  <p className="text-[10px] text-white bg-[#212121] group-hover:bg-[#F85606] px-2.5 py-1 rounded-full font-bold mt-2 inline-block transition-colors">{c.count || 0} Products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[16px] p-4 mt-3 border hidden md:block">
          <h3 className="font-black text-[14px]">Shop by Category at Baharaz - Best Online Shopping in Bangladesh</h3>
          <p className="text-[12px] text-gray-600 mt-2 leading-[18px]">Baharaz is #1 online shopping site in Bangladesh. Buy electronics, fashion, mobiles, groceries at best price. Fast delivery in Dhaka, Rajshahi, Chittagong, Sylhet. Cash on Delivery, Free Return, Warranty. Daraz alternative with better deals.</p>
        </div>

        <div className="text-center mt-6 pb-10">
          <Link href="/" className="bg-[#F85606] text-white px-10 py-3.5 rounded-full text-[13px] font-black inline-block shadow-[0_6px_20px_rgba(248,86,6,0.35)] hover:bg-[#212121] transition-all">Go Home - Baharaz #1 🛍️</Link>
        </div>
      </div>
    </div>
  )
}