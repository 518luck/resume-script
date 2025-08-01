import { Page, ElementHandle } from 'puppeteer-core'
import { logger, randomDelay } from '../../../utils/index.js'
import { Config } from '../../../../types/electron.js'
import { IpcManager } from '../../../services/index.js'
/**
 * 自动选择城市并搜索职位
 *
 * 此函数用于在BOSS直聘页面自动完成城市选择和职位搜索流程。
 * 步骤包括：
 * 1. 点击城市选择按钮
 * 2. 输入城市名称（依赖环境变量 CITY）
 * 3. 从下拉列表中选择目标城市
 * 4. 输入职位关键词（依赖环境变量 JOB）
 * 5. 提交搜索并等待结果列表出现
 *
 * @param {Page} page - Puppeteer 的 Page 实例，表示当前浏览器页面
 * @returns {Promise<void>} - 无返回值，流程中如遇错误会提前 return 并记录日志
 * @throws 无显式抛出异常，流程中如遇页面元素未找到会记录错误日志并提前返回
 * @environment CITY - 需设置为目标城市名称（如“北京”）
 * @environment JOB - 需设置为搜索的职位关键词
 */
export async function selectCity(page: Page, config: Config) {
  const citySelect = await page.$('p[ka="header-switch-city"]')
  if (citySelect) {
    await citySelect.click()
    logger.info('点击了城市选择按钮')
  } else {
    logger.error('完犊子了，没找到城市选择按钮')
    return
  }

  await page.waitForSelector("input[class='city-current']", {
    timeout: 10000,
  })
  logger.info('城市选择框出现')
  const city = config.city
  if (!city) {
    logger.error('城市未配置')
    return
  }

  await randomDelay(500, 1500)

  await page.type("input[class='city-current']", city, {
    delay: Math.random() * 150 + 50,
  })
  logger.info('城市输入完成')

  await page.waitForSelector("ul[class='dropdown-list']", { timeout: 10000 })
  logger.info('城市选择列表出现')
  const element = await page.$(`li[data-name="${city}"]`)
  if (element) {
    await element.click()
    await randomDelay(500, 1500)
    logger.info(`点击了城市: ${city}`)
  } else {
    logger.error(`完犊子了，没找到城市: ${city}`)
    return
  }

  const job = config.job
  if (!job) {
    logger.error('职位未配置')
    return
  }
  await page.waitForSelector('input[class="ipt-search"]', { timeout: 10000 })
  await page.type('input[class="ipt-search"]', job, {
    delay: Math.random() * 150 + 50,
  })
  logger.info('搜索输入完成')
  await page.keyboard.press('Enter')
  logger.info('搜索提交')

  await page.waitForSelector('ul[class="rec-job-list"]', { timeout: 10000 })
  logger.info('搜索结果出现')
}

// 处理 Boss 页面筛选逻辑
export const handleBossFilterChange = async (page: Page, config: Config) => {
  const selects = await page.$$('.current-select')

  for (const select of selects) {
    const text = await select.$eval('.placeholder-text', (el) =>
      el.textContent?.trim()
    )
    if (
      text === '求职类型' &&
      'jobType' in config &&
      config.jobType !== null &&
      config.jobType !== ''
    ) {
      logger.info(`发现用户勾选了求职类型,正在筛选求职类型`)
      await select.click()
      await randomDelay(500, 1500)
      await page.click(`li[ka="${config.jobType}"]`)
      await randomDelay(500, 1500)
    }
    if (
      text === '薪资待遇' &&
      'jobSalary' in config &&
      config.jobSalary !== null &&
      config.jobSalary !== ''
    ) {
      logger.info(`发现用户勾选了薪资待遇,正在筛选薪资待遇`)
      await select.click()
      await randomDelay(500, 1500)
      await page.click(`li[ka="${config.jobSalary}"]`)
      await randomDelay(500, 1500)
    }

    if (text === '工作经验' && config.jobExperience) {
      logger.info(`发现用户勾选了工作经验,正在筛选工作经验`)
      await select.click()
      await randomDelay(500, 1500)
      for (const item of config.jobExperience) {
        await page.click(`li[ka="${item}"]`)
        await randomDelay(500, 1500)
      }
    }

    if (text === '学历要求' && config.jobEducation) {
      logger.info(`发现用户勾选了学历要求,正在筛选学历要求`)
      await select.click()
      await randomDelay(500, 1500)
      for (const item of config.jobEducation) {
        await page.click(`li[ka="${item}"]`)
        await randomDelay(500, 1500)
      }
    }

    if (text === '公司规模' && config.jobScale) {
      logger.info(`发现用户勾选了公司规模,正在筛选公司规模`)
      await select.click()
      await randomDelay(500, 1500)
      for (const item of config.jobScale) {
        await page.click(`li[ka="${item}"]`)
        await randomDelay(500, 1500)
      }
    }
  }
}

