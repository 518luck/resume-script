import { app, BrowserWindow } from 'electron'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

import { configPath, isDev, logger } from '../utils/index.js'
import { Config } from '../../types/electron.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * 根据环境加载页面到指定窗口
 *
 * 在开发环境下，加载到 Vite 开发服务器的指定端口；
 * 在生产环境下，加载打包后的静态 HTML 文件。
 *
 * @param {BrowserWindow} win - 要加载页面的 Electron 窗口实例
 * @param {Config} config - 应用配置对象，包含端口号等信息
 * @returns {void} 无返回值
 *
 * @example
 * // 开发环境
 * loadPage(win, { portNumber: 5123 })
 * // 加载: http://localhost:5123
 *
 * @example
 * // 生产环境
 * loadPage(win, {})
 * // 加载: file:///path/to/dist-reract/index.html
 *
 * @since 1.0.0
 */
export const loadPage = (win: BrowserWindow, config: Config) => {
  if (isDev()) {
    const portNumber = config.portNumber || 5123
    win.loadURL(`http://localhost:${portNumber}`)
  } else {
    const htmlPath = path.join(app.getAppPath(), 'dist-reract', 'index.html')
    win.loadFile(htmlPath)
  }
}

/**
 * 创建主应用窗口
 *
 * 创建一个无边框的 Electron 窗口，配置窗口大小、图标、
 * 预加载脚本等属性。窗口创建后需要调用 loadPage 加载页面。
 *
 * @returns {BrowserWindow} 创建的窗口实例
 *
 * @example
 * const win = createWindow()
 * loadPage(win, config)
 *
 * @since 1.0.0
 */
export const createWindow = () => {
  console.log('__dirname', path.join(__dirname, '..'))

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
  return win
}

/**
 * 读取用户配置文件
 *
 * 从用户数据目录读取配置文件，如果文件不存在或读取失败，
 * 返回空对象。配置文件包含应用的各种设置参数。
 *
 * @returns {Config} 配置对象，如果读取失败返回空对象
 *
 * @example
 * const config = loadConfig()
 * console.log('端口号:', config.portNumber)
 * console.log('手机号:', config.phone)
 *
 * @throws {Error} 当文件读取或 JSON 解析失败时，会记录错误日志
 *
 * @since 1.0.0
 */
export const loadConfig = () => {
  try {
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf8')
      return JSON.parse(data)
    }
  } catch {
    logger.error('读取配置失败')
  }
  return {}
}

/**
 * 保存用户配置到文件
 *
 * 将配置对象序列化为 JSON 格式并保存到用户数据目录。
 * 如果保存失败，会记录错误日志并返回 false。
 *
 * @param {Config} config - 要保存的配置对象
 * @returns {boolean} 保存成功返回 true，失败返回 false
 *
 * @example
 * const config = {
 *   portNumber: 5123,
 *   phone: '13800138000',
 *   city: '深圳'
 * }
 * const success = saveConfig(config)
 * if (success) {
 *   console.log('配置保存成功')
 * } else {
 *   console.log('配置保存失败')
 * }
 *
 * @throws {Error} 当文件写入失败时，会记录错误日志
 *
 * @since 1.0.0
 */
export const saveConfig = (config: Config) => {
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
    return true
  } catch {
    return false
  }
}
