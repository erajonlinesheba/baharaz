'use client'
import { memo, useState } from 'react'
import Link from 'next/link'

const Logo = memo(function Logo(){
  const [imgError, setImgError] = useState(false)

  return (
    <Link href="/" className="shrink-0 flex items-center gap-2 select-none">
      <div className="w-[40px] h-[40px] md:w-[44px] md:h-[44px] bg-white rounded-[10px] flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.08)] active:scale-95 transition-transform overflow-hidden">
        {!imgError ? (
          <img 
            src="/logo.png" 
            alt="Baharaz" 
            width={32} 
            height={32} 
            className="w-[28px] h-[28px] md:w-[32px] md:h-[32px] object-contain" 
            loading="eager"
            onError={()=> setImgError(true)}
          />
        ) : (
          <span className="w-full h-full flex items-center justify-center font-black text-[20px] md:text-[22px] text-[#F85606]">B</span>
        )}
      </div>
      <span className="text-white font-black text-[19px] md:text-[22px] tracking-[-0.7px] leading-none">Baharaz</span>
    </Link>
  )
})

Logo.displayName = "Logo"
export default Logo