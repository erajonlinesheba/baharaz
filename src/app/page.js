export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow sticky top-0">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">BAHARAZ</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Cart 0</button>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-20 px-4">
        <h1 className="text-5xl font-bold mb-4">Welcome to BAHARAZ</h1>
        <p className="text-xl mb-6">বাংলাদেশের সবচেয়ে বড় অনলাইন শপিং প্ল্যাটফর্ম</p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold">Shop Now</button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6 mt-10">
        <p>© 2026 BAHARAZ. All rights reserved.</p>
      </footer>
    </main>
  )
}