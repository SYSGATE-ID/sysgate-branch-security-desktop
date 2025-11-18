import { useEffect, useState } from 'react'
import { loggerDB } from '@renderer/db/loggerDB'
import { ILogData } from '@renderer/interface/config.interface'
import { useNavigate } from 'react-router-dom'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useIndex = () => {
  const navigate = useNavigate()
  const [logs, setLogs] = useState<ILogData[]>([])
  const [search, setSearch] = useState('')

  const loadLogs = async (): Promise<void> => {
    const data = await loggerDB.logs.orderBy('created_at').reverse().toArray()
    console.log(data)

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
    return (
      log.type?.toLowerCase().includes(s) ||
      log.action?.toLowerCase().includes(s) ||
      log.message?.toLowerCase().includes(s) ||
      JSON.stringify(log.meta || '')
        .toLowerCase()
        .includes(s) ||
      JSON.stringify(log.request || '')
        .toLowerCase()
        .includes(s) ||
      JSON.stringify(log.payload || '')
        .toLowerCase()
        .includes(s) ||
      JSON.stringify(log.response || '')
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
