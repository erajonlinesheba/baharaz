'use client'
import { memo, useState, useEffect } from 'react'
import AlgoliaSearch from '@/components/search/AlgoliaSearch'

const SearchBox = memo(function SearchBox(){
  const [lang, setLang] = useState('en')
  
  useEffect(()=>{
    const s = localStorage.getItem('baharaz-lang')
    if(s) setLang(s)
    const onLang = ()=>{ 
      const ns = localStorage.getItem('baharaz-lang')
      if(ns) setLang(ns) 
    }
    window.addEventListener('langChanged', onLang)
    return ()=> window.removeEventListener('langChanged', onLang)
  },[])

  return (
    <div className="w-full h-[36px] md:h-[42px]">
      <div className="w-full h-full bg-white rounded-[6px] md:rounded-[8px] overflow-hidden flex shadow-sm">
        <div className="flex-1 h-full">
          <AlgoliaSearch placeholder={lang==='en' ? "Search in Baharaz" : "বাহারাজে খুঁজুন"} />
        </div>
      </div>
    </div>
  )
})

export default SearchBox