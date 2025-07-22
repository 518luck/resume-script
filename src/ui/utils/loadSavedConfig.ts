import type { FormInstance } from 'antd'
import { message } from 'antd'

export const loadSavedConfig = async (form: FormInstance) => {
  try {
    const config = await window.electronAPI.loadConfig()
    if (config && Object.keys(config).length > 0) {
      form.setFieldsValue(config)
      message.success('配置加载成功')
    }
  } catch (error) {
    message.error('配置加载失败')
    console.error('配置加载失败', error)
  }
}
