import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Interface untuk WindowInfo
interface WindowInfo {
  id: number
  type: string
  url: string
  title: string
  isMaximized: boolean
  isMinimized: boolean
  isFocused: boolean
  isLoginWindow?: boolean
  isMainWindow?: boolean
}

// Custom APIs for renderer
const api = {
  getMyConfig: async () => {
    return await ipcRenderer.invoke('get-my-config')
  },

  getImage: async (): Promise<string> => {
    return await ipcRenderer.invoke('get-assets-path')
  },
  
  getImageBase64: async (filename: string): Promise<string> => 
    ipcRenderer.invoke('get-image-base64', filename),

  // Tambahkan IPC handlers untuk window control dan auth
  windowControl: {
    minimize: (): void => ipcRenderer.send('window-minimize'),
    maximize: (): void => ipcRenderer.send('window-maximize'),
    close: (): void => ipcRenderer.send('window-close')
  },

  auth: {
    loginSuccess: (): void => ipcRenderer.send('login-success'),
    logout: (): void => ipcRenderer.send('logout')
  },

  // API untuk window detection
  onWindowType: (callback: (type: string) => void): void => {
    ipcRenderer.on('window-type', (_, type: string) => callback(type))
  },

  removeWindowTypeListener: (): void => {
    ipcRenderer.removeAllListeners('window-type')
  },

  windowInfo: {
    getInfo: async (): Promise<WindowInfo | null> => {
      return await ipcRenderer.invoke('get-window-info')
    }
  },

  // Untuk listen event dari main process (jika diperlukan)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on: (channel: string, callback: (...args: any[]) => void): void => {
    ipcRenderer.on(channel, (_, ...args) => callback(...args))
  },

  // Tambahkan remove listener umum
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeListener: (channel: string, callback: (...args: any[]) => void): void => {
    ipcRenderer.removeListener(channel, callback)
  },

  removeAllListeners: (channel: string): void => {
    ipcRenderer.removeAllListeners(channel)
  },

  getAppVersion: async (): Promise<string> => {
    return await ipcRenderer.invoke('get-app-version')
  }
}

// Gunakan contextBridge
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // Fallback untuk development
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(window as any).electron = electronAPI
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(window as any).api = api
}