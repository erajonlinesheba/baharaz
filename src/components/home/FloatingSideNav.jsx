"use client";
import { useEffect, useState, useCallback } from "react";

export default function FloatingSideNav() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if(!ticking){
        window.requestAnimationFrame(()=>{
          setShow(window.scrollY > 600)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = useCallback((id)=>{
    if(id === "top"){
      window.scrollTo({ top: 0, behavior: "smooth" })
    }else{
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    }
  },[])

  if (!show) return null;

  const items = [
    { id: "top", label: "Back to Top" },
    { id: "flash-sale", label: "Flash Sale" },
    { id: "categories", label: "Categories" },
    { id: "just-for-you", label: "Just For You" },
  ];

  return (
    <div className="hidden xl:flex fixed left-[calc((100vw-1188px)/2-50px)] bottom-[140px] z-[99] flex-col bg-white border border-[#eaeaea] shadow-[0_8px_24px_rgba(0,0,0,0.10)] rounded-[10px] w-[38px] overflow-visible">
      {items.map((item) => (
        <div key={item.id} className="group relative w-full">
          <div className="absolute left-[48px] top-1/2 -translate-y-1/2 bg-white border border-gray-200 text-[#212121] text-[12px] font-medium px-3 py-[5px] rounded-[4px] shadow-[0_2px_10px_rgba(0,0,0,0.15)] whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-x-[-8px] group-hover:translate-x-0 transition-all duration-200 z-[100] pointer-events-none">
            {item.label}
            <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-2 h-2 bg-white border-l border-b border-gray-200 rotate-45"></div>
          </div>

          {item.id === "top"? (
            <button
              onClick={() => scrollTo("top")}
              className="w-[38px] h-[38px] flex items-center justify-center bg-[#2e3346] rounded-t-[10px] text-white hover:bg-black transition-colors"
              aria-label="Back to top"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="m18 15-6-6-6 6"/></svg>
            </button>
          ) : (
            <button
              onClick={() => scrollTo(item.id)}
              className={`w-[38px] h-[38px] flex items-center justify-center border-t border-[#f0f0f0] transition-all duration-200 last:rounded-b-[10px]
                ${item.id==="flash-sale" ? "bg-[#fff1eb] text-[#f85606] hover:bg-[#ff3d00] hover:text-white" : ""}
                ${item.id==="categories" ? "bg-[#f3f0ff] text-[#7c4dff] hover:bg-[#7c4dff] hover:text-white" : ""}
                ${item.id==="just-for-you" ? "bg-[#e8f5e9] text-[#00c853] hover:bg-[#00c853] hover:text-white" : ""}
              `}
            >
              {item.id === "flash-sale" && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>}
              {item.id === "categories" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>}
              {item.id === "just-for-you" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}