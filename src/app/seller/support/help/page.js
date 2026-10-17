export default function HelpCenterPage() {
  const faqs = [
    { id: 1, question: "How to add a new product?", category: "Products" },
    { id: 2, question: "How to track my orders?", category: "Orders" },
    { id: 3, question: "What are the seller fees?", category: "Finance" },
    { id: 4, question: "How to withdraw money?", category: "Finance" },
    { id: 5, question: "How to handle returns?", category: "Orders" },
    { id: 6, question: "How to run ads?", category: "Marketing" },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">â“ Help Center</h1>

      <div className="bg-white p-6 rounded-lg border">
        <input 
          type="text" 
          placeholder="Search for help articles..." 
          className="w-full border rounded-lg px-4 py-3" 
        />
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-lg font-bold mb-4">Popular Topics</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg hover:bg-orange-50 cursor-pointer text-center">
            <div className="text-3xl mb-2">ðŸ“¦</div>
            <p className="font-medium">Products</p>
          </div>
          <div className="p-4 border rounded-lg hover:bg-orange-50 cursor-pointer text-center">
            <div className="text-3xl mb-2">ðŸ›’</div>
            <p className="font-medium">Orders</p>
          </div>
          <div className="p-4 border rounded-lg hover:bg-orange-50 cursor-pointer text-center">
            <div className="text-3xl mb-2">ðŸ’°</div>
            <p className="font-medium">Finance</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-lg font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map(faq => (
            <div key={faq.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{faq.question}</p>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{faq.category}</span>
                </div>
                <span className="text-gray-400">â€º</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-orange-50 p-6 rounded-lg border-orange-200">
        <h2 className="text-lg font-bold mb-2">Still need help?</h2>
        <p className="text-gray-600 mb-3">Contact our support team</p>
        <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">Chat with us</button>
      </div>
    </div>
  )
}
