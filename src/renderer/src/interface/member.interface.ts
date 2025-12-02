import type { IMedia } from './media.interface'
import { ITariff } from './tariff.interface'

export interface IMember {
  id: number
  number: string
  full_name: string
  email: string
  phone: string
  address: string
  media_id: number
  department_id: number
  description: string
  profile_picture: IMedia
  created_at: Date
  updated_at: Date
  deleted_at: Date
  update_by: string
  delete_by: string
  status: string
  picture_out: IMedia
  picture_in: IMedia
  tariff: ITariff
}

export interface IPayloadMember {
  number: string
  full_name: string
  department_id: number | null
  picture_filename?: string | null
  email: string
  phone: string
  description: string
  vehicle_plate?: string
}
