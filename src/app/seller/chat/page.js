export default function ChatPage() {
  return (
    <div className="bg-white rounded-lg border h-[80vh] flex">
      {/* Left: Customer List */}
      <div className="w-1/3 border-r">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg">Messages</h2>
        </div>
        <div className="p-3 bg-orange-50 border-l-4 border-orange-500 cursor-pointer">
          <p className="font-semibold">Rahim Uddin</p>
          <p className="text-sm text-gray-500 truncate">Bhai iPhone er warranty ache?</p>
        </div>
        <div className="p-3 hover:bg-gray-50 cursor-pointer">
          <p className="font-semibold">Fatema Khatun</p>
          <p className="text-sm text-gray-500 truncate">Sofa er delivery kobe?</p>
        </div>
      </div>

      {/* Right: Chat Box */}
      <div className="flex-1 flex-col">
        <div className="p-4 border-b">
          <p className="font-bold">Rahim Uddin</p>
          <p className="text-sm text-gray-500">About: iPhone 15 Pro Max</p>
        </div>
        
        <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
          <div className="bg-gray-200 p-3 rounded-lg w-fit max-w-xs">
            Bhai iPhone er warranty ache?
          </div>
          <div className="bg-orange-500 text-white p-3 rounded-lg w-fit max-w-xs ml-auto">
            Ji vai, 1 year official warranty ache.
          </div>
          <div className="bg-gray-200 p-3 rounded-lg w-fit max-w-xs">
            Price ki komano jabe?
          </div>
        </div>

        <div className="p-4 border-t flex gap-2">
          <input 
            type="text" 
            placeholder="Type a message..." 
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" 
          />
          <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
