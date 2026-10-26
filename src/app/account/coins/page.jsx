'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const TASKS = [
  { id: 'daily', title: 'Daily Check-in', title_bn: 'প্রতিদিন চেক-ইন', coins: 20, icon: '📅', done: false, type: 'daily' },
  { id: 'order', title: 'Place an Order', title_bn: 'অর্ডার করুন', coins: 100, icon: '🛒', done: false, type: 'once' },
  { id: 'review', title: 'Write a Review', title_bn: 'রিভিউ লিখুন', coins: 30, icon: '⭐', done: false, type: 'repeat' },
  { id: 'share', title: 'Share Product', title_bn: 'প্রোডাক্ট শেয়ার', coins: 15, icon: '🔗', done: false, type: 'repeat' },
  { id: 'wishlist', title: 'Add to Wishlist', title_bn: 'উইশলিস্টে যোগ', coins: 10, icon: '❤️', done: false, type: 'repeat' },
  { id: 'app', title: 'Open App 3 Days', title_bn: '৩ দিন অ্যাপ খুলুন', coins: 50, icon: '📱', done: false, type: 'streak' },
]

const REWARDS = [
  { id: 1, title: '৳20 Off', need: 200, discount: 20, icon: '🎟️' },
  { id: 2, title: '৳50 Off', need: 500, discount: 50, icon: '🎫' },
  { id: 3, title: '৳100 Off', need: 900, discount: 100, icon: '🎁' },
  { id: 4, title: 'Free Delivery', need: 150, discount: 0, freeDelivery: true, icon: '🚚' },
  { id: 5, title: '৳200 Off Mega', need: 1800, discount: 200, icon: '💎' },
]

