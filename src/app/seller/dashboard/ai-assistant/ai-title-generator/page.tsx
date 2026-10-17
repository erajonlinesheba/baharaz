'use client'
import { useState } from 'react'

export default function AiTitleGeneratorPage() {
  const [productName, setProductName] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const generate = async () => {
    if(!productName.trim()) return alert("Product Name likho")
    setLoading(true)
    setResult('')
    try {
      const prompt = `Tumi ekjon Baharaz/E-commerce SEO Expert. " ${productName} " ei product er jonno 5 ta SEO friendly, click-bait Bangla Product Title likho. Prottekta title 80 character er moddhe hote hobe. Important keyword age thakte hobe. Prottekta alada line e number diye likho.`
      
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

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">AI Title Generator</h1>
      <p className="text-gray-600 mb-4">Product er naam dile AI 5 ta SEO Title banai dibe</p>
      
      <input 
        value={productName} 
        onChange={e=>setProductName(e.target.value)} 
        onKeyDown={e => e.key === 'Enter' && generate()}
        placeholder="ex: Wireless Bluetooth Headphone" 
        className="border p-3 w-full mt-2 rounded focus:ring-2 focus:ring-red-500 outline-none"
      />
      
      <button 
        onClick={generate} 
        disabled={loading} 
        className="bg-red-500 text-white px-6 py-3 rounded mt-4 w-full font-bold hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
      >
        {loading? '✨ 5 ta Title Banacche...' : '✨ SEO Title Generate করো'}
      </button>
      
      {result && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50 shadow-sm">
          <h2 className="font-bold text-lg mb-3">5 ta Best Title:</h2>
          <div className="space-y-3">
            {result.split('\n').filter(line => line.trim()).map((line, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-white border rounded">
                <p className="text-gray-800 flex-1">{line}</p>
                <button 
                  onClick={() => handleCopy(line, index)}
                  className="ml-4 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded transition"
                >
                  {copiedIndex === index ? '✅ Copied' : '📋 Copy'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}