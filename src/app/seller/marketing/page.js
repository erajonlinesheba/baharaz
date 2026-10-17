export default function MarketingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Marketing Center</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Voucher */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-bold mb-2">Voucher</h3>
          <p className="text-gray-600 text-sm mb-4">Create discount vouchers for your customers</p>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">Create Voucher</button>
        </div>

        {/* Seller Ads */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-bold mb-2">Seller Ads</h3>
          <p className="text-gray-600 text-sm mb-4">Promote your products to get more views</p>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">Run Ad</button>
        </div>
      </div>

      {/* Active Campaigns */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-bold mb-4">Active Campaigns</h3>
        <p className="text-gray-500">No active campaigns. Create one to start!</p>
      </div>
    </div>
  )
}
