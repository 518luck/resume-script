export interface Config {
  phone?: string
  isHeadless?: boolean
  city?: string
  job?: string
  portNumber?: number
  jobType?: string
  jobSalary?: string
  jobExperience?: string[]
  jobEducation?: string[]
  jobScale?: string[]
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
  // 获取日志文件路径
  getLogPath: () => Promise<string>
  // 暴露浏览器用户数据目录
  getBrowserUserDataDir: () => Promise<string>
  // 监听日志更新
  onLogUpdated: (callback: (data: string) => void) => void
  // 获取日志内容
  getLogContent: () => Promise<string>
  // 清除日志
  clearLogs: () => Promise<void>
  // 打开文件夹
  openFolder: (folderPath: string) => Promise<boolean>
  // 暂停自动投递
  stopBossAutoDeliver: () => Promise<void>
  // 跳转Ycursor界面
  openUrl: (url: string) => Promise<void>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
