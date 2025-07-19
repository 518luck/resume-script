// src/electron/services/AppManager.ts
import { WindowManager, IpcManager } from './index.js'
import { loadConfig, loadPage } from './index.js'
import { logger, logUpdated } from '../utils/index.js'

export class AppManager {
  private windowManager: WindowManager
  private ipcManager: IpcManager

  constructor() {
    this.windowManager = new WindowManager()
    this.ipcManager = new IpcManager()
  }
  async initialize() {
    // 创建窗口
    const mainWindow = this.windowManager.createWindow()
    logger.info('窗口创建完成')

    // 加载页面

    const config = await loadConfig()

    loadPage(mainWindow, config)
    // 监听日志更新
    logUpdated(mainWindow)
  }
}
