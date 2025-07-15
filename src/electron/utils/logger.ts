import { app } from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import { createLogger, format, transports } from 'winston'

// 获取日志路径（只在主进程用！）
function getLogPath() {
  // app.getPath('userData') 只有在 app ready 后才能用
  const logDir = path.join(app.getPath('userData'), 'logs')
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true })
  }
  return path.join(logDir, 'app.log')
}

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
    new transports.Console(),
    new transports.File({ filename: getLogPath() }),
  ],
})

export default logger
