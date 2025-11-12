// File: src/renderer/components/Sidebar.tsx
import React, { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@renderer/components/ui/tooltip'
import { Home, Grid, Users, Settings, LogOut, User } from 'lucide-react'
import { Separator } from '@renderer/components/ui/separator'
import { useNavigate } from 'react-router-dom'
import { useConfigStore } from '@renderer/store/configProvider'

const navItems = [
  { id: 'home', label: 'Home', icon: Home, link: '/' },
  { id: 'dashboard', label: 'Dashboard', icon: Grid, link: '/' },
  { id: 'users', label: 'Users', icon: Users, link: '/' },
  { id: 'settings', label: 'Settings', icon: Settings, link: '/' }
]

interface SidebarProps {
  activeTab?: string
  onTabChange?: (tabId: string) => void
  onLogout?: () => void
  onProfileClick?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab = 'home',
  onTabChange,
  onLogout,
  onProfileClick
}) => {
  const navigate = useNavigate()
  const [active, setActive] = useState(activeTab)
    const { assetsPathConfig } = useConfigStore();

  const handleTabClick = (tabId: string, link: string): void => {
    setActive(tabId)
    onTabChange?.(tabId)
    navigate(link)
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className="flex flex-col bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 h-screen w-16 shadow-sm"
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
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = active === item.id

              return (
                <li key={item.id}>
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
          </Tooltip>

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
