import { app } from 'electron'
import puppeteer from 'puppeteer-core'
import * as path from 'path'

// 启动浏览器
export async function launchBrowser(isHeadless: boolean) {
  const userDataDir = path.join(app.getPath('userData'), 'browser-userData')
  return await puppeteer.launch({
    headless: isHeadless,
    defaultViewport: null,
    userDataDir,
    channel: 'chrome',
  })
}
