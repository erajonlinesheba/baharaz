"use client";
import { useState, useEffect } from "react";

const banners = [
  { id: 1, image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=400&fit=crop&q=80&auto=format", title: "Fashion Fest", subtitle: "Up to 70% OFF", bg: "linear-gradient(135deg, #FF6B9D, #FF8A00)" },
  { id: 2, image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop&q=80&auto=format", title: "Flash Sale", subtitle: "Live Now", bg: "linear-gradient(135deg, #667EEA, #764BA2)" },
  { id: 3, image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=400&fit=crop&q=80&auto=format", title: "Mega Deal", subtitle: "Today Only", bg: "linear-gradient(135deg, #F093FB, #F5576C)" },
];

export default function Banner() {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const b = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(b);
  }, []);

  return (
    <div className="w-full relative overflow-hidden h-[200px] min-[400px]:h-[210px] max-[360px]:h-[185px]" style={{ aspectRatio: '720 / 360' }}>
      {/* SEO Friendly - img alt + width height + Zero Second Load */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {banners.map((banner, idx) => (
          <div key={banner.id} className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${idx === currentBanner ? 'opacity-100' : 'opacity-0'}`} style={{ background: banner.bg }}>
            <img 
              src={banner.image} 
              alt={`${banner.title} - ${banner.subtitle} - Baharaz Best Online Shopping BD`}
              className="w-full h-full object-cover object-center" 
              width="720" 
              height="360"
              loading={idx === 0 ? "eager" : "lazy"}
              fetchPriority={idx === 0 ? "high" : "low"}
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70"></div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 px-3.5 pb-3 pt-12" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)' }}>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-white text-[18px] font-[900] leading-none">Fashion Fest</h1>
            <p className="text-white/90 text-[11px] font-[600] mt-1">Up to 70% OFF</p>
            <div className="flex gap-1.5 mt-2">
              {banners.map((_, idx) => (
                <span key={idx} className={`h-1 rounded-full transition-all ${idx === currentBanner ? 'w-4 bg-white' : 'w-1 bg-white/60'}`}></span>
              ))}
            </div>
          </div>
          <button aria-label="Shop Now Baharaz" className="bg-white text-black text-[11px] font-[700] px-3.5 py-1.5 rounded-full shadow-md active:scale-95">Shop Now ›</button>
        </div>
      </div>
    </div>
  );
}