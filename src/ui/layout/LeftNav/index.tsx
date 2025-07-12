import styles from './index.module.scss'
import Logo from '../../views/Logo'
import LeftNavArticle from '../../views/LeftNavArticle'
import Versions from '../../views/Versions'

const LeftNav = () => {
  return (
    <div className={styles.leftNav}>
      <Logo />
      <LeftNavArticle />
      <Versions />
    </div>
  )
}
export default LeftNav
