"use client";

import { useState, useEffect } from "react";

export default function AnnouncementBar({ store }) {
  const [isVisible, setIsVisible] = useState(true);

  const announcement = store?.announcement || store?.offer_text || "🎉 Free Delivery All Over Bangladesh On Order Over 1000TK - Cash On Delivery Available!";

  if (!isVisible ||!announcement) return null;

  return (
    <div className="w-full bg-slate-900 text-white relative overflow-hidden group">
      {/* Moving Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 opacity-90"></div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)] animate-[slide_2s_infinite]"></div>

      <div className="relative max-w-[1300px] mx-auto px-4 py-2.5 flex items-center justify-center gap-3">
        {/* Animated Dot */}
        <span className="hidden sm:flex w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)] shrink-0"></span>

        {/* Text - Scrolling on Mobile */}
        <div className="flex-1 md:flex-none overflow-hidden">
          <p className="text-[11px] md:text-[12px] font-bold tracking-wide text-center whitespace-nowrap md:whitespace-normal animate-[marquee_15s_linear_infinite] md:animate-none">
            <span className="inline-flex items-center gap-2">
              <span className="text-[12px]">🔥</span>
              {announcement}
              <span className="hidden md:inline-flex items-center gap-2 ml-3 bg-white/10 border border-white/20 text-white text-[10px] px-3 py-1 rounded-full font-black">
                LIMITED TIME OFFER
              </span>
            </span>
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="w-6 h-6 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full flex items-center justify-center text-[10px] shrink-0 transition-all active:scale-90"
        >
          ✕
        </button>
      </div>

      <style jsx>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}