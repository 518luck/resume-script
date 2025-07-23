import { Divider, Space } from 'antd'
import { CopyrightOutlined, HeartOutlined, QqOutlined } from '@ant-design/icons'

import ShineStarIcon from '../../assets/ShineStarIcon'
import styles from './index.module.scss'

const AboutUs = () => {
  const handleClickStar = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    window.electronAPI.openUrl('https://github.com/518luck/resume-script')
  }
  return (
    <div className={styles.aboutUs}>
      <header className={styles.header}>
        <h2 className={styles.headerTitle}>
          <ShineStarIcon style={{ fontSize: 32 }} />
          关于
        </h2>
        <div className={styles.headerVersion}>
          <span>AR 1.0.0</span>
          <span>Developed by 多云</span>
        </div>
        <Divider className={styles.headerDivider}></Divider>
        <Space direction='vertical'>
          <div className={styles.footerMeta}>
            <CopyrightOutlined className={styles.copyrightOutlined} /> 2025
            Duoyun. Share with attribution.
          </div>
          <div className={styles.footerContact}>
            <QqOutlined className={styles.qqOutlined} /> 1512013298@qq.com
          </div>
          <div className={styles.footerThanks}>
            <HeartOutlined className={styles.heartOutlined} /> 界面样式参考自
            <a
              href='#'
              onClick={(e) => {
                e.preventDefault()
                window.electronAPI.openUrl(
                  'https://docs.qq.com/aio/DV2VKUnNaeFRyRGRH?p=DKRZhtXI98ELAa724va8q8'
                )
              }}
              style={{ marginLeft: 4, color: '#1890ff' }}>
              ycursor
            </a>
            项目，特此致谢。
          </div>
        </Space>

        <div className={styles.footerThanksYou}>感谢你的使用和支持❤️</div>
      </header>

      <footer>
        <button onClick={handleClickStar}>点赞</button>
      </footer>
    </div>
  )
}
export default AboutUs
