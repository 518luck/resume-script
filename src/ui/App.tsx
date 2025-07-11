import styles from './App.module.scss'
import ToNav from './layout/ToNav'

function App() {
  return (
    <>
      <div className={styles.appBackground}>
        <ToNav />
        <article className={styles.appMain}>主要内容区域</article>
      </div>
    </>
  )
}

export default App
