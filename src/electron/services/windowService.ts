import { BrowserWindow, Menu, globalShortcut, ipcMain, app } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * 窗口管理器
 *
 * 负责 Electron 应用的窗口创建、窗口事件、全局快捷键和应用生命周期管理。
 * 支持多窗口管理，提供窗口最小化、最大化、关闭等功能。
 *
 * @class WindowManager
 * @example
 * const wm = new WindowManager()
 * const win = wm.createWindow()
 * wm.getWindows().forEach(win => win.close())
 */
export class WindowManager {
  /**
   * 存储所有被管理的窗口实例
   * @private
   * @type {BrowserWindow[]}
   */
  private windows: BrowserWindow[] = []

  /**
   * 创建 WindowManager 实例，并自动注册窗口控制、快捷键和生命周期事件
   */
  constructor() {
    this.setupWindowControls()
    this.setupGlobalShortcuts()
    this.setupAppLifecycle()
  }

  private setupWindowControls() {
    /**
     * 注册窗口最小化、最大化、关闭的 IPC 事件
     * @private
     */
    ipcMain.on('window-minimize', () => {
      BrowserWindow.getFocusedWindow()?.minimize()
    })

    /**
     * 注册窗口最大化、最小化的 IPC 事件
     * @private
     */
    ipcMain.on('window-maximize', () => {
      const win = BrowserWindow.getFocusedWindow()
      if (win?.isMaximized()) {
        win.unmaximize()
      } else {
        win?.maximize()
      }
    })

    /**
     * 注册窗口关闭的 IPC 事件
     * @private
     */
    ipcMain.on('window-close', () => {
      BrowserWindow.getFocusedWindow()?.close()
    })
  }

  private setupGlobalShortcuts() {
    /**
     * 隐藏菜单栏
     * @private
     */
    Menu.setApplicationMenu(null)

    /**
     * 注册打开开发者工具的快捷键
     * @private
     */
    globalShortcut.register('CommandOrControl+Shift+I', () => {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (focusedWindow) {
        focusedWindow.webContents.toggleDevTools()
      }
    })
  }

  private setupAppLifecycle() {
    /**
     * 注册窗口关闭事件
     * @private
     */
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    /**
     * 注册窗口激活事件
     * @private
     */
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow()
      }
    })
  }

  /**
   * 创建新的浏览器窗口实例
   * @returns {BrowserWindow} 创建的窗口实例
   */
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

  /**
   * 获取所有被管理的窗口实例
   * @returns {BrowserWindow[]} 窗口实例数组
   */
  getWindows() {
    return this.windows
  }
}
