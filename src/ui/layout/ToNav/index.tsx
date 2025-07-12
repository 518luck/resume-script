import styles from './index.module.scss'

declare global {
  interface Window {
    electronAPI: {
      closeWindow: () => void
      minimizeWindow: () => void
      maximizeWindow: () => void
    }
  }
}

const ToNav = () => {
  return (
    <div className={styles.toNav}>
      <div className={styles.macButtons}>
        <span
          className={styles.minimize}
          onClick={() => window.electronAPI.minimizeWindow()}></span>
        <span
          className={styles.maximize}
          onClick={() => window.electronAPI.maximizeWindow()}></span>
        <span
          className={styles.close}
          onClick={() => window.electronAPI.closeWindow()}></span>
      </div>
    </div>
  )
}
export default ToNav
