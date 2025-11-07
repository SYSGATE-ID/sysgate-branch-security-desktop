export interface IPagination {
  page: number
  limit: number
}

export interface IResponseDashboard<T = unknown> {
  type: string
  message: string
  data?: T
}

export interface IDashboardData {
  ticket: {
    created: number
    pending: number
    approved: number
    used: number
    denied: number
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  visitor: Record<string, any>
}
