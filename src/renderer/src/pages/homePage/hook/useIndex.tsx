import { useEffect, useState } from 'react'
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Ticket,
  type LucideIcon,
  ArrowUpDown
} from 'lucide-react'
import type { IDashboardData, IPagination, IResponseDashboard } from '@interface/config.interface'
import VisitorService from '@renderer/services/visitorService'
import { useSearchParams } from 'react-router-dom'
import { ColumnDef, SortingState } from '@tanstack/react-table'
import { optionInitialLimit, timeDebounce } from '@renderer/utils/optionsData'
import { IVisitor } from '@renderer/interface/visitor.interface'
import { useDebounce } from '@uidotdev/usehooks'
import { useTableInstance } from '@renderer/components/core/useTableDataInstance'
import { AxiosError } from 'axios'
import { IErrorResponse } from '@renderer/interface/response.interface'
import { convertStatusVisitor, formatDateTime, toPlus62 } from '@renderer/utils/myFunctions'
import { Button } from '@renderer/components/ui/button'
import { toast } from 'sonner'
import { useSSEInstance } from '@renderer/api/useSSEInstance'
interface StatItem {
  label: string
  value: number
  icon: LucideIcon
  color: string
  bgLight: string
  bgDark: string
  textLight: string
  textDark: string
  iconBg: string
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useIndex = () => {
  const [statistic, setStatistic] = useState<IDashboardData | null>(null)
  const visitorService = VisitorService()
  const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [sorting, setSorting] = useState<SortingState>([])

  const initialPage = Number(searchParams.get('page')) || 1
  const initialLimit = Number(searchParams.get('limit')) || optionInitialLimit
  const initialSearch = searchParams.get('search') || ''

  const [data, setData] = useState<IVisitor[]>([])
  const [totalRows, setTotalRows] = useState(0)
  const [search, setSearch] = useState(initialSearch)
  const debouncedSearch = useDebounce(search, timeDebounce)

  const [pagination, setPagination] = useState<IPagination>({
    page: initialPage,
    limit: initialLimit
  })

  const totalPages = Math.ceil(totalRows / pagination.limit) || 1

  const [loading, setLoading] = useState({
    fetchData: false,
    deleteData: false,
    actionPermission: false
  })

  const [selectedData, setSelectedData] = useState<IVisitor | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean
    id: number | null
  }>({
    open: false,
    id: null
  })

  // Perbaikan: Gunakan useEffect untuk sinkronisasi URL params dengan state
  useEffect(() => {
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || optionInitialLimit
    const searchParam = searchParams.get('search') || ''

    setPagination({ page, limit })
    setSearch(searchParam)
  }, [searchParams])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const eventSource = useSSEInstance('/events/statistic/listen')

