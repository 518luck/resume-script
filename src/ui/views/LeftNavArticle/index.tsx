import styles from './index.module.scss'

const LeftNavArticle = () => {
  return (
    <div className={styles.leftNavArticle}>
      <div className={styles.leftNavArticleItem}>配置</div>
      <div className={styles.leftNavArticleItem}>BOSS直聘</div>
      <div className={styles.leftNavArticleItem}>牛客网</div>
      <div className={styles.leftNavArticleItem}>关于</div>
      <div className={styles.leftNavArticleItem}>日志</div>
    </div>
  )
}
export default LeftNavArticle
