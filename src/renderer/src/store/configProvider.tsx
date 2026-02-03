import { create } from 'zustand'
import type { IConfigAsset } from '@renderer/interface/configAsset.interface'

interface ConfigState {
  config?: IConfigAsset
  assetsPathConfig: string
  isLoading: boolean
  fetchConfig: () => Promise<void>
  setConfig: (cfg: IConfigAsset) => void
}

export const useConfigStore = create<ConfigState>((set) => ({
  config: undefined,
  assetsPathConfig: '',
  isLoading: true,

  // 🔄 fetch config dari localStorage atau preload API (Electron)
  fetchConfig: async () => {
    try {
      // Cek localStorage dulu
      const localConfigStr = localStorage.getItem('localConfig')

      if (localConfigStr) {
        // Jika ada di localStorage, gunakan itu
        const localConfig = JSON.parse(localConfigStr)
        const img = await window.api.getImage()
        set({ config: localConfig, assetsPathConfig: img, isLoading: false })
      } else {
        // Jika tidak ada di localStorage, ambil dari file dan simpan ke localStorage
        const cfg = await window.api.getMyConfig()
        const img = await window.api.getImage()

        // Simpan ke localStorage untuk pertama kali
        localStorage.setItem('localConfig', JSON.stringify(cfg))

        set({ config: cfg, assetsPathConfig: img, isLoading: false })
      }
    } catch (err) {
      console.error('Failed to load config:', err)
      set({ isLoading: false })
    }
  },

  setConfig: (cfg) => set({ config: cfg })
}))
