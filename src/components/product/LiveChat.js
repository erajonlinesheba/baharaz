"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

function localSupportReply(message) {
  const text = message.toLowerCase();
  if (text.includes("delivery") || text.includes("ডেলিভারি")) return "আপনার অর্ডারের tracking status দেখতে My Orders খুলুন। নির্দিষ্ট order number দিলে support team আরও সাহায্য করতে পারবে।";
  if (text.includes("return") || text.includes("ফেরত") || text.includes("রিটার্ন")) return "Return শুরু করতে My Orders থেকে order নির্বাচন করে Return Request দিন। পণ্য ও order অনুযায়ী policy প্রযোজ্য হবে।";
  if (text.includes("payment") || text.includes("পেমেন্ট") || text.includes("দাম")) return "Payment বা price বিষয়ে order number ও product name দিলে support team যাচাই করে জানাবে।";
  return "আপনার বার্তা পেয়েছি। আমি প্রাথমিকভাবে সাহায্য করতে পারি; প্রয়োজন হলে একজন admin বা seller এই chat-এ reply করবেন।";
}

export default function LiveChat({ mode = "customer" }) {
  const [user, setUser] = useState(null);
  const [threads, setThreads] = useState([]);
  const [threadId, setThreadId] = useState("");
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("");
  const [sellers, setSellers] = useState([]);
  const [targetSeller, setTargetSeller] = useState("");
  const [aiReply, setAiReply] = useState(true);
  const [aiThinking, setAiThinking] = useState(false);
  const activeThread = useMemo(() => threads.find((thread) => thread.id === threadId), [threads, threadId]);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(async ({ data, error }) => {
      if (!mounted) return;
      if (error || !data.user) return setStatus("Sign in to use live chat.");
      setUser(data.user);
      if (mode === "customer") {
        const { data: sellerRows } = await supabase.from("sellers").select("id, shop_name").eq("status", "approved").order("shop_name");
        if (mounted) setSellers(sellerRows || []);
      }
      let query = supabase.from("chat_threads").select("*").order("updated_at", { ascending: false });
      if (mode === "seller") query = query.eq("seller_id", data.user.id);
      if (mode === "customer") query = query.eq("customer_id", data.user.id);
      const { data: rows, error: threadError } = await query;
      if (threadError) return setStatus(threadError.code === "PGRST205" ? "Run supabase/chat-migration.sql in Supabase SQL Editor first." : threadError.message);
      if (mounted) {
        setThreads(rows || []);
        if (rows?.[0]) setThreadId(rows[0].id);
      }
    });
    return () => { mounted = false; };
  }, [mode]);

  useEffect(() => {
    if (!threadId) return undefined;
    let mounted = true;
    supabase.from("chat_messages").select("*").eq("thread_id", threadId).order("created_at").then(({ data, error }) => {
      if (!mounted) return;
      if (error) setStatus(error.code === "PGRST205" ? "Run supabase/chat-migration.sql in Supabase SQL Editor first." : error.message);
      else setMessages(data || []);
    });
    const channel = supabase.channel(`chat-${threadId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages", filter: `thread_id=eq.${threadId}` }, (payload) => {
        setMessages((current) => current.some((item) => item.id === payload.new.id) ? current : [...current, payload.new]);
      })
      .subscribe();
    return () => { mounted = false; supabase.removeChannel(channel); };
  }, [threadId]);

  const createThread = async () => {
    if (!user) return setStatus("Sign in to start a chat.");
    const payload = mode === "seller"
      ? { seller_id: user.id, subject: "Seller support chat" }
      : { customer_id: user.id, seller_id: targetSeller || null, subject: targetSeller ? "Customer to seller chat" : "Customer to admin chat" };
    const { data, error } = await supabase.from("chat_threads").insert(payload).select().single();
    if (error) return setStatus(error.code === "PGRST205" ? "Run supabase/chat-migration.sql in Supabase SQL Editor first." : error.message);
    setThreads((current) => [data, ...current]);
    setThreadId(data.id);
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    const customerMessage = draft.trim();
    if (!customerMessage || !user || !threadId || aiThinking) return;
    const { error } = await supabase.from("chat_messages").insert({ thread_id: threadId, sender_id: user.id, sender_type: "user", body: customerMessage });
    if (error) return setStatus(error.message);
    await supabase.from("chat_threads").update({ updated_at: new Date().toISOString() }).eq("id", threadId);
    setDraft("");
    if (mode !== "customer" || !aiReply) return;
    setAiThinking(true);
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "support", q: customerMessage }),
      });
      const result = await response.json().catch(() => ({}));
      const body = result.answer || localSupportReply(customerMessage);
      const { error: aiError } = await supabase.from("chat_messages").insert({ thread_id: threadId, sender_id: null, sender_type: "ai", body });
      if (aiError) {
        setMessages((current) => [...current, { id: `local-ai-${Date.now()}`, sender_id: null, sender_type: "ai", body, created_at: new Date().toISOString() }]);
        setStatus(`AI reply দেখানো হয়েছে, কিন্তু database sync হয়নি: ${aiError.message}`);
      }
    } finally {
      setAiThinking(false);
    }
  };

  return <section className="rounded-2xl border-2 border-orange-100 bg-gradient-to-br from-white via-orange-50/40 to-violet-50/50 p-5 shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-black text-slate-900">Live AI Chat 🤖</h2><p className="text-xs text-slate-500">Customer ↔ Seller ↔ Admin realtime support</p></div><div className="flex flex-wrap gap-2">{mode === "customer" && <><select value={targetSeller} onChange={(event) => setTargetSeller(event.target.value)} className="rounded-lg border border-orange-200 bg-white p-2 text-xs"><option value="">Admin support</option>{sellers.map((seller) => <option key={seller.id} value={seller.id}>{seller.shop_name}</option>)}</select><label className="flex items-center gap-1 rounded-lg border border-violet-200 bg-white px-2 text-xs"><input type="checkbox" checked={aiReply} onChange={(event) => setAiReply(event.target.checked)} /> AI reply</label></>}<button onClick={createThread} className="rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 px-3 py-2 text-xs font-bold text-white">New chat</button></div></div>
    {status && <p className="mt-3 rounded-lg bg-orange-50 p-2 text-xs text-orange-700">{status}{!user && <Link href="/login" className="ml-2 font-bold underline">Sign in</Link>}</p>}
    <div className="mt-4 grid gap-4 md:grid-cols-[220px_1fr]">
      <div className="space-y-2">{threads.map((thread) => <button key={thread.id} onClick={() => setThreadId(thread.id)} className={`w-full rounded-lg p-3 text-left text-sm ${thread.id === threadId ? "bg-orange-100 font-bold" : "bg-slate-50"}`}>{thread.subject || "Support chat"}<span className="mt-1 block text-[11px] text-slate-500">{thread.status}</span></button>)}{!threads.length && <p className="text-xs text-slate-500">No conversations yet.</p>}</div>
      <div className="flex min-h-64 flex-col rounded-xl bg-slate-50 p-3">{activeThread ? <><div className="flex-1 space-y-2 overflow-auto">{messages.map((message) => <div key={message.id} className={`max-w-[85%] rounded-xl p-3 text-sm ${message.sender_type === "ai" ? "border border-violet-200 bg-violet-50" : message.sender_id === user?.id ? "ml-auto bg-orange-500 text-white" : "bg-white"}`}><span className="mb-1 block text-[10px] font-bold opacity-70">{message.sender_type === "ai" ? "AI Support" : message.sender_id === user?.id ? "You" : "Support"}</span>{message.body}</div>)}{aiThinking && <div className="w-fit rounded-xl bg-violet-50 p-3 text-xs text-violet-700">AI is typing...</div>}</div><form onSubmit={sendMessage} className="mt-3 flex gap-2"><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a message..." className="min-w-0 flex-1 rounded-lg border p-3 text-sm" /><button disabled={aiThinking} className="rounded-lg bg-slate-950 px-4 text-sm font-bold text-white">Send</button></form></> : <p className="m-auto text-sm text-slate-500">Start a new chat to connect with support.</p>}</div>
    </div>
  </section>;
}
