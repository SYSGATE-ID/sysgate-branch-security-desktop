import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { readFileSync } from 'fs'
import nodeChildProcess from 'child_process'

let mainWindow: BrowserWindow | null = null
let loginWindow: BrowserWindow | null = null

function clearAllLocalStorage(): void {
  const windows = BrowserWindow.getAllWindows()
  windows.forEach((win) => {
    if (!win.isDestroyed()) {
      win.webContents.executeJavaScript('localStorage.clear()').catch(() => {
        // Ignore errors jika window sudah dihancurkan
      })
    }
  })
  console.log('LocalStorage cleared from all windows')
}

ipcMain.handle('get-window-info', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  if (!window) return null

  // Mendapatkan URL/window title untuk identifikasi
  const url = window.webContents.getURL()
  const title = window.getTitle()

  // Mendeteksi window type berdasarkan URL atau properti lain
  let windowType = 'unknown'

  if (url.includes('/login') || title.includes('Login')) {
    windowType = 'login'
  } else if (url.includes('/home') || title.includes('Home')) {
    windowType = 'main'
  }

  // Atau gunakan id window yang sudah kita ketahui
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
  // Jika login window sudah ada, focus dan return
  if (loginWindow) {
    loginWindow.focus()
    return
  }

  // Create login window
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
    // Jika login window ditutup dan main window belum ada, tutup app
    if (!mainWindow) {
      clearAllLocalStorage()
      app.quit()
    }
  })

  // HMR for renderer base on electron-vite cli.
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
  // Jika main window sudah ada, focus dan return
  if (mainWindow) {
    mainWindow.focus()
    return
  }

  // Create the main browser window.
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
    // Jika main window ditutup, buka login window
    if (!loginWindow) {
      createLoginWindow()
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// IPC handlers untuk semua window
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

// Handler untuk login berhasil
ipcMain.on('login-success', () => {
  // Tutup login window dan buka main window
  loginWindow?.close()
  loginWindow = null
  createMainWindow()
})

// Handler untuk logout
ipcMain.on('logout', () => {
  // Tutup main window dan buka login window
  clearAllLocalStorage()
  mainWindow?.close()
  mainWindow = null
  createLoginWindow()
})

// IPC handlers lainnya (get-my-config, get-assets-path, get-deviceID) tetap sama
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // Buat login window pertama kali
  createLoginWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createLoginWindow()
  })
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

// Handle uncaught exceptions dan crashes
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

// Handle SIGTERM dan SIGINT signals (untuk graceful shutdown)
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
