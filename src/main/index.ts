import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { readFileSync } from 'fs'
import nodeChildProcess from 'child_process'
import { autoUpdater } from 'electron-updater'

let mainWindow: BrowserWindow | null = null
let loginWindow: BrowserWindow | null = null

function clearAllLocalStorage(): void {
  const windows = BrowserWindow.getAllWindows()
  windows.forEach((win) => {
    if (!win.isDestroyed()) {
      win.webContents.executeJavaScript('localStorage.clear()').catch(() => {})
    }
  })
  console.log('LocalStorage cleared from all windows')
}

ipcMain.handle('get-window-info', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  if (!window) return null

  const url = window.webContents.getURL()
  const title = window.getTitle()

  let windowType = 'unknown'

  if (url.includes('/login') || title.includes('Login')) {
    windowType = 'login'
  } else if (url.includes('/home') || title.includes('Home')) {
    windowType = 'main'
  }

  if (window === loginWindow) {
    windowType = 'login'
  } else if (window === mainWindow) {
    windowType = 'main'
  }

  return {
    id: window.id,
    type: windowType,
    url: url,
    title: title,
    isMaximized: window.isMaximized(),
    isMinimized: window.isMinimized(),
    isFocused: window.isFocused()
  }
})

function createLoginWindow(): void {
  if (loginWindow) {
    loginWindow.focus()
    return
  }

  loginWindow = new BrowserWindow({
    width: 450,
    height: 550,
    minWidth: 450,
    minHeight: 550,
    show: false,
    frame: false,
    titleBarStyle: 'hidden',
    resizable: false,
    center: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: true,
      webSecurity: false,
      contextIsolation: false
    }
  })

  loginWindow.on('ready-to-show', () => {
    loginWindow?.show()
    loginWindow?.focus()
  })

  loginWindow.on('closed', () => {
    loginWindow = null

    if (!mainWindow) {
      clearAllLocalStorage()
      app.quit()
    }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    loginWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/login')
  } else {
    loginWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      hash: '/login'
    })
  }

  loginWindow.webContents.on('did-finish-load', () => {
    loginWindow?.webContents.send('window-type', 'login')
  })
}

function createMainWindow(): void {
  if (mainWindow) {
    mainWindow.focus()
    return
  }

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1200,
    minHeight: 800,
    show: false,
    frame: false,
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: true,
      webSecurity: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.maximize()
    mainWindow?.show()
    mainWindow?.focus()
  })

  mainWindow.on('closed', () => {
    mainWindow = null

    if (!loginWindow) {
      createLoginWindow()
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

ipcMain.on('window-minimize', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  window?.minimize()
})

ipcMain.on('window-maximize', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  if (window?.isMaximized()) {
    window.unmaximize()
  } else {
    window?.maximize()
  }
})

ipcMain.on('window-close', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  window?.webContents.executeJavaScript('localStorage.clear()')
  window?.close()
})

ipcMain.on('login-success', () => {
  loginWindow?.close()
  loginWindow = null
  createMainWindow()
})

ipcMain.on('logout', () => {
  clearAllLocalStorage()
  mainWindow?.close()
  mainWindow = null
  createLoginWindow()
})

ipcMain.handle('get-my-config', async () => {
  try {
    const jsonPath = is.dev
      ? join(__dirname, '../../resources/assets/config/config.json')
      : join(process.resourcesPath, 'resources/assets/config/config.json')

    const content = readFileSync(jsonPath, 'utf8')
    return JSON.parse(content)
  } catch (err) {
    console.error('Gagal membaca config:', err)
    return null
  }
})

ipcMain.handle('get-assets-path', async () => {
  const assetsPathConfig = is.dev
    ? join(__dirname, '../../resources/assets')
    : join(process.resourcesPath, 'resources/assets')

  return assetsPathConfig
})

ipcMain.on('get-deviceID', (event) => {
  const script = nodeChildProcess.spawn('cmd.exe', ['/c', 'wmic csproduct get uuid'])

  script.stdout.on('data', (data) => {
    event.sender.send('uuid-response', data.toString().trim())
  })

  script.stderr.on('data', (err) => {
    event.sender.send('uuid-response', `Error: ${err.toString().trim()}`)
  })
})

ipcMain.handle('clear-localstorage', async () => {
  const windows = BrowserWindow.getAllWindows()
  windows.forEach((win) => {
    win.webContents.executeJavaScript('localStorage.clear()')
  })
})

ipcMain.handle('get-app-version', () => {
  return app.getVersion()
})

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  createLoginWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createLoginWindow()
  })
})

// Event dari tombol "Cek Update"
ipcMain.on('check-for-updates', () => {
  // Cek apakah dalam mode development
  if (is.dev) {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send(
        'update:notification',
        'Aplikasi dalam mode development. Auto-update hanya tersedia untuk versi production yang sudah di-package.',
        'info'
      )
    }
    return
  }

  autoUpdater.checkForUpdates()
})

// Konfigurasi auto update
autoUpdater.autoDownload = false

autoUpdater.on('update-not-available', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(
      'update:notification',
      'Aplikasi Anda sudah menggunakan versi terbaru.',
      'latest'
    )
  }
})

autoUpdater.on('update-available', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('update:notification', 'Update tersedia dan siap diunduh.', 'info')
    dialog
      .showMessageBox(mainWindow as BrowserWindow, {
        type: 'info',
        title: 'Update tersedia',
        message: 'Versi baru tersedia. Mau download sekarang?',
        buttons: ['Ya', 'Nanti']
      })
      .then((result) => {
        if (result.response === 0) {
          autoUpdater.downloadUpdate()
        }
      })
  }
})

autoUpdater.on('download-progress', (progressObj) => {
  const progress = Math.round(progressObj.percent)
  if (mainWindow) {
    mainWindow.webContents.send('update:download-progress', progress)
  }
})

autoUpdater.on('update-downloaded', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(
      'update:notification',
      'Update berhasil diunduh dan siap diinstall.',
      'info'
    )
    dialog
      .showMessageBox(mainWindow, {
        title: 'Update Siap',
        message: 'Update telah diunduh. Aplikasi akan restart untuk update.'
      })
      .then(() => {
        autoUpdater.quitAndInstall()
      })
  }
})

app.on('before-quit', () => {
  console.log('App is quitting, clearing localStorage...')
  clearAllLocalStorage()
})

app.on('will-quit', () => {
  console.log('App will quit, ensuring localStorage is cleared...')
  clearAllLocalStorage()
})

app.on('window-all-closed', () => {
  console.log('All windows closed, clearing localStorage...')
  clearAllLocalStorage()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  clearAllLocalStorage()
  app.quit()
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  clearAllLocalStorage()
  app.quit()
})

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, clearing localStorage...')
  clearAllLocalStorage()
  app.quit()
})

process.on('SIGINT', () => {
  console.log('Received SIGINT, clearing localStorage...')
  clearAllLocalStorage()
  app.quit()
})
