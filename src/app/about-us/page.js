import Link from "next/link"
import { Shield, Package, Users } from "lucide-react"

export default function AboutUs(){
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="pt-[110px] md:pt-[130px] pb-4">
          <Link href="/" className="inline-flex px-4 py-2 bg-white shadow rounded-full text-xs md:text-sm font-bold">
            ← Back to Home
          </Link>
        </div>

        <div className="bg-white border rounded-[20px] md:rounded-[32px] p-6 md:p-10">
          <h1 className="text-[22px] md:text-4xl font-black">About Baharaz</h1>
          <p className="mt-2 text-[12px] md:text-sm text-gray-500 leading-relaxed">
            Baharaz is Bangladesh fastest growing e-commerce platform. We deliver happiness to millions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-50 p-4 rounded-xl flex gap-3">
              <Package size={18} className="text-orange-500" />
              <div>
                <h3 className="font-bold text-sm">10M+ Products</h3>
                <p className="text-[11px] text-gray-500">Best collection</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl flex gap-3">
              <Users size={18} className="text-blue-500" />
              <div>
                <h3 className="font-bold text-sm">50k+ Sellers</h3>
                <p className="text-[11px] text-gray-500">Trusted partners</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl flex gap-3">
              <Shield size={18} className="text-green-500" />
              <div>
                <h3 className="font-bold text-sm">100% Safe</h3>
                <p className="text-[11px] text-gray-500">Secure payment</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}