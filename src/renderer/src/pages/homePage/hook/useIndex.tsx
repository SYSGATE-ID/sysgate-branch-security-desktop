import { useEffect, useState } from 'react'
import { FileText, Clock, CheckCircle, XCircle, Ticket, type LucideIcon } from 'lucide-react'
import type { IDashboardData, IResponseDashboard } from '@interface/config.interface'

const apiUrl = import.meta.env.VITE_API_URL as string

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

interface UseDashboardReturn {
  statistic: IDashboardData | null
  stats: StatItem[]
}

export const useIndex = (): UseDashboardReturn => {
  const [statistic, setStatistic] = useState<IDashboardData | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    const eventSource = new EventSource(`${apiUrl}/v1/events/statistic/listen?token=${token}`)

    const handleUpdate = (event: MessageEvent): void => {
      try {
        const payload: IResponseDashboard<IDashboardData> = JSON.parse(event.data)

        if (payload?.type === 'DASHBOARD_STATISTIC_UPDATE' && payload.data) {
          setStatistic(payload.data)
          console.log('📊 Statistik diperbarui:', payload.data)
        }
      } catch (err) {
        console.error('❌ Gagal parse SSE dashboard:', err)
      }
    }

    eventSource.addEventListener('update-statistic', handleUpdate)

    eventSource.onerror = (err) => {
      console.error('⚠️ EventSource error dashboard:', err)
      eventSource.close()
    }

    return () => {
      eventSource.removeEventListener('update-statistic', handleUpdate)
      eventSource.close()
    }
  }, [])

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

  return { statistic, stats }
}
