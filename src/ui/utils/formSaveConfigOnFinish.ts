import { message } from 'antd'
import { debounce } from 'lodash'
export const formSaveConfigOnFinish = debounce(async (values) => {
  try {
    const oldValues = await window.electronAPI.loadConfig()
    const newValues = { ...oldValues, ...values }
    const success = await window.electronAPI.saveConfig(newValues)
    if (success) {
      message.success('配置保存成功')
    } else {
      message.error('配置保存失败')
    }
  } catch (error) {
    console.error('保存配置失败:', error)
    message.error('保存失败')
  }
}, 1000)
