import { app, BrowserWindow } from 'electron'
import * as fs from 'fs'
import path from 'path'

const logPath = path.join(app.getPath('userData'), 'logs/app.log')

export function watchLogFile(win: BrowserWindow) {
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
        console.log('推送日志到前端:', newData)
      })
      lastSize = curr.size
    }
  })
}
