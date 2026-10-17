export default function FinancePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Finance</h1>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-gray-500 text-sm">Available Balance</p>
          <p className="text-3xl font-bold text-green-600">à§³12,450</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-gray-500 text-sm">Pending Balance</p>
          <p className="text-3xl font-bold text-orange-500">à§³3,200</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-gray-500 text-sm">Total Earned</p>
          <p className="text-3xl font-bold">à§³45,600</p>
        </div>
      </div>

      {/* Withdraw Button */}
      <div className="bg-white p-6 rounded-lg border">
        <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 font-semibold">Withdraw Money</button>
      </div>

      {/* Transaction History */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-bold mb-4">Transaction History</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm text-gray-500">
              <th className="pb-2">Date</th>
              <th className="pb-2">Type</th>
              <th className="pb-2">Amount</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-3">2026-09-08</td>
              <td className="py-3">Order #1023</td>
              <td className="py-3 text-green-600">+à§³1,200</td>
              <td className="py-3"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Completed</span></td>
            </tr>
            <tr>
              <td className="py-3">2026-09-07</td>
              <td className="py-3">Withdraw</td>
              <td className="py-3 text-red-600">-à§³5,000</td>
              <td className="py-3"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">Processing</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
