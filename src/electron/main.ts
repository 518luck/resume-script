import { app, BrowserWindow, ipcMain, Menu, globalShortcut } from 'electron'
import * as fs from 'fs'

import { runBossAutoDeliver } from './scripts/boos/main.js'
import {
  clearLogs,
  logger,
  logUpdated,
  isDev,
  configPath,
  logPath,
} from './utils/index.js'
import {
  loadConfig,
  saveConfig,
  loadPage,
  createWindow,
} from './services/index.js'

// 开发环境禁用安全警告, 生产环境不使用(记得删除)
if (isDev()) {
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
}

app.whenReady().then(() => {
  // 创建窗口
  const win = createWindow()

  const config = loadConfig()

  // 加载页面
  loadPage(win, config)
  // 监听日志更新
  logUpdated(win)

  // 隐藏菜单栏
  Menu.setApplicationMenu(null)

  // 打开开发者工具
  globalShortcut.register('CommandOrControl+Shift+I', () => {
    const focusedWindow = BrowserWindow.getFocusedWindow()
    if (focusedWindow) {
      focusedWindow.webContents.toggleDevTools()
    }
  })

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

  // 窗口关闭macOS下不退出
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  // 窗口激活macOS下不退出
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  // 自动投递
  ipcMain.handle('run-boss-auto-deliver', async () => {
    await runBossAutoDeliver(config)
    return '自动投递完成'
  })

  // 保存配置
  ipcMain.handle('save-config', async (event, config) => {
    const result = saveConfig(config)
    logger.info(`保存地址: ${configPath}`)
    return result
  })

  // 读取配置
  ipcMain.handle('load-config', async () => {
    return loadConfig()
  })

  //暴露配置文件路径
  ipcMain.handle('get-config-path', async () => {
    return configPath
  })

  // 获取日志内容
  ipcMain.handle('get-log-content', async () => {
    try {
      return await fs.promises.readFile(logPath, 'utf-8')
    } catch (e) {
      console.error('读取日志文件失败:', e)
      return '读取日志文件失败'
    }
  })
  // 获取日志文件路径
  ipcMain.handle('get-log-path', async () => {
    return logPath
  })

  // 清除日志
  ipcMain.handle('clear-logs', async () => {
    clearLogs(logPath)
  })
})
