"use client";
import { createContext, useContext, useState, useEffect } from "react";
const StoreContext = createContext();
export function StoreProvider({ children }){
  const [cart,setCart]=useState([]);
  const [wishlist,setWishlist]=useState([]);
  const [search,setSearch]=useState("");
  const [isCartOpen,setIsCartOpen]=useState(false);
  useEffect(()=>{
    setCart(JSON.parse(localStorage.getItem("baharaz_cart")||"[]"));
    setWishlist(JSON.parse(localStorage.getItem("baharaz_wish")||"[]"));
  },[]);
  useEffect(()=>{ localStorage.setItem("baharaz_cart", JSON.stringify(cart)); },[cart]);
  useEffect(()=>{ localStorage.setItem("baharaz_wish", JSON.stringify(wishlist)); },[wishlist]);
  const addToCart=(p,qty=1)=>{ setCart(prev=>{ const ex=prev.find(i=>i.id===p.id); if(ex) return prev.map(i=>i.id===p.id?{...i,qty:i.qty+qty}:i); return [...prev,{...p,qty}]; }); setIsCartOpen(true); };
  const updateQty=(id,qty)=>{ if(qty<1) return; setCart(prev=>prev.map(i=>i.id===id?{...i,qty}:i)); };
  const removeCart=(id)=>setCart(prev=>prev.filter(i=>i.id!==id));
  const toggleWishlist=(id)=>setWishlist(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  const cartCount=cart.reduce((s,i)=>s+(i.qty||1),0);
  const subtotal=cart.reduce((s,i)=>s+(i.price*(i.qty||1)),0);
  return <StoreContext.Provider value={{cart,wishlist,search,setSearch,isCartOpen,setIsCartOpen,addToCart,updateQty,removeCart,toggleWishlist,cartCount,subtotal}}>{children}</StoreContext.Provider>
}
export const useStore=()=>useContext(StoreContext);