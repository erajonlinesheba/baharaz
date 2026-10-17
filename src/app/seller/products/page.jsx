'use client'
import { useState, useEffect, useMemo } from 'react'
import { supabase } from "@/lib/supabase/client"
import { Search, Package, Eye, Edit3, Trash2, Sparkles, Bot, Zap, TrendingUp, Star, ChevronLeft, ChevronRight, Crown, BarChart3, Wand2, Brain, AlertTriangle, CheckCircle2, Copy, ExternalLink, DollarSign, Layers, Activity, Tag, Filter, Plus, CheckSquare, Download, Save, X, Globe, Share2, Hash, FileText, Award, Target, ShoppingBag, Video, CopyPlus, Ban, Clock, ShieldAlert, Box, Flame, Rocket, Gem, ArrowUp, ArrowDown, Calculator, Store, Gift, Percent, QrCode, Megaphone, Lightbulb, Gauge, LineChart, Heart, MessageCircle, Repeat, Smartphone, Printer, TrendingDown, BadgeCheck, Timer, Coins, MousePointerClick, PieChart, Users, Radar, RefreshCw, Settings2, UploadCloud, Image as ImageIcon, Play, ThumbsUp, Link2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SellerProductsPage(){
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [brandFilter, setBrandFilter] = useState('All')
  const [priceFilter, setPriceFilter] = useState('All')
  const [seoFilter, setSeoFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [selected, setSelected] = useState([])
  const [aiProcessing, setAiProcessing] = useState(null)
  const [editingPrice, setEditingPrice] = useState(null)
  const [tempPrice, setTempPrice] = useState('')
  const [editingStock, setEditingStock] = useState(null)
  const [tempStock, setTempStock] = useState('')
  const [sellerScore, setSellerScore] = useState({ score: 0, products: 0, views: 0, orders: 0, rating: 0, level: 'New', active: 0, lowStock: 0 })
  const [seoModal, setSeoModal] = useState(null)
  const [stockModal, setStockModal] = useState(false)
  const [bulkStockValue, setBulkStockValue] = useState('')
  const [bulkPriceModal, setBulkPriceModal] = useState(false)
  const [bulkPriceValue, setBulkPriceValue] = useState('')
  const [bulkPriceType, setBulkPriceType] = useState('fixed')
  const [priceSuggest, setPriceSuggest] = useState(null)
  const [qrModal, setQrModal] = useState(null)
  const [boostModal, setBoostModal] = useState(null)
  const [analyticsModal, setAnalyticsModal] = useState(null)
  const [toast, setToast] = useState('')
  const [viewMode, setViewMode] = useState('list')
  const [sortBy, setSortBy] = useState('newest')
  const itemsPerPage = 20

  const showToast = (m) => { setToast(m); setTimeout(()=>setToast(''), 2800) }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const from = (currentPage - 1) * itemsPerPage
      const to = from + itemsPerPage - 1
      const { data: { user } } = await supabase.auth.getUser()
      if(!user) {
        setLoading(false)
        return
      }

      // ✅ UNLIMITED SELLER FIX - সব ID Collect করো
      let allSellerIds = [user.id]
      try {
        const { data: seller } = await supabase.from('sellers').select('id').eq('user_id', user.id).maybeSingle()
        if(seller?.id) allSellerIds.push(seller.id)
      } catch(e) {}

      // ✅ UNLIMITED FIX - 4টা Column দিয়েই Search করবে, যাতে যেকোনোভাবে Save হলেও পায়
      let query = supabase.from('products').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(from, to).or(`seller_id.in.(${allSellerIds.join(',')}),seller_user_id.eq.${user.id},user_id.eq.${user.id},seller_table_id.in.(${allSellerIds.join(',')})`)

      if (search) query = query.or(`title.ilike.%${search}%,sku.ilike.%${search}%`)
      if (filterStatus === 'Active') query = query.eq('status', 'active')
      if (filterStatus === 'Inactive') query = query.eq('status', 'inactive')
      if (filterStatus === 'Pending Approval') query = query.eq('status', 'pending')
      if (filterStatus === 'Low Stock') query = query.lt('stock', 5).gt('stock', 0)
      if (filterStatus === 'Out of Stock') query = query.eq('stock', 0)
      if (filterStatus === 'Violations') query = query.eq('status', 'violation')
      if (categoryFilter!== 'All') query = query.eq('category', categoryFilter)
      if (brandFilter!== 'All') query = query.eq('brand', brandFilter)
      if (priceFilter === '0-800') query = query.lte('price', 800)
      if (priceFilter === '800-1500') query = query.gte('price', 800).lte('price', 1500)
      if (priceFilter === '1500+') query = query.gte('price', 1500)
      if (seoFilter === 'SEO 100') query = query.eq('seo_score', 100)
      if (seoFilter === 'No SEO') query = query.lt('seo_score', 50)
      if (sortBy === 'price_low') query = query.order('price', { ascending: true })
      if (sortBy === 'price_high') query = query.order('price', { ascending: false })
      if (sortBy === 'views') query = query.order('views', { ascending: false })
      const { data, count, error } = await query
      if (error) {
        // Fallback - যদি OR Fail করে, তাহলে simple IN দিয়ে Try
        console.log('OR failed, fallback:', error.message)
        const fallback = await supabase.from('products').select('*', { count: 'exact' }).in('seller_id', allSellerIds).order('created_at', { ascending: false }).range(from, to)
        if(fallback.data) {
          setProducts(fallback.data)
          setTotalCount(fallback.count || 0)
          setLoading(false)
          return
        }
        throw error
      }
      if (data) { setProducts(data); setTotalCount(count || 0) }
    } catch (err) {
      console.error('Fetch Error:', err.message)
      setProducts([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }

  const fetchRealSellerScore = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // ✅ UNLIMITED SELLER FIX - সব ID
      let allSellerIds = [user.id]
      try {
        const { data: seller } = await supabase.from('sellers').select('id').eq('user_id', user.id).maybeSingle()
        if(seller?.id) allSellerIds.push(seller.id)
      } catch(e) {}

      const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).or(`seller_id.in.(${allSellerIds.join(',')}),seller_user_id.eq.${user.id},user_id.eq.${user.id},seller_table_id.in.(${allSellerIds.join(',')})`)
      const { count: activeCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).or(`seller_id.in.(${allSellerIds.join(',')}),seller_user_id.eq.${user.id},user_id.eq.${user.id},seller_table_id.in.(${allSellerIds.join(',')})`).eq('status', 'active')
      const { data: allProducts } = await supabase.from('products').select('views, stock, rating').or(`seller_id.in.(${allSellerIds.join(',')}),seller_user_id.eq.${user.id},user_id.eq.${user.id},seller_table_id.in.(${allSellerIds.join(',')})`)
      let totalViews = 0
      let totalRating = 0
      let lowStock = 0
      if (allProducts) {
        allProducts.forEach(p => {
          totalViews += p.views || 0
          totalRating += p.rating || 0
          if ((p.stock || 0) < 5) lowStock++
        })
      }
      let ordersCount = 0
      try {
        const { count: oCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('seller_id', user.id)
        ordersCount = oCount || 0
      } catch(e) { ordersCount = 0 }
      const pCount = productCount || 0
      const aCount = activeCount || 0
      const avgRating = allProducts && allProducts.length > 0? (totalRating / allProducts.length) : 0
      let score = 0
      score += Math.min(pCount * 0.8, 3)
      score += aCount > 0? (aCount / Math.max(pCount, 1)) * 2 : 0
      score += Math.min(totalViews / 100, 2)
      score += Math.min(ordersCount * 0.5, 1.5)
      score += avgRating > 0? (avgRating / 5) * 1 : 0
      score -= lowStock * 0.2
      score = Math.max(0, Math.min(10, parseFloat(score.toFixed(1))))
      let level = 'New'
      if (score >= 8) level = 'Platinum'
      else if (score >= 6) level = 'Gold'
      else if (score >= 4) level = 'Silver'
      else if (score >= 2) level = 'Bronze'
      setSellerScore({ score, products: pCount, views: totalViews, orders: ordersCount, rating: avgRating.toFixed(1), active: aCount, lowStock, level })
    } catch (e) {
      console.log('Score Error', e)
    }
  }

  useEffect(() => { fetchProducts(); fetchRealSellerScore() }, [currentPage, search, filterStatus, categoryFilter, brandFilter, priceFilter, seoFilter, sortBy])
  useEffect(() => { setCurrentPage(1) }, [search, filterStatus, categoryFilter, brandFilter, priceFilter, seoFilter])

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  const tabs = [
    { name: 'All', icon: Layers, count: sellerScore.products },
    { name: 'Active', icon: CheckCircle2, count: sellerScore.active },
    { name: 'Inactive', icon: Ban, count: Math.max(0, sellerScore.products - sellerScore.active) },
    { name: 'Pending Approval', icon: Clock, count: 0 },
    { name: 'Out of Stock', icon: Box, count: sellerScore.lowStock },
    { name: 'Violations', icon: ShieldAlert, count: 0 },
  ]

  const stats = useMemo(()=> {
    const totalValue = products.reduce((a,b)=>a+(b.price*b.stock),0)
    const avgPrice = products.length? Math.round(products.reduce((a,b)=>a+b.price,0)/products.length) : 0
    const totalProfit = products.reduce((a,b)=>a+((b.price - (b.price*0.6))*b.stock),0)
    return { totalValue, avgPrice, totalProfit }
  }, [products])

  const handleGenerateFullSEO = async (product) => {
    setAiProcessing(product.id + 'seo')
    const seoTitle = `${product.title} | Baharaz | Free Delivery | Original Product | Best Price BD`
    const seoDesc = `Buy ${product.title} at Baharaz - Best price ৳${product.price}. 100% Original, Free Delivery All Bangladesh, 7 Days Return. ${product.category} best seller.`
    const keywords = `${product.title}, Baharaz, ${product.category}, free delivery, original product, best price Bangladesh`
    const facebookDesc = `${product.title} - Now available at Baharaz! Free Delivery | Best Price ৳${product.price}`
    const youtubeTags = `${product.title}, Baharaz unboxing, ${product.category} review Bangladesh`
    const tiktokHashtags = `#Baharaz #${product.category} #FreeDelivery #Bangladesh #fyp`
    const marketplaceTags = `${product.title} baharaz, ${product.category} baharaz, best ${product.category} price bd`
    const googleSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.title,
      "image": product.image,
      "description": seoDesc,
      "brand": "Baharaz",
      "offers": { "@type": "Offer", "price": product.price, "priceCurrency": "BDT", "availability": "https://schema.org/InStock", "seller": "Baharaz Official Store" }
    }
    const { error } = await supabase.from('products').update({
      seo_title: seoTitle,
      seo_description: seoDesc,
      seo_keywords: keywords,
      facebook_description: facebookDesc,
      youtube_tags: youtubeTags,
      tiktok_hashtags: tiktokHashtags,
      marketplace_tags: marketplaceTags,
      google_schema: JSON.stringify(googleSchema),
      seo_score: 100,
      ai_optimized: true,
      last_seo_update: new Date().toISOString(),
      viral_score: Math.floor(Math.random()*20)+80
    }).eq('id', product.id)
    if (!error) {
      setSeoModal({ product, seoTitle, seoDesc, keywords, facebookDesc, youtubeTags, tiktokHashtags, marketplaceTags, googleSchema })
      fetchProducts()
      showToast('SEO Updated Successfully')
    }
    setAiProcessing(null)
  }

  const handleBulkFullSEO = async () => {
    if (selected.length === 0) return alert('Select products first!')
    setAiProcessing('bulkseo')
    for (let id of selected) {
      const prod = products.find(p => p.id === id)
      if (prod) {
        const seoTitle = `${prod.title} | Baharaz | Free Delivery | Best Price`
        const seoDesc = `Buy ${prod.title} at Baharaz - ৳${prod.price} - Free Delivery Bangladesh`
        await supabase.from('products').update({
          seo_title: seoTitle,
          seo_description: seoDesc,
          seo_score: 100,
          ai_optimized: true,
          marketplace_tags: `${prod.title} baharaz official`,
          viral_score: 95,
          last_seo_update: new Date().toISOString()
        }).eq('id', id)
      }
    }
    setAiProcessing(null); setSelected([]); fetchProducts()
    showToast(`${selected.length} Products SEO Updated`)
  }

  const handleInlinePriceSave = async (id) => {
    const { error } = await supabase.from('products').update({ price: parseFloat(tempPrice) }).eq('id', id)
    if (!error) { setEditingPrice(null); fetchProducts(); fetchRealSellerScore(); showToast('Price Updated') }
  }

  const handleInlineStockSave = async (id) => {
    const { error } = await supabase.from('products').update({ stock: parseInt(tempStock) }).eq('id', id)
    if (!error) { setEditingStock(null); fetchProducts(); fetchRealSellerScore(); showToast('Stock Updated') }
  }

  const handleCopyLink = (id) => {
    navigator.clipboard.writeText(`${window.location.origin}/product/${id}`)
    showToast('Link Copied')
  }

  const handleDuplicate = async (product) => {
    const { id, created_at,...rest } = product
    const { error } = await supabase.from('products').insert([{...rest, title: rest.title + ' - Copy', views: 0, created_at: new Date().toISOString(), seo_score: 0, status: 'active', viral_score: 0 }])
    if (!error) { fetchProducts(); fetchRealSellerScore(); showToast('Product Duplicated') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) { fetchProducts(); fetchRealSellerScore(); showToast('Product Deleted') }
  }

  const handleBulkDelete = async () => {
    if (selected.length === 0) return alert('Select products!')
    if (!confirm(`${selected.length} products delete?`)) return
    const { error } = await supabase.from('products').delete().in('id', selected)
    if (!error) { setSelected([]); fetchProducts(); fetchRealSellerScore(); showToast('Products Deleted') }
  }

  const handleBulkStockUpdate = async () => {
    if (!bulkStockValue) return alert('Enter stock!')
    const { error } = await supabase.from('products').update({ stock: parseInt(bulkStockValue) }).in('id', selected)
    if (!error) { setSelected([]); setStockModal(false); setBulkStockValue(''); fetchProducts(); fetchRealSellerScore(); showToast(`Stock Updated to ${bulkStockValue}`) }
  }

  const handleBulkPriceUpdate = async () => {
    if (!bulkPriceValue) return alert('Enter price!')
    if (bulkPriceType === 'fixed') {
      const { error } = await supabase.from('products').update({ price: parseFloat(bulkPriceValue) }).in('id', selected)
      if (!error) { setSelected([]); setBulkPriceModal(false); fetchProducts(); showToast(`Price Updated to ${bulkPriceValue}`) }
    } else {
      for (let id of selected) {
        const prod = products.find(p=>p.id===id)
        if (prod) {
          const newPrice = bulkPriceType==='increase'? prod.price * (1+parseFloat(bulkPriceValue)/100) : prod.price * (1-parseFloat(bulkPriceValue)/100)
          await supabase.from('products').update({ price: Math.round(newPrice) }).eq('id', id)
        }
      }
      setSelected([]); setBulkPriceModal(false); fetchProducts(); showToast(`Price ${bulkPriceType} ${bulkPriceValue}%`)
    }
  }

  const handleBoostProduct = async (product) => {
    setBoostModal(product)
    setTimeout(async ()=>{
      await supabase.from('products').update({ views: (product.views||0)+100, boost_active: true, boost_until: new Date(Date.now()+7*24*60*60*1000).toISOString() }).eq('id', product.id)
      fetchProducts()
      showToast('Product Boosted for 7 Days')
    }, 1500)
  }

  const handleAIRewrite = async (product) => {
    setAiProcessing(product.id+'rewrite')
    setTimeout(async ()=>{
      const newTitle = `${product.title} - Premium Quality - Free Delivery`
      await supabase.from('products').update({ title: newTitle, ai_optimized: true }).eq('id', product.id)
      setAiProcessing(null)
      fetchProducts()
      showToast('Title Rewritten')
    }, 2000)
  }

  const handleExport = () => {
    const csv = ['Title,SKU,Price,Special Price,Stock,Category,Brand,Views,SEO Score,Viral Score,Status,Profit,Link'].concat(products.map(p => `"${p.title}","${p.sku||''}",${p.price},${p.special_price||''},${p.stock},${p.category},${p.brand||'Baharaz'},${p.views||0},${p.seo_score||0},${p.viral_score||0},${p.status},${Math.round(p.price*0.4)},${window.location.origin}/product/${p.id}`)).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `baharaz-products-${new Date().toISOString().slice(0,10)}.csv`; a.click()
    showToast('CSV Exported')
  }

  const handleSelectAll = () => {
    if(selected.length===products.length) setSelected([])
    else setSelected(products.map(p=>p.id))
  }

  const totalViral = useMemo(()=> products.filter(p=>p.viral_score>=80).length, [products])
  const topProduct = useMemo(()=> [...products].sort((a,b)=>(b.views||0)-(a.views||0))[0], [products])

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-3 md:p-5 space-y-4">
      {toast && <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-[#212121] text-white px-6 py-3 rounded-full text-[12px] font-bold z-[9999] shadow-xl">{toast}</div>}

      <div className="bg-white rounded-xl p-4 flex flex-wrap justify-between items-center gap-3 shadow-sm border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#F85606] flex items-center justify-center text-white font-black text-[14px]">B</div>
          <div>
            <p className="font-bold text-[15px] text-[#212121]">Manage Products</p>
            <p className="text-[11px] text-gray-500">Baharaz Seller Center</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold">
          <span className="bg-[#FFF0E8] text-[#F85606] border border-[#FFCDB2] px-4 py-2 rounded-full flex items-center gap-1"><Coins size={12}/> ৳{stats.totalValue.toLocaleString()}</span>
          <span className="bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-full">Profit ৳{stats.totalProfit.toLocaleString()}</span>
          <span className="bg-[#212121] text-white px-4 py-2 rounded-full">Avg ৳{stats.avgPrice}</span>
        </div>
      </div>

      {sellerScore.lowStock > 0 && (
        <div className="bg-white border-l-4 border-l-[#F85606] border-y border-r border-gray-200 rounded-xl p-3 flex items-center gap-3 shadow-sm">
          <div className="w-9 h-9 rounded-full bg-[#FFF0E8] text-[#F85606] border border-[#FFCDB2] flex items-center justify-center"><AlertTriangle size={16}/></div>
          <div className="flex-1"><p className="text-[12px] font-bold text-[#212121]">{sellerScore.lowStock} Products Need Restock</p><p className="text-[10px] text-gray-500">Low stock products will be deactivated soon</p></div>
          <button onClick={()=>setFilterStatus('Out of Stock')} className="px-5 py-2 bg-[#F85606] text-white rounded-full text-[11px] font-bold">View</button>
        </div>
      )}

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 lg:col-span-9 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-4 border shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between"><div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Products</p><h2 className="text-[28px] font-black text-[#212121] leading-none mt-1">{sellerScore.products}</h2><p className="text-[10px] mt-2 font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full inline-flex">All Products</p></div><div className="w-11 h-11 rounded-xl bg-gray-50 border flex items-center justify-center"><Package size={20} className="text-[#212121]"/></div></div>
            <div className="mt-3 h-1 bg-gray-100 rounded-full"><div className="h-full bg-[#212121] rounded-full" style={{ width: `${Math.min(sellerScore.products*10,100)}%` }}></div></div>
          </div>
          <div className="bg-white rounded-xl p-4 border shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between"><div><p className="text-[10px] font-bold text-gray-400 uppercase">Total Views</p><h2 className="text-[28px] font-black text-[#212121] leading-none mt-1">{sellerScore.views}</h2><p className="text-[10px] mt-2 font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full inline-flex border border-blue-100"><Eye size={10}/> Views</p></div><div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center"><Eye size={20}/></div></div>
            <div className="mt-3 h-1 bg-gray-100 rounded-full"><div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.min(sellerScore.views/10,100)}%` }}></div></div>
          </div>
          <div className="bg-white rounded-xl p-4 border shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between"><div><p className="text-[10px] font-bold text-gray-400 uppercase">Total Orders</p><h2 className="text-[28px] font-black text-[#212121] leading-none mt-1">{sellerScore.orders}</h2><p className="text-[10px] mt-2 font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full inline-flex border border-violet-100"><Star size={10}/> {sellerScore.rating} Rating</p></div><div className="w-11 h-11 rounded-xl bg-violet-50 border border-violet-100 text-violet-600 flex items-center justify-center"><ShoppingBag size={20}/></div></div>
            <div className="mt-3 h-1 bg-gray-100 rounded-full"><div className="h-full bg-violet-600 rounded-full" style={{ width: `${Math.min(sellerScore.orders*20,100)}%` }}></div></div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-orange-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between"><div><p className="text-[10px] font-bold text-orange-600 uppercase">Top & Low</p><h2 className="text-[28px] font-black text-[#F85606] leading-none mt-1">{totalViral}/{sellerScore.lowStock||0}</h2><p className="text-[10px] mt-2 font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full inline-flex border border-orange-100"><Flame size={10}/> Performance</p></div><div className="w-11 h-11 rounded-xl bg-[#F85606] text-white flex items-center justify-center shadow"><Flame size={20}/></div></div>
            <div className="mt-3 h-1 bg-orange-100 rounded-full"><div className="h-full bg-[#F85606] rounded-full" style={{ width: `${Math.min((sellerScore.lowStock||0)*20,100)}%` }}></div></div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-3 bg-[#212121] rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-[#F85606] text-white flex items-center justify-center"><Crown size={14}/></div><span className="font-bold text-[12px]">Seller Score</span><span className="ml-auto text-[9px] bg-white text-black px-2.5 py-1 rounded-full font-black">{sellerScore.level.toUpperCase()}</span></div>
          <h2 className="text-[38px] font-black leading-none mt-4">{sellerScore.score}<span className="text-[16px] text-white/40">/10</span></h2>
          <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden"><div className="h-full bg-[#F85606] rounded-full" style={{ width: `${sellerScore.score*10}%` }}></div></div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-[10px]"><div className="bg-white/10 rounded-lg p-2.5 border border-white/10"><p className="text-white/50 uppercase text-[8px] font-bold">Products</p><p className="font-bold text-[11px] mt-1">{sellerScore.products} Total</p></div><div className="bg-white/10 rounded-lg p-2.5 border border-white/10"><p className="text-white/50 uppercase text-[8px] font-bold">Active</p><p className="font-bold text-[11px] mt-1">{sellerScore.active} Live</p></div></div>
          <button onClick={fetchRealSellerScore} className="mt-4 w-full h-10 rounded-lg bg-white text-black text-[11px] font-bold flex items-center justify-center gap-2"><RefreshCw size={14}/> Refresh Score</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#212121] flex items-center justify-center text-white"><Bot size={18}/></div>
          <div className="flex-1"><p className="text-[13px] font-bold text-[#212121]">AI Tools - SEO & Marketing</p><p className="text-[11px] text-gray-600 mt-0.5">Optimize SEO, Price, Stock and Boost your products</p></div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={handleBulkFullSEO} disabled={aiProcessing==='bulkseo'} className="px-5 py-2.5 bg-[#212121] text-white rounded-full text-[11px] font-bold flex items-center gap-2 disabled:opacity-50"><Brain size={14}/> Bulk SEO ({selected.length})</button>
            <button onClick={()=>setBulkPriceModal(true)} disabled={selected.length===0} className="px-5 py-2.5 bg-white border border-gray-300 rounded-full text-[11px] font-bold flex items-center gap-2 disabled:opacity-40"><DollarSign size={14}/> Price</button>
            <button onClick={()=>setStockModal(true)} disabled={selected.length===0} className="px-5 py-2.5 bg-white border border-gray-300 rounded-full text-[11px] font-bold flex items-center gap-2 disabled:opacity-40"><Box size={14}/> Stock</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-3 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold text-gray-500 mr-2 whitespace-nowrap">Status:</span>
          {tabs.map(t=>{
            const Icon = t.icon
            return <button key={t.name} onClick={()=>setFilterStatus(t.name)} className={`px-4 py-2 rounded-full text-[11px] font-bold border whitespace-nowrap flex items-center gap-1.5 transition-all ${filterStatus===t.name?'bg-[#212121] text-white border-[#212121] shadow':'bg-white text-gray-700 border-gray-200 hover:border-black'}`}><Icon size={12}/>{t.name}<span className={`px-2 py-0.5 rounded-full text-[9px] ${filterStatus===t.name?'bg-white text-black':'bg-gray-100'}`}>{t.count||0}</span></button>
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl border p-4 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-4 relative"><Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search Title / SKU" className="w-full h-11 pl-11 pr-4 bg-[#f5f5f5] border border-gray-200 rounded-full text-[12px] outline-none focus:bg-white focus:border-black"/></div>
          <select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)} className="lg:col-span-2 h-11 px-4 bg-white border border-gray-200 rounded-full text-[11px] font-bold outline-none"><option value="All">All Category</option><option value="Shirt">Shirt</option><option value="Pant">Pant</option><option value="Panjabi">Panjabi</option><option value="Polo">Polo</option><option value="Hoodie">Hoodie</option><option value="Fashion">Fashion</option></select>
          <select value={brandFilter} onChange={e=>setBrandFilter(e.target.value)} className="lg:col-span-1 h-11 px-3 bg-white border border-gray-200 rounded-full text-[11px] font-bold"><option value="All">Brand</option><option value="Baharaz">Baharaz</option></select>
          <select value={priceFilter} onChange={e=>setPriceFilter(e.target.value)} className="lg:col-span-1 h-11 px-3 bg-white border border-gray-200 rounded-full text-[11px] font-bold"><option value="All">Price</option><option value="0-800">0-800</option><option value="800-1500">800-1500</option><option value="1500+">1500+</option></select>
          <select value={seoFilter} onChange={e=>setSeoFilter(e.target.value)} className="lg:col-span-1 h-11 px-3 bg-white border border-gray-200 rounded-full text-[11px] font-bold"><option value="All">SEO All</option><option value="SEO 100">SEO 100</option><option value="No SEO">No SEO</option></select>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="lg:col-span-2 h-11 px-3 bg-white border border-gray-200 rounded-full text-[11px] font-bold"><option value="newest">Newest</option><option value="price_low">Low Price</option><option value="price_high">High Price</option><option value="views">Most Views</option></select>
          <button onClick={()=>{setSearch(''); setCategoryFilter('All'); setBrandFilter('All'); setPriceFilter('All'); setSeoFilter('All'); setFilterStatus('All'); showToast('Filters Reset')}} className="lg:col-span-1 h-11 bg-black text-white rounded-full text-[11px] font-bold">Reset</button>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[10px] font-bold"><span className="bg-gray-100 px-3 py-1.5 rounded-full border">Show {(currentPage-1)*20+1}-{Math.min(currentPage*20,totalCount)} of {totalCount}</span><span className="bg-[#212121] text-white px-3 py-1.5 rounded-full">Profit ৳{stats.totalProfit.toLocaleString()}</span></div>
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-full p-1 border"><button onClick={()=>setViewMode('list')} className={`w-8 h-8 rounded-full flex items-center justify-center ${viewMode==='list'?'bg-black text-white':'text-gray-500'}`}><Layers size={14}/></button><button onClick={()=>setViewMode('grid')} className={`w-8 h-8 rounded-full flex items-center justify-center ${viewMode==='grid'?'bg-black text-white':'text-gray-500'}`}><PieChart size={14}/></button></div>
            <button onClick={handleExport} className="h-9 w-9 rounded-full bg-white border flex items-center justify-center hover:border-black"><Download size={14}/></button>
            <button onClick={()=>router.push('/seller/products/add')} className="h-9 px-5 rounded-full bg-[#F85606] text-white text-[11px] font-bold flex items-center gap-1.5"><Plus size={12}/> Add Product</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-3 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={selected.length===products.length && products.length>0} onChange={handleSelectAll} className="w-4 h-4" /><span className="text-[12px] font-bold">Select All ({selected.length})</span></label>
          {selected.length>0 && <span className="text-[11px] bg-[#FFF0E8] text-[#F85606] border border-[#FFCDB2] px-3 py-1 rounded-full font-bold">{selected.length} Selected • ৳{products.filter(p=>selected.includes(p.id)).reduce((a,b)=>a+b.price,0).toLocaleString()}</span>}
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={handleBulkFullSEO} disabled={selected.length===0} className="bg-[#212121] disabled:opacity-30 text-white px-4 py-2.5 rounded-full text-[11px] font-bold flex items-center gap-1.5"><Sparkles size={12}/> SEO 100</button>
          <button onClick={()=>setBulkPriceModal(true)} disabled={selected.length===0} className="bg-white border disabled:opacity-30 px-4 py-2.5 rounded-full text-[11px] font-bold flex items-center gap-1.5"><DollarSign size={12}/> Price Update</button>
          <button onClick={()=>setStockModal(true)} disabled={selected.length===0} className="bg-white border disabled:opacity-30 px-4 py-2.5 rounded-full text-[11px] font-bold flex items-center gap-1.5"><Box size={12}/> Stock Update</button>
          <button onClick={handleBulkDelete} disabled={selected.length===0} className="bg-red-600 disabled:opacity-30 text-white px-4 py-2.5 rounded-full text-[11px] font-bold flex items-center gap-1.5"><Trash2 size={12}/> Delete</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b bg-[#fafafa] flex items-center justify-between">
          <div className="flex items-center gap-3"><Layers size={16}/><span className="text-[12px] font-bold">Products</span>{selected.length>0 && <span className="text-[10px] bg-black text-white px-3 py-1 rounded-full font-bold">{selected.length} Selected</span>}{topProduct && <span className="text-[9px] bg-[#F85606] text-white px-2.5 py-1 rounded-full font-bold flex items-center gap-1"><Crown size={10}/> TOP: {topProduct.title.slice(0,15)}</span>}</div>
        </div>

        {loading? (
          <div className="p-20 text-center"><div className="w-10 h-10 border-4 border-[#F85606] border-t-transparent rounded-full animate-spin mx-auto"></div><p className="text-[12px] font-bold mt-4">Loading Products...</p></div>
        ) : products.length===0? (
          <div className="p-14 text-center"><div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-5"><Package size={28} className="text-gray-500"/></div><h3 className="text-[16px] font-bold">No Products Found</h3><button onClick={()=>router.push('/seller/products/add')} className="mt-5 px-6 py-3 bg-[#F85606] text-white rounded-full text-[12px] font-bold flex items-center gap-2 mx-auto"><Plus size={14}/> Add Product</button></div>
        ) : viewMode==='grid'? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 p-4">
            {products.map((p)=>(
              <div key={p.id} className="border rounded-xl overflow-hidden hover:shadow-lg hover:border-black transition-all bg-white group">
                <div className="aspect-square bg-gray-100 relative overflow-hidden"><img src={p.image || p.images?.[0] || 'https://via.placeholder.com/100'} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt=""/><div className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full border-2 border-white ${p.stock===0?'bg-red-500':p.stock<5?'bg-yellow-500':'bg-green-500'}`}></div>{p.id===topProduct?.id && <div className="absolute top-2 left-2 bg-[#F85606] text-white text-[8px] px-2 py-0.5 rounded-full font-bold">TOP</div>}</div>
                <div className="p-3"><p className="text-[12px] font-bold line-clamp-2 leading-tight">{p.title}</p><p className="text-[13px] font-black text-[#F85606] mt-1">৳{p.price}</p><p className="text-[10px] text-gray-500 mt-1">{p.stock} Stock • {p.views||0} Views • Profit ৳{Math.round(p.price*0.4)}</p></div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div className="divide-y">
              {products.map((p)=>{
                const isTop = topProduct?.id === p.id
                return (
                <div key={p.id} className={`p-4 hover:bg-gray-50 flex items-center gap-4 group ${isTop? 'bg-[#FFF8F0]' : ''}`}>
                  <button onClick={()=>setSelected(prev=>prev.includes(p.id)? prev.filter(x=>x!==p.id) : [...prev, p.id])} className={`w-5 h-5 rounded border-2 flex items-center justify-center ${selected.includes(p.id)?'bg-[#F85606] border-[#F85606]':'border-gray-300 bg-white hover:border-black'}`}>{selected.includes(p.id) && <CheckSquare size={12} className="text-white"/>}</button>
                  <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden border relative"><img src={p.image || p.images?.[0] || 'https://via.placeholder.com/100'} className="w-full h-full object-cover" alt=""/><div className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full border-2 border-white ${p.stock===0?'bg-red-500':p.stock<5?'bg-yellow-500':'bg-green-500'}`}></div>{isTop && <div className="absolute -top-1 -left-1 bg-[#F85606] text-white text-[7px] px-1 py-0.5 rounded-full font-bold">TOP</div>}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap"><h3 className="text-[13px] font-bold truncate max-w-[320px]">{p.title}</h3>{p.seo_score===100 && <span className="text-[8px] bg-green-600 text-white px-2 py-0.5 rounded-full font-bold">SEO 100</span>}<span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${p.status==='active'?'bg-green-50 text-green-700 border-green-200':'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>{p.status}</span><span className="text-[9px] bg-gray-100 px-2 py-0.5 rounded-full font-mono border flex items-center gap-1">{p.sku||'SKU'} <button onClick={()=>{navigator.clipboard.writeText(p.sku||''); showToast('SKU Copied')}} className="hover:text-black"><Copy size={8}/></button></span></div>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {editingPrice===p.id? (
                        <div className="flex items-center gap-1"><input value={tempPrice} onChange={e=>setTempPrice(e.target.value)} className="w-20 h-7 px-2 border-2 border-black rounded-lg text-[12px] font-bold outline-none"/><button onClick={()=>handleInlinePriceSave(p.id)} className="w-7 h-7 bg-black text-white rounded-lg flex items-center justify-center"><Save size={12}/></button><button onClick={()=>setEditingPrice(null)} className="w-7 h-7 bg-gray-200 rounded-lg flex items-center justify-center"><X size={12}/></button></div>
                      ) : (
                        <span onClick={()=>{ setEditingPrice(p.id); setTempPrice(p.price) }} className="text-[13px] font-black text-[#F85606] cursor-pointer hover:underline">৳{p.price||0} <span className="text-[9px] bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded-full">+40% Profit</span></span>
                      )}
                      {editingStock===p.id? (
                        <div className="flex items-center gap-1"><input value={tempStock} onChange={e=>setTempStock(e.target.value)} className="w-16 h-7 px-2 border-2 border-black rounded-lg text-[11px] font-bold outline-none"/><button onClick={()=>handleInlineStockSave(p.id)} className="w-7 h-7 bg-black text-white rounded-lg flex items-center justify-center"><Save size={12}/></button><button onClick={()=>setEditingStock(null)} className="w-7 h-7 bg-gray-200 rounded-lg flex items-center justify-center"><X size={12}/></button></div>
                      ) : (
                        <span onClick={()=>{ setEditingStock(p.id); setTempStock(p.stock) }} className={`text-[10px] px-2.5 py-1 rounded-full border font-bold cursor-pointer ${p.stock===0?'bg-red-50 text-red-700 border-red-200':p.stock<5?'bg-yellow-50 text-yellow-700 border-yellow-200':'bg-green-50 text-green-700 border-green-200'}`}>{p.stock||0} Stock</span>
                      )}
                      <span className="text-[10px] text-gray-600 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full border"><Eye size={12}/> {p.views||0}</span><span className="text-[10px] flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200"><Star size={10} className="fill-yellow-400 text-yellow-400"/> {p.rating||4.8}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={()=>handleGenerateFullSEO(p)} disabled={aiProcessing===p.id+'seo'} className="h-8 px-3 rounded-full bg-black text-white text-[10px] font-bold flex items-center gap-1 disabled:opacity-50"><Globe size={10}/> SEO</button>
                    <button onClick={()=>handleCopyLink(p.id)} className="w-8 h-8 rounded-full bg-white border flex items-center justify-center hover:bg-black hover:text-white transition-all"><Copy size={12}/></button>
                    <button onClick={()=>handleDuplicate(p)} className="w-8 h-8 rounded-full bg-white border flex items-center justify-center hover:bg-black hover:text-white transition-all"><CopyPlus size={12}/></button>
                    <button onClick={()=>router.push(`/product/${p.id}`)} className="w-8 h-8 rounded-full bg-white border flex items-center justify-center hover:bg-black hover:text-white transition-all"><ExternalLink size={12}/></button>
                    <button onClick={()=>router.push(`/seller/products/edit/${p.id}`)} className="w-8 h-8 rounded-full bg-white border flex items-center justify-center hover:bg-[#F85606] hover:text-white transition-all"><Edit3 size={12}/></button>
                    <button onClick={()=>handleDelete(p.id)} className="w-8 h-8 rounded-full bg-white border flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"><Trash2 size={12}/></button>
                  </div>
                </div>
                )
              })}
            </div>
            <div className="px-5 py-4 bg-[#fafafa] border-t flex flex-col lg:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[11px] font-bold">{currentPage}</div><p className="text-[11px] font-bold">Page {currentPage} of {totalPages||1} • {totalCount} Products</p></div>
              <div className="flex items-center gap-2">
                <button disabled={currentPage===1} onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} className="h-9 px-4 rounded-full bg-white border text-[11px] font-bold flex items-center gap-1 disabled:opacity-40"><ChevronLeft size={14}/> Prev</button>
                <div className="flex items-center gap-1">{Array.from({length: Math.min(5,totalPages||1)}, (_,i)=>{ const pageNum = currentPage<=3? i+1 : currentPage>=totalPages-2? totalPages-4+i : currentPage-2+i; if(pageNum<1||pageNum>totalPages) return null; return <button key={pageNum} onClick={()=>setCurrentPage(pageNum)} className={`w-9 h-9 rounded-full text-[11px] font-bold border ${currentPage===pageNum?'bg-black text-white border-black':'bg-white border-gray-300'}`}>{pageNum}</button> })}</div>
                <button disabled={currentPage===totalPages||totalPages===0} onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} className="h-9 px-4 rounded-full bg-white border text-[11px] font-bold flex items-center gap-1 disabled:opacity-40">Next <ChevronRight size={14}/></button>
              </div>
            </div>
          </div>
        )}
      </div>

      {stockModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-[400px] w-full p-6 border shadow-2xl"><div className="flex items-center justify-between mb-4"><h3 className="font-bold text-[14px] flex items-center gap-2"><Box size={16}/> Bulk Stock Update</h3><button onClick={()=>setStockModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X size={14}/></button></div><input value={bulkStockValue} onChange={e=>setBulkStockValue(e.target.value)} type="number" placeholder="Ex: 100" className="w-full h-11 px-4 border-2 rounded-xl text-[13px] font-bold outline-none focus:border-black" /><div className="flex gap-2 mt-4"><button onClick={()=>setStockModal(false)} className="flex-1 h-11 rounded-xl border-2 font-bold text-[12px]">Cancel</button><button onClick={handleBulkStockUpdate} className="flex-1 h-11 rounded-xl bg-[#F85606] text-white font-bold text-[12px]">Update Stock</button></div></div>
        </div>
      )}

      {bulkPriceModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-[420px] w-full p-6 border shadow-2xl"><div className="flex items-center justify-between mb-4"><h3 className="font-bold text-[14px]">Bulk Price Update</h3><button onClick={()=>setBulkPriceModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X size={14}/></button></div><div className="flex gap-2 mb-3">{['fixed','increase','decrease'].map(t=><button key={t} onClick={()=>setBulkPriceType(t)} className={`flex-1 h-10 rounded-xl text-[11px] font-black border-2 ${bulkPriceType===t?'bg-black text-white border-black':'bg-white border-gray-200'}`}>{t.toUpperCase()}</button>)}</div><input value={bulkPriceValue} onChange={e=>setBulkPriceValue(e.target.value)} type="number" placeholder={bulkPriceType==='fixed'?'Ex: 799':'Ex: 10 (%)'} className="w-full h-11 px-4 border-2 rounded-xl text-[13px] font-bold outline-none focus:border-black" /><div className="flex gap-2 mt-4"><button onClick={()=>setBulkPriceModal(false)} className="flex-1 h-11 rounded-xl border-2 font-bold text-[12px]">Cancel</button><button onClick={handleBulkPriceUpdate} className="flex-1 h-11 rounded-xl bg-black text-white font-bold text-[12px]">Update Price</button></div></div>
        </div>
      )}

      {seoModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-[700px] w-full max-h-[90vh] overflow-y-auto border shadow-2xl">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white"><p className="text-[14px] font-black">SEO Details</p><button onClick={()=>setSeoModal(null)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"><X size={16}/></button></div>
            <div className="p-6 space-y-4">
              <div className="bg-[#FFF0E8] border border-[#FFCDB2] rounded-xl p-4"><p className="text-[11px] font-bold text-[#F85606]">Google SEO</p><p className="text-[12px] font-bold mt-1">{seoModal.seoTitle}</p><p className="text-[11px] text-gray-600 mt-2">{seoModal.seoDesc}</p></div>
              <button onClick={()=>setSeoModal(null)} className="w-full h-11 rounded-xl bg-[#F85606] text-white font-bold text-[13px]">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}