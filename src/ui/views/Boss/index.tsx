import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, message, Select, Tooltip, Form } from 'antd'
import { AppstoreOutlined } from '@ant-design/icons'

import {
  checkRequiredConfig,
  loadSavedConfig,
  formSaveConfigOnFinish,
} from '../../utils/index.js'
import {
  jobType,
  jobSalary,
  jobExperience,
  jobEducation,
  jobScale,
} from './config'
import type { Config } from '../../../types/electron'
import styles from './index.module.scss'

const Boss = () => {
  const [logPath, setLogPath] = useState<string>('')
  const navigate = useNavigate()
  const [form] = Form.useForm()

  useEffect(() => {
    window.electronAPI.getLogPath().then((path) => {
      setLogPath(path)
    })
  }, [])

  useEffect(() => {
    loadSavedConfig(form)
  }, [form])

  const handleRunBossAutoDeliverOnClick = async () => {
    const result = await checkRequiredConfig(navigate)
    try {
      if (result) {
        await window.electronAPI.runBossAutoDeliver()
      }
    } catch (error) {
      console.error('自动投递失败:', error)
    }
  }

  const handlePauseBossAutoDeliverOnClick = async () => {
    await window.electronAPI.stopBossAutoDeliver()
    message.success('暂停自动投递')
  }

  const handleSelectOnchange = async (
    fieldName: keyof Config,
    value: string
  ) => {
    form.setFieldsValue({ [fieldName]: value })

    const currentValues = form.getFieldsValue()
    const newValues = { ...currentValues, [fieldName]: value }
    try {
      await form.validateFields()

      formSaveConfigOnFinish(newValues)
    } catch (error) {
      console.error('表单校验失败:', error)
    }
  }

  return (
    <div className={styles.boss}>
      <header className={styles.header}>
        <div className={styles.header_System}>
          <AppstoreOutlined />
          <span className={styles.System_type}>系统类型</span>
        </div>
        <div className={styles.header_footer}>
          <div className={styles.header_footer_top}>
            <div className={styles.log_path_leven}>
              日志地址:
              <Tooltip title={logPath}>
                <span>{logPath}</span>
              </Tooltip>
            </div>
            <span>日志地址</span>
          </div>
          <div className={styles.header_footer_footer}>
            <span>日志地址</span>
            <span>日志地址</span>
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.main_left}>
          <Button type='primary' onClick={handleRunBossAutoDeliverOnClick}>
            一件投递
          </Button>
          <Button type='primary' onClick={handlePauseBossAutoDeliverOnClick}>
            结束投递
          </Button>
        </div>
        <div className={styles.main_right}>鸡汤</div>
      </main>
      <footer className={styles.footer}>
        <div className={styles.footer_letf}>
          <Form form={form}>
            <Form.Item name='jobType'>
              <Select
                allowClear
                placeholder='求职类型'
                options={jobType}
                className={styles.select}
                onChange={(value) => handleSelectOnchange('jobType', value)}
              />
            </Form.Item>
            <Form.Item name='jobSalary'>
              <Select
                allowClear
                placeholder='薪资待遇'
                options={jobSalary}
                className={styles.select}
                onChange={(value) => handleSelectOnchange('jobSalary', value)}
              />
            </Form.Item>
            <Form.Item name='jobExperience'>
              <Select
                mode='multiple'
                allowClear
                placeholder='工作经验'
                options={jobExperience}
                className={styles.select}
                onChange={(value) =>
                  handleSelectOnchange('jobExperience', value)
                }
              />
            </Form.Item>
            <Form.Item name='jobEducation'>
              <Select
                mode='multiple'
                allowClear
                placeholder='学历要求'
                options={jobEducation}
                className={styles.select}
                onChange={(value) =>
                  handleSelectOnchange('jobEducation', value)
                }
              />
            </Form.Item>
            <Form.Item name='jobScale'>
              <Select
                mode='multiple'
                allowClear
                placeholder='公司规模'
                options={jobScale}
                className={styles.select}
                onChange={(value) => handleSelectOnchange('jobScale', value)}
              />
            </Form.Item>
          </Form>
        </div>
      </footer>
    </div>
  )
}
export default Boss
