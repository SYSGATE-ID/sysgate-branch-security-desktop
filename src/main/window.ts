import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

export let mainWindow: BrowserWindow | null = null
let loginWindow: BrowserWindow | null = null

export function clearAllLocalStorage(): void {
  const windows = BrowserWindow.getAllWindows()
  windows.forEach((win) => {
    if (!win.isDestroyed()) {
      win.webContents.executeJavaScript('localStorage.removeItem("userLogin")').catch(() => {})
    }
  })
  console.log('LocalStorage cleared from all windows')
}

export function getMainWindow(): BrowserWindow | null {
  return mainWindow
}

export function getLoginWindow(): BrowserWindow | null {
  return loginWindow
}

export function setMainWindow(win: BrowserWindow | null): void {
  mainWindow = win
}

export function setLoginWindow(win: BrowserWindow | null): void {
  loginWindow = win
}

export function createLoginWindow(): void {
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

export function createMainWindow(): void {
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
    fullscreenable: true,
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
    mainWindow?.setFullScreen(true)
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
