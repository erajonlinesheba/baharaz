'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js'; const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export default function ProductList() {
  const [products, setProducts] = useState([]);
  async function fetchProducts() { const { data } = await supabase.from('products').select('*'); setProducts(data || []); }
  async function deleteProduct(id) { await supabase.from('products').delete().eq('id', id); fetchProducts(); }
  useEffect(() => { fetchProducts(); }, []);
  return (
    <div className="p-5 md:p-8"><h1 className="text-3xl font-bold mb-6">à¦¸à¦¬ Product</h1>
      <table className="w-full bg-white rounded-xl shadow"><thead><tr className="text-left"><th className="p-4">Name</th><th>Price</th><th>Stock</th><th>Action</th></tr></thead>
      <tbody>{products.map(p => <tr key={p.id} className="border-t"><td className="p-4">{p.name}</td><td>à§³{p.price}</td><td>{p.stock}</td><td><button onClick={()=>deleteProduct(p.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button></td></tr>)}</tbody></table>
    </div>
  );
}
