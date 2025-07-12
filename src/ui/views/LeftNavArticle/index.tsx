import { NavLink } from 'react-router-dom'
import styles from './index.module.scss'

const LeftNavArticle = () => {
  return (
    <div className={styles.leftNavArticle}>
      <NavLink to='/config' className={styles.leftNavArticleItem}>
        配置
      </NavLink>
      <NavLink to='/boss' className={styles.leftNavArticleItem}>
        BOSS直聘
      </NavLink>
      <NavLink to='/nowcoder' className={styles.leftNavArticleItem}>
        牛客网
      </NavLink>
      <NavLink to='/about' className={styles.leftNavArticleItem}>
        关于
      </NavLink>
      <NavLink to='/logs' className={styles.leftNavArticleItem}>
        日志
      </NavLink>
    </div>
  )
}
export default LeftNavArticle