    eventSource.addEventListener('update-statistic', (event) => {
      try {
        const payload: IResponseDashboard<IDashboardData> = JSON.parse(event.data)

        if (payload.type === 'DASHBOARD_STATISTIC_UPDATE' && payload.data) {
          setStatistic(payload.data)
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

  const handlePageChange = (newPage: number): void => {
    setSearchParams({
      page: newPage.toString(),
      limit: pagination.limit.toString(),
      search: debouncedSearch
    })
  }

  const handleLimitChange = (newLimit: number): void => {
    setSearchParams({
      page: '1',
      limit: newLimit.toString(),
      search: debouncedSearch
    })
  }

  useEffect(() => {
    fetchData()
  }, [debouncedSearch, pagination.page, pagination.limit])

  const fetchData = async (): Promise<void> => {
    try {
      setLoading((p) => ({ ...p, fetchData: true }))
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch
      }

      const response = await visitorService.getAllVisitors(params)

      if (response.status_code === 200) {
        setData(response.data || [])
        setTotalRows(response.meta?.total || 0)
      }
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>
      toast.error('Gagal Memuat Data', {
        description: axiosError.response?.data?.message || 'Terjadi kesalahan saat memuat data.'
      })
    } finally {
      setLoading((p) => ({ ...p, fetchData: false }))
    }
  }

  const handleSearch = (value: string): void => {
    setSearchParams({
      page: '1',
      limit: pagination.limit.toString(),
      search: value
    })
  }

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

  const handleApprove = async (id: string): Promise<void> => {
    console.log(id)
    setIsOpenModalConfirm(false)
  }

  const handleReject = async (id: string): Promise<void> => {
    console.log(id)
    setIsOpenModalConfirm(false)
  }

  const handleDeleteData = async (id: number): Promise<void> => {
    try {
      setLoading((p) => ({ ...p, deleteData: true }))
      const response = await visitorService.deleteVisitor(id)

      if (response.status_code === 200) {
        toast.success(response.message, {
          description: 'Data berhasil dihapus.'
        })
        await fetchData()
      }
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>
      toast.error('Gagal Menghapus', {
        description: axiosError.response?.data?.message || 'Terjadi kesalahan saat menghapus data.'
      })
    } finally {
      setLoading((p) => ({ ...p, deleteData: false }))
      setConfirmDelete({ open: false, id: null })
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
      cell: ({ row }) => <span>{convertStatusVisitor(row.original.status)}</span>,
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
            setOpenDialog(true)
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
        <div className="w-[150px] text-left">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-white font-semibold hover:bg-transparent"
          >
            Plat Nomor
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-60 text-white" />
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <button
          onClick={async () => {
            setOpenDialog(true)
          }}
          className="font-medium transition-colors"
        >
          {row.original.vehicle_plate}
        </button>
      ),
      size: 100
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

  const stats: StatItem[] = [
    {
      label: 'Total',
      value: statistic?.ticket.created ?? 0,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      bgDark: 'dark:bg-blue-950/30',
      textLight: 'text-blue-600',
      textDark: 'dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-900/50'
    },
    {
      label: 'Menunggu',
      value: statistic?.ticket.pending ?? 0,
      icon: Clock,
      color: 'from-amber-500 to-amber-600',
      bgLight: 'bg-amber-50',
      bgDark: 'dark:bg-amber-950/30',
      textLight: 'text-amber-600',
      textDark: 'dark:text-amber-400',
      iconBg: 'bg-amber-100 dark:bg-amber-900/50'
    },
    {
      label: 'Disetujui',
      value: statistic?.ticket.approved ?? 0,
      icon: CheckCircle,
      color: 'from-emerald-500 to-emerald-600',
      bgLight: 'bg-emerald-50',
      bgDark: 'dark:bg-emerald-950/30',
      textLight: 'text-emerald-600',
      textDark: 'dark:text-emerald-400',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/50'
    },
    {
      label: 'Sedang Digunakan',
      value: statistic?.ticket.used ?? 0,
      icon: Ticket,
      color: 'from-violet-500 to-violet-600',
      bgLight: 'bg-violet-50',
      bgDark: 'dark:bg-violet-950/30',
      textLight: 'text-violet-600',
      textDark: 'dark:text-violet-400',
      iconBg: 'bg-violet-100 dark:bg-violet-900/50'
    },
    {
      label: 'Ditolak',
      value: statistic?.ticket.denied ?? 0,
      icon: XCircle,
      color: 'from-rose-500 to-rose-600',
      bgLight: 'bg-rose-50',
      bgDark: 'dark:bg-rose-950/30',
      textLight: 'text-rose-600',
      textDark: 'dark:text-rose-400',
      iconBg: 'bg-rose-100 dark:bg-rose-900/50'
    }
  ]

  return {
    statistic,
    stats,
    data,
    totalRows,
    pagination,
    loading,
    handleSearch,
    handleDeleteData,
    fetchData,
    columns,
    table,
    handlePageChange,
    handleLimitChange,
    selectedData,
    setSelectedData,
    openDialog,
    setOpenDialog,
    confirmDelete,
    setConfirmDelete,
    totalPages,
    handleApprove,
    handleReject,
    handleReSendTicket,
    isOpenModalConfirm,
    setIsOpenModalConfirm
  }
}
