import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'

import { isDev } from './util.js'
import { runBossAutoDeliver } from './scripts/boos/main'

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  })

  if (isDev()) {
    win.loadURL('http://localhost:5123')
  } else {
    win.loadFile(path.join(app.getAppPath(), 'dist-reract/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()
})
