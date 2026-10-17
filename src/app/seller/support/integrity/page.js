export default function IntegrityPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">ðŸ›¡ï¸ Integrity & Reporting <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">New</span></h1>

      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
        <p className="font-semibold text-red-700">Report Violations Anonymously</p>
        <p className="text-sm text-red-600">Help us keep Baharaz safe. All reports are confidential.</p>
      </div>

      <div className="bg-white p-6 rounded-lg border space-y-4">
        <h2 className="text-lg font-bold">Submit a Report</h2>
        
        <div>
          <label className="block text-sm font-medium mb-1">Report Type</label>
          <select className="w-full border rounded-lg px-3 py-2">
            <option>Fake Product</option>
            <option>Fraudulent Seller</option>
            <option>Price Manipulation</option>
            <option>Copyright Violation</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Product/Store Link</label>
          <input type="text" placeholder="https://Baharaz.com.bd/..." className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea rows="4" placeholder="Describe the issue in detail..." className="w-full border rounded-lg px-3 py-2"></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Upload Evidence</label>
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <p className="text-gray-500">ðŸ“Ž Click to upload screenshots</p>
          </div>
        </div>

        <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 font-semibold">
          Submit Report
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-lg font-bold mb-3">My Submitted Reports</h2>
        <p className="text-gray-500 text-sm">No reports submitted yet</p>
      </div>
    </div>
  )
}
