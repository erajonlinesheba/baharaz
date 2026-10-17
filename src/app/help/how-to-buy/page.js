import Link from "next/link"

export default function HowToBuy(){
  return(
    <div className="min-h-screen bg-[#f8f8fb]">
      <div className="max-w-4xl mx-auto px-4 pt-[100px] pb-20">
        <Link href="/help" className="text-[12px] font-bold bg-white px-4 py-2 rounded-full border">← Back to Help</Link>
        <div className="bg-white rounded-[22px] p-8 mt-4 border shadow-sm">
          <h1 className="text-[28px] font-black">How to Order 🛒</h1>
          <p className="text-[13px] text-gray-500 mt-2">New to Baharaz? 4 Step এ Order করো!</p>
          <div className="mt-6 grid md:grid-cols-4 gap-3 text-center">
            <div className="p-4 bg-[#f8f8fb] rounded-xl border">
              <p className="text-[24px]">🔍</p>
              <p className="font-bold text-[12px] mt-2">1. Search</p>
              <p className="text-[10px] text-gray-500 mt-1">Product খুঁজো</p>
            </div>
            <div className="p-4 bg-[#f8f8fb] rounded-xl border">
              <p className="text-[24px]">🛒</p>
              <p className="font-bold text-[12px] mt-2">2. Add to Cart</p>
              <p className="text-[10px] text-gray-500 mt-1">Cart এ Add করো</p>
            </div>
            <div className="p-4 bg-[#f8f8fb] rounded-xl border">
              <p className="text-[24px]">🔐</p>
              <p className="font-bold text-[12px] mt-2">3. PIN দাও</p>
              <p className="text-[10px] text-gray-500 mt-1">Secure PIN</p>
            </div>
            <div className="p-4 bg-[#f8f8fb] rounded-xl border">
              <p className="text-[24px]">🎉</p>
              <p className="font-bold text-[12px] mt-2">4. Done!</p>
              <p className="text-[10px] text-gray-500 mt-1">Order Complete</p>
            </div>
          </div>
          <div className="mt-8 p-4 rounded-xl bg-[#fff7ed] border border-orange-100">
            <p className="text-[12px] font-black">Need Help?</p>
            <p className="text-[11px] text-gray-600 mt-1">Call 09613-800800 - 9AM to 9PM</p>
          </div>
        </div>
      </div>
    </div>
  )
}