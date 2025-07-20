import { Page } from 'puppeteer-core'
import inquirer from 'inquirer'

import { logger } from '../../../utils/index.js'
import { Config } from '../../../../types/electron.js'

/**
 * 判断当前页面是否已登录
 *
 * 该函数会查找页面上是否存在 BOSS直聘的“登录/注册”按钮（a[ka="header-login"]）。
 * 如果找不到该按钮，说明已登录；如果能找到，说明未登录。
 *
 * @param {Page} page - Puppeteer 的 Page 实例，表示要检测的页面
 * @returns {Promise<boolean>} - 已登录返回 true，未登录返回 false
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    await page.waitForSelector('a[ka="header-login"]', { timeout: 10000 })
    logger.info('寻找登录按钮')
    return false
  } catch (err) {
    logger.info('未找到登录按钮: ' + (err as Error).message)
    return true
  }
}

/**
 * 自动登录函数
 * @param page Puppeteer Page 实例
 */
export async function autoLogin(page: Page, config: Config) {
  const loginBtn = await page.$('a[ka="header-login"]')
  if (loginBtn) {
    await loginBtn?.click()
    logger.info('点击了登录按钮')
  } else {
    logger.error('完犊子了，没找到登录按钮')
    return
  }

  await page.waitForSelector(
    'input[placeholder="手机号"], input[placeholder="短信验证码"]',
    {
      timeout: 10000,
    }
  )
  logger.info('登录表单出现')

  const phone = config.phone
  if (!phone) {
    logger.error('手机号未配置')
    return
  }
  await page.type('input[placeholder="手机号"]', phone, {
    delay: Math.random() * 150 + 50,
  })
  logger.info('手机号输入完成')

  await page.waitForSelector('div[ka="send_sms_code_click"]', {
    timeout: 100000,
  })
  const sendCode = await page.$('div[ka="send_sms_code_click"]')
  if (sendCode) {
    await sendCode.click()
    logger.info('点击了发送验证码按钮')
  } else {
    logger.error('完犊子了，没找到发送验证码按钮')
    return
  }

  try {
    logger.info('等待验证按钮出现')
    await page.waitForSelector('div[aria-label="点击按钮进行验证"]', {
      visible: true,
      timeout: 5000,
    })
  } catch (err) {
    logger.error('没找到验证按钮' + (err as Error).message)
    return
  }

  const buttonLocator = await page.$('div[aria-label="点击按钮进行验证"]')
  if (buttonLocator) {
    logger.info('找到验证按钮，准备点击')
    await buttonLocator.click()
  } else {
    logger.error('没找到验证按钮')
    return
  }

  logger.info('出现滑块验证')

  await page.waitForSelector('.geetest_panel', { hidden: true, timeout: 60000 })
  logger.info('滑块验证已通过')

  const { code } = await inquirer.prompt([
    {
      type: 'input',
      name: 'code',
      message: '请输入短信验证码：',
    },
  ])

  await page.type('input[placeholder="短信验证码"]', code, {
    delay: Math.random() * 150 + 50,
  })
  logger.info('短信验证码输入完成')

  const agreePolicy = await page.$('.agree-policy')
  if (agreePolicy) {
    await agreePolicy.click()
    logger.info('点击了同意协议按钮')
  } else {
    logger.error('完犊子了，没找到同意协议按钮')
    return
  }

  const signupSubmitButton = await page.$(
    'button[ka="signup_submit_button_click"]'
  )
  if (signupSubmitButton) {
    await signupSubmitButton.click()
    logger.info('点击了登录按钮')
  } else {
    logger.error('完犊子了，没找到登录按钮')
    return
  }

  const dialogSur = await page.waitForSelector("span[ka='dialog_sure']", {
    timeout: 10000,
  })
  if (dialogSur) {
    await dialogSur.click()
    logger.info('点击了同意按钮')
  } else {
    logger.error('完犊子了，没找到同意按钮')
    return
  }

  logger.info('等待登录跳转...')
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 })
  logger.info('登录流程结束')

  return true
}
