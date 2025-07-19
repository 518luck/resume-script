import { app } from 'electron'

import { isDev } from './utils/index.js'
import { AppManager } from './services/index.js'

// 开发环境禁用安全警告, 生产环境不使用(记得删除)
if (isDev()) {
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
}

app.whenReady().then(async () => {
  const appManager = new AppManager()
  await appManager.initialize()
})
