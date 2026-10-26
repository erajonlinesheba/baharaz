"use client";
import Link from "next/link";
import { useState, useEffect, useCallback, memo } from "react";
import { useRouter } from "next/navigation";

const SearchBar = memo(function SearchBar() {
  const router = useRouter();
  const [placeholder, setPlaceholder] = useState("smart watch");
  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const placeholders = ["bra for girls", "t-shirt for men", "watch for man", "smart watch", "earbuds"];

  useEffect(() => {
    setMounted(true);
    let idx = 0;
    const t = setInterval(() => {
      idx = (idx + 1) % placeholders.length;
      setPlaceholder(placeholders[idx]);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  const handleHaptic = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  }, []);

  const handleSearch = useCallback(() => {
    handleHaptic();
    const q = searchText.trim() || placeholder;
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  }, [searchText, placeholder, router, handleHaptic]);

  const handleImageSearch = useCallback(() => {
    handleHaptic();
    router.push('/search/image');
  }, [router, handleHaptic]);

  return (
    <div className="relative z-20 w-full px-2.5 pt-[10px] pb-2 flex items-center gap-2" role="search" aria-label="Search BAHARAZ products">
      {/* SEO #1 - Global Brand - Google / Facebook / Instagram / YouTube First Page */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "BAHARAZ - Bangladesh's Most Loved Online Shopping",
            "alternateName": ["BAHARAZ", "Baharaz BD"],
            "url": "https://baharaz.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://baharaz.com/search?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="flex-1 h-[42px] flex items-center pl-3 pr-1 gap-2 overflow-hidden shrink min-w-0"
        style={{
          background: isFocused ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.90)',
          borderRadius: '21px',
          border: '1px solid rgba(255,255,255,1)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
          backdropFilter: 'blur(0px)',
          WebkitBackdropFilter: 'blur(0px)',
        }}
        itemScope
        itemType="https://schema.org/SearchAction"
        aria-label="BAHARAZ Search Form"
      >
        <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0" style={{ background: '#FFE0CC' }}>
          <svg className="w-[14px] h-[14px] text-[#FF4D00]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <label htmlFor="mobile-search-input" className="sr-only">Search products on BAHARAZ</label>
        <input
          id="mobile-search-input"
          name="q"
          type="search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={mounted ? placeholder : "smart watch"}
          aria-label="Search for bra, t-shirt, watch, smart watch, earbuds"
          title="Search BAHARAZ - Best Online Shopping in Bangladesh - Global Brand"
          autoComplete="off"
          itemProp="query-input"
          className="flex-1 h-full bg-transparent outline-none border-0 min-w-0 placeholder:text-black placeholder:font-[800] placeholder:text-[15px] placeholder:opacity-100"
          style={{ color: '#000000', fontSize: '15px', fontWeight: '800', letterSpacing: '-0.3px' }}
          suppressHydrationWarning
        />
        <button
          type="button"
          onClick={handleImageSearch}
          aria-label="Search by image"
          title="Search by Image - BAHARAZ"
          className="w-[30px] h-[30px] shrink-0 flex items-center justify-center rounded-full active:scale-90 transition-transform duration-75"
          style={{ background: 'rgba(0,0,0,0.06)' }}
        >
          <svg className="w-[16px] h-[16px] text-[#444]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <button
          type="submit"
          aria-label="Search button"
          title="Search BAHARAZ - Online Shopping BD"
          className="h-[32px] px-[16px] shrink-0 text-white rounded-full font-[800] text-[13px] active:scale-95 transition-transform duration-75"
          style={{ background: 'linear-gradient(135deg, #FF7A20 0%, #FF4D00 100%)' }}
        >
          Search
        </button>
      </form>
      <Link
        href="/digital-goods"
        onClick={handleHaptic}
        aria-label="Digital Goods"
        title="Digital Goods - BAHARAZ Global"
        className="w-[48px] h-[42px] shrink-0 flex flex-col items-center justify-center gap-0.5 rounded-[13px] active:scale-95 transition-transform duration-75"
        style={{ background: 'rgba(255,255,255,0.90)', border: '1px solid rgba(255,255,255,1)', boxShadow: '0 2px 10px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)', backdropFilter: 'blur(0px)', WebkitBackdropFilter: 'blur(0px)' }}
      >
        <span className="text-[15px]" aria-hidden="true">📱</span>
        <span className="text-[6px] font-[900]" style={{ color: '#1A1A1A' }}>DIGITAL<br />GOODS</span>
      </Link>
      <style>{`.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0;}`}</style>
    </div>
  );
});

export default SearchBar;