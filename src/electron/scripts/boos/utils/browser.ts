import puppeteer from 'puppeteer-core'
import * as path from 'path'

// 启动浏览器
export async function launchBrowser(isHeadless: boolean) {
  const userDataDir = path.resolve(__dirname, '../data/userData')
  return await puppeteer.launch({
    headless: isHeadless,
    defaultViewport: null,
    userDataDir,
    channel: 'chrome',
  })
}
