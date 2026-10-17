"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "../layout";

const menuGroups = [
  {
    title: "STORE MANAGEMENT",
    items: [
      { path: "/seller/store", label: "Overview", desc: "Dashboard", badge: "LIVE", grad: "from-blue-500 to-cyan-500", shadow: "shadow-blue-500/20", icon: "📊" },
      { path: "/seller/store/basic", label: "Basic Info", desc: "Name, Desc, Address", badge: "Must", grad: "from-orange-500 to-amber-500", shadow: "shadow-orange-500/20", icon: "📝" },
      { path: "/seller/store/branding", label: "Branding", desc: "Logo, Name, Identity", badge: "ID", grad: "from-violet-500 to-purple-500", shadow: "shadow-violet-500/20", icon: "🎨" },
      { path: "/seller/store/banner", label: "Store Banner", desc: "Hero 1600x600", badge: "HD", grad: "from-emerald-500 to-teal-500", shadow: "shadow-emerald-500/20", icon: "🖼️" },
    ]
  },
  {
    title: "GROWTH & MARKETING",
    items: [
      { path: "/seller/store/announcement", label: "Announcement", desc: "Top Offer Bar", badge: "Offer", grad: "from-rose-500 to-pink-500", shadow: "shadow-rose-500/20", icon: "📢" },
      { path: "/seller/store/theme", label: "Theme & Colors", desc: "Themes", badge: "New", grad: "from-fuchsia-500 to-pink-500", shadow: "shadow-fuchsia-500/20", icon: "💅" },
      { path: "/seller/store/social", label: "Social & Contact", desc: "FB, IG, WA", badge: "Trust", grad: "from-sky-500 to-blue-500", shadow: "shadow-sky-500/20", icon: "🔗" },
    ]
  },
  {
    title: "SETTINGS & LEGAL",
    items: [
      { path: "/seller/store/seo", label: "SEO", desc: "Title, Description", badge: "SEO", grad: "from-yellow-500 to-orange-500", shadow: "shadow-yellow-500/20", icon: "🔍" },
      { path: "/seller/store/policy", label: "Policy", desc: "Return, Warranty", badge: "Legal", grad: "from-slate-600 to-slate-700", shadow: "shadow-slate-500/20", icon: "📜" },
      { path: "/seller/store/verification", label: "Verification", desc: "NID, Badge", badge: "OK", grad: "from-green-500 to-emerald-600", shadow: "shadow-green-500/20", icon: "✅" },
      { path: "/seller/store/settings", label: "Settings", desc: "Store Settings", badge: "•", grad: "from-zinc-600 to-zinc-700", shadow: "shadow-zinc-500/20", icon: "⚙️" },
    ]
  }
];

export default function StoreSidebar({ onClose, saveMsg }) {
  const pathname = usePathname();
  // ✅ DYNAMIC - No Hardcoded 83% - Real Completion from Context
  const storeCtx = useStore();
  const completion = storeCtx?.completion?? 0;

  return (
    <div className="h-full flex flex-col bg-[#fcfcff] backdrop-blur-xl">
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2.5 py-4">
        {menuGroups.map((group, gi) => (
          <div key={gi} className={gi > 0? "mt-6" : ""}>
            <div className="h-[16px] mb-2.5 px-2 flex items-center">
              <p className="text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-all duration-300">
                {group.title}
              </p>
              <div className="group-hover/sidebar:hidden w-full flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                <div className="flex-1 h-[1px] bg-slate-200"></div>
              </div>
            </div>

            <div className="space-y-1">
              {group.items.map((m) => {
                const active = pathname === m.path || (m.path!== "/seller/store" && pathname.startsWith(m.path));
                return (
                  <Link
                    key={m.path}
                    href={m.path}
                    onClick={onClose}
                    className={`relative flex items-center gap-2.5 rounded-[12px] w-full overflow-hidden transition-all duration-200 border
                      ${active
                     ? "bg-white border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]"
                        : "bg-white/50 border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
                      }
                      p-1.5 group-hover/sidebar:p-2.5
                    `}
                  >
                    {active && <div className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-gradient-to-b ${m.grad}`}></div>}

                    <div className={`w-[30px] h-[30px] rounded-[8px] flex items-center justify-center text-[14px] shrink-0 transition-all duration-200
                      bg-gradient-to-br ${m.grad} ${m.shadow} shadow-[0_2px_6px_rgba(0,0,0,0.12)] text-white
                      ${active? "scale-105 shadow-[0_3px_10px_rgba(0,0,0,0.18)]" : "group-hover/sidebar:scale-105"}
                    `}>
                      {m.icon}
                    </div>

                    <div className="flex-1 min-w-0 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <p className={`text-[12px] font-bold truncate leading-none ${active? "text-slate-900" : "text-slate-700"}`}>{m.label}</p>
                        <span className={`text-[7px] px-1.5 py-0.5 rounded-full font-black leading-none
                          ${active? "bg-slate-900 text-white" : m.badge==="LIVE"? "bg-green-500 text-white" : m.badge==="Must"? "bg-orange-500 text-white" : m.badge==="ID"? "bg-violet-500 text-white" : m.badge==="HD"? "bg-emerald-500 text-white" : m.badge==="Offer"? "bg-rose-500 text-white" : m.badge==="New"? "bg-fuchsia-500 text-white" : m.badge==="Trust"? "bg-sky-500 text-white" : m.badge==="OK"? "bg-green-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                          {m.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium truncate mt-[3px] leading-none">{m.desc}</p>
                    </div>

                    {active && <div className="hidden group-hover/sidebar:flex w-5 h-5 rounded-full bg-slate-900 text-white items-center justify-center text-[10px]">›</div>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-2.5 mt-auto">
        {saveMsg? (
          <div className="rounded-[10px] bg-gradient-to-r from-emerald-500 to-green-500 text-white text-[10px] font-bold py-2.5 text-center shadow-[0_4px_12px_rgba(34,197,94,0.25)] opacity-0 group-hover/sidebar:opacity-100 transition-opacity">
            {saveMsg}
          </div>
        ) : (
          <div className="hidden group-hover/sidebar:block rounded-[12px] bg-gradient-to-br from-slate-900 to-slate-800 p-3 text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-blue-500/30 to-violet-500/30 rounded-full blur-xl"></div>
            <div className="relative flex items-center gap-2">
              <div className="w-8 h-8 rounded-[8px] bg-white/15 backdrop-blur-md flex items-center justify-center text-[12px]">🚀</div>
              <div>
                <p className="text-[11px] font-black">{completion}% Complete</p>
                <p className="text-[9px] text-white/60">{completion === 100? "Ready to Publish" : "Get Top Badge"}</p>
              </div>
            </div>
            <div className="relative mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 to-violet-400 rounded-full transition-all duration-700" style={{ width: `${completion}%` }}></div>
            </div>
          </div>
        )}
        <div className="group-hover/sidebar:hidden flex justify-center py-2">
          <div className="w-6 h-1 bg-slate-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}