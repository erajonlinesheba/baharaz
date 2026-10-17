'use client'
import { useState } from 'react'

export default function NotificationsPage() {
  const [tab, setTab] = useState('All')
  const tabs = ['All', 'Orders', 'Messages', 'System', 'Promotions']

  const notifications = [
    { id: 1, type: 'Orders', title: 'New Order Received', desc: 'Order #123456789 - iPhone 15', time: '2 min ago', unread: true },
    { id: 2, type: 'System', title: 'Account Verification', desc: 'Please complete your KYC', time: '1 hour ago', unread: false },
    { id: 3, type: 'Messages', title: 'New Chat Message', desc: 'Customer: Is this available?', time: '3 hours ago', unread: true },
  ]

  const filtered = tab === 'All' ? notifications : notifications.filter(n => n.type === tab)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">ðŸ”” Notifications</h1>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-lg border flex gap-2 overflow-x-auto">
        {tabs.map(t => (
          <button 
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${tab === t ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="bg-white rounded-lg border">
        {filtered.length === 0 ? (
          // Empty State - à¦¤à§‹à¦®à¦¾à¦° Screenshot à¦à¦° à¦®à¦¤à§‹
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">No notifications</h3>
            <p className="text-gray-500">Please modify filter.</p>
          </div>
        ) : (
          <div>
            {filtered.map(n => (
              <div key={n.id} className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${n.unread ? 'bg-orange-50' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    {n.unread && <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>}
                    <div>
                      <p className="font-semibold">{n.title}</p>
                      <p className="text-sm text-gray-600">{n.desc}</p>
                      <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded">{n.type}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="text-orange-500 hover:underline">Mark all as read</button>
    </div>
  )
}
