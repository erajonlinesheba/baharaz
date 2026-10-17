'use client'

export default function PromotionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          Promotions <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded">New</span>
        </h1>
        <p className="text-gray-500">Run discounts and vouchers to increase sales</p>
      </div>

      {/* 3 Types of Promotions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border hover:shadow-lg cursor-pointer">
          <div className="text-3xl mb-3">ðŸ·ï¸</div>
          <h3 className="font-semibold text-lg">Shop Voucher</h3>
          <p className="text-sm text-gray-500 mb-4">Create store-wide vouchers for buyers</p>
          <button className="text-orange-500 font-medium">Create Now â†’</button>
        </div>

        <div className="bg-white p-6 rounded-lg border hover:shadow-lg cursor-pointer">
          <div className="text-3xl mb-3">ðŸ’°</div>
          <h3 className="font-semibold text-lg">Product Discount</h3>
          <p className="text-sm text-gray-500 mb-4">Set discount for specific products</p>
          <button className="text-orange-500 font-medium">Create Now â†’</button>
        </div>

        <div className="bg-white p-6 rounded-lg border hover:shadow-lg cursor-pointer">
          <div className="text-3xl mb-3">ðŸŽ</div>
          <h3 className="font-semibold text-lg">Bundle Deal</h3>
          <p className="text-sm text-gray-500 mb-4">Buy more, save more deals</p>
          <button className="text-orange-500 font-medium">Create Now â†’</button>
        </div>
      </div>

      {/* Active Promotions */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="font-semibold mb-4">My Active Promotions</h2>
        <div className="text-center py-10 text-gray-400">
          No active promotions. Start one to boost sales!
        </div>
      </div>
    </div>
  )
}
