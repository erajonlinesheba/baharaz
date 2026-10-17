import Link from "next/link"
export default function Affiliate(){
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="pt-[110px] md:pt-[130px] pb-4">
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 bg-white shadow rounded-full text-xs md:text-sm font-bold">← Back to Home</Link>
        </div>
        <div className="bg-gray-900 text-white rounded-[20px] md:rounded-[32px] p-6 md:p-10">
          <h1 className="text-[22px] md:text-4xl font-black">Baharaz Affiliate<br/><span className="text-[#f85606]">Earn 10% Commission</span></h1>
          <p className="mt-2 text-[12px] md:text-sm text-gray-400">Share products and earn on every sale.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white border rounded-2xl p-5"><h3 className="font-bold text-sm">High Commission</h3><p className="text-xs text-gray-500">Up to 10% per sale</p></div>
          <div className="bg-white border rounded-2xl p-5"><h3 className="font-bold text-sm">50k+ Products</h3><p className="text-xs text-gray-500">Share any product</p></div>
          <div className="bg-white border rounded-2xl p-5"><h3 className="font-bold text-sm">Daily Payout</h3><p className="text-xs text-gray-500">Withdraw anytime</p></div>
        </div>
      </div>
    </div>
  )
}