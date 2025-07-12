import styles from './index.module.scss'
import logo from '../../assets/logo.svg'

const Logo = () => {
  return (
    <div className={styles.logo}>
      <img src={logo} alt='logo' className={styles.logoImg} />
      <span>多云RA</span>
    </div>
  )
}
export default Logo
