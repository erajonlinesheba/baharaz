// src/components/ProductInfo.jsx - FULL CODE
'use client'
import { useState } from 'react'
import { Star, ShieldCheck, Truck, Store, Minus, Plus, ShoppingCart, Zap, Heart } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'

export default function ProductInfo({ product }) {
  const { addToCart } = useCart()
  const [qty, setQty] = useState(1)
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null)
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null)

  const discount = product.original_price? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0

  const handleAdd = () => {
    addToCart(product, qty, { color: selectedColor, size: selectedSize })
    alert('Added to Cart! 🛒')
  }

  return (
    <div className="bg-white rounded-xl p-4 lg:p-5 space-y-4">
      {/* Title */}
      <h1 className="text-[18px] lg:text-[20px] font-normal text-[#212121] leading-6">{product.name}</h1>

      {/* Rating + Brand */}
      <div className="flex items-center gap-3 text-[12px]">
        <div className="flex items-center gap-1">
          <Star size={12} className="fill-[#ffca28] text-[#ffca28]" />
          <span className="font-bold">{product.rating || 4.8}</span>
          <span className="text-gray-500">({product.review_count || 234} Ratings)</span>
        </div>
        <span className="text-gray-300">|</span>
        <span className="text-[#1a9cb7]">Brand: <Link href={`/brand/${product.brand}`} className="font-bold">{product.brand || 'BaharaZ'}</Link></span>
        {product.verified && <span className="flex items-center gap-1 text-blue-600"><ShieldCheck size={12} /> Verified</span>}
      </div>

      {/* Price */}
      <div className="bg-[#f5f5f5] p-3 rounded-lg">
        <div className="flex items-baseline gap-3">
          <span className="text-[26px] font-bold text-[#f85606]">৳{Number(product.price).toLocaleString()}</span>
          {product.original_price && (
            <>
              <span className="text-[14px] text-gray-400 line-through">৳{Number(product.original_price).toLocaleString()}</span>
              <span className="bg-[#f85606] text-white text-[12px] px-2 py-0.5 rounded">-{discount}%</span>
            </>
          )}
        </div>
        <p className="text-[11px] text-gray-500 mt-1">Inclusive of VAT • EMI from ৳{Math.round(product.price / 12)}/month • <span className="text-[#1a9cb7]">Details</span></p>
      </div>

      {/* Variants - Color */}
      {product.colors && (
        <div>
          <p className="text-[13px] font-bold mb-2">Color Family: <span className="font-normal">{selectedColor}</span></p>
          <div className="flex gap-2">
            {product.colors.map(c => (
              <button key={c} onClick={() => setSelectedColor(c)} className={`w-9 h-9 rounded-full border-2 ${selectedColor === c? 'border-[#f85606] ring-2 ring-[#f85606]/20' : 'border-gray-200'}`} style={{ backgroundColor: c.toLowerCase() }} title={c}></button>
            ))}
          </div>
        </div>
      )}

      {/* Variants - Size */}
      {product.sizes && (
        <div>
          <p className="text-[13px] font-bold mb-2">Size: <span className="font-normal">{selectedSize}</span></p>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map(s => (
              <button key={s} onClick={() => setSelectedSize(s)} className={`px-4 py-2 border rounded text-[12px] ${selectedSize === s? 'border-[#f85606] bg-[#fff7f3] text-[#f85606] font-bold' : 'border-gray-200 hover:border-gray-400'}`}>{s}</button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="flex items-center gap-4">
        <p className="text-[13px] font-bold">Quantity:</p>
        <div className="flex items-center border rounded">
          <button onClick={() => setQty(q => Math.max(1, q - 1))} className="p-2 hover:bg-gray-50"><Minus size={14} /></button>
          <span className="px-4 text-[13px] font-bold border-x">{qty}</span>
          <button onClick={() => setQty(q => Math.min(product.stock || 10, q + 1))} className="p-2 hover:bg-gray-50"><Plus size={14} /></button>
        </div>
        <span className="text-[11px] text-gray-500">{product.stock || 99} pieces available</span>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button onClick={handleAdd} className="flex-1 bg-[#2abbe8] hover:bg-[#1da3cc] text-white font-bold text-[13px] py-3 rounded flex items-center justify-center gap-2">
          <ShoppingCart size={16} /> Add to Cart
        </button>
        <Link href="/cart" onClick={handleAdd} className="flex-1 bg-[#f85606] hover:bg-[#e04d05] text-white font-bold text-[13px] py-3 rounded flex items-center justify-center gap-2 text-center">
          <Zap size={16} /> Buy Now
        </Link>
      </div>

      {/* Delivery Info - New Future */}
      <div className="border-t pt-4 space-y-3 text-[12px]">
        <div className="flex gap-3"><Truck size={16} className="text-gray-500 mt-0.5" /><div><p className="font-bold">Delivery Options</p><p className="text-gray-600">Dhaka 2-3 days, Outside Dhaka 3-5 days • Free Delivery over ৳500 • Cash on Delivery Available</p></div></div>
        <div className="flex gap-3"><Store size={16} className="text-gray-500 mt-0.5" /><div><p className="font-bold">Sold by {product.seller_name || 'BaharaZ Official'}</p><p className="text-[#1a9cb7]">Chat with Seller • 98% Positive • 1.2k Followers</p></div></div>
      </div>
    </div>
  )
}