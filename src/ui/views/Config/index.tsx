import { Form, Input } from 'antd'

import styles from './index.module.scss'

const Config = () => {
  return (
    <div className={styles.config}>
      <section className={styles.section}>
        <div className={styles.header}></div>
        <div className={styles.content}>
          <Form>
            <Form.Item label='手机号' name='phone'>
              <Input />
            </Form.Item>
          </Form>
        </div>
      </section>
    </div>
  )
}
export default Config
