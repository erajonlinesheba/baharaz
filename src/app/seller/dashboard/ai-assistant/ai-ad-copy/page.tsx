'use client'
import { useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)

export default function AiAdCopyPage() {
  const [productName, setProductName] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    if(!productName) return alert("Product Name লিখো")
    setLoading(true)
    setResult('')
    try {
      const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-pro-latest' })
      const prompt = `তুমি একজন Facebook Ads Expert। " ${productName} " এর জন্য 3 টা Hook + 1 টা Caption + 3 টা Hashtag Bangla তে লিখো। Emoji use করো। Sale বাড়ানোর জন্য লিখতে হবে।`
      const res = await model.generateContent(prompt)
      setResult(res.response.text())
    } catch (error: any) {
      setResult('Error: ' + error.message)
    }
    setLoading(false)
  }
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">AI Ad Copy</h1>
      <p className="text-gray-600 mb-4">Product এর নাম দিলেই AI Viral Ad Copy বানাবে</p>
      <input value={productName} onChange={e=>setProductName(e.target.value)} placeholder="ex: Men T-Shirt" className="border p-3 w-full mt-2 rounded"/>
      <button onClick={generate} disabled={loading} className="bg-red-500 text-white px-6 py-3 rounded mt-4 w-full font-bold hover:bg-red-600 disabled:bg-gray-400">
        {loading? 'Generating...' : '🚀 Ad Copy Generate করো'}
      </button>
      {result && <div className="mt-6 p-4 border rounded bg-gray-50 whitespace-pre-wrap">{result}</div>}
    </div>
  )
}