/**
 * @file logger.ts
 * @description
 * 封装 winston 日志库，提供全局统一的日志记录功能。
 * 日志会同时输出到控制台和 Electron 用户数据目录下的 logs/app.log 文件。
 * 支持 info、warn、error 等日志级别，自动带时间戳。
 *
 * 使用方式：
 *   import logger from './utils/logger'
 *   logger.info('信息')
 *   logger.warn('警告')
 *   logger.error('错误')
 */
import { app } from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import { createLogger, format, transports } from 'winston'

/**
 * 获取日志文件路径，统一存储于 Electron 用户数据目录下的 logs/app.log。
 * 确保目录存在，避免开发和生产环境日志分散。
 * @returns {string} 日志文件的绝对路径
 */
function getLogPath() {
  // app.getPath('userData') 只有在 app ready 后才能用
  const logDir = path.join(app.getPath('userData'), 'logs')
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true })
  }
  return path.join(logDir, 'app.log')
}

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
    // new transports.Console(),
    new transports.File({ filename: getLogPath() }),
  ],
})

export default logger
