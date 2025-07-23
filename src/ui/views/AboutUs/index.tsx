import { Button, Divider, Space } from 'antd'
import {
  CopyrightOutlined,
  GithubOutlined,
  HeartOutlined,
  QqOutlined,
} from '@ant-design/icons'

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
        <h3>👋 您好!</h3>
        <span>您在试用过程中发现它对您有帮助,可以个帮忙吗</span>
        <ul>
          <li>前往 GitHub 仓库点击右上角 Star。</li>
          <li>将项目分享给更多可能需要的朋友。</li>
          <li>通过 Issue / Discussion 反馈建议或提交 PR 共同完善。</li>
          <li>
            您的每一次
            Star、反馈与分享，都是对开源社区最宝贵的支持，也将直接转化为项目持续迭代的动力。
          </li>
        </ul>
        <Space>
          <Button ghost onClick={handleClickStar} icon={<GithubOutlined />}>
            link
          </Button>
          🥰
        </Space>
      </footer>
    </div>
  )
}
export default AboutUs
