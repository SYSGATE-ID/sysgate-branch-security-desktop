// File: src/renderer/components/Sidebar.tsx
import React, { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@renderer/components/ui/tooltip'
import { Home, LogOut, Sun, Moon, User } from 'lucide-react'
import { Separator } from '@renderer/components/ui/separator'
import { useNavigate } from 'react-router-dom'
import { useConfigStore } from '@renderer/store/configProvider'
import { useTheme } from './ThemeProvider'

const navItems = [
  { id: 'home', label: 'Home', icon: Home, link: '/' },
  { id: 'users', label: 'Users', icon: User, link: '/' }
  // { id: 'settings', label: 'Settings', icon: Settings, link: '/' }
]

interface SidebarProps {
  activeTab?: string
  onTabChange?: (tabId: string) => void
  onLogout?: () => void
  onProfileClick?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab = 'home', onTabChange, onLogout }) => {
  const navigate = useNavigate()
  const { setTheme, theme } = useTheme()
  const [active, setActive] = useState(activeTab)
  const { assetsPathConfig } = useConfigStore()

  const handleTabClick = (tabId: string, link: string): void => {
    setActive(tabId)
    onTabChange?.(tabId)
    navigate(link)
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className="flex flex-col bg-slate-50 dark:bg-neutral-900 border-r border-slate-200 dark:border-slate-800 w-16 shadow-sm"
        aria-label="Sidebar navigation"
      >
        {/* Logo/Brand */}
        <div className="flex items-center justify-center h-16 border-b border-slate-200 dark:border-slate-800">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            <img src={`${assetsPathConfig}\\images\\logo.png`} alt="Logo" />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4">
          <ul className="flex flex-col gap-2 px-2">
            {navItems.map((item, index) => {
              const Icon = item.icon
              const isActive = active === item.id

              return (
                <li key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleTabClick(item.id, item.link)}
                        className={`
                          relative w-full h-12 flex items-center justify-center rounded-lg
                          transition-all duration-200 outline-none
                          hover:bg-slate-200 dark:hover:bg-slate-800
                          focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                          ${
                            isActive
                              ? 'bg-blue-500 text-white shadow-md hover:bg-blue-600'
                              : 'text-slate-600 dark:text-slate-400'
                          }
                        `}
                        aria-label={item.label}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <Icon size={20} strokeWidth={2} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-medium">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </li>
              )
            })}
          </ul>
        </nav>

        <Separator className="my-2" />

        {/* Bottom Actions */}
        <div className="pb-4 px-2 space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-full h-12 flex items-center justify-center rounded-lg
                  text-slate-600 dark:text-slate-400
                  hover:bg-slate-200 dark:hover:bg-slate-800
                  transition-all duration-200 outline-none
                  focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                {/* Sun Icon */}
                <Sun
                  className={`absolute h-[1.2rem] w-[1.2rem] text-slate-700 dark:text-slate-300 
          transition-all duration-300 transform 
          ${theme === 'dark' ? 'scale-0 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}
        `}
                />

                {/* Moon Icon */}
                <Moon
                  className={`absolute h-[1.2rem] w-[1.2rem] text-slate-700 dark:text-slate-300 
          transition-all duration-300 transform 
          ${theme === 'dark' ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0'}
        `}
                />
                <span className="sr-only">Toggle theme</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              Tema
            </TooltipContent>
          </Tooltip>

          {/* <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onProfileClick}
                className="
                  w-full h-12 flex items-center justify-center rounded-lg
                  text-slate-600 dark:text-slate-400
                  hover:bg-slate-200 dark:hover:bg-slate-800
                  transition-all duration-200 outline-none
                  focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                "
                aria-label="Profile"
              >
                <User size={20} strokeWidth={2} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              Profile
            </TooltipContent>
          </Tooltip> */}

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onLogout}
                className="
                  w-full h-12 flex items-center justify-center rounded-lg
                  text-rose-600 dark:text-rose-400
                  hover:bg-rose-50 dark:hover:bg-rose-950/30
                  transition-all duration-200 outline-none
                  focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2
                "
                aria-label="Logout"
              >
                <LogOut size={20} strokeWidth={2} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              Logout
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  )
}
