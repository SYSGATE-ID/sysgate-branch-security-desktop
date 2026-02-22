import { app } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'

import {
  createLoginWindow,
  createMainWindow,
  clearAllLocalStorage,
  getMainWindow,
  getLoginWindow,
  setMainWindow,
  setLoginWindow
} from './window'

import { registerAppIpcHandlers } from './ipc/app.ipc'
import { registerDeviceIpcHandlers } from './ipc/device.ipc'
import { registerWindowIpcHandlers } from './ipc/window.ipc'
import { setupAutoUpdater } from './services/updater.service'
import {
  registerProcessHandlers,
  registerAppLifecycleHandlers,
  logAppToServer
} from './services/logger.service'
import { startNetworkMonitoring } from './services/network.service'

// Register semua IPC handlers
registerAppIpcHandlers()
registerDeviceIpcHandlers()
registerWindowIpcHandlers({
  getMainWindow,
  getLoginWindow,
  createMainWindow,
  createLoginWindow,
  clearAllLocalStorage,
  setMainWindow,
  setLoginWindow
})

// Setup auto-updater
setupAutoUpdater(getMainWindow)
startNetworkMonitoring()
// Setup logger & lifecycle handlers
registerProcessHandlers(clearAllLocalStorage)
registerAppLifecycleHandlers(clearAllLocalStorage)

// App lifecycle
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  logAppToServer()
  createLoginWindow()

  app.on('activate', function () {
    createLoginWindow()
  })
})

app.on('window-all-closed', () => {
  console.log('All windows closed, clearing localStorage...')
  clearAllLocalStorage()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
