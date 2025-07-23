import { ipcMain, shell } from 'electron'
import * as fs from 'fs'
import { runBossAutoDeliver } from '../scripts/boos/main.js'
import {
  clearLogs,
  logger,
  configPath,
  logPath,
  userDataDir,
} from '../utils/index.js'
import { loadConfig, saveConfig } from './index.js'

/**
 * IPC 管理器
 *
 * 负责处理主进程与渲染进程之间的通信。
 * 提供自动投递、配置读写、日志操作等 IPC 事件处理。
 *
 * @class IpcManager
 * @example
 * const ipcManager = new IpcManager()
 * ipcManager.setupIpcHandlers()
 */
export class IpcManager {
  static isStopped = false
  constructor() {
    this.setupIpcHandlers()
  }
  private setupIpcHandlers() {
    /**
     * 注册自动投递的 IPC 事件
     * @private
     */
    ipcMain.handle('run-boss-auto-deliver', async () => {
      const currentConfig = await loadConfig()
      await runBossAutoDeliver(currentConfig)
      return '自动投递完成'
    })

    /**
     * 注册保存配置的 IPC 事件
     * @private
     */
    ipcMain.handle('save-config', async (event, config) => {
      const result = saveConfig(config)
      logger.info(`保存地址: ${configPath}`)
      return result
    })

    /**
     * 注册读取配置的 IPC 事件
     * @private
     */
    ipcMain.handle('load-config', async () => {
      return loadConfig()
    })

    /**
     * 注册获取日志内容的 IPC 事件
     * @private
     */
    ipcMain.handle('get-log-content', async () => {
      try {
        return await fs.promises.readFile(logPath, 'utf-8')
      } catch (e) {
        console.error('读取日志文件失败:', e)
        return '读取日志文件失败'
      }
    })

    /**
     * 注册获取日志文件路径的 IPC 事件
     * @private
     */
    ipcMain.handle('get-log-path', async () => {
      return logPath
    })

    /**
     * 注册暴露配置文件路径的 IPC 事件
     * @private
     */
    ipcMain.handle('get-config-path', async () => {
      return configPath
    })

    /**
     * 注册暴露浏览器用户数据目录的 IPC 事件
     * @private
     */
    ipcMain.handle('get-browser-user-data-dir', async () => {
      return userDataDir
    })

    /**
     * 注册清除日志的 IPC 事件
     * @private
     */
    ipcMain.handle('clear-logs', async () => {
      clearLogs(logPath)
    })

    /**
     * 注册打开文件夹的 IPC 事件
     * @private
     */
    ipcMain.handle('open-folder', async (event, folderPath: string) => {
      try {
        if (fs.existsSync(folderPath)) {
          await shell.openPath(folderPath)
          return true
        } else {
          logger.error('文件夹不存在')
          return false
        }
      } catch (e) {
        logger.error('打开文件夹失败:', e)
        return false
      }
    })

    /**
     * 注册暂停自动投递的 IPC 事件
     * @private
     */
    ipcMain.handle('stop-boss-auto-deliver', async () => {
      IpcManager.isStopped = true
    })

    /**
     * 跳转Ycursor界面
     */
    ipcMain.handle('open-url', async (_, url) => {
      shell.openExternal(url)
    })
  }
}
