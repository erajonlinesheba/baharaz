'use client'

export default function DuoFlashPage() {
  const campaigns = [] // à¦à¦–à¦¾à¦¨à§‡ à¦ªà¦°à§‡ API à¦¥à§‡à¦•à§‡ Data à¦†à¦¸à¦¬à§‡

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          DuoFlash <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded">New</span>
        </h1>
        <p className="text-gray-500">Create powerful flash sale campaigns to boost sales</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-500">Active Campaigns</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-500">Total Sales</p>
          <p className="text-2xl font-bold">à§³0</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-500">Visitors</p>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>

      {/* Create Button */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="font-semibold mb-4">Apply for DuoFlash</h2>
        <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 font-medium">
          + Create New Campaign
        </button>
      </div>

      {/* Campaign List */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="font-semibold mb-4">My DuoFlash Campaigns</h2>
        {campaigns.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">ðŸ“¢</div>
            <p className="text-gray-500">No campaigns yet. Create your first DuoFlash!</p>
          </div>
        ) : (
          <div>List here</div>
        )}
      </div>
    </div>
  )
}
