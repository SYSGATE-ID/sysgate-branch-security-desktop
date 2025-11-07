// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IResponseNotif<T = Record<string, any>> {
  id: number
  user_id?: string | null
  title: string
  message: string
  type: string
  category: string
  priority: string
  data?: T // bisa apa aja
  is_read?: boolean
  created_at?: string
}

export interface INotif {
  notif_id: number
  type: string
  title: string
  isResolved?: boolean
  subtitle: string
  ticket_id: string
  date: Date
}
