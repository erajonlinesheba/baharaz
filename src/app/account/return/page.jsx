'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ReturnsPage(){
  const [activeTab, setActiveTab] = useState('returns')
  const [returns, setReturns] = useState([])
  const [cancellations, setCancellations] = useState([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(()=>{
    const loadData = async()=>{
      try{
        setLoading(true)
        const { data:{ session } } = await supabase.auth.getSession()
        if(!session?.user){ setLoading(false); return }

        // Returns table থেকে Data আনবে - না থাকলে Empty দেখাবে
        const { data: retData } = await supabase.from('returns').select('*').eq('user_id', session.user.id).order('created_at', {desc:true})
        if(retData) setReturns(retData)

        const { data: cancelData } = await supabase.from('orders').select('*').eq('user_id', session.user.id).eq('status', 'cancelled').order('created_at', {desc:true})
        if(cancelData) setCancellations(cancelData)

      }catch(e){ console.log(e) }
      finally{ setLoading(false) }
    }
    loadData()
  },[])

  if(loading){
    return (
      <div className="bg-white rounded-[8px] p-6 min-h-[400px] flex items-center justify-center">
        <p className="text-gray-500 text-[13px]">Loading...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[8px] overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-0">
        <h2 className="text-[20px] font-bold text-black">My Returns & Cancellations</h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b mt-6 px-6 gap-8">
        <button 
          onClick={()=>setActiveTab('returns')}
          className={`pb-3 text-[14px] font-medium border-b-2 transition ${activeTab==='returns' ? 'border-[#F85606] text-[#F85606]' : 'border-transparent text-gray-500 hover:text-black'}`}
        >
          My Returns ({returns.length})
        </button>
        <button 
          onClick={()=>setActiveTab('cancellations')}
          className={`pb-3 text-[14px] font-medium border-b-2 transition ${activeTab==='cancellations' ? 'border-[#F85606] text-[#F85606]' : 'border-transparent text-gray-500 hover:text-black'}`}
        >
          My Cancellations ({cancellations.length})
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'returns' ? (
          returns.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-[120px] h-[120px] mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-[40px]">📦</span>
              </div>
              <p className="text-black font-medium text-[15px]">No returns yet</p>
              <p className="text-gray-400 text-[12px] mt-1 max-w-[300px] mx-auto">When you return an item, you can track its status and refund here</p>
              <Link href="/" className="inline-block mt-6 px-6 py-2.5 bg-[#F85606] text-white rounded-[4px] text-[13px] font-bold hover:bg-[#e04e05]">Continue Shopping</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {returns.map((item, i)=>(
                <div key={i} className="border rounded-[8px] p-4 flex justify-between">
                  <div>
                    <p className="text-[13px] font-bold text-black">Return #{item.id?.slice(0,8)}</p>
                    <p className="text-[11px] text-gray-500 mt-1">Reason: {item.reason || 'Not specified'}</p>
                    <p className="text-[11px] text-gray-500">Date: {new Date(item.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className="text-[11px] bg-yellow-100 text-yellow-700 px-2 py-1 rounded h-fit">{item.status || 'Pending'}</span>
                </div>
              ))}
            </div>
          )
        ) : (
          cancellations.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-[120px] h-[120px] mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-[40px]">❌</span>
              </div>
              <p className="text-black font-medium text-[15px]">No cancellations</p>
              <p className="text-gray-400 text-[12px] mt-1">Your cancelled orders will appear here</p>
              <Link href="/account/orders" className="inline-block mt-6 px-6 py-2.5 border border-[#F85606] text-[#F85606] rounded-[4px] text-[13px] font-bold hover:bg-orange-50">View My Orders</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {cancellations.map((order, i)=>(
                <div key={i} className="border rounded-[8px] p-4">
                  <div className="flex justify-between">
                    <p className="text-[13px] font-bold">Order #{order.id?.slice(0,8)}</p>
                    <span className="text-[11px] bg-red-100 text-red-600 px-2 py-1 rounded">Cancelled</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-2">Cancelled on {new Date(order.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}