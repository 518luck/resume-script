import { app } from 'electron'
import path from 'path'

// 求职配置文件路径
export const configPath = path.join(
  app.getPath('userData'),
  'duoyunARConfig.json'
)

// 日志文件路径
export const logPath = path.join(app.getPath('userData'), 'logs/app.log')

// 日志文件夹路径
export const logDir = path.join(app.getPath('userData'), 'logs')
