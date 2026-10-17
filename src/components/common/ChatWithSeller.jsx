'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ChatWithSeller({ sellerId, sellerName }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const sendMessage = async () => {
    if (!message.trim()) return
    const newMsg = { text: message, from: 'buyer', time: new Date().toLocaleTimeString() }
    setMessages([...messages, newMsg])
    setMessage('')
    // Supabase e save
    const { data: user } = await supabase.auth.getUser()
    if (user?.user) {
      await supabase.from('chats').insert({ seller_id: sellerId, buyer_id: user.user.id, message: newMsg.text })
    }
    // Auto reply demo
    setTimeout(() => setMessages(prev => [...prev, { text: `Thanks! ${sellerName} will reply soon.`, from: 'seller', time: new Date().toLocaleTimeString() }]), 1000)
  }

  return (
    <>
      <button onClick={() => setOpen(!open)} className="fixed bottom-5 right-5 bg-[#25d366] text-white px-4 py-2 rounded-full shadow-lg text-[13px] z-50">Chat with {sellerName || 'Seller'}</button>
      {open && (
        <div className="fixed bottom-20 right-5 w-[300px] h-[400px] bg-white border shadow-xl rounded flex flex-col z-50">
          <div className="bg-[#075e54] text-white p-3 font-bold text-[13px]">Chat with {sellerName}</div>
          <div className="flex-1 p-2 overflow-y-auto text-[12px]">
            {messages.map((m, i) => <div key={i} className={`mb-2 p-2 rounded ${m.from === 'buyer'? 'bg-[#dcf8c6] ml-10' : 'bg-gray-100 mr-10'}`}>{m.text}<div className="text-[9px] text-gray-500">{m.time}</div></div>)}
          </div>
          <div className="p-2 flex gap-1 border-t">
            <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Type message..." className="border p-2 rounded flex-1 text-[12px]" />
            <button onClick={sendMessage} className="bg-[#25d366] text-white px-3 rounded">Send</button>
          </div>
        </div>
      )}
    </>
  )
}