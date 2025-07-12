import { useEffect } from 'react'
import type { FormProps } from 'antd'
import { Form, Input, message, Button } from 'antd'

import styles from './index.module.scss'

const Config = () => {
  const [form] = Form.useForm()

  useEffect(() => {
    const loadSavedConfig = async () => {
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

    loadSavedConfig()
  }, [form])

  const handleSaveConfigOnFinish: FormProps['onFinish'] = async (values) => {
    try {
      const success = await window.electronAPI.saveConfig(values)
      if (success) {
        message.success('配置保存成功')
      } else {
        message.error('配置保存失败')
      }
    } catch (error) {
      console.error('保存配置失败:', error)
      message.error('保存失败')
    }
  }

  return (
    <div className={styles.config}>
      <section className={styles.section}>
        <div className={styles.header}></div>
        <div className={styles.content}>
          <Form form={form} onFinish={handleSaveConfigOnFinish}>
            <Form.Item label='手机号' name='phone'>
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type='primary' htmlType='submit'>
                保存配置
              </Button>
            </Form.Item>
          </Form>
        </div>
      </section>
    </div>
  )
}
export default Config