/**
 * 自动遍历并与所有职位卡片进行沟通。
 *
 * 该函数会循环遍历页面上所有职位卡片，自动滚动页面以加载更多职位，
 * 并调用 handleJobBox 处理每一个职位卡片，直到没有新职位加载为止。
 *
 * @param {Page} page - Puppeteer 的 Page 实例，表示当前浏览器页面。
 * @returns {Promise<void>} 无返回值，流程中如遇错误会提前 return 并记录日志。
 */
export async function clickAllJobsAndCommunicate(page: Page) {
  let lastJobCount: number = 0
  let reachedEnd: boolean = false

  while (!reachedEnd) {
    await page.waitForSelector('li.job-card-box', { timeout: 1000 })

    const jobBoxes = await page.$$('li.job-card-box')
    const currentJobCount = jobBoxes.length

    if (currentJobCount === lastJobCount) {
      reachedEnd = true
      break
    }

    for (let i = lastJobCount; i < currentJobCount; i++) {
      if (IpcManager.isStopped) {
        logger.info('暂停自动投递')
        return
      }
      await handleJobBox(jobBoxes[i], page)
    }

    await randomDelay(500, 1500)
    await scrollAndWaitForNewJobs(page)
    lastJobCount = currentJobCount
  }
}

/**
 * 处理单个职位卡片的沟通逻辑。
 *
 * 包括提取职位名称、薪资，判断 boss 是否在线，
 * 如在线则自动点击卡片并进行沟通操作。
 *
 * @param {ElementHandle} jobBox - Puppeteer 的 ElementHandle，表示单个职位卡片元素。
 * @param {Page} page - Puppeteer 的 Page 实例。
 * @returns {Promise<void>} 无返回值，流程中如遇错误会记录日志。
 */
async function handleJobBox(jobBox: ElementHandle, page: Page) {
  // 处理单个职位卡片的所有逻辑
  // 包括 boss 在线判断、点击、沟通等
  try {
    const jobName = await jobBox.$eval(
      '.job-name',
      (el: Element) => el.textContent
    )
    logger.info(`职位名称: ${jobName}`)

    const jobSalary = await jobBox.$eval(
      '.job-salary',
      (el: Element) => el.textContent
    )
    if (jobSalary) {
      const codes = Array.from(jobSalary)
        .map((ch) => '\\u' + ch.charCodeAt(0).toString(16))
        .join(' ')
      logger.info(`职位薪资: ${codes}`)
    }

    const bossOnlineIcon = await jobBox.$('.boss-online-icon')
    if (bossOnlineIcon) {
      logger.info('boss在线,准备开始沟通')
      await randomDelay(500, 1500)
      logger.info('点击职位卡片')
      await jobBox.click()

      logger.info('等待立即沟通按钮出现')
      await randomDelay(500, 1500)
      await page.waitForSelector('a.op-btn.op-btn-chat', { timeout: 10000 })
      await page.click('a.op-btn.op-btn-chat')
      logger.info('点击沟通按钮')

      logger.info('等待沟通弹窗')
      await randomDelay(500, 1500)
      await page.waitForSelector('a.default-btn.cancel-btn', {
        timeout: 10000,
      })
      await page.click('a.default-btn.cancel-btn')
      logger.info('点击留在此页')
    } else {
      logger.info('boss不在线')
    }
  } catch (err) {
    logger.error('处理职位卡片时出错: ' + (err as Error).message)
  }
}

/**
 * 滚动页面到底部并等待新职位加载。
 *
 * 该函数会将页面滚动到底部，随后等待一段时间，
 * 以确保新职位卡片能够被加载和渲染。
 *
 * @param {Page} page - Puppeteer 的 Page 实例。
 * @returns {Promise<void>} 无返回值。
 */
async function scrollAndWaitForNewJobs(page: Page) {
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight)
  })
  await new Promise((resolve) => setTimeout(resolve, 1500))
}
