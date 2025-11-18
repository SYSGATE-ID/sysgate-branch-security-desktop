import { ReactElement } from 'react'

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

export interface ILogData {
  id?: number
  type: 'INFO' | 'ERROR' | 'WARN' | 'DEBUG'
  action: string
  message: string
  request?: unknown
  payload?: unknown
  response?: unknown
  meta?: unknown
  created_at: string
}

export interface IAppRoute {
  path: string
  element: ReactElement
  active: boolean
  protected: boolean
  redirectTo?: string
}
