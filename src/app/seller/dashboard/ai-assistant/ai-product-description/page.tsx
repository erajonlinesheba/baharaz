'use client'
import { useState } from 'react'

export default function AiBulkDescriptionPage() {
  const [productNames, setProductNames] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    if(!productNames.trim()) return alert("Minimum 1 ta Product Name likho")
    setLoading(true)
    setResult('')
    setCopied(false)
    try {
      const prompt = `Tumi ekjon E-commerce Expert. Nicher prottekta Product er jonno alada alada 2 line er akorshoniyo Bangla Product Description likho. Prottekta description er age Product er naam diye : diye suru korba. Feature + Benefit + 1 ta Emoji thakte hobe.
      
      Product List:
      ${productNames}`
      
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })

      const data = await res.json()
      
      if(res.ok) {
        setResult(data.text)
      } else {
        setResult('Error: ' + data.error)
      }

    } catch (error: any) {
      setResult('Error: ' + error.message)
    }
    setLoading(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">AI Bulk Description</h1>
      <p className="text-gray-600 mb-4">10 ta product er naam comma diye likho. AI 10 ta description ekbare diye dibe</p>
      
      <textarea 
        value={productNames} 
        onChange={e=>setProductNames(e.target.value)} 
        placeholder="ex: Wireless Headphone, Cotton T-shirt, Smart Watch, Running Shoe, Backpack"
        rows={5}
        className="border p-3 w-full mt-2 rounded focus:ring-2 focus:ring-red-500 outline-none"
      />
      
      <button 
        onClick={generate} 
        disabled={loading} 
        className="bg-red-500 text-white px-6 py-3 rounded mt-4 w-full font-bold hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
      >
        {loading? '✨ 10 ta Description Banacche...' : '✨ Bulk Generate করো'}
      </button>
      
      {result && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-lg">Result:</h2>
            <button 
              onClick={handleCopy}
              className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-1.5 rounded transition"
            >
              {copied ? '✅ Copied!' : '📋 All Copy করো'}
            </button>
          </div>
          <pre className="whitespace-pre-wrap text-gray-800 font-sans">{result}</pre>
        </div>
      )}
    </div>
  )
}