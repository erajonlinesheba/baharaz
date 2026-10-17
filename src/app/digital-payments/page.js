import Link from "next/link"
import { Lock, Shield, CreditCard } from "lucide-react"
export default function DigitalPayments(){
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="pt-[110px] md:pt-[130px] pb-6">
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white shadow rounded-full text-sm font-bold">← Back to Home</Link>
        </div>
        <h1 className="text-2xl md:text-4xl font-black">Digital Payments</h1>
        <p className="text-gray-500 mt-2">Safe and secure payment options</p>
        
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="border-2 border-pink-100 bg-pink-50 p-6 rounded-2xl">
            <CreditCard className="text-pink-500 mb-3" />
            <h3 className="font-bold">bKash / Nagad</h3>
            <p className="text-sm text-gray-500 mt-1">Pay instantly</p>
          </div>
          <div className="border-2 border-blue-100 bg-blue-50 p-6 rounded-2xl">
            <CreditCard className="text-blue-500 mb-3" />
            <h3 className="font-bold">Cards</h3>
            <p className="text-sm text-gray-500 mt-1">Visa, MasterCard</p>
          </div>
          <div className="border-2 border-green-100 bg-green-50 p-6 rounded-2xl">
            <Shield className="text-green-500 mb-3" />
            <h3 className="font-bold">Cash on Delivery</h3>
            <p className="text-sm text-gray-500 mt-1">Pay on delivery</p>
          </div>
        </div>

        <div className="mt-8 bg-gray-900 text-white p-6 rounded-[20px] flex gap-4 items-center">
          <Lock className="text-[#f85606]" />
          <div>
            <h4 className="font-bold">100% Secure</h4>
            <p className="text-sm text-gray-400">Your payment is encrypted and safe</p>
          </div>
        </div>

      </div>
    </div>
  )
}

