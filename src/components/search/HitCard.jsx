import Link from "next/link";

export default function HitCard({ hit }) {
  return (
    <Link 
      prefetch={false}
      href={`/product/${hit.objectID}`} 
      className="flex gap-3 p-3 hover:bg-[#FFF1EB] rounded-xl border border-transparent hover:border-orange-100 transition-all group"
    >
      <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border">
        {hit.image ? (
          <img 
            src={hit.image} 
            alt={hit.title || hit.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">No Img</div>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <h4 className="font-semibold text-[13px] line-clamp-1 group-hover:text-[#F85606]">{hit.title || hit.name}</h4>
        <p className="text-[11px] text-gray-500">{hit.category} • {hit.brand}</p>
        <p className="text-[13px] font-bold mt-1 text-[#F85606]">৳ {hit.price || "—"}</p>
        {hit.in_stock ? (
          <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold">In Stock</span>
        ) : (
          <span className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full">Out of Stock</span>
        )}
      </div>
    </Link>
  );
}