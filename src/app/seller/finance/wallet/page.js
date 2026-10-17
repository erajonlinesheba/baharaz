'use client'

export default function WalletPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">Homepage &gt; Finance &gt; Wallet</p>
        <h1 className="text-2xl font-bold">Wallet</h1>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white p-6 rounded-lg">
        <p className="text-sm opacity-90">Available Balance</p>
        <p className="text-2xl md:text-4xl font-bold mt-2">à§³ 12,450.00</p>
        <div className="flex gap-3 mt-4">
          <button className="bg-white text-orange-500 px-4 py-2 rounded font-medium">Withdraw</button>
          <button className="border border-white px-4 py-2 rounded font-medium">Transaction History</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-500">Pending Amount</p>
          <p className="text-2xl font-bold">à§³ 3,200.00</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-500">This Month Earned</p>
          <p className="text-2xl font-bold">à§³ 45,600.00</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-500">Last Withdraw</p>
          <p className="text-2xl font-bold">à§³ 10,000.00</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="font-semibold mb-4">Recent Transactions</h2>
        <table className="w-full text-sm">
          <thead className="text-left text-gray-500 border-b">
            <tr>
              <th className="pb-2">Date</th>
              <th className="pb-2">Type</th>
              <th className="pb-2">Amount</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-3">08 Sep 2026</td>
              <td>Order Payment</td>
              <td className="text-green-600">+à§³ 1,250.00</td>
              <td><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Success</span></td>
            </tr>
            <tr>
              <td className="py-3">05 Sep 2026</td>
              <td>Withdraw</td>
              <td className="text-red-600">-à§³ 5,000.00</td>
              <td><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">Processing</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
