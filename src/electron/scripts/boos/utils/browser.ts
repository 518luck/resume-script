import puppeteer from 'puppeteer-core'
import path from 'path'

// 启动浏览器
export async function launchBrowser() {
  const userDataDir = path.resolve(__dirname, '../data/userData')
  return await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    userDataDir,
    channel: 'chrome',
  })
}
