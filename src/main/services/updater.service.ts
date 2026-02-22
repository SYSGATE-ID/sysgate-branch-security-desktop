import { ipcMain, BrowserWindow, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import { is } from '@electron-toolkit/utils'

export function setupAutoUpdater(getMainWindow: () => BrowserWindow | null): void {
  autoUpdater.autoDownload = false

  // Event dari tombol "Cek Update"
  ipcMain.on('check-for-updates', () => {
    if (is.dev) {
      const mainWindow = getMainWindow()
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

  autoUpdater.on('update-not-available', () => {
    const mainWindow = getMainWindow()
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send(
        'update:notification',
        'Aplikasi Anda sudah menggunakan versi terbaru.',
        'latest'
      )
    }
  })

  autoUpdater.on('update-available', () => {
    const mainWindow = getMainWindow()
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send(
        'update:notification',
        'Update tersedia dan siap diunduh.',
        'info'
      )
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
    const mainWindow = getMainWindow()
    if (mainWindow) {
      mainWindow.webContents.send('update:download-progress', progress)
    }
  })

  autoUpdater.on('update-downloaded', () => {
    const mainWindow = getMainWindow()
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
}
