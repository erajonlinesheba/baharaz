import Link from "next/link"
export default function Careers(){
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="pt-[110px] md:pt-[130px] pb-6">
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white shadow rounded-full text-sm font-bold">← Back to Home</Link>
        </div>
        <div className="bg-gray-900 text-white rounded-[20px] md:rounded-[32px] p-5 md:p-8 md:p-6 md:p-12">
          <h1 className="text-2xl md:text-4xl font-black">Join Baharaz</h1>
          <p className="text-gray-300 mt-2">Build the future of e-commerce</p>
        </div>
      </div>
    </div>
  )
}

