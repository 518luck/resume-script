import { Button } from 'antd'
import { useEffect, useState } from 'react'

import { parseLogWithColors } from '../../utils/index'
import styles from './index.module.scss'

const Log = () => {
  const [logs, setLogs] = useState('')
  const [logPath, setLogPath] = useState('')

  useEffect(() => {
    // 先获取全部日志
    window.electronAPI.getLogContent().then((content) => {
      setLogs(content)
    })
    // 再监听增量推送
    window.electronAPI.onLogUpdated((newLog) => {
      setLogs((old) => old + newLog)
    })
    // 获取日志目录
    window.electronAPI.getLogPath().then((path) => {
      setLogPath(path)
    })
  }, [])

  const handleLogPathClick = () => {
    window.electronAPI.openFolder(logPath)
  }

  const handleClearLogsOnClick = async () => {
    setLogs('')
    await window.electronAPI.clearLogs()
    window.electronAPI.getLogContent().then((content) => {
      setLogs(content)
    })
  }

  return (
    <div className={styles.log}>
      <header>
        <div className={styles.header_left}>
          <Button ghost className={styles.header_Bt_info} size='small'>
            信息
          </Button>
          <Button ghost className={styles.header_Bt_warning} size='small'>
            警告
          </Button>
          <Button ghost className={styles.header_Bt_error} size='small'>
            错误
          </Button>
        </div>
        <div className={styles.header_right}>
          <Button
            ghost
            className={styles.header_Bt_path}
            size='small'
            onClick={handleLogPathClick}>
            打开日志
          </Button>
          <Button
            ghost
            className={styles.header_Bt_clear}
            size='small'
            onClick={handleClearLogsOnClick}>
            清空日志
          </Button>
        </div>
      </header>
      <main>
        <pre
          className={styles.logContent}
          dangerouslySetInnerHTML={{
            __html: parseLogWithColors(logs),
          }}></pre>
      </main>
    </div>
  )
}
export default Log
