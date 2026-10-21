"use client";
import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/product/ProductCard";
import { searchProducts as algoliaSearch } from "@/lib/algolia";
import { Search, Clock, TrendingUp, SlidersHorizontal, Grid3X3, List, X } from "lucide-react";

// ✅ Inner Content - Main Logic
function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';
  const sortBy = searchParams.get('sort') || 'relevance';
  
  const [hits, setHits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilter, setShowFilter] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [recentSearches, setRecentSearches] = useState([]);

  const trendingSearches = ["iPhone 15", "Saree", "Fan", "Watch", "Shoes", "Headphone"];

  // ✅ Recent Search Load
  useEffect(() => {
    const saved = localStorage.getItem('baharaz_recent_search');
    if (saved) {
      try { setRecentSearches(JSON.parse(saved)); } catch {}
    }
  }, []);

  // ✅ Save Recent Search
  useEffect(() => {
    if (q && q.length > 1) {
      const updated = [q, ...recentSearches.filter(s => s !== q)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('baharaz_recent_search', JSON.stringify(updated));
    }
  }, [q]);

  useEffect(() => {
    if (!q) {
      setHits([]);
      return;
    }

    const doSearch = async () => {
      setLoading(true);
      try {
        // 1. প্রথমে Algolia Try করো
        let results = await algoliaSearch(q);

        // 2. Algolia তে 0 হলে Supabase থেকে Direct Search - 100% কাজ করবে!
        if (!results || results.length === 0) {
          const { data, error } = await supabase
           .from('products')
           .select('*')
           .ilike('name', `%${q}%`)
           .limit(30);

          if (!error && data) {
            // Supabase Data কে Algolia Format এ Convert
            results = data.map(p => ({
             ...p,
              objectID: p.id,
              image: p.thumbnail || p.images?.[0] || '/placeholder.png'
            }));
          }
        }

        // ✅ Filter by Category if needed
        if (category !== 'all' && results) {
          results = results.filter(p => 
            p.category?.toLowerCase().includes(category.toLowerCase()) ||
            p.name?.toLowerCase().includes(category.toLowerCase())
          );
        }

        // ✅ Filter by Price
        if (results) {
          results = results.filter(p => {
            const price = p.price || p.sale_price || 0;
            return price >= priceRange[0] && price <= priceRange[1];
          });
        }

        // ✅ Sort
        if (results) {
          if (sortBy === 'price_low') results.sort((a,b) => (a.price||0) - (b.price||0));
          if (sortBy === 'price_high') results.sort((a,b) => (b.price||0) - (a.price||0));
          if (sortBy === 'newest') results.sort((a,b) => new Date(b.created_at||0) - new Date(a.created_at||0));
        }

        setHits(results || []);
      } catch (e) {
        console.log('Search Error:', e);
        setHits([]);
      } finally {
        setLoading(false);
      }
    };

    doSearch();
  }, [q, category, sortBy, priceRange]);

  const clearSearch = () => {
    router.push('/search');
  };

  const handleTrendingClick = (term) => {
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="w-full min-h-screen bg-[#f5f3f0] md:bg-[#f5f5f7]">
      <div className="max-w-[1200px] mx-auto px-0 md:px-3 py-0 md:py-5 min-h-[60vh]">
        
        {/* ✅ Header - iOS 26 Glass */}
        <div className="sticky top-0 z-20 bg-white/80 md:bg-white/75 backdrop-blur-[20px] md:rounded-[20px] border-b md:border border-white/80 md:shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-3 md:p-4 mb-0 md:mb-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <h1 className="text-[16px] md:text-[20px] font-black tracking-tight flex items-center gap-2">
                <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center"><Search size={14}/></span>
                {q ? `"${q}"` : 'Search Products'} 
                <span className="text-[12px] font-bold bg-[#f5f5f7] px-3 py-1 rounded-full border">{hits.length} found</span>
              </h1>
              <p className="text-[11px] md:text-[12px] text-[#666] mt-1 ml-10">
                {loading? (
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin"></span> Searching in 12M+ products...</span>
                ) : (
                  `${hits.length} products found ${q? `for "${q}"` : ''} • Zero Second Fast`
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button onClick={() => setViewMode(viewMode==='grid'?'list':'grid')} className="w-9 h-9 bg-[#f5f5f7] hover:bg-black hover:text-white rounded-full flex items-center justify-center transition border">
                {viewMode==='grid'? <List size={16}/> : <Grid3X3 size={16}/>}
              </button>
              <button onClick={() => setShowFilter(!showFilter)} className={`h-9 px-4 rounded-full flex items-center gap-1.5 text-[12px] font-black border transition ${showFilter?'bg-black text-white':'bg-white hover:bg-black hover:text-white'}`}>
                <SlidersHorizontal size={14}/> Filter
              </button>
              {q && <button onClick={clearSearch} className="w-9 h-9 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 rounded-full flex items-center justify-center transition border"><X size={16}/></button>}
            </div>
          </div>

          {/* ✅ Filters - New Future */}
          {showFilter && (
            <div className="mt-4 p-4 bg-[#f9f9f9] rounded-[16px] border grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in">
              <div>
                <label className="text-[10px] font-black tracking-widest uppercase">Category</label>
                <select value={category} onChange={(e)=>router.push(`/search?q=${q}&category=${e.target.value}`)} className="w-full mt-1.5 px-3 py-2.5 bg-white border rounded-full text-[13px] font-bold outline-none">
                  <option value="all">All Categories</option>
                  <option value="mobile">Mobile</option>
                  <option value="fashion">Fashion</option>
                  <option value="electronics">Electronics</option>
                  <option value="home">Home & Living</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black tracking-widest uppercase">Sort By</label>
                <select value={sortBy} onChange={(e)=>router.push(`/search?q=${q}&sort=${e.target.value}`)} className="w-full mt-1.5 px-3 py-2.5 bg-white border rounded-full text-[13px] font-bold outline-none">
                  <option value="relevance">Relevance</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black tracking-widest uppercase">Price Range: ৳{priceRange[0]} - ৳{priceRange[1]}</label>
                <input type="range" min="0" max="50000" step="500" value={priceRange[1]} onChange={(e)=>setPriceRange([0, parseInt(e.target.value)])} className="w-full mt-3 accent-black"/>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 md:p-0">
          {/* ✅ No Query - Show Trending & Recent */}
          {!q && (
            <div className="space-y-4">
              {recentSearches.length > 0 && (
                <div className="bg-white rounded-[20px] p-4 border shadow-sm">
                  <h3 className="text-[12px] font-black uppercase tracking-widest flex items-center gap-1.5 mb-3"><Clock size={12}/> Recent Searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((s,i)=>(
                      <button key={i} onClick={()=>handleTrendingClick(s)} className="px-4 py-2 bg-[#f5f5f7] hover:bg-black hover:text-white rounded-full text-[12px] font-bold border transition">{s}</button>
                    ))}
                  </div>
                </div>
              )}
              <div className="bg-white rounded-[20px] p-4 border shadow-sm">
                <h3 className="text-[12px] font-black uppercase tracking-widest flex items-center gap-1.5 mb-3"><TrendingUp size={12}/> Trending Searches in Bangladesh</h3>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((t,i)=>(
                    <button key={i} onClick={()=>handleTrendingClick(t)} className="px-4 py-2 bg-gradient-to-r from-[#f57224]/10 to-[#ff8a00]/10 hover:from-black hover:to-black hover:text-white rounded-full text-[12px] font-bold border border-orange-100 transition">{t}</button>
                  ))}
                </div>
              </div>
              <div className="text-center py-20 bg-white rounded-[20px] border">
                <p className="text-[50px]">🔍</p>
                <p className="font-black text-[18px] mt-3">Search 12M+ Products</p>
                <p className="text-[12px] text-[#999] mt-1">Type anything - Mobile, Saree, Fan, Watch</p>
              </div>
            </div>
          )}

          {/* ✅ Results */}
          {q && (
            <>
              {loading? (
                <div className={viewMode==='grid'?"grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3":"space-y-3"}>
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="bg-white rounded-[16px] h-[260px] animate-pulse border p-2">
                      <div className="bg-[#f5f5f7] rounded-[12px] h-[160px]"></div>
                      <div className="h-3 bg-[#f5f5f7] rounded-full mt-3 w-3/4"></div>
                      <div className="h-4 bg-[#f5f5f7] rounded-full mt-2 w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : hits.length > 0? (
                <div className={viewMode==='grid'?"grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3":"grid grid-cols-1 gap-3"}>
                  {hits.map(hit => <ProductCard key={hit.objectID || hit.id} product={hit} />)}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-[20px] border shadow-sm">
                  <p className="text-[50px]">😕</p>
                  <p className="font-black text-[16px] text-[#333] mt-3">No products found for "{q}"</p>
                  <p className="text-[12px] text-[#999] mt-1">Try different keywords like fan, mobile, saree</p>
                  <div className="mt-6 flex flex-wrap gap-2 justify-center">
                    {trendingSearches.slice(0,4).map((t,i)=>(
                      <button key={i} onClick={()=>handleTrendingClick(t)} className="px-4 py-2 bg-black text-white rounded-full text-[12px] font-bold">Try {t}</button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ✅ Fix: Suspense Boundary - Build Error ঠিক হবে + Fast Load
function SearchSkeleton() {
  return (
    <div className="max-w-[1200px] mx-auto p-4">
      <div className="h-[80px] bg-white rounded-[20px] animate-pulse border mb-4"></div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[...Array(10)].map((_,i)=><div key={i} className="h-[220px] bg-white rounded-[16px] animate-pulse border"></div>)}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchPageContent />
    </Suspense>
  );
}