'use client'
import { useState } from 'react'

const shippingRates = {
  'Rajshahi': 60, 'Dhaka': 120, 'Chittagong': 120, 'Khulna': 100, 'Barisal': 110, 'Sylhet': 120, 'Rangpur': 80, 'Mymensingh': 100, 'Default': 120
}

export default function ShippingCalculator({ onChargeChange }) {
  const [district, setDistrict] = useState('Rajshahi')
  const charge = shippingRates[district] || shippingRates['Default']

  const handleChange = (e) => {
    const d = e.target.value
    setDistrict(d)
    const c = shippingRates[d] || 120
    if (onChargeChange) onChargeChange(c, d)
  }

  return (
    <div className="bg-white p-3 mt-2 rounded border">
      <div className="font-bold text-[13px]">Live Delivery Charge - REAL</div>
      <div className="mt-2 flex gap-2 items-center">
        <select value={district} onChange={handleChange} className="border p-2 rounded w-full text-[13px]">
          {Object.keys(shippingRates).map(k => k!== 'Default' && <option key={k} value={k}>{k}</option>)}
        </select>
        <div className="font-bold text-[#f85606]">৳ {charge}</div>
      </div>
      <div className="text-[11px] text-gray-500 mt-1">Rajshahir vitore ৳60, baire ৳120 - Auto update hobe</div>
    </div>
  )
}