"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase/client";

export default function LiveChat({ store }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user && store?.user_id) {
      fetchMessages();

      const channel = supabase
       .channel(`live-chat-${store.user_id}-${user.id}`)
       .on("postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "live_chats",
            filter: `seller_id=eq.${store.user_id}`
          },
          (payload) => {
            const isRelevant = payload.new.buyer_id === user.id || payload.new.seller_id === user.id;
            if (isRelevant) {
              setMessages((prev) => {
                if(prev.find(m => m.id === payload.new.id)) return prev;
                return [...prev, payload.new];
              });
              if (!isOpen) setUnreadCount((c) => c + 1);
            }
          }
        )
       .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, store, isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) setUnreadCount(0);
  }, [isOpen]);

  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data?.user) setUser(data.user);
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
       .from("live_chats")
       .select("*")
       .or(`and(seller_id.eq.${store.user_id},buyer_id.eq.${user.id}),and(seller_id.eq.${user.id},buyer_id.eq.${store.user_id})`)
       .order("created_at", { ascending: true })
       .limit(100);

      if (!error && data) setMessages(data);
    } catch (e) {
      console.log("Fetch error:", e);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!newMessage.trim()) return;

    if (!user) {
      alert("Please login to chat! Login করে Chat করতে পারবে!");
      window.location.href = "/login";
      return;
    }

    const tempMessage = {
      id: `temp-${Date.now()}`,
      sender_id: user.id,
      message: newMessage.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, tempMessage]);
    const messageToSend = newMessage.trim();
    setNewMessage("");
    setLoading(true);

    try {
      const { error } = await supabase.from("live_chats").insert({
        seller_id: store.user_id,
        buyer_id: user.id,
        sender_id: user.id,
        message: messageToSend,
        shop_slug: store.shop_slug,
        shop_name: store.shop_name,
        is_read: false,
      });

      if (error) {
        setMessages(prev => prev.filter(m => m.id!== tempMessage.id));
        alert("Message failed to send!");
      } else {
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => prev.filter(m => m.id!== tempMessage.id));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button id="live-chat-trigger" className="hidden" onClick={() => setIsOpen(true)}></button>

      <div className="fixed bottom-5 right-4 md:right-6 z-[99]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-[56px] h-[56px] md:w-[60px] md:h-[60px] bg-slate-900 hover:bg-black text-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.25)] flex items-center justify-center text-[26px] hover:scale-105 active:scale-95 transition-all border-2 border-white"
        >
          {isOpen? "✕" : "💬"}
          {unreadCount > 0 &&!isOpen && (
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-[11px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse">
              {unreadCount > 9? "9+" : unreadCount}
            </span>
          )}
          <span className="absolute -bottom-1 -left-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>
        {!isOpen && (
          <div className="absolute bottom-[70px] right-0 bg-slate-900 text-white text-[11px] px-3 py-2 rounded-[10px] font-bold whitespace-nowrap shadow-xl animate-bounce">
            Chat Before Order! 💬
            <div className="absolute -bottom-1 right-6 w-2 h-2 bg-slate-900 rotate-45"></div>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="fixed bottom-[90px] right-4 md:right-6 w-[92vw] md:w-[380px] h-[480px] md:h-[520px] bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-slate-200 z-[100] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">

          <div className="bg-slate-900 text-white p-4 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center font-black text-[16px] overflow-hidden shrink-0">
              {store?.shop_logo? <img src={store.shop_logo} alt="logo" className="w-full h-full object-cover" /> : store?.shop_name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[13px] font-black truncate">{store?.shop_name}</h4>
              <p className="text-[11px] text-white/70 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online • Reply in 30min
              </p>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8fafc] scrollbar-thin">
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black shrink-0">S</div>
              <div className="bg-white border border-slate-200 rounded-[14px] rounded-tl-[4px] p-3 max-w-[78%] shadow-sm">
                <p className="text-[12px] font-bold text-slate-900">Assalamu Alaikum! 👋</p>
                <p className="text-[12px] text-slate-600 mt-1 leading-relaxed">Welcome to {store?.shop_name}! Order করার আগে Product, Size, Color, Delivery নিয়ে জিজ্ঞেস করুন! 100% Fast Reply!</p>
                <p className="text-[10px] text-slate-400 mt-2">🟢 Online Now</p>
              </div>
            </div>

            {messages.map((msg, i) => {
              const isMe = msg.sender_id === user?.id;
              return (
                <div key={msg.id || i} className={`flex gap-2 ${isMe? "flex-row-reverse" : ""}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${isMe? "bg-blue-600 text-white" : "bg-slate-900 text-white"}`}>
                    {isMe? "U" : "S"}
                  </div>
                  <div className={`rounded-[14px] p-3 max-w-[78%] text-[12px] leading-relaxed shadow-sm break-words ${isMe? "bg-slate-900 text-white rounded-tr-[4px]" : "bg-white border border-slate-200 text-slate-700 rounded-tl-[4px]"}`}>
                    {msg.message}
                    <p className={`text-[9px] mt-1 ${isMe? "text-white/60" : "text-slate-400"}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef}></div>
          </div>

          <form onSubmit={sendMessage} className="p-3 border-t border-slate-200 bg-white shrink-0">
            <div className="flex items-center gap-2 bg-[#f8fafc] border border-slate-200 rounded-full px-2 py-1.5 focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-slate-900/10 transition-all">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask before ordering... Size? Color?"
                className="flex-1 bg-transparent outline-none text-[13px] px-3 py-1.5 placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={loading ||!newMessage.trim()}
                className="w-9 h-9 bg-slate-900 hover:bg-black disabled:bg-slate-300 text-white rounded-full flex items-center justify-center text-[14px] transition-all active:scale-95 shrink-0"
              >
                {loading? "..." : "➤"}
              </button>
            </div>
            <p className="text-[9px] text-center text-slate-400 mt-2 font-bold tracking-wide">💡 Order এর আগে Chat করুন - 100% Trusted Seller • Fast Reply</p>
          </form>
        </div>
      )}
    </>
  );
}