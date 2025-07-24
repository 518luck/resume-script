import styles from './index.module.scss'

const Guide = () => {
  return (
    <div className={styles.guide}>
      <header className={styles.guide_header}>🦉欢迎使用 多云AR</header>
      <div className={styles.guide_content}>
        <span>👋嗨,我是 多云</span>
        <span>感谢您使用 多云AR，第一次使用Electron制作这种桌面程序，</span>
        <span>我是为了找工作，才开始学习，一个多月，一边学一边做，</span>
        <span>很多地方做的比较草率，还请见谅，</span>
        <span>
          好了,废话不多说，之所以有这个界面就是因为技术有限，无法解决反爬虫的人机验证问题，而且多云刚刚毕业没办法自费购买外部服务，还请见谅
        </span>
        <span>
          所以，我只能通过模拟浏览器的行为，来实现自动投递简历的功能，
        </span>
        <span>
          注意事项
          <ul>
            <li>在配置界面,按照表单要求填写配置</li>
            <li>手机号必须是真实有效的手机号,否则无法收到验证码</li>
            <li>城市名称需要与 BOSS 直聘上的名称完全一致</li>
            <li>端口号用于开发调试，生产环境会自动配置</li>
            <li style={{ color: 'red' }}>
              主要BUG在第一次投递的时候，因为没办法通过人机验证,需要关闭无头模式,手动来过验证,您的信息会自动保存,只需要
              <strong>一次</strong> 就好了
            </li>
            <li>最好的建议就是登录上之后,退出软件,重新打开</li>
            <li>
              如果投递失败,请检查配置是否正确,日志也会有报错提示的,或者
              <strong>关于界面</strong>联系我,我会尽快解决
            </li>
            <li>目前软件我会持续维护,同时也会后续加上一些其他的投聘网站</li>
          </ul>
        </span>
      </div>
    </div>
  )
}

export default Guide
