'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function ImageSearch() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState('')

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setFileName(file.name)
    setLoading(true)
    // Demo: image name diye search - Real e AI lagbe - Baharaz Level
    const searchTerm = file.name.split('.')[0].split('-')[0].split('_')[0] || 'mini';
    const { data } = await supabase.from('products').select('*').ilike('name', `%${searchTerm}%`).limit(6)
    if (!data || data.length === 0) {
      const { data: all } = await supabase.from('products').select('*').ilike('name', `%mini%`).limit(6)
      if(all && all.length > 0) setResults(all)
      else {
        const { data: all2 } = await supabase.from('products').select('*').limit(6)
        setResults(all2 || [])
      }
    } else setResults(data)
    setLoading(false)
  }

  return (
    <div className="bg-white p-4 mt-3 rounded-xl border-2 border-dashed border-[#F85606]/30 hover:border-[#F85606] transition-colors">
      <h2 className="font-bold text-[13px] flex items-center gap-2"><span className="bg-[#FFF1EB] w-6 h-6 rounded-full flex items-center justify-center">📸</span> Image Search - Chobi diye khujo</h2>
      <p className="text-[11px] text-gray-500 mt-1">Mini fan er chobi upload koro, similar product dekhabe</p>
      <input type="file" accept="image/*" onChange={handleUpload} className="mt-3 text-[12px] w-full file:bg-[#F85606] file:text-white file:border-0 file:rounded-full file:px-4 file:py-1 file:text-[11px] file:font-bold" />
      {fileName && <p className="text-[11px] mt-2 text-[#F85606] font-medium">Searching for: {fileName}</p>}
      {loading && <div className="text-[12px] mt-3 flex items-center gap-2"><span className="w-4 h-4 border-2 border-orange-200 border-t-[#F85606] rounded-full animate-spin"></span> AI khujtese...</div>}
      {results.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-3">
          {results.map(p => <div key={p.id} className="border rounded-lg p-1 text-[11px] hover:border-[#F85606] transition-colors"><img src={p.image || '/placeholder.png'} className="h-20 w-full object-contain bg-gray-50 rounded" alt="" /><p className="line-clamp-1 mt-1 font-medium">{p.name}</p><p className="text-[#F85606] font-bold">৳{p.price}</p></div>)}
        </div>
      )}
    </div>
  )
}