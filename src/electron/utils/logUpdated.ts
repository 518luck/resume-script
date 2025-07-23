import { app, BrowserWindow } from 'electron'
import * as fs from 'fs'
import path from 'path'

import logger from './logger.js'

/**
 * 日志文件路径，统一存储于 Electron 用户数据目录下的 logs/app.log。
 * 该路径在开发和生产环境下都一致，确保日志文件不会丢失或分散。
 */
const logPath = path.join(app.getPath('userData'), 'logs/app.log')

/**
 * 监听日志文件的变化，并将新增内容实时推送到前端。
 *
 * @param {BrowserWindow} win - 需要推送日志内容的 Electron 窗口实例。
 *
 * 该函数会定时（每秒）检查日志文件是否有新内容，
 * 如果有，则只读取新增部分并通过 win.webContents.send('log-updated', newData) 推送到前端。
 * 适用于实时日志面板、终端输出等场景。
 */
export function watchLogFile(win: BrowserWindow) {
  logger.info('监听日志文件')
  let lastSize = 0
  fs.watchFile(logPath, { interval: 1000 }, (curr) => {
    if (curr.size > lastSize) {
      const stream = fs.createReadStream(logPath, {
        start: lastSize,
        end: curr.size - 1,
      })
      let newData = ''
      stream.on('data', (chunk) => {
        newData += chunk.toString()
      })
      stream.on('end', () => {
        win.webContents.send('log-updated', newData)
      })
      lastSize = curr.size
    }
  })
}
