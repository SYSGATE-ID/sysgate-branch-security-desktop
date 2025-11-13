import React from 'react'
import { Minus, Square, X, Sun, Moon, User } from 'lucide-react'
import { useConfigStore } from '@renderer/store/configProvider'

interface TitleBarProps {
  title?: string
  username?: string
  theme?: 'light' | 'dark'
  onThemeToggle?: () => void
}

export const TitleBar: React.FC<TitleBarProps> = ({
  title = 'Sysgate',
  username = '',
  theme = 'light',
  onThemeToggle
}) => {
  const { assetsPathConfig } = useConfigStore()

  const handleMinimize = (): void => {
    window.electron?.ipcRenderer.send('window-minimize')
  }

  const handleMaximize = (): void => {
    window.electron?.ipcRenderer.send('window-maximize')
  }

  const handleClose = (): void => {
    window.electron?.ipcRenderer.send('window-close')
    localStorage.clear()
  }

  return (
    <div
      className="h-10 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-3 select-none"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* Left - App Icon & Title */}
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded flex items-center justify-center">
          <img src={`${assetsPathConfig}/images/logo.png`} alt="" />
        </div>
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{title}</span>
      </div>

      {/* Center - Username */}
      {username !== '' && (
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-50 dark:bg-gray-700/50"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <User className="w-3 h-3 text-gray-500 dark:text-gray-400" />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{username}</span>
        </div>
      )}

      {/* Right - Theme Toggle & Window Controls */}
      <div
        className="flex items-center gap-0.5"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        {/* Theme Toggle */}
        <button
          onClick={onThemeToggle}
          className="h-8 w-9 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded relative"
          aria-label="Toggle theme"
        >
          {/* Sun Icon */}
          <Sun
            className={`absolute h-3.5 w-3.5 text-gray-600 dark:text-gray-400
              transition-all duration-300 transform 
              ${theme === 'dark' ? 'scale-0 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}
            `}
          />

          {/* Moon Icon */}
          <Moon
            className={`absolute h-3.5 w-3.5 text-gray-600 dark:text-gray-400
              transition-all duration-300 transform 
              ${theme === 'dark' ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0'}
            `}
          />
        </button>

        {/* Divider */}
        <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-0.5" />

        {/* Window Controls */}
        <button
          onClick={handleMinimize}
          className="h-8 w-9 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded"
          aria-label="Minimize"
        >
          <Minus className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
        </button>
        <button
          onClick={handleMaximize}
          className="h-8 w-9 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded"
          aria-label="Maximize"
        >
          <Square className="w-3 h-3 text-gray-600 dark:text-gray-400" />
        </button>
        <button
          onClick={handleClose}
          className="h-8 w-9 flex items-center justify-center hover:bg-red-500 transition-colors rounded group"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-white" />
        </button>
      </div>
    </div>
  )
}
