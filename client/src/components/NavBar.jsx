import { MenuIcon, SearchIcon, XIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5'>
        <Link to='/' className='max-md:flex-1'>
            <img src="/src/assets/logo.png" alt='logo' className='w-20 md:w-20 lg:w-28'/>
        </Link>

        <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium 
                        max-md:text-lg z-50 flex flex-col md:flex-row items-center 
                        max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen 
                        min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 
                        md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${isOpen ? "max-md:w-full" : "max-md:w-0 max-md:py-0 max-md:px-0"}`}>
            <XIcon className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer' onClick={toggleMenu}/>                
    
            <Link to='/'>Home</Link>
            <Link to='/movies'>Movies</Link>
            <Link to='/theaters'>Theaters</Link>
            <Link to='/releases'>Releases</Link>
            <Link to='/favourites'>Favourites</Link>
        </div>

        <div className='flex items-center gap-8'> 
            <SearchIcon className='max-md:hidden w-6 h-6 cursor-pointer' />
            <button className='bg-red-700 hover:bg-red-900 text-white font-bold py-2 px-10 rounded'>Login</button>
        </div>

        {isOpen ? (
            <XIcon className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer' onClick={toggleMenu}/>
        ) : (
            <MenuIcon className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer' onClick={toggleMenu}/>
        )}
    </div>
  )
}

export default NavBar

