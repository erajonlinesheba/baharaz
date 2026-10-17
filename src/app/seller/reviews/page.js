'use client'

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">Homepage &gt; Orders &gt; Reviews</p>
        <h1 className="text-2xl font-bold">Reviews Management</h1>
      </div>

      {/* Performance Overview */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="font-semibold mb-2">Performance Overview</h2>
        <p className="text-gray-500 text-sm">
          No data yet. Higher review ratings help selling more. 
          <a href="#" className="text-blue-500 hover:underline ml-1">Learn more about how to manage reviews</a>
        </p>
      </div>

      {/* Tools - à¦¤à§‹à¦®à¦¾à¦° Screenshot à¦à¦° à¦®à¦¤à§‹ 4 à¦Ÿà¦¾ Card */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="font-semibold mb-4">Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border p-4 rounded-lg hover:shadow-md cursor-pointer transition">
            <div className="text-blue-500 text-2xl mb-2">ðŸ’¬</div>
            <p className="font-semibold">Quick Reply</p>
            <p className="text-xs text-gray-500">Quick reply to your reviews</p>
          </div>
          <div className="border p-4 rounded-lg hover:shadow-md cursor-pointer transition">
            <div className="text-blue-500 text-2xl mb-2">ðŸ“Š</div>
            <p className="font-semibold">Review Analysis Center</p>
            <p className="text-xs text-gray-500">Know your reviews performance better</p>
          </div>
          <div className="border p-4 rounded-lg hover:shadow-md cursor-pointer transition">
            <div className="text-blue-500 text-2xl mb-2">ðŸŒ</div>
            <p className="font-semibold">External Review</p>
            <p className="text-xs text-gray-500">Manage imported reviews to your store</p>
          </div>
          <div className="border p-4 rounded-lg hover:shadow-md cursor-pointer transition">
            <div className="text-orange-500 text-2xl mb-2">â“</div>
            <p className="font-semibold">Customer Question</p>
            <p className="text-xs text-gray-500">Check and answer the questions from customers</p>
          </div>
        </div>
      </div>

      {/* Product Review Detail */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex gap-6 border-b mb-4">
          <button className="pb-2 border-b-2 border-orange-500 text-orange-500 font-semibold">Product's Review Detail</button>
          <button className="pb-2 text-gray-500 hover:text-gray-700">To Be Reviewed</button>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <select className="border px-3 py-2 rounded"><option>Status: All</option></select>
          <select className="border px-3 py-2 rounded"><option>Content: All</option></select>
          <select className="border px-3 py-2 rounded"><option>Rating: All</option></select>
        </div>

        <div className="text-center py-16 text-gray-400">
          No reviews to display
        </div>
      </div>
    </div>
  )
}
