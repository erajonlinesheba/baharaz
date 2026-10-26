'use client'
import { memo } from 'react'
import Logo from './header/Logo'
import SearchBox from './header/SearchBox'
import CartIcon from './header/CartIcon'

const Header = memo(function Header(){
  return (
    <div className="w-full bg-[#F85606] h-[56px] md:h-[64px] flex items-center z-30 shadow-sm">
      <div className="w-full max-w-[1200px] mx-auto px-3 md:px-4 flex items-center">
        
        {/* Logo - যদি থাকে */}
        <div className="shrink-0 hidden md:block">
          <Logo />
        </div>

        {/* Search Box - যেখানে আছে ওখানেই থাকবে, নড়বে না */}
        <div className="w-full md:w-[700px] md:ml-6">
          <SearchBox />
        </div>

        {/* Cart - শুধু এইটা Search এর পাশে আসবে */}
        <div className="shrink-0 ml-3 md:ml-4">
          <CartIcon />
        </div>

      </div>
    </div>
  )
})

export default Header