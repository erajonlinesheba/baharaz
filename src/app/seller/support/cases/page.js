export default function MyCasesPage() {
  const cases = [
    { id: "#C1001", subject: "Payment not received", status: "Open", date: "2026-09-08", priority: "High" },
    { id: "#C1002", subject: "Product listing rejected", status: "In Progress", date: "2026-09-07", priority: "Medium" },
    { id: "#C1003", subject: "Order delivery issue", status: "Resolved", date: "2026-09-06", priority: "Low" },
  ]

  const getStatusColor = (status) => {
    if(status === "Open") return "bg-red-100 text-red-600"
    if(status === "In Progress") return "bg-yellow-100 text-yellow-600"
    return "bg-green-100 text-green-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">ðŸŽ« My Cases <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">New</span></h1>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">+ Create New Case</button>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-lg font-bold mb-4">All Cases</h2>
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b">
              <th className="p-3">Case ID</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Date</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {cases.map(c => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{c.id}</td>
                <td className="p-3">{c.subject}</td>
                <td className="p-3">{c.date}</td>
                <td className="p-3">{c.priority}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded text-xs ${getStatusColor(c.status)}`}>{c.status}</span></td>
                <td className="p-3 text-orange-500 cursor-pointer">View</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-lg font-bold mb-3">Case Statistics</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <p className="text-gray-500 text-sm">Open</p>
            <p className="text-2xl font-bold text-red-500">1</p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-gray-500 text-sm">In Progress</p>
            <p className="text-2xl font-bold text-yellow-500">1</p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-gray-500 text-sm">Resolved</p>
            <p className="text-2xl font-bold text-green-500">1</p>
          </div>
        </div>
      </div>
    </div>
  )
}
