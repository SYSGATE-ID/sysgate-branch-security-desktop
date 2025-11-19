import { ElectronAPI } from '@electron-toolkit/preload'
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      on: (channel: string, callback: Function) => void
    }
  }
}
