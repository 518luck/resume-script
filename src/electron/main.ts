import { app, BrowserWindow, ipcMain, Menu, globalShortcut } from 'electron'
import * as path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import { isDev } from './util.js'
import { runBossAutoDeliver } from './scripts/boos/main.js'

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, // 关闭原生标题栏
    titleBarStyle: 'hidden', // 可选，macOS 下更好看
    icon: path.join(__dirname, 'duoyunico.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (isDev()) {
    win.loadURL('http://localhost:5123')
  } else {
    win.loadFile(path.join(app.getAppPath(), 'dist-reract/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  Menu.setApplicationMenu(null)

  globalShortcut.register('CommandOrControl+Shift+I', () => {
    const focusedWindow = BrowserWindow.getFocusedWindow()
    if (focusedWindow) {
      focusedWindow.webContents.toggleDevTools()
    }
  })

  ipcMain.on('window-minimize', () => {
    BrowserWindow.getFocusedWindow()?.minimize()
  })
  ipcMain.on('window-maximize', () => {
    const win = BrowserWindow.getFocusedWindow()
    if (win?.isMaximized()) {
      win.unmaximize()
    } else {
      win?.maximize()
    }
  })
  ipcMain.on('window-close', () => {
    BrowserWindow.getFocusedWindow()?.close()
  })

  ipcMain.handle('run-boss-auto-deliver', async () => {
    await runBossAutoDeliver()
    return '自动投递完成'
  })
})
