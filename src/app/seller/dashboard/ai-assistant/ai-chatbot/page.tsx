'use client'
import { useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)

export default function AiChatbotPage() {
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    if(!question) return alert("Question লিখো")
    setLoading(true)
    setResult('')
    try {
      const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-pro-latest' })
      const prompt = `তুমি একজন Customer Support Agent। Customer জিজ্ঞেস করছে: " ${question} "। 2-3 লাইনে ভদ্র Bangla উত্তর দাও।`
      const res = await model.generateContent(prompt)
      setResult(res.response.text())
    } catch (error: any) {
      setResult('Error: ' + error.message)
    }
    setLoading(false)
  }
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">AI Customer Support</h1>
      <p className="text-gray-600 mb-4">Customer এর যেকোনো Question এর উত্তর দাও</p>
      <input value={question} onChange={e=>setQuestion(e.target.value)} placeholder="ex: Return Policy কি?" className="border p-3 w-full mt-2 rounded"/>
      <button onClick={generate} disabled={loading} className="bg-red-500 text-white px-6 py-3 rounded mt-4 w-full font-bold hover:bg-red-600 disabled:bg-gray-400">
        {loading? 'Generating...' : '🤖 উত্তর Generate করো'}
      </button>
      {result && <div className="mt-6 p-4 border rounded bg-gray-50 whitespace-pre-wrap">{result}</div>}
    </div>
  )
}