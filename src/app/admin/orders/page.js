'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js'; const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  async function fetchOrders() { const { data, error: loadError } = await supabase.from("orders").select("*").order("created_at", { ascending: false }); if (loadError) setError(loadError.message); setOrders(data || []); }
  async function updateStatus(id, status) { const { error: updateError } = await supabase.from("orders").update({ status }).eq("id", id); if (updateError) setError(updateError.message); else fetchOrders(); }
  useEffect(() => { fetchOrders(); }, []);
  return (
    <div className="min-h-screen bg-slate-50 p-5 md:p-8"><h1 className="mb-2 text-3xl font-bold">Order management</h1><p className="mb-6 text-slate-500">Track payment and delivery status from Supabase.</p>{error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <table className="w-full bg-white rounded-xl shadow"><thead><tr className="text-left"><th className="p-4">Customer</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>{orders.map(o => <tr key={o.id} className="border-t"><td className="p-4">{o.customer_name}</td><td>à§³{o.total}</td><td>{o.status}</td><td>
        <select value={o.status} onChange={(e)=>updateStatus(o.id, e.target.value)} className="border p-1 rounded"><option value="pending">Pending</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option><option value="returned">Returned</option></select>
      </td></tr>)}</tbody></table>
    </div>
  );
}
