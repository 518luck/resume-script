import { app, BrowserWindow, ipcMain, Menu, globalShortcut } from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { runBossAutoDeliver } from './scripts/boos/main.js'
import { clearLogs, logger, logUpdated, isDev } from './utils/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 开发环境禁用安全警告, 生产环境不使用(记得删除)
if (isDev()) {
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
}

export interface Config {
  phone?: string
  city?: string
  job?: string
  [key: string]: unknown
}

// 配置文件路径
const configPath = path.join(app.getPath('userData'), 'duoyunARConfig.json')
// 日志文件路径
const logPath = path.join(app.getPath('userData'), 'logs/app.log')
// 读取配置
const loadConfig = () => {
  try {
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    logger.error('读取配置失败', error)
  }
  return {}
}
const config = loadConfig()
// 保存配置
const saveConfig = (config: Config) => {
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
    return true
  } catch (error) {
    logger.error('保存配置失败', error)
    return false
  }
}

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
    win.loadURL(`http://localhost:${config.portNumber}`)
    logger.info(`端口号为:${config.portNumber}`)
  } else {
    const htmlPath = path.join(app.getAppPath(), 'dist-reract', 'index.html')
    win.loadFile(htmlPath)
  }
  return win
}

app.whenReady().then(() => {
  // 创建窗口
  const win = createWindow()
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
