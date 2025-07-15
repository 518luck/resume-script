import { Button } from 'antd'
import styles from './index.module.scss'
import { useEffect, useState } from 'react'

const handleRunBossAutoDeliver = async () => {
  await window.electronAPI.runBossAutoDeliver()
}

const Boss = () => {
  const [logs, setLogs] = useState('')
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
  }, [])

  return (
    <div className={styles.boss}>
      <header className={styles.header}>
        <div className={styles.header_System}>
          <span>系统类型</span>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.main_left}>
          <Button type='primary' onClick={handleRunBossAutoDeliver}>
            一件投递
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
