import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, message, Select, Tooltip, Form, Space, Typography } from 'antd'
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
  const [encouragementTextCN, setEncouragementTextCN] = useState<string>('')
  const [encouragementTextEN, setEncouragementTextEN] = useState<string>('')
  const [date, setDate] = useState<string>('')
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const { Paragraph } = Typography

  useEffect(() => {
    window.electronAPI.getLogPath().then((path) => {
      setLogPath(path)
    })
  }, [])

  useEffect(() => {
    loadSavedConfig(form)
  }, [form])

  useEffect(() => {
    fetch('http://localhost:3000/api/dsapi')
      .then((res) => res.json())
      .then((data) => {
        setEncouragementTextCN(data.note)
        setEncouragementTextEN(data.content)
        setDate(data.dateline)
      })
  })

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
          </div>
          <div className={styles.header_footer_footer}>
            <span>当前时间:</span>
            <div className={styles.date}>{date}</div>
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.main_left}>
          <Space size={10}>
            <Button
              type='primary'
              className={styles.autoDeliverBtn}
              onClick={handleRunBossAutoDeliverOnClick}>
              自动投递
            </Button>
            <Button
              type='dashed'
              ghost
              className={styles.pauseBtn}
              onClick={handlePauseBossAutoDeliverOnClick}>
              结束投递
            </Button>
          </Space>
        </div>
        <div className={styles.main_right}>
          <Paragraph copyable ellipsis className={styles.encouragementText}>
            {encouragementTextCN}
          </Paragraph>
          <Paragraph copyable ellipsis className={styles.encouragementText}>
            {encouragementTextEN}
          </Paragraph>
        </div>
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
        <div className={styles.footer_right}>暂时未开发</div>
      </footer>
    </div>
  )
}
export default Boss
