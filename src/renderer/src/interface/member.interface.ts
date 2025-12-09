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
  vehicle_plate: string
  picture_out: IMedia
  picture_in: IMedia
  tariff: ITariff
  track?: ITrackGate
}

export interface ITrackGate {
  id: number
  member_id: number
  vehicle_plate: string
  last_detected_plate: string
  entered_at: string
  exited_at: string
  created_at: string
  updated_at: string
  picture_in: IMedia[]
  picture_out: IMedia[]
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
