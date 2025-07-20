import { message } from 'antd'

export const checkRequiredConfig = async (navigate: (path: string) => void) => {
  try {
    const config = await window.electronAPI.loadConfig()
    const missingFields = []

    if (!config.phone) missingFields.push('手机号')
    if (!config.job) missingFields.push('工作职位')
    if (!config.city) missingFields.push('择业城市')

    if (missingFields.length > 0) {
      message.warning(`请先完善以下配置：${missingFields.join('、')}`)
      navigate('/config')
      return false
    }
    return true
  } catch (error) {
    console.error('检查配置失败:', error)
    message.error('检查配置失败')
    return false
  }
}
