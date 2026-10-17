'use client';
import { useState } from 'react';
export default function AiChatbot({ showAIBot, setShowAIBot, aiMessage, setAiMessage, aiResponse, handleAISend }) {
  if (!showAIBot) return null;
  return (
    <div className="fixed bottom-5 right-5 w-80 h-96 bg-white rounded-xl shadow-2xl border p-4 z-50 flex flex-col">
      <div className="flex justify-between font-bold">AI Assistant <button onClick={()=>setShowAIBot(false)}>X</button></div>
      <div className="flex-1 overflow-y-auto mt-2 text-xs">{aiResponse.map((r,i)=><div key={i} className="mb-2"><b>You:</b> {r.user}<br/><b>AI:</b> {r.ai}</div>)}</div>
      <div className="flex gap-2 mt-2"><input value={aiMessage} onChange={e=>setAiMessage(e.target.value)} className="flex-1 border rounded px-2 py-1 text-xs" placeholder="Ask AI..." /><button onClick={handleAISend} className="bg-orange-500 text-white px-3 py-1 rounded text-xs">Send</button></div>
    </div>
  );
}
