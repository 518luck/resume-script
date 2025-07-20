import logger from './logger.js'
import type { Page } from 'puppeteer-core'

export async function waitForUserToSolveCaptcha(page: Page) {
  try {
    logger.info('请手动完成所有验证...')

    // 显示带倒计时的提示框
    await page.evaluate(() => {
      const tip = document.createElement('div')
      tip.id = 'captcha-tip'
      tip.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: #ff6b6b99;
          color: white;
          padding: 20px;
          border-radius: 10px;
          z-index: 999999;
          font-size: 16px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        ">
          <div style="margin-bottom: 10px;">⚠️ 需要手动验证</div>
          <div>请完成人机验证和验证码输入</div>
          <div style="font-size: 12px; margin-top: 10px; opacity: 0.8;">
            验证完成后程序将自动继续
          </div>
          <div style="margin-top: 15px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 5px;">
            <div style="font-size: 12px; margin-bottom: 5px;">剩余时间</div>
            <div id="countdown" style="font-size: 18px; font-weight: bold; font-family: monospace;">
              <span id="time-left">05:00</span>
            </div>
          </div>
        </div>
      `
      document.body.appendChild(tip)

      // 倒计时逻辑
      let timeLeft = 300
      const timeLeftElement = document.getElementById('time-left')

      // 添加空值检查
      if (!timeLeftElement) {
        console.error('找不到倒计时元素')
        return
      }

      const countdown = setInterval(() => {
        timeLeft--
        const minutes = Math.floor(timeLeft / 60)
        const seconds = timeLeft % 60

        // 再次检查元素是否存在
        if (timeLeftElement) {
          timeLeftElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

          // 根据剩余时间改变颜色
          if (timeLeft <= 60) {
            timeLeftElement.style.color = '#ff4444'
          } else if (timeLeft <= 120) {
            timeLeftElement.style.color = '#ffaa00'
          }

          if (timeLeft <= 0) {
            clearInterval(countdown)
            timeLeftElement.textContent = '超时'
            timeLeftElement.style.color = '#ff4444'
          }
        } else {
          // 如果元素不存在，清除定时器
          clearInterval(countdown)
        }
      }, 1000)
    })

    // 等待页面跳转
    const currentUrl = page.url()
    await page.waitForFunction(() => window.location.href !== currentUrl, {
      timeout: 300000,
    })

    // 移除提示框
    await page.evaluate(() => {
      const tip = document.getElementById('captcha-tip')
      if (tip) tip.remove()
    })

    logger.info('用户完成所有验证，继续执行...')
    return true
  } catch (error) {
    logger.error('等待用户验证超时:', error)
    return false
  }
}
