import React, { useState } from 'react'
import { CardHeader, CardTitle, CardContent } from '@renderer/components/ui/card'
import { Input } from '@renderer/components/ui/input'
import { Badge } from '@renderer/components/ui/badge'
import { Button } from '@renderer/components/ui/button'
import { useIndex } from './hook/useIndex'
import {
  Download,
  RefreshCcw,
  Trash2,
  ChevronDown,
  ChevronRight,
  Monitor,
  Globe,
  Search,
  Filter,
  MapPin,
  User,
  Clock
} from 'lucide-react'
import { MyContainer } from '@renderer/components/core/MyContainer'

export const LogViewerPage: React.FC = () => {
  const { logs, search, setSearch, refresh, clearLogs } = useIndex()
  const [openLog, setOpenLog] = useState<number | null>(null)
  const [selectedType, setSelectedType] = useState<string>('ALL')

  /* ============================ COLOR TAG ============================ */
  const getColorByType = (type: string): string => {
    switch (type) {
      case 'ERROR':
        return 'bg-red-600 text-white'
      case 'WARN':
        return 'bg-yellow-500 text-black'
      case 'DEBUG':
        return 'bg-purple-600 text-white'
      case 'INFO':
        return 'bg-blue-600 text-white'
      default:
        return 'bg-gray-600 text-white'
    }
  }

  /* ============================ FILTER LOGS ============================ */
  const filteredLogs = logs.filter((log) => {
    if (selectedType !== 'ALL' && log.type !== selectedType) {
      return false
    }
    return true
  })

  /* ============================ STATISTICS ============================ */
  const logStats = {
    total: logs.length,
    error: logs.filter((log) => log.type === 'ERROR').length,
    warn: logs.filter((log) => log.type === 'WARN').length,
    info: logs.filter((log) => log.type === 'INFO').length,
    debug: logs.filter((log) => log.type === 'DEBUG').length
  }

  /* ============================ EXPORT JSON ============================ */
  const handleExportJSON = (): void => {
    const blob = new Blob([JSON.stringify(filteredLogs, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `logs-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  /* ============================ EXPORT CSV ============================ */
  const handleExportCSV = (): void => {
    if (filteredLogs.length === 0) return

    const csvRows: string[] = []
    const headers = Object.keys(filteredLogs[0])
    csvRows.push(headers.join(','))

    filteredLogs.forEach((log) => {
      const values = headers.map((h) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const val = (log as any)[h]
        if (val === null || val === undefined) return ''
        return typeof val === 'object' ? JSON.stringify(val).replace(/,/g, ';') : String(val)
      })
      csvRows.push(values.join(','))
    })

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `logs-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <MyContainer className="p-6">
      {/* ============================ HEADER ============================ */}
      <CardHeader className="mb-6 flex flex-row justify-between items-center gap-4">
        <div>
          <CardTitle className="text-2xl font-bold mb-2">Logger Aktivitas</CardTitle>
          <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>
              Total: <strong>{logStats.total}</strong>
            </span>
            <span className="text-red-600">
              Error: <strong>{logStats.error}</strong>
            </span>
            <span className="text-yellow-600">
              Warning: <strong>{logStats.warn}</strong>
            </span>
            <span className="text-blue-600">
              Info: <strong>{logStats.info}</strong>
            </span>
            <span className="text-purple-600">
              Debug: <strong>{logStats.debug}</strong>
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={refresh}>
            <RefreshCcw size={16} className="mr-1" /> Refresh
          </Button>

          <Button variant="outline" onClick={handleExportCSV} disabled={filteredLogs.length === 0}>
            <Download size={16} className="mr-1" /> CSV
          </Button>

          <Button variant="outline" onClick={handleExportJSON} disabled={filteredLogs.length === 0}>
            <Download size={16} className="mr-1" /> JSON
          </Button>

          <Button variant="destructive" onClick={clearLogs} disabled={logs.length === 0}>
            <Trash2 size={16} className="mr-1" /> Clear
          </Button>
        </div>
      </CardHeader>

      {/* ============================ FILTERS & SEARCH ============================ */}
      <CardContent className="p-0">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <Input
              placeholder="Cari log (type, action, message, request, payload, device, ip, page...)"
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Filter size={16} className="text-gray-400 mt-2" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
            >
              <option value="ALL">All Types</option>
              <option value="ERROR">Error</option>
              <option value="WARN">Warning</option>
              <option value="INFO">Info</option>
              <option value="DEBUG">Debug</option>
            </select>
          </div>
        </div>

        {/* ============================ LIST LOGS ============================ */}
        <div className="space-y-3 pr-2 max-h-[calc(100vh-280px)] overflow-y-auto">
          {filteredLogs.length === 0 && (
            <div className="text-center text-gray-500 py-10 text-sm">
              {logs.length === 0
                ? 'Belum ada log disimpan'
                : 'Tidak ada log yang sesuai dengan filter'}
            </div>
          )}

          {filteredLogs.map((log) => {
            const isOpen = openLog === log.id
            // Parse info dari meta
            const metaInfo =
              log.meta && typeof log.meta === 'object'
                ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (log.meta as any)
                : null
            const clientInfo = metaInfo?.client
            const pageInfo = metaInfo?.page
            const userAction = metaInfo?.userAction

            return (
              <div
                key={log.id}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                onClick={() => setOpenLog(isOpen ? null : log.id!)}
              >
                {/* ============================ HEADER LOG ITEM ============================ */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <Badge className={`${getColorByType(log.type)} whitespace-nowrap`}>
                      {log.type}
                    </Badge>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                        {log.action}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{log.message}</p>

                      {/* Page & Action Information */}
                      <div className="flex flex-col gap-1 mt-2">
                        {pageInfo && (
                          <div className="flex flex-wrap items-center gap-3 text-xs">
                            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                              <MapPin size={12} />
                              <span className="font-medium">Page:</span>
                              <span>{pageInfo.route || pageInfo.path}</span>
                            </div>

                            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                              <Clock size={12} />
                              <span>
                                {pageInfo.timestamp
                                  ? new Date(pageInfo.timestamp).toLocaleTimeString('id-ID')
                                  : new Date(log.created_at).toLocaleTimeString('id-ID')}
                              </span>
                            </div>
                          </div>
                        )}

                        {userAction && (
                          <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
                            <User size={12} />
                            <span className="font-medium">Action:</span>
                            <span>{userAction}</span>
                          </div>
                        )}

                        {/* Device & IP Info */}
                        {clientInfo && (
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Monitor size={12} />
                              <span>{clientInfo.device?.browser || 'Unknown'}</span>
                              <span>•</span>
                              <span>{clientInfo.device?.os || 'Unknown OS'}</span>
                              {clientInfo.device?.deviceType && (
                                <>
                                  <span>•</span>
                                  <span>{clientInfo.device.deviceType}</span>
                                </>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              <Globe size={12} />
                              <span>{clientInfo.ip || 'No IP'}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleDateString('id-ID')}
                    </span>
                    {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </div>
                </div>

                {/* ============================ COLLAPSIBLE SECTIONS ============================ */}
                {isOpen && (
                  <div className="mt-4 space-y-3 border-t pt-4 border-gray-200 dark:border-gray-700">
                    {/* Page Information Section */}
                    {pageInfo && (
                      <CollapsibleBlock
                        title="Page Information"
                        data={pageInfo}
                        icon={<MapPin size={14} />}
                      />
                    )}

                    {/* Client Information Section */}
                    {clientInfo && (
                      <CollapsibleBlock
                        title="Client Information"
                        data={clientInfo}
                        icon={<Monitor size={14} />}
                      />
                    )}

                    {log.request && <CollapsibleBlock title="Request" data={log.request} />}

                    {log.params && <CollapsibleBlock title="Params" data={log.params} />}

                    {log.payload && <CollapsibleBlock title="Payload" data={log.payload} />}

                    {log.response && <CollapsibleBlock title="Response" data={log.response} />}

                    {log.meta && <CollapsibleBlock title="Meta (Full)" data={log.meta} />}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </MyContainer>
  )
}

const CollapsibleBlock: React.FC<{
  title: string
  data: unknown
  icon?: React.ReactNode
}> = ({ title, data, icon }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-slate-300 dark:border-slate-700 rounded">
      <button
        className="w-full flex justify-between items-center px-3 py-2 text-sm font-medium bg-slate-200 dark:bg-slate-800 rounded-t hover:bg-slate-300 dark:hover:bg-slate-700 transition"
        onClick={(e) => {
          e.stopPropagation()
          setOpen(!open)
        }}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </div>
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>

      {open && (
        <pre className="p-3 text-xs bg-slate-100 dark:bg-slate-900 overflow-auto rounded-b max-h-96">
          {typeof data === 'string' ? data : JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  )
}
