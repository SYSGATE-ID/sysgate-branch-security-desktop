import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { readFileSync } from 'fs'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      // sandbox: false,
      nodeIntegration: true,
      webSecurity: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

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

// Dapatkan path folder image
ipcMain.handle('get-image-path', async () => {
  const imagePath = is.dev
    ? join(__dirname, '../../resources/assets/images')
    : join(process.resourcesPath, 'resources/assets/images')

  return imagePath
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// app.whenReady().then(() => {
//   // Daftarkan protokol "app://"
//   protocol.registerBufferProtocol('app', (request, respond) => {
//     const url = request.url.substr(6) // hapus "app://"

//     // Tentukan base path
//     const basePath = is.dev
//       ? join(__dirname, '../../resources/assets')
//       : join(process.resourcesPath, 'assets')

//     const filePath = join(basePath, url)

//     try {
//       if (!existsSync(filePath)) {
//         console.error('File not found:', filePath)
//         respond({ statusCode: 404 })
//         return
//       }

//       const data = readFileSync(filePath)

//       // deteksi mime type sederhana
//       const ext = filePath.split('.').pop()?.toLowerCase()
//       const mimeType =
//         ext === 'png'
//           ? 'image/png'
//           : ext === 'jpg' || ext === 'jpeg'
//             ? 'image/jpeg'
//             : ext === 'svg'
//               ? 'image/svg+xml'
//               : 'application/octet-stream'

//       respond({ mimeType, data })
//     } catch (err) {
//       console.error('Gagal load file:', err)
//       respond({ statusCode: 500 })
//     }
//   })
// })

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
