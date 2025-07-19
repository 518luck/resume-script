import * as fs from 'fs'
import { logger } from './index.js'

/**
 * 清除指定路径的日志文件内容
 *
 * 将日志文件内容清空，但保留文件本身。如果清除过程中发生错误，
 * 会通过 logger 记录错误信息；成功时会记录成功信息。
 *
 * @param {string} logPath - 要清除的日志文件路径
 * @returns {void} 无返回值
 *
 * @example
 * // 清除应用日志
 * clearLogs('/path/to/app.log')
 *
 * @example
 * // 在 Electron 应用中使用
 * const logPath = path.join(app.getPath('userData'), 'logs/app.log')
 * clearLogs(logPath)
 *
 * @throws {Error} 当文件写入失败时，会通过 logger.error 记录错误
 *
 * @since 1.0.0
 */

export const clearLogs = (logPath: string) => {
  fs.writeFile(logPath, '', (err) => {
    if (err) {
      logger.error('清除日志失败')
    } else {
      logger.info('清除日志成功')
    }
  })
}
