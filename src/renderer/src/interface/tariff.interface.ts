export interface ITariff {
  id: number
  name: string
  code: string
  description: string
  created_at: Date
  updated_at: Date
  deleted_at: Date
  update_by: string
  delete_by: string
}

export interface IPayloadTariff {
  name: string
  code?: string
  description?: string
}
