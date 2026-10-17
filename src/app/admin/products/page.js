"use client";

import { useEffect, useState } from "react";
import { createProduct, getProducts } from '../../../lib/store-data' // âœ… à¦à¦–à¦¾à¦¨à§‡ fix à¦•à¦°à¦²à¦¾à¦®

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    description: ""
  });

  async function fetchProducts() {
    setLoading(true);
    const data = await getProducts();
    setProducts(data || []);
    setLoading(false);
  }
  // Products load à¦•à¦°à¦¾
  useEffect(() => {
    fetchProducts();
  }, []);

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProduct = {
      ...form,
      price: Number(form.price),
      id: Date.now()
    };
    await createProduct(newProduct);
    setForm({ name: "", price: "", category: "", image: "", description: "" });
    fetchProducts();
    alert("Product Added!");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-black mb-6">Admin - Products</h1>

      {/* Add Product Form */}
      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Add New Product</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="border p-3 rounded-lg"
            required
          />
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            type="number"
            className="border p-3 rounded-lg"
            required
          />
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="border p-3 rounded-lg"
            required
          />
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="border p-3 rounded-lg"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-3 rounded-lg md:col-span-2"
            rows={3}
          />
          <button type="submit" className="bg-orange-500 text-white font-bold py-3 rounded-lg md:col-span-2 hover:bg-orange-600">
            Add Product
          </button>
        </form>
      </div>

      {/* Products List */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-4">All Products</h2>
        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="border rounded-lg p-4">
                <img src={p.image} alt={p.name} className="w-full h-40 object-cover rounded" />
                <h3 className="font-bold mt-2">{p.name}</h3>
                <p className="text-sm text-gray-600">{p.category}</p>
                <p className="font-black text-orange-600">à§³{p.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
