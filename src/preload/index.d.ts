// src/electron.d.ts atau preload/index.d.ts
import { ElectronAPI } from '@electron-toolkit/preload'
import { WindowInfo } from '@renderer/interface/config.interface'
import { IConfigAsset } from '@renderer/interface/configAsset.interface'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getMyConfig: () => Promise<IConfigAsset>
      getImage: () => Promise<string>
      getImageBase64: (filename: string) => Promise<string>
      windowControl: {
        minimize: () => void
        maximize: () => void
        close: () => void
      }
      auth: {
        loginSuccess: () => void
        logout: () => void
      }
      // API untuk window detection
      onWindowType: (callback: (type: string) => void) => void
      removeWindowTypeListener: () => void
      windowInfo: {
        getInfo: () => Promise<WindowInfo | null>
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      on: (channel: string, callback: Function) => void
    }
  }
}