'use client'

const returns = [
  { id: 'RET001', orderId: 'ORD12340', customer: 'Nayeem Islam', reason: 'Damaged Product', status: 'Pending', date: '08 Sep 2026', amount: 1200 },
  { id: 'RET002', orderId: 'ORD12338', customer: 'Tania Akter', reason: 'Wrong Size', status: 'Approved', date: '06 Sep 2026', amount: 850 },
]

export default function ReturnOrdersPage() {
  const getStatusColor = (status) => {
    if(status === 'Pending') return 'bg-yellow-100 text-yellow-700'
    if(status === 'Approved') return 'bg-blue-100 text-blue-700'
    return 'bg-green-100 text-green-700'
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">Homepage &gt; Orders &gt; Return Orders</p>
        <h1 className="text-2xl font-bold">Return Orders</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-500">Pending Returns</p>
          <p className="text-2xl font-bold">1</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-500">Approved</p>
          <p className="text-2xl font-bold">1</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-500">Total Refund</p>
          <p className="text-2xl font-bold">à§³ 850</p>
        </div>
      </div>

      {/* Return Table */}
      <div className="bg-white p-6 rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-500 border-b">
            <tr>
              <th className="pb-3">Return ID</th>
              <th className="pb-3">Order ID</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Reason</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {returns.map(r => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="py-3 font-medium">{r.id}</td>
                <td className="text-blue-500">{r.orderId}</td>
                <td>{r.customer}</td>
                <td>{r.reason}</td>
                <td>à§³ {r.amount}</td>
                <td><span className={`px-2 py-1 rounded text-xs ${getStatusColor(r.status)}`}>{r.status}</span></td>
                <td>
                  <button className="text-orange-500 hover:underline">Process</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
