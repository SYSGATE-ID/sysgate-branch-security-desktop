import type { IReportStats } from './config.interface'
import type { IMedia } from './media.interface'
import type { IMeta } from './response.interface'
import type { ITariff } from './tariff.interface'

export interface IVisitor {
  id: number
  code: string
  full_name: string
  phone: string
  email: string
  vehicle_plate: string
  occupants: number
  status: string
  description: string
  judge_reason: string
  pictures: IMedia[]
  reservation_at: string
  created_at: Date
  updated_at: Date
  deleted_at: Date
  judge_by: string
  update_by: string
  delete_by: string
  tariff_id: number
  tariff: ITariff
}

export interface IPayloadVisitor {
  full_name: string
  phone: string
  email: string
  vehicle_plate: string
  occupants: number
  picture_filenames: string[]
  tariff_code: string
  reservation_at: string
  time_reservation?: string
}
export interface IPayloadAgreement {
  judge_reason: string
}
export interface IResponseReportVisitor<T = unknown> {
  message: string
  status_code: number
  success: boolean
  error: string
  data?: T
  meta?: IMeta
  filters: IReportFilter
  stats: IReportStats
}

export interface IReportFilter {
  filters: string
  status: string
  date_from: string
  date_to: string
  vehicle_plate: string
}
