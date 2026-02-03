import React, { useEffect, useState } from 'react'
import { Minus, Square, X, Sun, Moon, User, Copy, RefreshCw } from 'lucide-react'
import { useConfigStore } from '@renderer/store/configProvider'
import { UseGlobalLayout } from './hook/useGlobalLayout'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@renderer/components/ui/dialog'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'

interface TitleBarProps {
  title?: string
  username?: string
  theme?: 'light' | 'dark'
  onThemeToggle?: () => void
}

export const TitleBar: React.FC<TitleBarProps> = ({
  title = 'Sysgate',
  username = '',
  theme = 'light',
  onThemeToggle
}) => {
  const { assetsPathConfig, config } = useConfigStore()
  const {
    deviceId,
    showModal,
    setShowModal,
    showPasswordModal,
    setShowPasswordModal,
    showConfigModal,
    setShowConfigModal
  } = UseGlobalLayout()

  // === State Modal Close Confirm ===
  const [showConfirmClose, setShowConfirmClose] = useState(false)

  // === State Password ===
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  // === State Update Progress ===
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [openedProgress, setOpenedProgress] = useState(false)
  const [updateInfoMsg, setUpdateInfoMsg] = useState('')
  const [updateInfoSeverity, setUpdateInfoSeverity] = useState<'success' | 'info'>('info')
  const [updateInfoOpen, setUpdateInfoOpen] = useState(false)

  // === State Config Form ===
  const [localConfig, setLocalConfig] = useState({
    apiUrl: config?.api_url,
    wsUrl: config?.ws_url,
    license: config?.license
  })

  const handleMinimize = (): void => {
    window.electron?.ipcRenderer.send('window-minimize')
  }

  const handleMaximize = (): void => {
    window.electron?.ipcRenderer.send('window-maximize')
  }

  // === Trigger open dialog, tidak langsung close ===
  const handleCloseClick = (): void => {
    setShowConfirmClose(true)
  }

  // === Confirm action ===
  const confirmClose = (): void => {
    localStorage.clear()
    window.electron?.ipcRenderer.send('window-close')
  }

  const handleUpdate = (): void => {
    window.electron.ipcRenderer.send('check-for-updates')
  }

  useEffect(() => {
    const handleProgress = (_event: unknown, percent: number): void => {
      setDownloadProgress(percent)
      setOpenedProgress(true)
      if (percent >= 100) {
        setTimeout(() => setOpenedProgress(false), 2000)
      }
    }

    const handleUpdateNotification = (_event: unknown, msg: string, type: string): void => {
      setUpdateInfoMsg(msg)
      setUpdateInfoSeverity(type === 'latest' ? 'success' : 'info')
      setUpdateInfoOpen(true)
    }

    window.electron.ipcRenderer.on('update:download-progress', handleProgress)
    window.electron.ipcRenderer.on('update:notification', handleUpdateNotification)
    return () => {
      window.electron.ipcRenderer.removeAllListeners('update:download-progress')
      window.electron.ipcRenderer.removeAllListeners('update:notification')
    }
  }, [])

  const handlePasswordSubmit = (): void => {
    if (password === 'admin123') {
      setShowPasswordModal(false)
      setShowConfigModal(true)
      setPassword('')
      setPasswordError('')
    } else {
      setPasswordError('Password salah!')
    }
  }

  const handleSaveConfig = (): void => {
    const newConfig = {
      api_url: localConfig.apiUrl,
      ws_url: localConfig.wsUrl,
      license: localConfig.license
    }
    localStorage.setItem('localConfig', JSON.stringify(newConfig))
    setShowConfigModal(false)
    window.location.reload()
  }

  return (
    <div
      className="h-10 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-3 select-none"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* Left - App Icon & Title */}
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded flex items-center justify-center">
          <img src={`${assetsPathConfig}/images/logo.png`} alt="" />
        </div>
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{title}</span>
      </div>

      {/* Center - Username */}
      {username !== '' && (
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-50 dark:bg-gray-700/50"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <User className="w-3 h-3 text-gray-500 dark:text-gray-400" />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{username}</span>
        </div>
      )}

      {/* Right Controls */}
      <div
        className="flex items-center gap-0.5"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        {/* Update Button */}
        <button
          onClick={handleUpdate}
          className="h-8 px-2.5 flex items-center gap-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded"
          aria-label="Check for updates"
        >
          <RefreshCw className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Update</span>
        </button>

        {/* Divider */}
        <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-0.5" />

        {/* Theme Toggle */}
        <button
          onClick={onThemeToggle}
          className="h-8 w-9 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded relative"
          aria-label="Toggle theme"
        >
          <Sun
            className={`absolute h-3.5 w-3.5 text-gray-600 dark:text-gray-400
              transition-all duration-300 transform 
              ${theme === 'dark' ? 'scale-0 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}
            `}
          />
          <Moon
            className={`absolute h-3.5 w-3.5 text-gray-600 dark:text-gray-400
              transition-all duration-300 transform 
              ${theme === 'dark' ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0'}
            `}
          />
        </button>

        {/* Divider */}
        <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-0.5" />

        {/* Minimize */}
        <button
          onClick={handleMinimize}
          className="h-8 w-9 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded"
          aria-label="Minimize"
        >
          <Minus className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
        </button>

        {/* Maximize */}
        <button
          onClick={handleMaximize}
          className="h-8 w-9 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded"
          aria-label="Maximize"
        >
          <Square className="w-3 h-3 text-gray-600 dark:text-gray-400" />
        </button>

        {/* Close */}
        <button
          onClick={handleCloseClick}
          className="h-8 w-9 flex items-center justify-center hover:bg-red-500 transition-colors rounded group"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-white" />
        </button>
      </div>

      {/* DEVICE ID MODAL */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Device ID</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="w-full">
              <div className="flex items-center justify-between px-3 py-2 rounded-md bg-muted dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">
                <span className="text-[16px] font-mono break-all text-gray-700 dark:text-gray-300">
                  {deviceId || 'Loading...'}
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 ml-2"
                  onClick={() => navigator.clipboard.writeText(deviceId || '')}
                >
                  <Copy className="text-[7px]" />
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button onClick={() => setShowModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CONFIRM CLOSE MODAL */}
      <Dialog open={showConfirmClose} onOpenChange={setShowConfirmClose}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Keluar Aplikasi</DialogTitle>
          </DialogHeader>

          <div className="text-sm text-gray-600 dark:text-gray-300">
            Apakah Anda yakin ingin keluar dari aplikasi?
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowConfirmClose(false)}>
              Batal
            </Button>

            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={confirmClose}>
              Keluar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PASSWORD MODAL */}
      <Dialog
        open={showPasswordModal}
        onOpenChange={(open) => {
          setShowPasswordModal(open)
          if (!open) {
            setPassword('')
            setPasswordError('')
          }
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Masukkan Password</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setPasswordError('')
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handlePasswordSubmit()
                  }
                }}
                className="w-full"
                autoFocus
              />
              {passwordError && (
                <p className="text-sm text-red-600 dark:text-red-400">{passwordError}</p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowPasswordModal(false)
                setPassword('')
                setPasswordError('')
              }}
            >
              Batal
            </Button>

            <Button onClick={handlePasswordSubmit}>Lanjutkan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CONFIG MODAL */}
      <Dialog open={showConfigModal} onOpenChange={setShowConfigModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Konfigurasi Aplikasi</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api_url" className="text-sm font-medium">
                API URL
              </Label>
              <Input
                id="api_url"
                type="text"
                placeholder="https://api.example.com"
                value={localConfig.apiUrl}
                onChange={(e) => setLocalConfig({ ...localConfig, apiUrl: e.target.value })}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ws_url" className="text-sm font-medium">
                WebSocket URL
              </Label>
              <Input
                id="ws_url"
                type="text"
                placeholder="https://api.example.com/ws"
                value={localConfig.wsUrl}
                onChange={(e) => setLocalConfig({ ...localConfig, wsUrl: e.target.value })}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="license" className="text-sm font-medium">
                License
              </Label>
              <Input
                id="license"
                type="text"
                placeholder="1234567890"
                value={localConfig.license}
                onChange={(e) => setLocalConfig({ ...localConfig, license: e.target.value })}
                className="w-full"
              />
            </div>
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowConfigModal(false)}>
              Batal
            </Button>

            <Button onClick={handleSaveConfig}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* UPDATE PROGRESS MODAL */}
      <Dialog open={openedProgress} onOpenChange={setOpenedProgress}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Download Update</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Progress Download</span>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {downloadProgress.toFixed(1)}%
                </span>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300 ease-out rounded-full flex items-center justify-end px-1"
                  style={{ width: `${downloadProgress}%` }}
                >
                  {downloadProgress > 10 && (
                    <span className="text-[10px] text-white font-medium">
                      {downloadProgress.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>

              {downloadProgress >= 100 ? (
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                  Download selesai! Aplikasi akan di-update...
                </p>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Mohon tunggu, sedang mengunduh update...
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* UPDATE INFO NOTIFICATION */}
      <Dialog open={updateInfoOpen} onOpenChange={setUpdateInfoOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              {updateInfoSeverity === 'success' ? 'Aplikasi Terbaru' : 'Update Tersedia'}
            </DialogTitle>
          </DialogHeader>

          <div className="text-sm text-gray-600 dark:text-gray-300">{updateInfoMsg}</div>

          <DialogFooter className="mt-4">
            <Button onClick={() => setUpdateInfoOpen(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
