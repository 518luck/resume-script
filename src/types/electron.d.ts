export interface Config {
  phone?: string
  city?: string
  job?: string
  isHeadless?: boolean
  [key: string]: unknown
}

interface ElectronAPI {
  // 窗口操作
  minimizeWindow: () => void
  maximizeWindow: () => void
  closeWindow: () => void
  // 自动投递
  runBossAutoDeliver: () => Promise<string>
  // 保存配置
  saveConfig: (config: Config) => Promise<boolean>
  // 读取配置
  loadConfig: () => Promise<Config>
  // 暴露配置文件路径
  getConfigPath: () => Promise<string>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
