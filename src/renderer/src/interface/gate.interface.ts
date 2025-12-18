import { IMedia } from './media.interface'
import { IMember, ITrackGate } from './member.interface'
import { ITariff } from './tariff.interface'
import { IVisitor } from './visitor.interface'

export interface IGate {
  id: number
  name: string
  type: string
  description: string
  created_at: Date
  updated_at: Date
  deleted_at: Date
  update_by: string
  delete_by: string
}

export interface IPayloadGate {
  name: string
  description?: string
  type: string
}

export interface ILogGate {
  id: number
  gate_id: number
  action: string
  created_at: Date
  description: string
  vehicle_plat: string
  model_id: number
  access_type: string
  tariff: ITariff
  picture: IMedia
}

export interface IPayloadWSChecking {
  gate: IGate
  image: string
  media: IMedia
  detected_plate: string
  current_track?: ITrackGate
  ticket: IVisitor
  member: IMember
}
