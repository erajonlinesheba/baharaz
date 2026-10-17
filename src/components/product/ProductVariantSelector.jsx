'use client'
import { useState, useEffect } from 'react'

export default function ProductVariantSelector({ product, onVariantChange }) {
  const [selectedColor, setSelectedColor] = useState(product?.variants?.[0]?.color || null)
  const [selectedSize, setSelectedSize] = useState(product?.variants?.[0]?.size || null)
  const [activeVariant, setActiveVariant] = useState(product?.variants?.[0] || null)

  useEffect(() => {
    if (!product?.variants) return
    let v = product.variants.find(v => v.color === selectedColor && v.size === selectedSize)
    if (!v) v = product.variants.find(v => v.color === selectedColor) || product.variants[0]
    setActiveVariant(v)
    if (onVariantChange) onVariantChange(v)
  }, [selectedColor, selectedSize, product])

  if (!product?.variants || product.variants.length === 0) return null

  const colors = [...new Set(product.variants.map(v => v.color).filter(Boolean))]
  const sizes = [...new Set(product.variants.map(v => v.size).filter(Boolean))]

  return (
    <div className="bg-white p-3 mt-2 rounded">
      {colors.length > 0 && (
        <div className="mb-3">
          <div className="font-bold text-[13px] mb-2">Color: <span className="font-normal">{selectedColor}</span></div>
          <div className="flex gap-2 flex-wrap">
            {colors.map(c => (
              <button key={c} onClick={() => setSelectedColor(c)} className={`w-[40px] h-[40px] rounded border-2 ${selectedColor === c? 'border-[#f85606]' : 'border-gray-200'}`} style={{ background: c.toLowerCase() }} title={c}></button>
            ))}
          </div>
        </div>
      )}
      {sizes.length > 0 && (
        <div className="mb-3">
          <div className="font-bold text-[13px] mb-2">Size: <span className="font-normal">{selectedSize}</span></div>
          <div className="flex gap-2 flex-wrap">
            {sizes.map(s => (
              <button key={s} onClick={() => setSelectedSize(s)} className={`px-3 py-1 border rounded text-[13px] ${selectedSize === s? 'bg-black text-white border-black' : 'bg-white border-gray-300'}`}>{s}</button>
            ))}
          </div>
        </div>
      )}
      {activeVariant && (
        <div className="mt-2 text-[12px]">
          {activeVariant.stock <= 3 && activeVariant.stock > 0 && <div className="text-red-600 font-bold">Only {activeVariant.stock} left in stock!</div>}
          {activeVariant.stock === 0 && <div className="text-red-600 font-bold">Out of Stock</div>}
          {product.free_shipping && <span className="bg-green-500 text-white px-2 py-0.5 rounded text-[10px] ml-2">Free Shipping</span>}
          {product.is_flash_sale && <span className="bg-orange-500 text-white px-2 py-0.5 rounded text-[10px] ml-2">Flash Sale</span>}
        </div>
      )}
    </div>
  )
}