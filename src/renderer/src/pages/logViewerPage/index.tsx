import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@renderer/components/ui/card'
import { Input } from '@renderer/components/ui/input'
import { Badge } from '@renderer/components/ui/badge'
import { Button } from '@renderer/components/ui/button'
import { useIndex } from './hook/useIndex'
import { Download, RefreshCcw, Trash2, ChevronDown, ChevronRight } from 'lucide-react'

export const LogViewerPage: React.FC = () => {
  const { logs, search, setSearch, refresh, clearLogs } = useIndex()
  const [openLog, setOpenLog] = useState<number | null>(null)

  /* ============================ COLOR TAG ============================ */
  const getColorByType = (type: string): string => {
    switch (type) {
      case 'ERROR':
        return 'bg-red-600 text-white'
      case 'WARN':
        return 'bg-yellow-500 text-black'
      case 'DEBUG':
        return 'bg-purple-600 text-white'
      default:
        return 'bg-blue-600 text-white'
    }
  }

  /* ============================ EXPORT JSON ============================ */
  const handleExportJSON = (): void => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `logs-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  /* ============================ EXPORT CSV ============================ */
  const handleExportCSV = (): void => {
    if (logs.length === 0) return

    const csvRows: string[] = []
    const headers = Object.keys(logs[0])
    csvRows.push(headers.join(','))

    logs.forEach((log) => {
      const values = headers.map((h) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const val = (log as any)[h]
        return typeof val === 'object' ? JSON.stringify(val).replace(/,/g, ';') : val
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
    <div className="p-6 flex justify-center">
      <Card className="w-full max-w-6xl shadow-xl border border-slate-200 dark:border-slate-700">
        {/* ============================ HEADER ============================ */}
        <CardHeader className="flex flex-row justify-between items-center gap-4">
          <CardTitle className="text-2xl font-bold">Log Viewer</CardTitle>

          <div className="flex gap-2">
            <Button variant="outline" onClick={refresh}>
              <RefreshCcw size={16} className="mr-1" /> Refresh
            </Button>

            <Button variant="outline" onClick={handleExportCSV}>
              <Download size={16} className="mr-1" /> CSV
            </Button>

            <Button variant="outline" onClick={handleExportJSON}>
              <Download size={16} className="mr-1" /> JSON
            </Button>

            <Button variant="destructive" onClick={clearLogs}>
              <Trash2 size={16} className="mr-1" /> Clear
            </Button>
          </div>
        </CardHeader>

        {/* ============================ SEARCH ============================ */}
        <CardContent>
          <Input
            placeholder="Cari log (type, action, message, request, payload...)"
            className="mb-4"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* ============================ LIST LOGS ============================ */}
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
            {logs.length === 0 && (
              <p className="text-center text-gray-500 py-10 text-sm">Belum ada log disimpan</p>
            )}

            {logs.map((log) => {
              const isOpen = openLog === log.id

              return (
                <div
                  key={log.id}
                  className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  {/* ============================ HEADER LOG ITEM ============================ */}
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setOpenLog(isOpen ? null : log.id!)}
                  >
                    <Badge className={getColorByType(log.type)}>{log.type}</Badge>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {new Date(log.created_at).toLocaleString('id-ID')}
                      </span>
                      {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </div>
                  </div>

                  {/* ============================ ACTION + MESSAGE ============================ */}
                  <p className="mt-2 font-semibold text-slate-800 dark:text-slate-100">
                    {log.action}
                  </p>

                  <p className="text-sm text-gray-700 dark:text-gray-300">{log.message}</p>

                  {/* ============================ COLLAPSIBLE SECTIONS ============================ */}
                  {isOpen && (
                    <div className="mt-4 space-y-3">
                      {log.request! && <CollapsibleBlock title="Request" data={log.request} />}

                      {log.payload! && <CollapsibleBlock title="Payload" data={log.payload} />}

                      {log.response! && <CollapsibleBlock title="Response" data={log.response} />}

                      {log.meta! && <CollapsibleBlock title="Meta" data={log.meta} />}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* =======================================================================
   COLLAPSIBLE JSON BLOCK COMPONENT
   ======================================================================= */
const CollapsibleBlock: React.FC<{ title: string; data: unknown }> = ({ title, data }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-slate-300 dark:border-slate-700 rounded">
      <button
        className="w-full flex justify-between items-center px-3 py-2 text-sm font-medium bg-slate-200 dark:bg-slate-800 rounded-t"
        onClick={() => setOpen(!open)}
      >
        <span>{title}</span>
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>

      {open && (
        <pre className="p-3 text-xs bg-slate-100 dark:bg-slate-900 overflow-auto rounded-b">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  )
}
