import React from 'react'
import backgroundImage from '../assets/backgroundImage.png'

const HeroSection = () => {
  return (
    <div className="relative min-h-[100vh] w-full flex items-center justify-start p-8 md:p-32 bg-black overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105" 
        style={{backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 30%, transparent 100%), url(${backgroundImage})`}}
      ></div>

      <div className="relative z-20 max-w-xl text-white ml-4 md:ml-12">
        <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-4">
          Father
        </h1>

        <div className="flex flex-col gap-1 mb-4 text-base font-medium opacity-90">
          <div className="flex items-center space-x-2">
            <span>Drama</span>
            <span className="text-gray-400">|</span>
            <span>Family</span>
            <span className="text-gray-400">|</span>
            <span>Social</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-white/10 px-2 py-0.5 rounded text-sm">
              2025
            </div>
            <div className="flex items-center bg-white/10 px-2 py-0.5 rounded text-sm">
              2h 15m
            </div>
          </div>
        </div>

        <p className="text-base md:text-lg leading-relaxed mb-6 text-gray-200 line-clamp-3">
          Set against the lush landscapes of Sri Lanka, a heartfelt story unfolds as a father returns after decades abroad, navigating cultural shifts and estranged relationships.
        </p>

        <button className="group flex items-center bg-red-500 hover:bg-red-600 transition-colors px-6 py-3 rounded-full text-base font-semibold">
          Explore Movies
          <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default HeroSection

