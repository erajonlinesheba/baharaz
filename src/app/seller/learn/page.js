export default function LearnPage() {
  const courses = [
    { id: 1, title: "How to Start Selling on Baharaz", duration: "15 min", views: "155,144" },
    { id: 2, title: "Product Listing Masterclass", duration: "25 min", views: "98,234" },
    { id: 3, title: "Marketing & Promotion Guide", duration: "20 min", views: "76,543" },
    { id: 4, title: "Order Management & Delivery", duration: "18 min", views: "65,120" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">ðŸŽ“ Baharaz University</h1>
        <p className="text-gray-500">Learn and Grow Your Business</p>
      </div>

      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-2">New Seller Package</h2>
        <p>Your first track to success on Baharaz</p>
        <button className="bg-white text-orange-500 px-4 py-2 rounded-lg mt-3 font-semibold">Start Learning</button>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4">Recommended Courses</h2>
        <div className="grid grid-cols-2 gap-4">
          {courses.map(course => (
            <div key={course.id} className="bg-white p-4 rounded-lg border hover:shadow-lg cursor-pointer">
              <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                <span className="text-2xl md:text-4xl">ðŸ“¹</span>
              </div>
              <h3 className="font-semibold mb-1">{course.title}</h3>
              <div className="flex justify-between text-sm text-gray-500">
                <span>â±ï¸ {course.duration}</span>
                <span>ðŸ‘ï¸ {course.views} views</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-lg font-bold mb-3">Popular Toolkit</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 border rounded-lg hover:bg-orange-50 cursor-pointer">
            <div className="text-3xl mb-2">ðŸ“¢</div>
            <p className="text-sm font-medium">Marketing Solutions</p>
          </div>
          <div className="text-center p-4 border rounded-lg hover:bg-orange-50 cursor-pointer">
            <div className="text-3xl mb-2">ðŸ“‹</div>
            <p className="text-sm font-medium">Regulations</p>
          </div>
          <div className="text-center p-4 border rounded-lg hover:bg-orange-50 cursor-pointer">
            <div className="text-3xl mb-2">â“</div>
            <p className="text-sm font-medium">FAQ</p>
          </div>
        </div>
      </div>
    </div>
  )
}
