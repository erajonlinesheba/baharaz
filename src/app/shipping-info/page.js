import Link from "next/link"

export default function ShippingInfoPage(){
  return(
    <div className="min-h-screen bg-[#f8f8fb]">
      <div className="max-w-[1100px] mx-auto px-4 pt-[90px] pb-20">
        <Link href="/help" className="text-[11px] font-black bg-white px-4 py-2 rounded-full border shadow-sm hover:bg-black hover:text-white transition">← Back to Help Center</Link>

        <div className="bg-gradient-to-br from-[#f85606] via-[#ff6a00] to-[#ff8a00] rounded-[24px] p-8 md:p-10 mt-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <h1 className="text-[30px] md:text-[42px] font-black leading-[0.95] relative z-10">Shipping & Delivery 🚚<br/>All Over Bangladesh</h1>
          <p className="text-[13px] md:text-[14px] opacity-90 mt-4 max-w-[600px] leading-[20px] relative z-10">We deliver to 64 districts, 490+ upazila, super fast and 100% safe. Cash on Delivery available everywhere.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-[20px] border p-6 shadow-sm">
            <div className="w-12 h-12 rounded-[12px] bg-[#f0fdf4] flex items-center justify-center text-[22px]">🏙️</div>
            <h3 className="font-black text-[15px] mt-4">Inside Dhaka</h3>
            <p className="text-[28px] font-black mt-2 text-green-600">৳60</p>
            <p className="text-[11px] text-gray-500 mt-1">Delivery Time: 1-2 Days</p>
            <p className="text-[11px] text-gray-500">Free Delivery Over ৳999</p>
            <div className="mt-4 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-[10px] font-black inline-block">MOST POPULAR</div>
          </div>
          <div className="bg-white rounded-[20px] border p-6 shadow-sm">
            <div className="w-12 h-12 rounded-[12px] bg-[#eff6ff] flex items-center justify-center text-[22px]">🌆</div>
            <h3 className="font-black text-[15px] mt-4">Outside Dhaka</h3>
            <p className="text-[28px] font-black mt-2 text-blue-600">৳120</p>
            <p className="text-[11px] text-gray-500 mt-1">Delivery Time: 2-4 Days</p>
            <p className="text-[11px] text-gray-500">Free Delivery Over ৳1499</p>
            <div className="mt-4 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black inline-block">ALL BD COVERAGE</div>
          </div>
          <div className="bg-white rounded-[20px] border p-6 shadow-sm">
            <div className="w-12 h-12 rounded-[12px] bg-[#fff7ed] flex items-center justify-center text-[22px]">⚡</div>
            <h3 className="font-black text-[15px] mt-4">Express Delivery</h3>
            <p className="text-[28px] font-black mt-2 text-[#f85606]">৳150</p>
            <p className="text-[11px] text-gray-500 mt-1">Delivery Time: 24 Hours</p>
            <p className="text-[11px] text-gray-500">Inside Dhaka Only</p>
            <div className="mt-4 px-3 py-1.5 bg-orange-50 text-[#f85606] rounded-full text-[10px] font-black inline-block">FASTEST</div>
          </div>
        </div>

        <div className="bg-white rounded-[22px] border p-7 md:p-8 mt-6 shadow-sm">
          <h2 className="font-black text-[18px]">How Shipping Works?</h2>
          <div className="grid md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-4 bg-[#f8f8fb] rounded-[16px] border">
              <p className="text-[28px]">📦</p>
              <p className="font-black text-[12px] mt-2">1. Order Confirm</p>
              <p className="text-[10px] text-gray-500 mt-1">We pack your product</p>
            </div>
            <div className="text-center p-4 bg-[#f8f8fb] rounded-[16px] border">
              <p className="text-[28px]">🚚</p>
              <p className="font-black text-[12px] mt-2">2. Shipped</p>
              <p className="text-[10px] text-gray-500 mt-1">Courier picks up</p>
            </div>
            <div className="text-center p-4 bg-[#f8f8fb] rounded-[16px] border">
              <p className="text-[28px]">📍</p>
              <p className="font-black text-[12px] mt-2">3. On The Way</p>
              <p className="text-[10px] text-gray-500 mt-1">Track live location</p>
            </div>
            <div className="text-center p-4 bg-[#f8f8fb] rounded-[16px] border">
              <p className="text-[28px]">🏠</p>
              <p className="font-black text-[12px] mt-2">4. Delivered</p>
              <p className="text-[10px] text-gray-500 mt-1">Pay & enjoy</p>
            </div>
          </div>
        </div>

        <div className="bg-black text-white rounded-[22px] p-7 md:p-8 mt-6">
          <h3 className="font-black text-[16px]">Need Help?</h3>
          <p className="text-[12px] opacity-70 mt-2">Call our hotline for shipping support - 9AM to 9PM - 7 Days</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="px-5 py-2.5 bg-white text-black rounded-full text-[12px] font-black">📞 09613-800800</div>
            <Link href="/help/track-order" className="px-5 py-2.5 bg-[#f85606] text-white rounded-full text-[12px] font-black">Track Order →</Link>
          </div>
        </div>

      </div>
    </div>
  )
}