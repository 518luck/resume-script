import { BrowserWindow, Menu, globalShortcut, ipcMain, app } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
export class WindowManager {
  private windows: BrowserWindow[] = []

  constructor() {
    this.setupWindowControls()
    this.setupGlobalShortcuts()
    this.setupAppLifecycle()
  }

  private setupWindowControls() {
    // 窗口最小化
    ipcMain.on('window-minimize', () => {
      BrowserWindow.getFocusedWindow()?.minimize()
    })

    // 窗口最大化
    ipcMain.on('window-maximize', () => {
      const win = BrowserWindow.getFocusedWindow()
      if (win?.isMaximized()) {
        win.unmaximize()
      } else {
        win?.maximize()
      }
    })

    // 窗口关闭
    ipcMain.on('window-close', () => {
      BrowserWindow.getFocusedWindow()?.close()
    })
  }

  private setupGlobalShortcuts() {
    // 隐藏菜单栏
    Menu.setApplicationMenu(null)

    // 打开开发者工具
    globalShortcut.register('CommandOrControl+Shift+I', () => {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (focusedWindow) {
        focusedWindow.webContents.toggleDevTools()
      }
    })
  }

  private setupAppLifecycle() {
    // 窗口关闭macOS下不退出
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    // 窗口激活macOS下不退出
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow()
      }
    })
  }

  createWindow() {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      frame: false, // 关闭原生标题栏
      titleBarStyle: 'hidden', // 可选，macOS 下更好看
      icon: path.join(__dirname, 'duoyunico.ico'),
      webPreferences: {
        preload: path.join(__dirname, '..', 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
      },
    })
    this.windows.push(win)
    return win
  }

  getWindows() {
    return this.windows
  }
}
