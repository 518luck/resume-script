/**
 * 日志工具模块
 *
 * 使用 winston 创建的全局 logger 实例，支持 info、error、warn 等日志级别。
 * 日志会被格式化为带有时间戳的字符串，并写入到 logPath 指定的日志文件中。
 *
 * @module logger
 * @requires winston
 * @requires ./path.js
 *
 * @example
 * import logger from './logger.js'
 * logger.info('应用启动成功')
 * logger.error('发生错误', err)
 */
import { createLogger, format, transports } from 'winston'
import { logPath } from './path.js'

/**
 * 全局 logger 实例
 *
 * - 日志级别：info
 * - 日志格式：YYYY-MM-DD HH:mm:ss [LEVEL]: message
 * - 输出目标：logPath 指定的文件
 */
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(
      (info) =>
        `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`
    )
  ),
  transports: [
    // new transports.Console(),
    new transports.File({ filename: logPath }),
  ],
})

export default logger
