"use client";
import Link from "next/link";

export default function OwnerBar({ store, isOwner = false }) {
  if (!isOwner) return null;

  const realName = store?.shop_name || store?.name || "My Store";
  const realSlug = store?.shop_slug || store?.slug || "";
  const realLogo = store?.shop_logo || store?.logo_url || store?.logo;

  return (
    <div className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 border-b border-amber-500/30 relative overflow-hidden rounded-[12px] md:rounded-[14px]">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-[shine_3s_infinite]"></div>

      <div className="max-w-[1300px] mx-auto px-4 py-2.5 relative flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-black text-amber-400 rounded-full flex items-center justify-center text-[12px] font-black shadow-sm">
            👑
          </div>
          <div className="flex items-center gap-2">
            <p className="text-[12px] font-black text-black tracking-wide">
              OWNER MODE - {realName}
            </p>
            <span className="w-1 h-1 bg-black/30 rounded-full"></span>
            <p className="text-[11px] font-bold text-black/80">
              {realSlug}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 bg-black text-white text-[10px] px-3 py-1.5 rounded-full font-black tracking-wide shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            LIVE PREVIEW - {realName}
          </div>

          <Link
            href="/seller/store"
            className="flex-1 sm:flex-none px-4 py-1.5 bg-black hover:bg-slate-900 text-white rounded-full text-[11px] font-black text-center shadow-[0_2px_8px_rgba(0,0,0,0.2)] transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            ⚙️ Dashboard
          </Link>

          <Link
            href={`/store/${realSlug}`}
            target="_blank"
            className="flex-1 sm:flex-none px-4 py-1.5 bg-white hover:bg-slate-50 text-black border border-black/10 rounded-full text-[11px] font-black text-center shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            👁️ View Store
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
      `}</style>
    </div>
  );
}