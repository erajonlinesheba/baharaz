"use client";

export default function SocialLinks({ store }) {
  const links = [
    {
      name: "Facebook",
      url: store?.facebook_url || store?.fb_link || "",
      icon: "f",
      bg: "bg-[#1877F2]",
      hover: "hover:bg-[#166fe5] hover:shadow-[0_8px_20px_rgba(24,119,242,0.3)]",
      show: true,
    },
    {
      name: "Instagram",
      url: store?.instagram_url || store?.insta_link || "",
      icon: "📷",
      bg: "bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5]",
      hover: "hover:shadow-[0_8px_20px_rgba(214,41,118,0.3)] hover:scale-[1.05]",
      show: true,
    },
    {
      name: "TikTok",
      url: store?.tiktok_url || "",
      icon: "♪",
      bg: "bg-black",
      hover: "hover:bg-zinc-900 hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)]",
      show: true,
    },
    {
      name: "YouTube",
      url: store?.youtube_url || "",
      icon: "▶️",
      bg: "bg-[#FF0000]",
      hover: "hover:bg-[#e60000] hover:shadow-[0_8px_20px_rgba(255,0,0,0.3)]",
      show: true,
    },
    {
      name: "WhatsApp",
      url: store?.whatsapp_url || (store?.phone? `https://wa.me/${store.phone.replace(/[^0-9]/g, "")}` : ""),
      icon: "W",
      bg: "bg-[#25D366]",
      hover: "hover:bg-[#20bd5a] hover:shadow-[0_8px_20px_rgba(37,211,102,0.3)]",
      show: true,
    },
  ];

  // Only show links that have URL
  const activeLinks = links.filter((l) => l.url && l.url.trim()!== "");

  if (activeLinks.length === 0) return null;

  return (
    <div className="bg-white rounded-[18px] border border-slate-200 shadow-sm p-4 md:p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-black text-slate-900 flex items-center gap-2">
          <span className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-[14px]">🌐</span>
          Follow Us On Social
        </h3>
        <span className="text-[10px] bg-[#f1f5f9] border border-slate-200 text-slate-600 px-2.5 py-1 rounded-full font-bold">
          {activeLinks.length} Platforms
        </span>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-5 gap-2.5">
        {activeLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${link.bg} ${link.hover} text-white rounded-[14px] h-[72px] flex flex-col items-center justify-center gap-1 shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200 active:scale-95 group`}
          >
            <span className="text-[20px] font-black leading-none group-hover:scale-110 transition-transform">
              {link.icon}
            </span>
            <span className="text-[10px] font-bold tracking-wide">{link.name}</span>
            <span className="text-[8px] bg-white/20 px-2 py-0.5 rounded-full font-bold">Follow</span>
          </a>
        ))}
      </div>

      <div className="mt-4 p-3 bg-[#f8fafc] border border-slate-100 rounded-[12px] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 bg-green-50 border border-green-200 rounded-full flex items-center justify-center text-[12px]">✓</span>
          <div>
            <p className="text-[11px] font-black text-slate-900">Verified Social Accounts</p>
            <p className="text-[10px] text-slate-500 font-medium">Chat & Follow for latest updates!</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-1 text-[10px] text-slate-400 font-bold">
          <span>🔒</span> Safe & Trusted
        </div>
      </div>

      {/* Extra SEO Text */}
      <p className="mt-3 text-center text-[10px] text-slate-400 font-medium">
        Follow on Facebook, Instagram, TikTok for New Offers & Giveaways! 🎉
      </p>
    </div>
  );
}