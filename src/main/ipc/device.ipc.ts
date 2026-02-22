import { ipcMain } from 'electron'
import nodeChildProcess from 'child_process'

export function registerDeviceIpcHandlers(): void {
  ipcMain.on('get-deviceID', (event) => {
    console.log('Running on', process.platform)

    if (process.platform === 'win32') {
      const script = nodeChildProcess.spawn('cmd.exe', ['/c', 'wmic csproduct get uuid'])

      script.stdout.on('data', (data) => {
        event.sender.send('uuid-response', data.toString().trim())
      })

      script.stderr.on('data', (err) => {
        console.error('Windows UUID Error:', err.toString().trim())
        event.sender.send('uuid-response', `Error: ${err.toString().trim()}`)
      })
    } else if (process.platform === 'linux') {
      const script = nodeChildProcess.spawn('sh', [
        '-c',
        'cat /etc/machine-id 2>/dev/null || cat /var/lib/dbus/machine-id 2>/dev/null || echo "Error: Unable to get machine ID"'
      ])

      script.stdout.on('data', (data) => {
        console.log('Linux UUID:', data.toString().trim())
        event.sender.send('uuid-response', data.toString().trim())
      })

      script.stderr.on('data', (err) => {
        event.sender.send('uuid-response', `Error: ${err.toString().trim()}`)
      })
    } else if (process.platform === 'darwin') {
      const script = nodeChildProcess.spawn('sh', [
        '-c',
        "system_profiler SPHardwareDataType | grep 'Hardware UUID' | awk '{print $3}'"
      ])

      script.stdout.on('data', (data) => {
        console.log('macOS UUID:', data.toString().trim())
        event.sender.send('uuid-response', data.toString().trim())
      })

      script.stderr.on('data', (err) => {
        event.sender.send('uuid-response', `Error: ${err.toString().trim()}`)
      })
    } else {
      event.sender.send('uuid-response', 'Error: Unsupported platform')
    }
  })
}
