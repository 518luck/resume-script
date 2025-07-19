import { app, ipcMain } from 'electron'
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
  WindowManager,
} from './services/index.js'

// 开发环境禁用安全警告, 生产环境不使用(记得删除)
if (isDev()) {
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
}

app.whenReady().then(async () => {
  // 创建窗口
  const windowManager = new WindowManager()
  const mainWindow = windowManager.createWindow()

  // 加载页面
  const config = await loadConfig()
  loadPage(mainWindow, config)
  // 监听日志更新
  logUpdated(mainWindow)

  // 自动投递
  ipcMain.handle('run-boss-auto-deliver', async () => {
    const currentConfig = await loadConfig()
    await runBossAutoDeliver(currentConfig)
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
