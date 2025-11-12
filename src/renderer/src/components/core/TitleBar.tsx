import React from 'react'
import { Minus, Square, X } from 'lucide-react'

interface TitleBarProps {
  title?: string
}

export const TitleBar: React.FC<TitleBarProps> = ({ title = 'Gate Management System' }) => {
  const handleMinimize = (): void => {
    window.electron?.ipcRenderer.send('window-minimize')
  }

  const handleMaximize = (): void => {
    window.electron?.ipcRenderer.send('window-maximize')
  }

  const handleClose = (): void => {
    window.electron?.ipcRenderer.send('window-close')
  }

  return (
    <div
      className="h-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-3 select-none"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* Left - App Icon & Title */}
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <span className="text-[10px] text-white font-bold">G</span>
        </div>
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{title}</span>
      </div>

      {/* Right - Window Controls */}
      <div
        className="flex items-center"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <button
          onClick={handleMinimize}
          className="h-8 w-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Minimize"
        >
          <Minus className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
        </button>
        <button
          onClick={handleMaximize}
          className="h-8 w-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Maximize"
        >
          <Square className="w-3 h-3 text-gray-600 dark:text-gray-400" />
        </button>
        <button
          onClick={handleClose}
          className="h-8 w-10 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-white" />
        </button>
      </div>
    </div>
  )
}
