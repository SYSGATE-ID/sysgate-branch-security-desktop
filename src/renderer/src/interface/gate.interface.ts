import { IMember } from './member.interface'
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
  member_id: number
  ticket_id: number
  gate: IGate
  member: IMember
  ticket: IVisitor | null
}

export interface IPayloadWSChecking {
  gate: IGate
  image: string
  ticket: IVisitor
  member: IMember
}
