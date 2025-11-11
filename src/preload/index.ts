import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  getMyConfig: async () => {
    return await ipcRenderer.invoke('get-my-config')
  },

  getImage: async () => {
    return await ipcRenderer.invoke('get-image-path')
  },
  getImageBase64: async (filename: string) => ipcRenderer.invoke('get-image-base64', filename)
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.electron = electronAPI
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.api = api
}
