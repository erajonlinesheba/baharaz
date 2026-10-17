"use client";

import { useState } from "react";

export default function ShareButtons({ store, url }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window!== "undefined"? window.location.href : "");
  const shareText = `Check out ${store?.shop_name || "this amazing store"} - ${store?.description?.slice(0, 80) || "Best products in Bangladesh!"} 🛒💬 Chat Before Order!`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareLinks = [
    {
      name: "Facebook",
      icon: "f",
      color: "bg-[#1877F2] hover:bg-[#166fe5]",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "WhatsApp",
      icon: "W",
      color: "bg-[#25D366] hover:bg-[#20bd5a]",
      href: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
    },
    {
      name: "Messenger",
      icon: "M",
      color: "bg-[#0084FF] hover:bg-[#0077e6]",
      href: `https://www.facebook.com/dialog/send?link=${encodeURIComponent(shareUrl)}&app_id=123456`,
    },
    {
      name: "Twitter",
      icon: "𝕏",
      color: "bg-black hover:bg-zinc-800",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    },
  ];

  return (
    <div className="bg-white rounded-[18px] border border-slate-200 shadow-sm p-4 md:p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-[14px]">↗️</div>
        <div>
          <h3 className="text-[13px] font-black text-slate-900">Share This Store</h3>
          <p className="text-[11px] text-slate-500">Share with friends & get 10% discount!</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2.5 mb-4">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${link.color} text-white rounded-[12px] h-[44px] flex flex-col items-center justify-center gap-0.5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] hover:-translate-y-[1px] active:translate-y-0 active:scale-95 transition-all`}
            title={`Share on ${link.name}`}
          >
            <span className="text-[16px] font-black leading-none">{link.icon}</span>
            <span className="text-[9px] font-bold opacity-90">{link.name}</span>
          </a>
        ))}
      </div>

      <div className="flex items-center gap-2 p-2 bg-[#f8fafc] border border-slate-200 rounded-full">
        <div className="flex-1 min-w-0 px-3">
          <p className="text-[11px] text-slate-500 truncate font-medium">{shareUrl}</p>
        </div>
        <button
          onClick={handleCopy}
          className={`px-5 py-2 rounded-full text-[11px] font-black transition-all active:scale-95 shrink-0 ${copied? "bg-green-600 text-white" : "bg-slate-900 text-white hover:bg-black"}`}
        >
          {copied? "✓ Copied!" : "Copy Link"}
        </button>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-slate-400">
        <span>🔒</span>
        <span className="font-medium">Secure Store Link • Verified by Sellora</span>
        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
        <span className="font-bold text-slate-600">{store?.total_sales || 500}+ Sales</span>
      </div>
    </div>
  );
}