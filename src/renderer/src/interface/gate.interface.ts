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
