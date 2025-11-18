import { loggerDB } from '@renderer/db/loggerDB'
import { ILogData } from '@renderer/interface/config.interface'

const safeSerialize = (value: unknown): string => {
  try {
    return JSON.parse(JSON.stringify(value))
  } catch {
    return String(value)
  }
}

const saveLog = async (data: ILogData): Promise<void> => {
  const cleaned = {
    ...data,
    request: data.request ? safeSerialize(data.request) : undefined,
    payload: data.payload ? safeSerialize(data.payload) : undefined,
    response: data.response ? safeSerialize(data.response) : undefined,
    meta: data.meta ? safeSerialize(data.meta) : undefined,
    created_at: new Date().toISOString()
  }

  await loggerDB.logs.add(cleaned)
}

export const LoggerService = {
  async info(
    action: string,
    message: string,
    extra?: {
      request?: unknown
      payload?: unknown
      response?: unknown
      meta?: unknown
    }
  ) {
    await saveLog({
      type: 'INFO',
      action,
      message,
      ...extra,
      created_at: new Date().toISOString()
    })
  },

  async warn(
    action: string,
    message: string,
    extra?: {
      request?: unknown
      payload?: unknown
      response?: unknown
      meta?: unknown
    }
  ) {
    await saveLog({
      type: 'WARN',
      action,
      message,
      ...extra,
      created_at: new Date().toISOString()
    })
  },

  async error(
    action: string,
    message: string,
    extra?: {
      request?: unknown
      payload?: unknown
      response?: unknown
      meta?: unknown
    }
  ) {
    await saveLog({
      type: 'ERROR',
      action,
      message,
      ...extra,
      created_at: new Date().toISOString()
    })
  },

  async debug(
    action: string,
    message: string,
    extra?: {
      request?: unknown
      payload?: unknown
      response?: unknown
      meta?: unknown
    }
  ) {
    await saveLog({
      type: 'DEBUG',
      action,
      message,
      ...extra,
      created_at: new Date().toISOString()
    })
  }
}
