import { ILogData } from '@renderer/interface/config.interface'
import Dexie, { Table } from 'dexie'

export class LoggerDB extends Dexie {
  logs!: Table<ILogData>

  constructor() {
    super('SysGateLocalDB')

    this.version(1).stores({
      logs: '++id, type, action, created_at, [type+created_at]'
    })
  }
}

export const loggerDB = new LoggerDB()
