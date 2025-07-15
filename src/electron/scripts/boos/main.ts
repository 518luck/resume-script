import { launchBrowser } from './utils/browser.js'
import logger from './utils/logger.js'
import { isLoggedIn, autoLogin } from './scripts/loginService.js'
import { selectCity, clickAllJobsAndCommunicate } from './scripts/zhipin.js'
// import { fetchWoffFromPage } from './utils/woffFetcher'
import { Config } from '../../../types/electron.js'

export async function runBossAutoDeliver(config: Config) {
  try {
    logger.info('================ 程序启动 ================')
    const browser = await launchBrowser(config.isHeadless || false)
    const page = await browser.newPage()

    logger.info('浏览器启动')
    await page.goto('https://www.zhipin.com')

    /*   logger.info('开始获取 woff 字体')
  await fetchWoffFromPage(page, '../data/woff_fonts') */

    logger.info('开始判断是否登录')
    const checkLogin = await isLoggedIn(page)
    logger.info(`${checkLogin ? '已登录' : '未登录'}`)

    if (!checkLogin) {
      await autoLogin(page, config)
    }

    await selectCity(page, config)
    await clickAllJobsAndCommunicate(page)
  } catch (err) {
    logger.error('主流程发生异常: ' + (err as Error).message)
  }
}
