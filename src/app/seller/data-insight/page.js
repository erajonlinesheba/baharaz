export default function DataInsightPage() {
  const stats = [
    { title: "7 à¦¦à¦¿à¦¨à§‡à¦° à¦­à¦¿à¦‰", value: "0" },
    { title: "7 à¦¦à¦¿à¦¨à§‡à¦° à¦­à¦¿à¦œà¦¿à¦Ÿà¦°", value: "0" },
    { title: "7 à¦¦à¦¿à¦¨à§‡à¦° à¦…à¦°à§à¦¡à¦¾à¦°", value: "0" },
    { title: "Conversion Rate", value: "0%" },
  ]

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Data Insight</h1>
      <p className="text-gray-500">à¦†à¦ªà¦¨à¦¾à¦° Shop à¦à¦° Performance à¦¦à§‡à¦–à§à¦¨</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.title} className="bg-white p-4 rounded-lg border">
            <p className="text-gray-500 text-sm">{s.title}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h3 className="font-bold mb-4">Sales Trend - Last 7 Days</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
          <p className="text-gray-400">à¦à¦–à¦¾à¦¨à§‡ à¦ªà¦°à§‡ Chart à¦†à¦¸à¦¬à§‡ ðŸ“Š</p>
        </div>
      </div>
    </div>
  )
}
