"use client";

export default function CategoryChips({ categories = [], active, setActive }) {
  if (!categories || categories.length <= 1) return null;

  return (
    <div className="bg-white rounded-[14px] border border-slate-200 shadow-sm p-2.5 md:p-3">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 md:pb-0">
        <span className="text-[11px] font-black text-slate-500 tracking-widest shrink-0 mr-1 hidden md:block">
          FILTER:
        </span>

        {categories.map((cat) => {
          const isActive = active === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                if (typeof setActive === "function") setActive(cat);
              }}
              className={`shrink-0 px-4 md:px-5 py-2 rounded-full text-[12px] font-bold tracking-wide border transition-all duration-200 active:scale-95 flex items-center gap-1.5
                ${
                  isActive
                   ? "bg-slate-900 text-white border-slate-900 shadow-[0_4px_12px_rgba(0,0,0,0.15)] scale-[1.02]"
                    : "bg-[#f8fafc] text-slate-600 border-slate-200 hover:bg-white hover:border-slate-300 hover:text-slate-900 hover:shadow-sm"
                }`}
            >
              {isActive && (
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              )}
              {cat}
            </button>
          );
        })}

        <div className="ml-auto pl-3 hidden md:flex items-center gap-1.5 text-[10px] text-slate-400 font-bold shrink-0 border-l border-slate-200">
          <span className="w-5 h-5 bg-[#f8fafc] border border-slate-200 rounded-full flex items-center justify-center text-[10px]">
            ↕️
          </span>
          Scroll
        </div>
      </div>

      <style jsx>{`
       .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
       .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}