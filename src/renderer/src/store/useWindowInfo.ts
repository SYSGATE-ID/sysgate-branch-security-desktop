// src/hooks/useWindowInfo.ts
import { useEffect, useState } from 'react'

interface WindowInfo {
  id: number
  type: string
  url: string
  title: string
  isMaximized: boolean
  isMinimized: boolean
  isFocused: boolean
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useWindowInfo() {
  const [windowInfo, setWindowInfo] = useState<WindowInfo | null>(null)
  const [currentWindowType, setCurrentWindowType] = useState<string>('')

  useEffect(() => {
    // Method 1: Get window info langsung
    const fetchWindowInfo = async (): Promise<void> => {
      try {
        if (window.api?.windowInfo?.getInfo) {
          const info = await window.api.windowInfo.getInfo()
          setWindowInfo(info)
          setCurrentWindowType(info?.type || '')
        }
      } catch (error) {
        console.error('Error fetching window info:', error)
      }
    }

    // Method 2: Listen untuk window-type event
    if (window.api?.onWindowType) {
      window.api.onWindowType((type: string) => {
        setCurrentWindowType(type)
      })
    }

    fetchWindowInfo()

    // Cleanup
    return () => {
      if (window.api?.removeWindowTypeListener) {
        window.api.removeWindowTypeListener()
      }
    }
  }, [])

  // Helper function untuk mengecek window type
  const isLoginWindow = currentWindowType === 'login' || windowInfo?.type === 'login'
  const isMainWindow = currentWindowType === 'main' || windowInfo?.type === 'main'

  return {
    windowInfo,
    currentWindowType,
    isLoginWindow,
    isMainWindow,
    refresh: async () => {
      if (window.api?.windowInfo?.getInfo) {
        const info = await window.api.windowInfo.getInfo()
        setWindowInfo(info)
        setCurrentWindowType(info?.type || '')
      }
    }
  }
}
