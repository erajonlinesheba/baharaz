'use client'

export default function ProductDetailsTab({ product }) {
  return (
    <div className="bg-white mt-3 rounded">
      <div className="border-b px-4 py-3 flex gap-6">
        <span className="font-bold text-[14px] border-b-2 border-[#f85606] pb-3 text-[#f85606]">Product Details</span>
      </div>
      <div className="p-4">
        <h2 className="font-bold text-[14px] mb-2">{product.name}</h2>
        <div className="text-[13px] leading-7 text-[#212121] whitespace-pre-wrap break-words">
          {product.description || "No Description"}
        </div>
        {product.description_html && (
          <div className="mt-4 text-[13px] leading-6" dangerouslySetInnerHTML={{ __html: product.description_html }}></div>
        )}
        {product.images && product.images.length > 1 && (
          <div className="mt-6 space-y-4">
            {product.images.map((img, i) => (
              <img key={i} src={img} alt="detail" className="w-full max-w-[750px] mx-auto border" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}