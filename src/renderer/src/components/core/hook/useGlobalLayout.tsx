import { useConfigStore } from '@renderer/store/configProvider'
import { getDigitMD5Serial, recursiveMD5 } from '@renderer/utils/myFunctions'
import { useEffect, useState } from 'react'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const UseGlobalLayout = () => {
  const { config } = useConfigStore.getState()
  const myLicense = config?.license

  const [deviceId, setDeviceId] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [licenseIs, setLicenseIs] = useState<boolean>(false)

  const checkIDDevice = async (): Promise<void> => {
    window.electron.ipcRenderer.send('get-deviceID')

    let secProductId = 'no'
    let secLicense = 'no'

    const handleResponse = (_: Electron.IpcRendererEvent, data: string): void => {
      secProductId = data.replace('UUID', '').trim()
      setDeviceId(secProductId)
    }

    window.electron.ipcRenderer.once('uuid-response', handleResponse)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      secLicense = getDigitMD5Serial(recursiveMD5('2021VMS2025' + secProductId, 10))
      console.log(secLicense)

      if (secLicense === myLicense) {
        setLicenseIs(true)
        console.log('license valid')
      } else {
        console.log('license invalid')
      }
    } catch (error) {
      console.error(`Error License ${error}`)
    }
  }

  useEffect(() => {
    const handleResponse = (_: Electron.IpcRendererEvent, data: string): void => {
      const id = data.replace('UUID', '').trim()
      setDeviceId(id)
    }

    window.electron.ipcRenderer.on('uuid-response', handleResponse)

    return () => {
      window.electron.ipcRenderer.removeListener('uuid-response', handleResponse)
    }
  }, [])

  useEffect(() => {
    checkIDDevice()
  }, [])

  // 🔥 Listener F12
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12') {
        e.preventDefault()
        setShowModal(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return { deviceId, showModal, setShowModal, licenseIs }
}
