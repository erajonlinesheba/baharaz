'use client'

export default function SellerHomePage() {
  const todos = [
    { id: 1, title: 'Email', done: true },
    { id: 2, title: 'Address', done: false },
    { id: 3, title: 'ID Bank', done: false },
    { id: 4, title: 'Product', done: false },
  ]

  const university = [
    { title: 'New Seller Package', views: '156,353', img: '🆕' },
    { title: 'Baharaz Marketing Solutions | Terms and Conditions', views: '51,801', img: '📢' },
    { title: 'Ultimate Guide to Marketing on Baharaz', views: '45,126', img: '📈' },
    { title: 'Improve your Product Content Quality', views: '54,241', img: '✨' },
  ]

  const toolkit = [
    { title: 'Marketing Solutions', icon: '📣' },
    { title: 'Regular Voucher', icon: '🎟️' },
    { title: 'Free Shipping', icon: '🚚' },
    { title: 'Coins Discount', icon: '🪙' },
    { title: 'Education Livestream', icon: '📺' },
    { title: '11.11 Guide', icon: '📊' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">☁️</div>
          <h1 className="text-xl font-bold">dulaltelecom</h1>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg text-sm">
          <p className="font-semibold">Important Notification</p>
          <p className="text-gray-500">You are updated! No new important notification for you</p>
        </div>
      </div>

      {/* To Do Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white p-6 rounded-lg">
        <h2 className="font-bold mb-4">To Do</h2>
        <div className="grid grid-cols-4 gap-4 text-center">
          {todos.map(todo => (
            <div key={todo.id}>
              <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 ${
                todo.done ? 'bg-white text-orange-500' : 'border-2 border-white'
              }`}>
                {todo.done ? '✓' : todo.id}
              </div>
              <p className="text-sm">{todo.title}</p>
            </div>
          ))}
        </div>

        <div className="bg-white text-black p-10 rounded-lg mt-6 text-center">
          <div className="text-6xl mb-3">🏪</div>
          <p className="font-semibold">Add a pick-up address</p>
          <p className="text-sm text-gray-500 mb-4">no video</p>
          <button className="bg-orange-500 text-white px-10 py-2 rounded font-medium hover:bg-orange-600">
            Add
          </button>
        </div>
      </div>

      {/* Baharaz University */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold">Baharaz University</h2>
          <button className="text-sm text-gray-500">More &gt;</button>
        </div>
        <p className="text-sm text-gray-500 mb-4">Recommendation based on previous learning history</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {university.map((item, i) => (
            <div key={i} className="border rounded-lg p-3 hover:shadow-md cursor-pointer">
              <div className="bg-gray-100 h-24 rounded flex items-center justify-center text-3xl mb-2">{item.img}</div>
              <p className="font-medium text-sm">{item.title}</p>
              <p className="text-xs text-gray-500">👁️ {item.views}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Toolkit */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="font-bold mb-4">Popular Toolkit</h2>
        <p className="text-sm text-gray-500 mb-4">Best in class education to support your business growth</p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
          {toolkit.map((item, i) => (
            <div key={i} className="border rounded-lg p-4 hover:bg-orange-50 cursor-pointer">
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="text-xs font-medium">{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-gray-400">Baharaz 2024. All rights reserved.</p>
    </div>
  )
}