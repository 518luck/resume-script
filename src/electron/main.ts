import { app } from 'electron'
import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'
const appExpress = express()

import { isDev } from './utils/index.js'
import { AppManager } from './services/index.js'

// 开发环境禁用安全警告, 生产环境不使用(记得删除)
if (isDev()) {
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
}
appExpress.use(cors())

appExpress.get('/api/dsapi', async (req, res) => {
  try {
    const response = await fetch('http://open.iciba.com/dsapi/')
    const data = await response.json()
    res.json(data)
  } catch {
    res.status(500).json({ error: '代理请求失败' })
  }
})
appExpress.listen(3000, () => {
  console.log('Express server running on http://localhost:3000')
})

app.whenReady().then(async () => {
  const appManager = new AppManager()
  await appManager.initialize()
})
