export interface IAppConfig {
  id: number
  key: string
  value: string
  type: string
  description: string
  category: string
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface IPayloadAppConfig {
  id?: number
  key?: string
  value: string
  type: string
  description: string
  category: string
  is_active: boolean
}

const AppConfigKey = {
  MEMBER_LABEL: 'MEMBER-LABEL',
  ONLINE_PAYMENT: 'ONLINE-PAYMENT',
  DEPARTMENT_LABEL: 'DEPARTMENT-LABEL',
  CAN_EXTEND_MEMBER: 'CAN-EXTEND-MEMBER',
  CAN_EXTEND_DEPARTMENT: 'CAN-EXTEND-DEPARTMENT',
  DIVISION_LABEL: 'DIVISION-LABEL',
  CAN_REGISTER_VISITOR: 'CAN-REGISTER-VISITOR',
  CAN_MANUAL_APPROVAL: 'CAN-MANUAL-APPROVAL'
} as const

export type AppConfigKey = (typeof AppConfigKey)[keyof typeof AppConfigKey]
