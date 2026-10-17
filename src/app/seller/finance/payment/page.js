'use client'

const payments = [
  { id: 'PAY001', date: '05 Sep 2026', amount: 10000, method: 'bKash', status: 'Completed', txnId: 'TXN123456' },
  { id: 'PAY002', date: '20 Aug 2026', amount: 8500, method: 'Bank Transfer', status: 'Completed', txnId: 'TXN123455' },
  { id: 'PAY003', date: '10 Sep 2026', amount: 5000, method: 'Nagad', status: 'Processing', txnId: 'TXN123457' },
]

export default function PaymentPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">Homepage &gt; Finance &gt; Payment</p>
        <h1 className="text-2xl font-bold">Payment History</h1>
      </div>

      {/* Withdraw Button */}
      <div className="bg-white p-6 rounded-lg border flex justify-between items-center">
        <div>
          <h2 className="font-semibold">Request Withdrawal</h2>
          <p className="text-sm text-gray-500">Withdraw your available balance to bank or mobile wallet</p>
        </div>
        <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600">
          + Request Withdraw
        </button>
      </div>

      {/* Payment Table */}
      <div className="bg-white p-6 rounded-lg border overflow-x-auto">
        <h2 className="font-semibold mb-4">Payment Records</h2>
        <table className="w-full text-sm">
          <thead className="text-left text-gray-500 border-b">
            <tr>
              <th className="pb-3">Date</th>
              <th className="pb-3">Payment ID</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Method</th>
              <th className="pb-3">Txn ID</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="py-3">{p.date}</td>
                <td>{p.id}</td>
                <td className="font-medium">à§³ {p.amount}</td>
                <td>{p.method}</td>
                <td className="text-gray-500">{p.txnId}</td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs ${
                    p.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
