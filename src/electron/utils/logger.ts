import { createLogger, format, transports } from 'winston'
import { logPath } from './index.js'

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
