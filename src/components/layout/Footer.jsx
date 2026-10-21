import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-8 bg-[#f5f5f5] w-full overflow-hidden border-t">
      {/* MAIN FOOTER */}
      <div className="bg-[#2A2A2A] md:bg-white text-white md:text-[#212121]">
        <div className="max-w-[1188px] mx-auto px-4 md:px-4 py-8 md:py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            
            {/* Customer Care */}
            <div>
              <h3 className="font-bold text-[14px] mb-4 uppercase tracking-wide flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-white md:bg-[#111] text-black md:text-white flex items-center justify-center text-[12px]">1</span>
                Customer Care
              </h3>
              <ul className="space-y-2.5">
                {[
                  ["Help Center", "/help"],
                  ["How to Buy", "/help/how-to-buy"],
                  ["Returns & Refunds", "/help/returns-refunds"],
                  ["Contact Us", "/help/contact-us"],
                  ["Shipping Info", "/shipping-info"],
                  ["Warranty Policy", "/warranty-policy"],
                ].map(([label, href])=>(
                  <li key={href}><Link href={href} className="text-[13px] text-white/70 md:text-[#666] hover:text-[#f85606] transition-colors">{label}</Link></li>
                ))}
              </ul>
              <div className="mt-5 bg-white/10 md:bg-[#f8f8f8] border border-white/10 md:border-[#eee] rounded-xl p-3 max-w-[220px]">
                <p className="text-[11px] font-bold opacity-60">HOTLINE 9AM - 9PM</p>
                <p className="text-[18px] font-black text-[#FFD814] md:text-[#f85606] mt-0.5">09613-800800</p>
                <p className="text-[11px] opacity-70 mt-1">7 Days Open • 64 Districts</p>
              </div>
            </div>

            {/* Baharaz */}
            <div>
              <h3 className="font-bold text-[14px] mb-4 uppercase tracking-wide flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#f85606] text-white flex items-center justify-center text-[12px]">2</span>
                Baharaz
              </h3>
              <ul className="space-y-2.5">
                {[
                  ["About Us", "/about-us"],
                  ["Careers", "/careers"],
                  ["Privacy Policy", "/privacy-policy"],
                  ["Terms & Conditions", "/terms-and-conditions"],
                  ["Sell on Baharaz", "/sell-on-baharaz"],
                  ["Affiliate Program", "/affiliate"],
                  ["Digital Payments", "/digital-payments"],
                ].map(([label, href])=>(
                  <li key={href}><Link href={href} className="text-[13px] text-white/70 md:text-[#666] hover:text-[#f85606] transition-colors">{label}</Link></li>
                ))}
              </ul>
              <div className="mt-5 flex gap-1.5">
                <span className="text-[10px] px-2.5 py-1 bg-[#f85606] text-white rounded-full font-bold">Verified</span>
                <span className="text-[10px] px-2.5 py-1 bg-white/15 md:bg-[#111] text-white rounded-full font-bold">Official</span>
              </div>
            </div>

            {/* Payment */}
            <div>
              <h3 className="font-bold text-[14px] mb-4 uppercase tracking-wide flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#00B578] text-white flex items-center justify-center text-[12px]">3</span>
                Payment
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-2 gap-2">
                {[
                  { name: "bKash", sub: "Mobile", bg: "bg-[#E2136E]", t: "bK" },
                  { name: "Nagad", sub: "Fast", bg: "bg-[#F6921E]", t: "Na" },
                  { name: "Visa", sub: "Card", bg: "bg-[#1A1F71]", t: "Vs" },
                  { name: "Master", sub: "Secure", bg: "bg-[#EB001B]", t: "Mc" },
                  { name: "COD", sub: "All BD", bg: "bg-black", t: "COD", full: true },
                ].map((p)=>(
                  <div key={p.name} className={`bg-white/10 md:bg-white border border-white/10 md:border-[#eee] rounded-lg p-2.5 flex items-center gap-2 ${p.full ? 'col-span-3 md:col-span-2' : ''} hover:shadow-md transition-shadow`}>
                    <div className={`w-9 h-9 rounded-lg ${p.bg} flex items-center justify-center text-white font-black text-[10px] shrink-0`}>{p.t}</div>
                    <div className="min-w-0">
                      <p className="font-bold text-[12px] leading-none text-white md:text-[#111] truncate">{p.name}</p>
                      <p className="text-[10px] text-white/60 md:text-[#888] mt-0.5">{p.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 bg-[#111] md:bg-black text-white rounded-xl p-3 flex items-center gap-2">
                <span className="text-[16px]">🔒</span>
                <div>
                  <p className="text-[12px] font-bold leading-none">100% Secure Payment</p>
                  <p className="text-[10px] opacity-60 mt-1">SSL • 3D Secure • Encrypted</p>
                </div>
              </div>
            </div>

            {/* App */}
            <div>
              <h3 className="font-bold text-[14px] mb-4 uppercase tracking-wide flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#0A66FF] text-white flex items-center justify-center text-[12px]">4</span>
                Get App - ৳100 OFF
              </h3>
              <div className="bg-white rounded-2xl p-4 shadow-sm border md:shadow-none">
                <div className="flex gap-3">
                  <div className="w-[72px] h-[72px] bg-[#111] rounded-xl flex items-center justify-center shrink-0">
                    <div className="w-[56px] h-[56px] bg-white rounded-lg flex items-center justify-center text-[9px] font-black text-center leading-tight">QR<br/>SCAN<br/>ME</div>
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-[14px] text-[#111]">Baharaz App</p>
                    <p className="text-[11px] text-[#666] mt-1 leading-tight">First Order ৳100 OFF + Free Delivery</p>
                    <div className="mt-3 flex gap-2">
                      <div className="flex-1 h-8 bg-black rounded-full flex items-center justify-center gap-1.5 text-white">
                        <span className="text-[12px]">▶</span><span className="text-[10px] font-bold">Play</span>
                      </div>
                      <div className="flex-1 h-8 bg-black rounded-full flex items-center justify-center gap-1.5 text-white">
                        <span className="text-[12px]">🍎</span><span className="text-[10px] font-bold">Store</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-bold opacity-60 mb-2.5 tracking-widest">FOLLOW US</p>
                <div className="flex gap-2">
                  <Link href="#" className="w-9 h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold hover:scale-110 transition-transform">f</Link>
                  <Link href="#" className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform">𝕏</Link>
                  <Link href="#" className="w-9 h-9 rounded-full bg-[#FF0000] text-white flex items-center justify-center text-[12px] hover:scale-110 transition-transform">▶</Link>
                  <Link href="#" className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center hover:scale-110 transition-transform">◎</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO TEXT */}
      <div className="bg-[#f5f5f5] border-t">
        <div className="max-w-[1188px] mx-auto px-4 py-6">
          <h2 className="font-bold text-[14px] md:text-[16px] text-[#111]">Experience Personalized Online Shopping in Bangladesh with Baharaz</h2>
          <p className="mt-2.5 text-[12px] md:text-[13px] text-[#666] leading-6 max-w-[900px]">
            Baharaz is Bangladesh&apos;s Most Loved Online Shopping Mall. 64 Districts, 490+ Upazila, 12M+ Products, Free Delivery over ৳499, 7 Days Return, bKash, Nagad, Visa, Mastercard, Cash on Delivery. Best Price, Official Warranty, Fast Delivery.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Online Shopping', 'Baharaz Mall', 'Flash Sale', 'Free Delivery', 'Official Store', 'Brand Festival', 'Just For You', 'Buyer Protection', '7 Days Return'].map((tag)=>(
              <span key={tag} className="text-[11px] px-3 py-1.5 bg-white border rounded-full font-medium text-[#444] hover:border-[#f85606] hover:text-[#f85606] cursor-pointer transition-colors">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="bg-[#111] text-white">
        <div className="max-w-[1188px] mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-[12px]">
            <div className="w-7 h-7 rounded-lg bg-[#f85606] flex items-center justify-center font-black">B</div>
            <span className="font-bold">Baharaz © 2024-2026</span>
            <span className="opacity-30">|</span>
            <span className="opacity-70 text-[11px]">64 Districts • 12M+ Products • Trusted by 5M+</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="opacity-70">🌍 Bangladesh</span>
            <span className="opacity-70">🔒 SSL Secured</span>
            <span className="px-2.5 py-1 rounded-full bg-white/10 font-bold">v2.6 CREAM</span>
          </div>
        </div>
      </div>
    </footer>
  )
}