import * as fs from 'fs'
import { logger } from './index.js'

export const clearLogs = (logPath: string) => {
  fs.writeFile(logPath, '', (err) => {
    if (err) {
      logger.error('清除日志失败')
    } else {
      logger.info('清除日志成功')
    }
  })
}
