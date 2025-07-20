import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, message, Select, Tooltip, Form } from 'antd'
import { AppstoreOutlined } from '@ant-design/icons'

import { checkRequiredConfig } from '../../utils/index.js'
import styles from './index.module.scss'

const Boss = () => {
  const [logPath, setLogPath] = useState<string>('')
  const navigate = useNavigate()

  useEffect(() => {
    window.electronAPI.getLogPath().then((path) => {
      setLogPath(path)
    })
  }, [])

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
        <div className={styles.footer_top}>
          <Form>
            <Form.Item name='jobType'>
              <Select mode='tags' allowClear placeholder='求职类型' />
            </Form.Item>
            <Form.Item name='jobExperience'>
              <Select mode='multiple' allowClear placeholder='工作经验' />
            </Form.Item>
            <Form.Item name='jobEducation'>
              <Select mode='multiple' allowClear placeholder='学历要求' />
            </Form.Item>
            <Form.Item name='jobScale'>
              <Select mode='multiple' allowClear placeholder='公司规模' />
            </Form.Item>
          </Form>
        </div>
      </footer>
    </div>
  )
}
export default Boss
