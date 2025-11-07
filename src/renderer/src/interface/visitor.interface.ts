import type { IMedia } from './media.interface'
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
}
export interface IPayloadAgreement {
  judge_reason: string
}
