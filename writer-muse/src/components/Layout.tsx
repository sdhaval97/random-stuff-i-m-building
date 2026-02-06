import { Outlet, NavLink } from 'react-router-dom'
import { PenLine, Lightbulb } from 'lucide-react'
import { cn } from '../lib/utils'
import { Settings } from './Settings'

export function Layout() {
  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="absolute top-0 right-0 p-4 z-10">
        <Settings />
      </header>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      
      <nav className="border-t border-slate-200 bg-white/80 backdrop-blur-md pb-safe">
        <div className="flex justify-around items-center h-16">
          <NavLink to="/" className="w-full h-full">
            {({ isActive }) => (
              <div
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                  isActive ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"
                )}
              >
                <PenLine size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">Notes</span>
              </div>
            )}
          </NavLink>
          
          <NavLink to="/topics" className="w-full h-full">
            {({ isActive }) => (
              <div
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                  isActive ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"
                )}
              >
                <Lightbulb size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">Topics</span>
              </div>
            )}
          </NavLink>
        </div>
      </nav>
    </div>
  )
}
