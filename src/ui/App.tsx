import styles from './App.module.scss'
import ToNav from './layout/ToNav'
import LeftNav from './layout/LeftNav'
import RightAside from './layout/RightAside'

function App() {
  return (
    <>
      <div className={styles.appBackground}>
        <ToNav />
        <article className={styles.appMain}>
          <LeftNav />
          <RightAside />
        </article>
      </div>
    </>
  )
}

export default App
