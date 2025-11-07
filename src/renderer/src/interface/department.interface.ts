export interface IDepartment {
  id: number
  division_id: number
  name: string
  code: string
  description: string
  created_at: Date
  updated_at: Date
  deleted_at: Date
  update_by: string
  delete_by: string
}

export interface IPayloadDepartment {
  name: string
  code?: string
  description?: string
  division_id: number | null
}
