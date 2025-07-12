interface Config {
  phone?: string
  city?: string
  job?: string
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
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
