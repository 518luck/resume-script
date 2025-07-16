import { Button, Tooltip } from 'antd'
import styles from './index.module.scss'
import { useEffect, useState } from 'react'
import { AppstoreOutlined } from '@ant-design/icons'

const Boss = () => {
  const [logs, setLogs] = useState('')
  const [logPath, setLogPath] = useState('')
  useEffect(() => {
    // 先获取全部日志

    window.electronAPI.getLogContent().then((content) => {
      setLogs(content)
    })
    // 再监听增量推送
    window.electronAPI.onLogUpdated((newLog) => {
      console.log('收到新日志:', newLog)
      setLogs((old) => old + newLog)
    })
    window.electronAPI.getLogPath().then((path) => {
      setLogPath(path)
    })
  }, [])

  const handleRunBossAutoDeliverOnClick = async () => {
    await window.electronAPI.runBossAutoDeliver()
  }

  const handleClearLogsOnClick = async () => {
    setLogs('')
    await window.electronAPI.clearLogs()
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
          <Button type='primary' onClick={handleClearLogsOnClick}>
            清除日志
          </Button>
        </div>
        <div className={styles.main_right}>鸡汤</div>
      </main>
      <footer className={styles.footer}>
        <span>日志</span>
        <div>当前日志长度: {logs.length}</div>
        <pre className={styles.logContent}>{logs}</pre>
      </footer>
    </div>
  )
}
export default Boss
