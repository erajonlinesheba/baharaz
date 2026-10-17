"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/product/ProductCard";
import { searchProducts as algoliaSearch } from "@/lib/algolia";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [hits, setHits] = useState([]);
  const [loading, setLoading] = useState(false);

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
           .limit(20);

          if (!error && data) {
            // Supabase Data কে Algolia Format এ Convert
            results = data.map(p => ({
             ...p,
              objectID: p.id,
              image: p.thumbnail || p.images?.[0] || '/placeholder.png'
            }));
          }
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
  }, [q]);

  return (
    <div className="max-w-[1200px] mx-auto px-3 py-5 min-h-[60vh]">
      <h1 className="text-[16px] md:text-[18px] font-bold mb-1">Search: {q} - {hits.length} products found</h1>
      <p className="text-[12px] text-[#666] mb-4">{loading? 'Searching...' : `${hits.length} products found`}</p>

      {loading? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-[10px] h-[220px] animate-pulse border" />
          ))}
        </div>
      ) : hits.length > 0? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {hits.map(hit => <ProductCard key={hit.objectID || hit.id} product={hit} />)}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border">
          <p className="text-[40px]">🔍</p>
          <p className="font-bold text-[#333] mt-2">No products found for "{q}"</p>
          <p className="text-[12px] text-[#999] mt-1">Try different keywords like fan, mobile</p>
        </div>
      )}
    </div>
  );
}