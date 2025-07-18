/* eslint-disable @typescript-eslint/no-require-imports */
const { contextBridge, ipcRenderer } = require('electron')
import type { IpcRendererEvent } from 'electron'

interface Config {
  phone?: string
  city?: string
  job?: string
  [key: string]: unknown
}

contextBridge.exposeInMainWorld('electronAPI', {
  // 窗口操作
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),
  // 自动投递
  runBossAutoDeliver: () => ipcRenderer.invoke('run-boss-auto-deliver'),

  // 保存配置
  saveConfig: (config: Config) => ipcRenderer.invoke('save-config', config),
  // 读取配置
  loadConfig: () => ipcRenderer.invoke('load-config'),

  // 暴露配置文件路径
  getConfigPath: () => ipcRenderer.invoke('get-config-path'),

  // 监听日志更新
  onLogUpdated: (callback: (data: string) => void) => {
    ipcRenderer.on('log-updated', (event: IpcRendererEvent, data: string) =>
      callback(data)
    )
  },

  // 获取日志内容
  getLogContent: () => ipcRenderer.invoke('get-log-content'),

  // 获取日志文件路径
  getLogPath: () => ipcRenderer.invoke('get-log-path'),

  // 清除日志
  clearLogs: () => ipcRenderer.invoke('clear-logs'),
})