export default function CoinsPage() {
  const [coins, setCoins] = useState(0)
  const [tasks, setTasks] = useState(TASKS)
  const [history, setHistory] = useState([])
  const [streak, setStreak] = useState(1)
  const [showCongrats, setShowCongrats] = useState(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const savedCoins = Number(localStorage.getItem('baharaz_coins') || '350')
    const savedHistory = JSON.parse(localStorage.getItem('baharaz_coins_history') || '[]')
    const savedTasks = JSON.parse(localStorage.getItem('baharaz_coins_tasks') || 'null')
    const lastCheckin = localStorage.getItem('baharaz_last_checkin')
    const today = new Date().toDateString()
    
    setCoins(savedCoins)
    if (savedHistory.length > 0) setHistory(savedHistory)
    else {
      const initHistory = [
        { id: 1, title: 'Welcome Bonus', coins: 200, time: '2 days ago', type: 'earn' },
        { id: 2, title: 'Daily Check-in', coins: 20, time: '1 day ago', type: 'earn' },
        { id: 3, title: 'Order #BAH-1234', coins: 100, time: '1 day ago', type: 'earn' },
        { id: 4, title: 'Used for Discount', coins: -50, time: 'Today', type: 'spend' },
      ]
      setHistory(initHistory)
    }
    
    if (savedTasks) {
      if (lastCheckin !== today) {
        const resetTasks = savedTasks.map(t => t.type === 'daily' ? { ...t, done: false } : t)
        setTasks(resetTasks)
      } else {
        setTasks(savedTasks)
      }
    }
    
    const savedStreak = Number(localStorage.getItem('baharaz_streak') || '3')
    setStreak(savedStreak)
  }, [])

  const saveCoins = (newCoins, newHistory) => {
    localStorage.setItem('baharaz_coins', String(newCoins))
    localStorage.setItem('baharaz_coins_history', JSON.stringify(newHistory))
  }

  const handleTaskComplete = useCallback((taskId) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task || task.done) return

    const newCoins = coins + task.coins
    const newHistoryItem = {
      id: Date.now(),
      title: task.title,
      title_bn: task.title_bn,
      coins: task.coins,
      time: 'Just now',
      type: 'earn'
    }
    const newHistory = [newHistoryItem, ...history].slice(0, 20)
    
    setCoins(newCoins)
    setHistory(newHistory)
    saveCoins(newCoins, newHistory)
    
    const newTasks = tasks.map(t => t.id === taskId ? { ...t, done: true } : t)
    setTasks(newTasks)
    localStorage.setItem('baharaz_coins_tasks', JSON.stringify(newTasks))
    
    if (taskId === 'daily') {
      localStorage.setItem('baharaz_last_checkin', new Date().toDateString())
      const newStreak = streak + 1
      setStreak(newStreak)
      localStorage.setItem('baharaz_streak', String(newStreak))
    }
    
    setShowCongrats({ coins: task.coins, title: task.title_bn })
    setTimeout(() => setShowCongrats(null), 2500)
    window.dispatchEvent(new Event('coinsUpdated'))
  }, [tasks, coins, history, streak])

  const handleRedeem = (reward) => {
    if (coins < reward.need) return
    
    const newCoins = coins - reward.need
    const newHistoryItem = {
      id: Date.now(),
      title: `Redeemed: ${reward.title}`,
      coins: -reward.need,
      time: 'Just now',
      type: 'spend'
    }
    const newHistory = [newHistoryItem, ...history].slice(0, 20)
    
    setCoins(newCoins)
    setHistory(newHistory)
    saveCoins(newCoins, newHistory)
    
    const vouchers = JSON.parse(localStorage.getItem('baharaz_vouchers') || '[]')
    vouchers.unshift({
      id: Date.now(),
      title: reward.title,
      discount: reward.discount,
      code: `BAH-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      expires: new Date(Date.now() + 7 * 86400000).toLocaleDateString(),
      freeDelivery: reward.freeDelivery || false
    })
    localStorage.setItem('baharaz_vouchers', JSON.stringify(vouchers))
    
    setShowCongrats({ coins: -reward.need, title: `${reward.title} Redeemed!`, isRedeem: true })
    setTimeout(() => setShowCongrats(null), 2500)
  }

  if (!isClient) {
    return (
      <div className="w-full min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-20 h-20 bg-yellow-200 rounded-full mx-auto mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-[#f5f5f7] overflow-x-hidden pb-[80px] md:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FFC107] to-[#FF9800] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="w-full max-w-[1188px] mx-auto px-4 py-6 md:py-8 relative">
          <div className="flex justify-between items-start">
            <div>
              <Link href="/" className="text-[12px] bg-black/20 px-3 py-1 rounded-full inline-flex items-center gap-1 mb-3">
                ← Back to Home
              </Link>
              <h1 className="text-[24px] md:text-[32px] font-black flex items-center gap-2">
                🪙 Baharaz Coins
              </h1>
              <p className="text-[13px] md:text-[14px] font-bold opacity-90 mt-1">Earn Coins, Get Free Discounts - Zero Second!</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-black opacity-80">TOTAL COINS</p>
              <p className="text-[28px] md:text-[36px] font-black">{coins.toLocaleString()}</p>
              <p className="text-[11px] bg-white text-[#FF6F00] font-black px-2.5 py-1 rounded-full inline-block">≈ ৳{Math.floor(coins/10)} OFF</p>
            </div>
          </div>

          {/* Streak */}
          <div className="mt-5 bg-white/15 backdrop-blur-md rounded-[16px] p-3 flex items-center justify-between border border-white/20">
            <div className="flex items-center gap-2">
              <span className="text-[20px]">🔥</span>
              <div>
                <p className="text-[13px] font-black">{streak} Days Streak!</p>
                <p className="text-[11px] opacity-80">Keep checking daily to earn bonus</p>
              </div>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black ${i < streak ? 'bg-white text-[#FF6F00]' : 'bg-white/20'}`}>
                  {i < streak ? '✓' : i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1188px] mx-auto px-0 md:px-4 mt-0 md:mt-4 space-y-3 md:space-y-4">
        {/* Daily Check-in Big Button */}
        <div className="bg-white md:rounded-[16px] p-4 shadow-sm border-0 md:border">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-black text-[15px]">Daily Tasks - প্রতিদিনের কাজ</h2>
            <span className="text-[11px] bg-[#FFF3E0] text-[#FF6F00] px-2.5 py-1 rounded-full font-black">{tasks.filter(t => t.done).length}/{tasks.length} Done</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {tasks.map((task) => (
              <div key={task.id} className={`flex items-center justify-between p-3 rounded-[12px] border-2 transition ${task.done ? 'bg-[#E8F5E9] border-[#4CAF50] opacity-70' : 'bg-[#FFFBF0] border-[#FFE0B2] hover:border-[#FF9800] hover:shadow-md'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[18px] ${task.done ? 'bg-[#4CAF50] text-white' : 'bg-white border shadow-sm'}`}>
                    {task.done ? '✓' : task.icon}
                  </div>
                  <div>
                    <p className="text-[13px] font-black">{task.title_bn}</p>
                    <p className="text-[11px] text-[#666]">{task.title} • <span className="text-[#FF6F00] font-black">+{task.coins} Coins</span></p>
                  </div>
                </div>
                <button
                  onClick={() => handleTaskComplete(task.id)}
                  disabled={task.done}
                  className={`px-4 py-2 rounded-full text-[11px] font-black transition ${task.done ? 'bg-[#4CAF50] text-white' : 'bg-gradient-to-r from-[#FFC107] to-[#FF9800] text-white shadow hover:scale-105'}`}
                >
                  {task.done ? 'Done ✓' : 'Earn'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-3 md:gap-4">
          {/* Rewards */}
          <div className="bg-white md:rounded-[16px] p-4 shadow-sm border-0 md:border">
            <h2 className="font-black text-[15px] mb-3 flex items-center gap-2">🎁 Redeem Rewards - পুরস্কার নিন</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {REWARDS.map((reward) => {
                const canRedeem = coins >= reward.need
                return (
                  <div key={reward.id} className={`p-4 rounded-[12px] border-2 relative overflow-hidden ${canRedeem ? 'bg-gradient-to-br from-[#FFF8E1] to-white border-[#FFC107] shadow-sm' : 'bg-[#FAFAFA] border-gray-200 opacity-60'}`}>
                    {canRedeem && <div className="absolute top-2 right-2 bg-[#4CAF50] text-white text-[9px] font-black px-2 py-0.5 rounded-full">AVAILABLE</div>}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-[12px] border shadow-sm flex items-center justify-center text-[22px]">{reward.icon}</div>
                      <div className="flex-1">
                        <p className="text-[14px] font-black">{reward.title}</p>
                        <p className="text-[11px] text-[#666] font-bold">{reward.need} Coins Needed</p>
                        <div className="mt-1.5 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-gradient-to-r from-[#FFC107] to-[#FF9800] h-full transition-all" style={{ width: `${Math.min(100, (coins / reward.need) * 100)}%` }}></div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRedeem(reward)}
                      disabled={!canRedeem}
                      className={`w-full mt-3 h-[38px] rounded-[10px] text-[12px] font-black transition ${canRedeem ? 'bg-black text-white hover:bg-gray-900' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                    >
                      {canRedeem ? `Redeem Now - ${reward.need} Coins` : `Need ${reward.need - coins} More Coins`}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* History & Info */}
          <div className="space-y-3">
            <div className="bg-white md:rounded-[16px] p-4 shadow-sm border-0 md:border">
              <h3 className="font-black text-[13px] mb-3">📜 Coins History</h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {history.map((h) => (
                  <div key={h.id} className="flex justify-between items-center p-2.5 rounded-[10px] bg-[#FAFAFA] border">
                    <div>
                      <p className="text-[12px] font-bold">{h.title_bn || h.title}</p>
                      <p className="text-[10px] text-[#888]">{h.time}</p>
                    </div>
                    <span className={`text-[12px] font-black px-2 py-1 rounded-full ${h.type === 'earn' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FFEBEE] text-[#C62828]'}`}>
                      {h.coins > 0 ? '+' : ''}{h.coins}
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/vouchers" className="mt-3 block text-center text-[11px] font-black text-[#1A9CB7] hover:underline">View My Vouchers →</Link>
            </div>

            <div className="bg-gradient-to-br from-[#1A1A1A] to-black text-white md:rounded-[16px] p-4 shadow-lg">
              <h3 className="font-black text-[13px] mb-2">💡 How Coins Work?</h3>
              <div className="space-y-2 text-[11px] leading-5 opacity-90">
                <p>• 10 Coins = ৳1 Discount</p>
                <p>• Daily Check-in = 20 Coins</p>
                <p>• Every Order = 100 Coins</p>
                <p>• Coins Expire in 90 Days</p>
                <p>• Use Coins + bKash Together</p>
              </div>
              <div className="mt-3 bg-white/10 rounded-[10px] p-2.5 border border-white/10">
                <p className="text-[11px] font-black">🎉 Special: Rajshahi Users Get 2X Coins Today!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Congrats Popup */}
      {showCongrats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
          <div className={`bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] p-6 text-center animate-bounce border-2 ${showCongrats.isRedeem ? 'border-[#4CAF50]' : 'border-[#FFC107]'}`}>
            <div className="w-16 h-16 bg-gradient-to-br from-[#FFC107] to-[#FF9800] rounded-full flex items-center justify-center text-[28px] mx-auto mb-3">🪙</div>
            <p className="text-[18px] font-black">{showCongrats.isRedeem ? 'Redeemed!' : `+${showCongrats.coins} Coins!`}</p>
            <p className="text-[12px] text-[#666] font-bold mt-1">{showCongrats.title}</p>
          </div>
        </div>
      )}
    </div>
  )
}