import { useEffect, useState } from 'react'
import { ArrowUpDown } from 'lucide-react'
import type { IDashboardData, IPagination, IResponseDashboard } from '@interface/config.interface'
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
import { ILogGate } from '@renderer/interface/gate.interface'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useIndex = () => {
  const visitorService = VisitorService()
  const gateService = GateService()
  const [statistic, setStatistic] = useState<IDashboardData | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])

  const initialPage = 1
  const initialLimit = 50

  const [data, setData] = useState<IVisitor[]>([])
  const [logGates, setLogGates] = useState<ILogGate[]>([])
  const [selectedlogGate, setSelectedLogGate] = useState<ILogGate | null>(null)
  const [totalRows, setTotalRows] = useState(0)

  const [pagination] = useState<IPagination>({
    page: initialPage,
    limit: initialLimit
  })

  const totalPages = Math.ceil(totalRows / pagination.limit) || 1

  const [loading, setLoading] = useState({
    fetchData: false,
    fetchLogGate: false,
    fetchDetailLogGate: false,
    deleteData: false,
    actionPermission: false
  })

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

  // Fungsi untuk menutup dialog
  const closeDialogHandler = (): void => {
    setOpenDialog(null)
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
          page: pagination.page,
          limit: pagination.limit,
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
    pagination,
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

  return {
    statistic,
    stats,
    data,
    totalRows,
    pagination,
    loading,
    columns,
    table,
    selectedData,
    setSelectedData,
    openDialog,
    setOpenDialog,
    confirmDelete,
    setConfirmDelete,
    totalPages,
    handleReSendTicket,
    logGates,
    fetchDetailLog,
    selectedlogGate,
    openDialogHandler,
    closeDialogHandler,
    handleGetDetailLogGate
  }
}
