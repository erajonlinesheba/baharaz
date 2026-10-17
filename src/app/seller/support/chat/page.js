export default function ChatWithUsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">ðŸ’¬ Chat with us</h1>

      <div className="bg-white rounded-lg border flex h-[600px]">
        {/* Left: Agent List */}
        <div className="w-80 border-r p-4">
          <h2 className="font-bold mb-4">Support Agents</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg cursor-pointer">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">A</div>
              <div>
                <p className="font-medium">Agent Ayesha</p>
                <p className="text-xs text-green-600">â— Online</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white">R</div>
              <div>
                <p className="font-medium">Agent Rahim</p>
                <p className="text-xs text-gray-500">â— Offline</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Chat Window */}
        <div className="flex-1 flex-col">
          <div className="p-4 border-b">
            <p className="font-bold">Chat with Agent Ayesha</p>
            <p className="text-sm text-gray-500">Usually replies in 2 minutes</p>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            <div className="bg-gray-100 p-3 rounded-lg max-w-xs">
              <p className="text-sm">Hello! How can I help you today?</p>
              <p className="text-xs text-gray-500 mt-1">9:30 AM</p>
            </div>
            <div className="bg-orange-500 text-white p-3 rounded-lg max-w-xs ml-auto">
              <p className="text-sm">I need help with my payment</p>
              <p className="text-xs text-orange-200 mt-1">9:31 AM</p>
            </div>
          </div>

          <div className="p-4 border-t flex gap-2">
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="flex-1 border rounded-lg px-4 py-2" 
            />
            <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}
