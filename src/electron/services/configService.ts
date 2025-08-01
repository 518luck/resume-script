import { app, BrowserWindow } from 'electron'
import fs from 'fs'
import path from 'path'

import { configPath, isDev, logger } from '../utils/index.js'
import { Config } from '../../types/electron.js'

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
    logger.info('开发环境')
    const portNumber = config.portNumber || 5123
    win.loadURL(`http://localhost:${portNumber}`)
  } else {
    logger.info('生产环境')
    const htmlPath = path.join(app.getAppPath(), 'dist-reract', 'index.html')
    win.loadFile(htmlPath)
  }
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
    if (!fs.existsSync(configPath)) {
      logger.info('配置文件不存在，返回默认配置')
      return {
        phone: '',
        job: '',
        city: '深圳',
        portNumber: '5123',
        isHeadless: true,
      }
    }
    logger.info('读取配置文件')
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
    const dir = path.dirname(configPath)
    if (!fs.existsSync(dir)) {
      logger.info('文件不存在,创建配置文件目录')
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
    return true
  } catch (error) {
    logger.error('保存配置失败' + error)
    return false
  }
}
