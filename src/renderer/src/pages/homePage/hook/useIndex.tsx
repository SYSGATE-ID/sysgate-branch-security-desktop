import { useEffect, useRef, useState } from 'react'
import { ArrowUpDown } from 'lucide-react'
import type {
  IDashboardData,
  IResponseDashboard,
  IWebSocketData
} from '@interface/config.interface'
import { ColumnDef, SortingState } from '@tanstack/react-table'
import { IVisitor } from '@renderer/interface/visitor.interface'
import { useTableInstance } from '@renderer/components/core/useTableDataInstance'
import { AxiosError } from 'axios'
import { IErrorResponse } from '@renderer/interface/response.interface'
import {
  convertStatusTicket,
  formatDateTime,
  generateStats,
  toPlus62
} from '@renderer/utils/myFunctions'
import { Button } from '@renderer/components/ui/button'
import { toast } from 'sonner'
import { useSSEInstance } from '@renderer/api/useSSEInstance'
import { Badge } from '@renderer/components/ui/badge'
import VisitorService from '@renderer/services/visitorService'
import GateService from '@renderer/services/gateService'
import { toastMessage } from '@renderer/utils/optionsData'
import { ILogGate, IPayloadWSChecking } from '@renderer/interface/gate.interface'
import { useConfigStore } from '@renderer/store/configProvider'
import { WsResponseAction } from '@renderer/interface/ws.interface'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useIndex = () => {
  const userLogin = localStorage.getItem('userLogin')
  const userData = userLogin ? JSON.parse(userLogin) : null

  const { config } = useConfigStore.getState()
  const ws_url = config?.ws_url || ''

  const visitorService = VisitorService()
  const gateService = GateService()
  const [statistic, setStatistic] = useState<IDashboardData | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])
  const [data, setData] = useState<IVisitor[]>([])
  const [logGates, setLogGates] = useState<ILogGate[]>([])
  const [selectedlogGate, setSelectedLogGate] = useState<ILogGate | null>(null)
  const [dataFromWS, setDataFromWS] = useState<IPayloadWSChecking>()
  const [totalRows, setTotalRows] = useState(0)

  const [loading, setLoading] = useState({
    fetchData: false,
    fetchLogGate: false,
    fetchDetailLogGate: false,
    deleteData: false,
    actionPermission: false,
    wsAction: false
  })

  const [wsData, setWsData] = useState<IWebSocketData | null>(null)
  const ws = useRef<WebSocket | null>(null)

  const [selectedData, setSelectedData] = useState<IVisitor | null>(null)
  const [openDialog, setOpenDialog] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean
    id: number | null
  }>({
    open: false,
    id: null
  })

  const openDialogHandler = (dialogName: string): void => {
    setOpenDialog(dialogName)
  }

  const closeDialogHandler = (): void => {
    setOpenDialog(null)
    setWsData(null)
  }

  const handleGetDetailLogGate = async (id: number): Promise<void> => {
    await fetchDetailLog(id)
    openDialogHandler('detailLogGate')
  }

  useEffect(() => {
    const fetchLogGate = async (): Promise<void> => {
      try {
        setLoading((p) => ({ ...p, fetchLogGate: true }))
        const params = {
          page: 1,
          limit: 20,
          search: ''
        }

        const response = await gateService.getAllLogGate(params)

        if (response.status_code === 200) {
          setLogGates(response.data || [])
          setTotalRows(response.meta?.total || 0)
        }
      } catch (error) {
        const axiosError = error as AxiosError<IErrorResponse>
        const { title, desc } = toastMessage.loadError('log gate')
        const message = axiosError.response?.data?.message || desc
        toast.error(title, {
          description: message
        })
      } finally {
        setLoading((p) => ({ ...p, fetchLogGate: false }))
      }
    }
    fetchLogGate()
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const eventSource = useSSEInstance('/events/statistic/listen')

    eventSource.addEventListener('update-statistic', (event) => {
      try {
        const payload: IResponseDashboard<IDashboardData> = JSON.parse(event.data)

        if (payload.type === 'DASHBOARD_STATISTIC_UPDATE' && payload.data) {
          setLoading({ ...loading, fetchData: false })
          setStatistic(payload.data)

          // ⬇⬇ UPDATE VISITOR DATA DARI SSE
          if (Array.isArray(payload.data.visitor)) {
            setData(payload.data.visitor)
            setTotalRows(payload.data.visitor.length)
          }
        }
      } catch (err) {
        console.error('Gagal parse SSE dashboard:', err)
      }
    })

    eventSource.onerror = (err) => {
      console.error('EventSource error dashboard:', err)
      eventSource.close()
    }

    return () => eventSource.close()
  }, [])

  const fetchDetailLog = async (id: number): Promise<void> => {
    try {
      setLoading({ ...loading, fetchDetailLogGate: true })
      const response = await gateService.getDetailLogGate(id.toString())

      if (response.status_code === 200) {
        setSelectedLogGate(response.data || null)
      }
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>
      const { title, desc } = toastMessage.loadError('detail log')
      const message = axiosError.response?.data?.message || desc
      toast.error(title, {
        description: message
      })
    } finally {
      setLoading({ ...loading, fetchDetailLogGate: false })
    }
  }

  const columns: ColumnDef<IVisitor>[] = [
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <div className="w-[50px] text-left">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-white font-semibold hover:bg-transparent"
          >
            Status <ArrowUpDown className="ml-2 h-4 w-4 opacity-60 text-white" />
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <Badge className={`${convertStatusTicket[row.original.status].className}`}>
          {convertStatusTicket[row.original.status].label}
        </Badge>
      ),
      size: 120
    },
    {
      accessorKey: 'reservation_at',
      header: ({ column }) => (
        <div className="w-[100px] text-left">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-white font-semibold hover:bg-transparent"
          >
            Jadwal <ArrowUpDown className="ml-2 h-4 w-4 opacity-60 text-white" />
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <span className="text-sm">{formatDateTime(row.original.reservation_at)}</span>
      ),
      size: 300
    },
    {
      accessorKey: 'full_name',
      header: ({ column }) => (
        <div className="w-[150px] text-left">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-white font-semibold hover:bg-transparent"
          >
            Nama Pengunjung <ArrowUpDown className="ml-2 h-4 w-4 opacity-60 text-white" />
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <button
          onClick={async () => {
            await fetchDetailData(row.original.id)
            openDialogHandler('detailVisitor')
          }}
          className="text-blue-600 font-medium hover:underline transition-colors"
        >
          {row.original.full_name}
        </button>
      ),
      size: 220
    },
    {
      accessorKey: 'vehicle_plate',
      header: ({ column }) => (
        <div className="w-[100px] text-left">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-white font-semibold hover:bg-transparent"
          >
            Plat Kendaraan <ArrowUpDown className="ml-2 h-4 w-4 opacity-60 text-white" />
          </Button>
        </div>
      ),
      cell: ({ row }) => <span className="text-sm">{row.original.vehicle_plate}</span>,
      size: 250
    },
    {
      accessorKey: 'phone',
      header: ({ column }) => (
        <div className="w-[100px] text-left">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-white font-semibold hover:bg-transparent"
          >
            No. Telp <ArrowUpDown className="ml-2 h-4 w-4 opacity-60 text-white" />
          </Button>
        </div>
      ),
      cell: ({ row }) => <span className="text-sm">{row.original.phone}</span>,
      size: 160
    }
  ]

  const table = useTableInstance({
    data,
    columns,
    totalRows,
    sorting,
    setSorting
  })

  const fetchDetailData = async (id: number): Promise<void> => {
    try {
      setLoading((prev) => ({ ...prev, fetchDetail: true }))
      const response = await visitorService.getDetailVisitor(id)
      if (response.status_code === 200) {
        const data = response.data as IVisitor
        setSelectedData(data)
      }
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>
      const message = axiosError.response?.data?.message || 'Gagal memuat data!'
      toast.error('Gagal Memuat Data', {
        description: message
      })
    } finally {
      setLoading((prev) => ({ ...prev, fetchDetail: false }))
    }
  }

  const handleReSendTicket = async (data: IVisitor, tipe: string): Promise<void> => {
    if (tipe === 'whatsapp') {
      const message = `
Halo ${data.full_name},

Tiket Anda telah *disetujui*
Berikut detail tiket Anda:

Kode Tiket: ${data.code}
Jadwal Kedatangan: ${formatDateTime(data.reservation_at)}

Silakan tunjukkan kode tiket ini saat kedatangan.
Terima kasih.
      `

      window.open(
        `https://wa.me/${toPlus62(data.phone)}?text=${encodeURIComponent(message)}`,
        '_blank'
      )
    } else if (tipe === 'gmail') {
      try {
        const response = await visitorService.sendEmailTicketVisitor(data.code)
        if (response.status_code === 200) {
          toast.success('Tiket Berhasil Dikirim', {
            description: response.message || 'Tiket berhasil dikirim ulang!'
          })
        } else {
          toast.error('Tiket Gagal Dikirim', {
            description: response.message || 'Tiket gagal dikirim ulang!'
          })
        }
      } catch (error) {
        const axiosError = error as AxiosError<IErrorResponse>
        const errorData = axiosError.response?.data?.error
        const message =
          typeof errorData === 'string'
            ? errorData
            : Object.values(errorData || {}).flat()[0] || 'Terjadi kesalahan pada server!'
        toast.error('Gagal Kirim Ulang Tiket', {
          description: message || 'Tiket gagal dikirim ulang!'
        })
      }
    }
  }

  const stats = generateStats(statistic)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const connectWebSocket = () => {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('Token tidak ditemukan')
        return
      }

      const wsUrl = `${ws_url}/gatekeeper?role=KEEPER&client_id=${token}`

      try {
        ws.current = new WebSocket(wsUrl)

        ws.current.onopen = () => {
          console.log('WebSocket connected')
          toast.success('WebSocket Connected', {
            description: 'Terhubung ke server gatekeeper'
          })
        }

        ws.current.onmessage = (event) => {
          try {
            const data: IWebSocketData = JSON.parse(event.data)
            setDataFromWS(data.payload)

            // Handle different message types
            switch (data.type) {
              case 'MEMBER_WITH_WRONG_PLATE_NEED_APPROVAL':
                setWsData(data)
                openDialogHandler('confirmData')
                toast.info('Perlu Approval', {
                  description: 'Ada kendaraan yang perlu persetujuan'
                })
                break
              case 'TICKET_WITH_WRONG_PLATE_NEED_APPROVAL':
                setWsData(data)
                openDialogHandler('confirmData')
                toast.info('Perlu Approval', {
                  description: 'Ada kendaraan yang perlu persetujuan'
                })
                break

              case 'OTHER_MESSAGE_TYPE':
                // Handle other message types
                break

              default:
                console.log('Unknown message type:', data.type)
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error)
          }
        }

        ws.current.onerror = (error) => {
          console.error('WebSocket error:', error)
          toast.error('WebSocket Error', {
            description: 'Terjadi kesalahan pada koneksi'
          })
        }

        ws.current.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason)
          if (event.code !== 1000) {
            // Reconnect setelah 5 detik jika bukan close normal
            setTimeout(connectWebSocket, 5000)
          }
        }
      } catch (error) {
        console.error('Error creating WebSocket:', error)
      }
    }

    connectWebSocket()

    // Cleanup function
    return () => {
      if (ws.current) {
        ws.current.close(1000, 'Component unmounting')
      }
    }
  }, [])

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const sendWsResponse = (action: WsResponseAction, reason?: string) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      toast.error('WebSocket tidak terhubung')
      return
    }

    if (!wsData) {
      toast.error('Data tidak ditemukan')
      return
    }

    setLoading((prev) => ({ ...prev, wsAction: true }))

    const hasTicket = Boolean(dataFromWS?.ticket?.id)
    const hasMember = Boolean(dataFromWS?.member?.id)

    const ticketId = dataFromWS?.ticket?.id
    const memberId = dataFromWS?.member?.number

    const payload = {
      gate_name: dataFromWS?.gate?.name,
      reason: reason || ''
    }

    if (hasTicket) {
      payload.ticket_id = ticketId
    } else if (hasMember) {
      payload.member_number = memberId
    }

    const response = {
      type: action,
      payload,
      meta: {
        timestamp: new Date().toISOString(),
        responded_by: 'gatekeeper',
        client_id: localStorage.getItem('token')
      }
    }

    try {
      ws.current.send(JSON.stringify(response))
      toast.success(
        `Berhasil ${action === WsResponseAction.KEEPER_APPROVE_ACCESS_WITH_WRONG_PLATE_MEMBER || action === WsResponseAction.KEEPER_APPROVE_ACCESS_WITH_WRONG_PLATE_TICKET ? 'Menyetujui' : 'Menolak'}`,
        {
          description: `Permintaan telah dikirim`
        }
      )
      closeDialogHandler()
    } catch (error) {
      console.error('Error sending WebSocket response:', error)
      toast.error('Gagal Mengirim Response')
    } finally {
      setLoading((prev) => ({ ...prev, wsAction: false }))
    }
  }

  const handleActionConfirm = (type: 'APPROVE' | 'REJECT', data: IPayloadWSChecking): void => {
    console.log(type)
    console.log(data)

    if (type === 'APPROVE') {
      if (data.member) {
        return sendWsResponse(WsResponseAction.KEEPER_APPROVE_ACCESS_WITH_WRONG_PLATE_MEMBER)
      }
      return sendWsResponse(WsResponseAction.KEEPER_APPROVE_ACCESS_WITH_WRONG_PLATE_TICKET)
    } else {
      const reason = `Ditolak oleh operator ${userData.username}`
      if (data.member) {
        return sendWsResponse(WsResponseAction.KEEPER_DENY_ACCESS_WITH_WRONG_PLATE_MEMBER, reason)
      }
      return sendWsResponse(WsResponseAction.KEEPER_DENY_ACCESS_WITH_WRONG_PLATE_TICKET, reason)
    }
  }

  // for testing
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'j') {
        e.preventDefault()
        openDialogHandler('confirmData')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return {
    statistic,
    stats,
    data,
    totalRows,
    loading,
    columns,
    table,
    selectedData,
    setSelectedData,
    openDialog,
    setOpenDialog,
    confirmDelete,
    setConfirmDelete,
    handleReSendTicket,
    logGates,
    fetchDetailLog,
    selectedlogGate,
    openDialogHandler,
    closeDialogHandler,
    handleGetDetailLogGate,
    handleActionConfirm,
    isWsConnected: ws.current?.readyState === WebSocket.OPEN,
    dataFromWS
  }
}
