import { useConfigStore } from '@renderer/store/configProvider'
import { getDigitMD5Serial, recursiveMD5 } from '@renderer/utils/myFunctions'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const UseGlobalLayout = () => {
  const navigate = useNavigate()
  const { config } = useConfigStore.getState()
  const myLicense = config?.license

  const [deviceId, setDeviceId] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false)
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false)
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
      await new Promise((resolve) => setTimeout(resolve, 1000))

      secLicense = getDigitMD5Serial(recursiveMD5('25SYSGATEE#PT' + secProductId + 'ELECTRONN', 10))
      if (secLicense === myLicense) {
        setLicenseIs(true)
      } else {
        console.error('license invalid')
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
        if (e.ctrlKey && e.shiftKey) {
          // Ctrl+Shift+F12 -> Password Modal dulu
          setShowPasswordModal(true)
        } else {
          // F12 -> Device ID Modal
          setShowModal(true)
        }
      }

      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault()
        navigate('/logger')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return {
    deviceId,
    showModal,
    setShowModal,
    showPasswordModal,
    setShowPasswordModal,
    showConfigModal,
    setShowConfigModal,
    licenseIs
  }
}
