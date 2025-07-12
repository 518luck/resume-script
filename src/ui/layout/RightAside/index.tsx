import { Outlet } from 'react-router'
import styles from './index.module.scss'

const RightAside = () => {
  return (
    <div className={styles.rightAside}>
      <Outlet />
    </div>
  )
}
export default RightAside
