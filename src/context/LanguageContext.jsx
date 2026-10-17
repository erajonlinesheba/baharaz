"use client";
import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  useEffect(()=>{
    try{
      const saved = localStorage.getItem("baharaz_lang");
      if(saved && (saved==="en" || saved==="bn")) setLang(saved);
    }catch{}
  },[]);

  const toggleLanguage = () => {
    const newLang = lang === "en"? "bn" : "en";
    setLang(newLang);
    try{ localStorage.setItem("baharaz_lang", newLang); }catch{}
  };

  const t = (en, bn) => lang === "bn"? bn : en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
export default LanguageProvider;