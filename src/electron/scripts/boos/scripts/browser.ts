import puppeteer from 'puppeteer-core'
import { userDataDir } from '../../../utils/path.js'

// 启动浏览器
export async function launchBrowser(isHeadless: boolean) {
  return await puppeteer.launch({
    headless: isHeadless,
    defaultViewport: null,
    userDataDir,
    channel: 'chrome',
  })
}
