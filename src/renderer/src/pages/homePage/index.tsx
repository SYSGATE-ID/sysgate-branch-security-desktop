import React from 'react'
import { getValueAppConfig } from '@renderer/utils/myFunctions'
import { DashboardVisitor } from './components/dashboardVisitor'
import { DashboardParking } from './components/dashboardParking'

export const HomePage: React.FC = () => {
  return (
    <>{getValueAppConfig('CAN-REGISTER-VISITOR') ? <DashboardVisitor /> : <DashboardParking />}</>
  )
}
