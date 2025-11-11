import { ElectronAPI } from '@electron-toolkit/preload'
import { IConfigAsset } from '@renderer/interface/configAsset.interface'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getMyConfig: () => Promise<IConfigAsset>
      getImage: () => Promise<string>
      getImageBase64: (filename: string) => Promise<string>
    }
  }
}
