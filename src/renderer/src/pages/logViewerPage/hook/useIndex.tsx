import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ILogData } from '@interface/config.interface'
import { loggerDB } from '@renderer/db/loggerDB'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useIndex = () => {
  const navigate = useNavigate()
  const [logs, setLogs] = useState<ILogData[]>([])
  const [search, setSearch] = useState('')

  const loadLogs = async (): Promise<void> => {
    const data = await loggerDB.logs.orderBy('created_at').reverse().toArray()
    setLogs(data)
  }

  const refresh = async (): Promise<void> => {
    await loadLogs()
  }

  const clearLogs = async (): Promise<void> => {
    await loggerDB.logs.clear()
    setLogs([])
  }

  const filteredLogs = logs.filter((log) => {
    if (!search) return true

    const s = search.toLowerCase()

    // Cek field utama
    const mainFieldsMatch =
      log.type?.toLowerCase().includes(s) ||
      log.action?.toLowerCase().includes(s) ||
      log.message?.toLowerCase().includes(s)

    if (mainFieldsMatch) return true

    // Cek dalam meta (client information)
    if (log.meta && typeof log.meta === 'object') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const meta = log.meta as any
      if (meta.client) {
        const client = meta.client
        const clientMatch =
          client.ip?.toLowerCase().includes(s) ||
          client.device?.browser?.toLowerCase().includes(s) ||
          client.device?.os?.toLowerCase().includes(s) ||
          client.device?.deviceType?.toLowerCase().includes(s) ||
          client.device?.platform?.toLowerCase().includes(s) ||
          client.url?.toLowerCase().includes(s) ||
          client.hostname?.toLowerCase().includes(s)

        if (clientMatch) return true
      }
    }

    // Cek field lainnya
    return (
      JSON.stringify(log.request || '')
        .toLowerCase()
        .includes(s) ||
      JSON.stringify(log.payload || '')
        .toLowerCase()
        .includes(s) ||
      JSON.stringify(log.response || '')
        .toLowerCase()
        .includes(s) ||
      JSON.stringify(log.meta || '')
        .toLowerCase()
        .includes(s)
    )
  })

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        navigate(-1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    loadLogs()
  }, [])

  return {
    logs: filteredLogs,
    search,
    setSearch,
    refresh,
    clearLogs
  }
}
