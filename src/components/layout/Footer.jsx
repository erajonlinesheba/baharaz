import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-6 bg-[#f5f5f5] border-t w-full overflow-hidden">
      <div className="max-w-[1188px] mx-auto px-4 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="min-w-0">
            <h3 className="font-bold text-[12px] mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] shrink-0">1</span>
              <span className="truncate">Customer Care</span>
            </h3>
            <ul className="space-y-1.5">
              <li><Link href="/help" className="text-[11px] text-[#444] hover:text-[#f85606] block truncate">Help Center - 24/7 Support</Link></li>
              <li><Link href="/help/how-to-buy" className="text-[11px] text-[#444] hover:text-[#f85606] block truncate">How to Buy - Easy Guide</Link></li>
              <li><Link href="/help/returns-refunds" className="text-[11px] text-[#444] hover:text-[#f85606] block truncate">Returns & Refunds - 7 Days</Link></li>
              <li><Link href="/help/contact-us" className="text-[11px] text-[#444] hover:text-[#f85606] block truncate">Contact Us - Hotline</Link></li>
              <li><Link href="/shipping-info" className="text-[11px] text-[#444] hover:text-[#f85606] block truncate">Shipping Info - 64 Districts</Link></li>
              <li><Link href="/payment-methods" className="text-[11px] text-[#444] hover:text-[#f85606] block truncate">Payment Methods - Secure</Link></li>
              <li><Link href="/warranty-policy" className="text-[11px] text-[#444] hover:text-[#f85606] block truncate">Warranty Policy - Official</Link></li>
            </ul>
            <div className="mt-3 p-2 rounded-md bg-white border max-w-[200px]">
              <p className="text-[9px] font-bold">Hotline - Call Us</p>
              <p className="text-[12px] font-bold text-[#f85606]">09613-800800</p>
              <p className="text-[8px] text-gray-500">9AM - 9PM - 7 Days</p>
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="font-bold text-[12px] mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#f85606] text-white flex items-center justify-center text-[10px] shrink-0">2</span>
              <span className="truncate">About Baharaz</span>
            </h3>
            <ul className="space-y-1.5">
              <li><Link href="/about-us" className="text-[11px] text-[#444] hover:text-[#f85606] block truncate">About Us - Our Story</Link></li>
              <li><Link href="/careers" className="text-[11px] text-[#444] hover:text-[#f85606] block truncate">Careers - Join Team</Link></li>
              <li><Link href="/digital-payments" className="text-[11px] text-[#444] hover:text-[#f85606] block truncate">Digital Payments - Secure</Link></li>
              <li><Link href="/privacy-policy" className="text-[11px] text-[#444] hover:text-[#f85606] block truncate">Privacy Policy - Protected</Link></li>
              <li><Link href="/terms-and-conditions" className="text-[11px] text-[#444] hover:text-[#f85606] block truncate">Terms & Conditions</Link></li>
              <li><Link href="/sell-on-baharaz" className="text-[11px] text-[#444] hover:text-[#f85606] block truncate">Sell on Baharaz - Earn ৳50k</Link></li>
              <li><Link href="/affiliate" className="text-[11px] text-[#444] hover:text-[#f85606] block truncate">Affiliate Program - Earn More</Link></li>
            </ul>
            <div className="mt-3 flex flex-wrap gap-1">
              <span className="text-[8px] px-2 py-0.5 bg-black text-white rounded-full font-bold">Verified</span>
              <span className="text-[8px] px-2 py-0.5 bg-[#f85606] text-white rounded-full font-bold">Official</span>
              <span className="text-[8px] px-2 py-0.5 bg-green-500 text-white rounded-full font-bold">Trusted</span>
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="font-bold text-[12px] mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-[10px] shrink-0">3</span>
              <span className="truncate">Payment Methods</span>
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="bg-white border rounded-md p-1.5 flex items-center gap-1.5 h-[32px]">
                <div className="w-6 h-6 rounded bg-[#e2136e] flex items-center justify-center text-white font-bold text-[6px] shrink-0">bK</div>
                <div className="min-w-0"><p className="font-bold text-[9px] leading-none truncate">bKash</p><p className="text-[7px] text-gray-500 leading-none">Mobile</p></div>
              </div>
              <div className="bg-white border rounded-md p-1.5 flex items-center gap-1.5 h-[32px]">
                <div className="w-6 h-6 rounded bg-[#f6921e] flex items-center justify-center text-white font-bold text-[6px] shrink-0">Na</div>
                <div className="min-w-0"><p className="font-bold text-[9px] leading-none truncate">Nagad</p><p className="text-[7px] text-gray-500 leading-none">Fast</p></div>
              </div>
              <div className="bg-white border rounded-md p-1.5 flex items-center gap-1.5 h-[32px]">
                <div className="w-6 h-6 rounded bg-[#1a1f71] flex items-center justify-center text-white font-bold text-[6px] shrink-0">VS</div>
                <div className="min-w-0"><p className="font-bold text-[9px] leading-none truncate">Visa</p><p className="text-[7px] text-gray-500 leading-none">Card</p></div>
              </div>
              <div className="bg-white border rounded-md p-1.5 flex items-center gap-1.5 h-[32px]">
                <div className="w-6 h-6 rounded bg-[#eb001b] flex items-center justify-center text-white font-bold text-[5px] shrink-0">Mc</div>
                <div className="min-w-0"><p className="font-bold text-[9px] leading-none truncate">Master</p><p className="text-[7px] text-gray-500 leading-none">Secure</p></div>
              </div>
              <div className="bg-white border rounded-md p-1.5 flex items-center gap-1.5 col-span-2 h-[32px]">
                <div className="w-6 h-6 rounded bg-black flex items-center justify-center text-white font-bold text-[6px] shrink-0">COD</div>
                <p className="font-bold text-[9px] truncate">Cash on Delivery - All BD</p>
              </div>
            </div>
            <div className="mt-2 p-2 rounded-md bg-black text-white">
              <p className="text-[9px] font-bold">🔒 100% Secure Payment</p>
              <p className="text-[7px] opacity-70">SSL Protected</p>
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="font-bold text-[12px] mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] shrink-0">4</span>
              <span className="truncate">Download App - ৳100 OFF</span>
            </h3>
            <div className="bg-white border rounded-lg p-2.5">
              <div className="flex gap-2">
                <div className="w-[56px] h-[56px] bg-black rounded-md flex flex-col items-center justify-center p-1 shrink-0">
                  <div className="w-[40px] h-[40px] bg-white rounded flex items-center justify-center text-[6px] font-bold text-center leading-none">QR<br/>CODE</div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-[10px]">Get Baharaz App</p>
                  <p className="text-[8px] text-gray-500 leading-tight">First Order ৳100 OFF + Free Delivery</p>
                  <div className="mt-1.5 space-y-1">
                    <div className="h-6 bg-black rounded-full flex items-center px-2 text-white">
                      <span className="text-[10px] mr-1">▶</span>
                      <p className="text-[9px] font-bold">Google Play</p>
                    </div>
                    <div className="h-6 bg-black rounded-full flex items-center px-2 text-white">
                      <span className="text-[10px] mr-1">🍎</span>
                      <p className="text-[9px] font-bold">App Store</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 flex gap-1">
              <div className="w-6 h-6 rounded-full bg-[#1877f2] text-white flex items-center justify-center text-[10px] font-bold">f</div>
              <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px]">𝕏</div>
              <div className="w-6 h-6 rounded-full bg-[#ff0000] text-white flex items-center justify-center text-[8px]">▶</div>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center text-[10px]">📸</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-b">
        <div className="max-w-[1188px] mx-auto px-4 py-4">
          <h2 className="font-bold text-[12px]">Experience Personalized Online Shopping in Bangladesh with Baharaz</h2>
          <p className="mt-2 text-[10px] text-[#888] leading-4">
            Baharaz - Bangladesh&apos;s Most Loved Online Shopping Mall - 64 Districts - 490+ Upazila - 12M+ products - Free delivery over ৳499 - 7 days return - bKash - Nagad - Visa - Mastercard - Cash on Delivery.
          </p>
          <div className="mt-3 flex flex-wrap gap-1">
            {['Online Shopping', 'Baharaz Mall', 'Flash Sale', 'Free Delivery', 'Official Store', 'Brand Festival', 'Just For You', 'Categories', 'Buyer Protection', '7 Days Return', 'bKash Payment'].map((tag, i) => (
              <span key={i} className="text-[8px] px-2 py-0.5 bg-[#f5f5f5] border rounded-full font-medium">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#212121] text-white">
        <div className="max-w-[1188px] mx-auto px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-1">
          <div className="flex items-center gap-2 text-[10px]">
            <div className="w-5 h-5 rounded bg-[#f85606] flex items-center justify-center font-bold text-[10px]">B</div>
            <span className="font-bold">Baharaz © 2024-2026</span>
            <span className="opacity-40 hidden md:block">|</span>
            <span className="opacity-60 text-[9px]">64 Districts • 12M+ Products</span>
          </div>
          <div className="flex items-center gap-2 text-[9px]">
            <span>🌍 Bangladesh</span>
            <span>🔒 SSL Secure</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10">v2.6</span>
          </div>
        </div>
      </div>
    </footer>
  )
}