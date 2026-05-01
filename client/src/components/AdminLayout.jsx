import React, { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  Activity,
  Film,
  Calendar,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  PlaySquare
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  const navItems = [
    { path: '/admin', icon: Activity, label: 'Dashboard' },
    { path: '/admin/movies', icon: Film, label: 'Movies' },
    { path: '/admin/shows', icon: PlaySquare, label: 'Shows' },
    { path: '/admin/bookings', icon: Calendar, label: 'Bookings' },
    { path: '/admin/users', icon: Users, label: 'Patrons' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-[#050905] flex">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-nebula-deep/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#0B0E14] border-r border-white/5 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8 pb-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-nebula-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform">
              <span className="text-white font-black text-xl">L</span>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter text-white uppercase italic leading-none">Lankan <span className="text-primary">HQ</span></span>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Command Center</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-6 overflow-y-auto">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-6">Menu</div>
          <ul className="space-y-2">
            {navItems.map((item) => {
              const active = isActive(item.path)
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-300 group
                      ${active
                        ? 'bg-primary/10 text-primary font-black shadow-inner shadow-primary/10'
                        : 'text-gray-400 font-bold hover:bg-white/5 hover:text-white'}
                    `}
                  >
                    <item.icon size={20} className={active ? 'text-primary' : 'text-gray-500 group-hover:text-white transition-colors'} />
                    <span className="text-xs uppercase tracking-widest">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-6">
          <button
            onClick={logout}
            className="flex items-center justify-center gap-3 w-full py-4 glass-card rounded-xl font-black text-xs uppercase tracking-widest text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all border-none"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen bg-transparent max-w-full overflow-hidden">
        {/* Top bar */}
        <header className="h-24 px-8 flex items-center justify-between border-b border-white/5 bg-[#0B0E14]/50 backdrop-blur-xl sticky top-0 z-30">
          <button
            className="lg:hidden p-3 glass-card rounded-xl border-none hover:bg-white/5"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="text-white" size={24} />
          </button>

          <div className="hidden lg:flex items-center gap-3 px-4 py-2 glass-card rounded-2xl border-white/5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">System Online</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-white italic">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">{user?.role || 'HQ STAFF'}</p>
            </div>
            <div className="w-12 h-12 rounded-[1rem] bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center border border-primary/20">
              <span className="text-primary font-black text-xl uppercase">{user?.name?.charAt(0) || 'A'}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto w-full">
          <div className="max-w-[1440px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout

