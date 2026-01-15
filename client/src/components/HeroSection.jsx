import React from 'react'
import backgroundImage from '../assets/backgroundImage.png'

const HeroSection = () => {
  return (
    <div className="relative min-h-[100vh] w-full flex items-center justify-start p-8 md:p-32 bg-black overflow-hidden">
      
      {/* Background with Dual Gradient for better text readability */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] hover:scale-110" 
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9) 20%, rgba(0,0,0,0.4) 50%, transparent 100%), linear-gradient(to top, rgba(0,0,0,0.8) 10%, transparent 40%), url(${backgroundImage})`
        }}
      ></div>

      {/* Decorative Glow - Unique Touch */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-red-600/20 blur-[120px] rounded-full"></div>

      <div className="relative z-20 max-w-2xl text-white ml-4 md:ml-12">
        {/* Animated Badge */}
        <div className="inline-block px-3 py-1 mb-4 border border-white/20 rounded-full bg-white/5 backdrop-blur-md text-[10px] uppercase tracking-[0.2em] animate-pulse">
          New Release
        </div>

        <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-4 leading-none bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500">
          FATHER
        </h1>

        <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center space-x-4 text-sm font-semibold tracking-wide uppercase text-red-500">
                <span>Drama</span>
                <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                <span>Family</span>
                <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                <span>Social</span>
            </div>
          
            <div className="flex items-center space-x-3">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1 rounded text-xs font-bold">
                2025
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1 rounded text-xs font-bold">
                2h 15m
                </div>
                <div className="flex items-center text-yellow-500 text-sm font-bold">
                    <span className="mr-1">★</span> 8.9 IMDB
                </div>
            </div>
        </div>

        <p className="text-lg md:text-xl leading-relaxed mb-8 text-gray-300 max-w-lg font-light italic">
          "Set against the lush landscapes of Sri Lanka, a heartfelt story unfolds as a father returns after decades abroad."
        </p>

        <div className="flex flex-wrap gap-4">
            <button className="group flex items-center bg-red-600 hover:bg-red-700 transition-all duration-300 px-8 py-4 rounded-xl text-base font-bold shadow-lg shadow-red-600/20">
            Explore Movies
            <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
            </button>
            
            <button className="flex items-center bg-white/5 hover:bg-white/10 border border-white/20 transition-all px-8 py-4 rounded-xl text-base font-bold backdrop-blur-sm">
                Watch Trailer
            </button>
        </div>
      </div>
    </div>
  )
}

export default HeroSection