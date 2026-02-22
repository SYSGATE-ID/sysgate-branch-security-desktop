import { ipcMain, BrowserWindow } from 'electron'

type WindowManager = {
  getMainWindow: () => BrowserWindow | null
  getLoginWindow: () => BrowserWindow | null
  createMainWindow: () => void
  createLoginWindow: () => void
  clearAllLocalStorage: () => void
  setMainWindow: (win: BrowserWindow | null) => void
  setLoginWindow: (win: BrowserWindow | null) => void
}

export function registerWindowIpcHandlers(manager: WindowManager): void {
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

    if (window === manager.getLoginWindow()) {
      windowType = 'login'
    } else if (window === manager.getMainWindow()) {
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
    window?.webContents.executeJavaScript('localStorage.removeItem("userLogin")')
    window?.close()
  })

  ipcMain.on('login-success', () => {
    const loginWindow = manager.getLoginWindow()
    loginWindow?.close()
    manager.setLoginWindow(null)
    manager.createMainWindow()
  })

  ipcMain.on('logout', () => {
    manager.clearAllLocalStorage()
    const mainWindow = manager.getMainWindow()
    mainWindow?.close()
    manager.setMainWindow(null)
    manager.createLoginWindow()
  })
}
