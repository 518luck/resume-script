/**
 * @file logger.ts
 * @description 封装 winston 日志库，提供统一的日志记录功能。
 * 日志会同时输出到控制台和 logs/app.log 文件。
 * 支持 info、warn、error 等日志级别。
 */

import { createLogger, format, transports } from 'winston'

/**
 * 全局日志记录器
 *
 * - level: 'info' 只记录 info 及以上级别日志
 * - format: 带时间戳和自定义格式
 * - transports: 同时输出到控制台和 logs/app.log 文件
 *
 * @example
 * logger.info('程序启动')
 * logger.warn('警告信息')
 * logger.error('错误信息')
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
    new transports.Console(), // 输出到控制台
    new transports.File({ filename: 'logs/app.log' }), // 输出到 logs/app.log 文件
  ],
})

export default logger
