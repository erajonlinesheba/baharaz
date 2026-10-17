"use client";
import Link from "next/link";

export default function StoreFooter({ store }) {
  const currentYear = new Date().getFullYear();

  // FIXED: সব column থেকে fallback - যেটা আছে সেটাই Real নাম হবে - Single Source
  const realName = store?.shop_name || store?.name || "My Store";
  const realLogo = store?.shop_logo || store?.logo_url || store?.logo;
  const realSlug = store?.shop_slug || store?.slug || "";
  const realDesc = store?.description || store?.bio || "Best quality products in Bangladesh. 100% Authentic, Fast Delivery, Cash On Delivery Available. Chat with us before ordering for best experience!";

  return (
    <footer className="bg-slate-900 text-white mt-8 rounded-t-[24px] md:rounded-t-[28px] overflow-hidden">
      {/* Top - Store Info */}
      <div className="max-w-[1300px] mx-auto px-4 md:px-6 py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-[12px] bg-white text-slate-900 flex items-center justify-center font-black text-[20px] overflow-hidden shadow-lg">
                {realLogo? <img src={realLogo} alt={realName} className="w-full h-full object-cover" /> : realName?.charAt(0) || "S"}
              </div>
              <div>
                <h3 className="text-[18px] font-black tracking-tight">{realName}</h3>
                <p className="text-[11px] text-white/60 font-bold tracking-widest uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Verified Seller • Baharaz
                </p>
              </div>
            </div>
            <p className="text-[13px] text-white/70 leading-relaxed max-w-md">
              {realDesc}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-white/10 border border-white/10 rounded-full text-[10px] font-bold flex items-center gap-1.5">🚚 Fast Delivery</span>
              <span className="px-3 py-1.5 bg-white/10 border border-white/10 rounded-full text-[10px] font-bold flex items-center gap-1.5">💵 COD Available</span>
              <span className="px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full text-[10px] font-bold flex items-center gap-1.5">💬 Live Chat</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[12px] font-black tracking-widest uppercase text-white/90 mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              <li><Link href={`/store/${realSlug}`} className="text-[12px] text-white/60 hover:text-white font-medium transition-colors">🏠 Store Home</Link></li>
              <li><button onClick={() => { const t = document.getElementById("live-chat-trigger"); if (t) t.click(); }} className="text-[12px] text-white/60 hover:text-white font-medium transition-colors text-left">💬 Live Chat Support</button></li>
              <li><Link href="/track-order" className="text-[12px] text-white/60 hover:text-white font-medium transition-colors">📦 Track Order</Link></li>
              <li><Link href="/return-policy" className="text-[12px] text-white/60 hover:text-white font-medium transition-colors">↩️ Return Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[12px] font-black tracking-widest uppercase text-white/90 mb-4">Contact & Support</h4>
            <ul className="space-y-2.5">
              <li className="text-[12px] text-white/60 font-medium flex items-center gap-2">📞 {store?.phone || "+880 1XXX-XXXXXX"}</li>
              <li className="text-[12px] text-white/60 font-medium flex items-center gap-2">✉️ {store?.email || "support@baharaz.com"}</li>
              <li className="text-[12px] text-white/60 font-medium flex items-center gap-2">📍 Rajshahi, Bangladesh</li>
              <li className="text-[12px] text-green-400 font-bold flex items-center gap-2"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Reply in 30 Minutes</li>
            </ul>

            <div className="mt-4 p-2.5 bg-white/5 border border-white/10 rounded-[12px]">
              <p className="text-[10px] text-white/50 font-bold">💡 Order করার আগে Live Chat এ জিজ্ঞেস করুন!</p>
              <button onClick={() => { const t = document.getElementById("live-chat-trigger"); if (t) t.click(); }} className="mt-2 w-full py-2 bg-white text-slate-900 rounded-full text-[11px] font-black hover:bg-slate-100 transition-all">💬 Chat Now</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="max-w-[1300px] mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/50 font-medium text-center md:text-left">
            © {currentYear} {realName} • Powered by <span className="text-white font-black">Baharaz</span> • All Rights Reserved • 🇧🇩 Made for Bangladesh
          </p>
          <div className="flex items-center gap-3 text-[10px] text-white/40 font-medium">
            <span className="flex items-center gap-1"><span>🔒</span> SSL Secured</span>
            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
            <span className="flex items-center gap-1"><span>✅</span> Verified</span>
            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
            <span>500+ Happy Customers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}