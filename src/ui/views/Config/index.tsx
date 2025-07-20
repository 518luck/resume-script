import { useEffect, useState } from 'react'
import type { FormProps } from 'antd'
import { Form, Input, message, Button, Tooltip, Switch, Select } from 'antd'
import {
  PhoneOutlined,
  BugOutlined,
  CopyOutlined,
  DesktopOutlined,
  TruckOutlined,
  FormOutlined,
  BranchesOutlined,
  UserOutlined,
} from '@ant-design/icons'

import styles from './index.module.scss'

const Config = () => {
  const [form] = Form.useForm()
  const [configPath, setConfigPath] = useState<string>('')
  const [browserUserDataDir, setBrowserUserDataDir] = useState<string>('')

  const cityOptions = [
    { label: '深圳', value: '深圳' },
    { label: '北京', value: '北京' },
    { label: '上海', value: '上海' },
    { label: '广州', value: '广州' },
  ]

  useEffect(() => {
    const loadSavedConfig = async () => {
      try {
        const config = await window.electronAPI.loadConfig()
        if (config && Object.keys(config).length > 0) {
          form.setFieldsValue(config)
          message.success('配置加载成功')
        }
      } catch (error) {
        message.error('配置加载失败')
        console.error('配置加载失败', error)
      }
    }

    loadSavedConfig()
  }, [form])

  useEffect(() => {
    const getConfigPath = async () => {
      try {
        const configPath = await window.electronAPI.getConfigPath()
        setConfigPath(configPath)
      } catch {
        message.error('获取配置文件路径失败')
      }
    }
    getConfigPath()
  })

  useEffect(() => {
    const getBrowserUserDataDir = async () => {
      const browserUserDataDir =
        await window.electronAPI.getBrowserUserDataDir()
      setBrowserUserDataDir(browserUserDataDir)
    }
    getBrowserUserDataDir()
  })

  const handleConfigPathOnClick = async () => {
    try {
      const dirExists = await window.electronAPI.openFolder(configPath)
      console.log(dirExists)

      if (!dirExists) {
        message.error('配置文件未创建,请先填写配置')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSaveConfigOnFinish: FormProps['onFinish'] = async (values) => {
    try {
      const success = await window.electronAPI.saveConfig(values)
      if (success) {
        message.success('配置保存成功')
      } else {
        message.error('配置保存失败')
      }
    } catch (error) {
      console.error('保存配置失败:', error)
      message.error('保存失败')
    }
  }

  const handleIsHeadlessOnChange = (checked: boolean) => {
    console.log(checked)
  }

  return (
    <div className={styles.config}>
      <section className={styles.section}>
        <div className={styles.header}>
          <div className={styles.header_left}>
            <BugOutlined style={{ fontSize: '20px', color: '#ed701a' }} />
            <span>自动投递配置</span>
          </div>
          <Button variant='solid' className={styles.header_Button}>
            帮助
          </Button>
        </div>

        <div className={styles.content}>
          <Form form={form} onFinish={handleSaveConfigOnFinish}>
            {/* 手机号 */}
            <div className={styles.inputRow}>
              <div className={styles.labelContainer}>
                <PhoneOutlined className={styles.iconPhone} />
                <div className={styles.labelContainer_text}>
                  <span className={styles.labelPhone}>手机号</span>
                  <span className={styles.annotation}>
                    主要用来注册的时候使用
                  </span>
                </div>
              </div>
              <Form.Item
                name='phone'
                className={styles.inputContainer}
                rules={[
                  { required: true, message: '请输入手机号' },
                  {
                    pattern: /^1[3-9]\d{9}$/,
                    message: '请输入正确的手机号格式',
                  },
                ]}>
                <Input placeholder='请输入手机号' />
              </Form.Item>
            </div>

            {/* 择业城市 */}
            <div className={styles.inputRow}>
              <div className={styles.labelContainer}>
                <TruckOutlined className={styles.iconCity} />
                <div className={styles.labelContainer_text}>
                  <span className={styles.labelCity}>择业城市</span>
                  <span className={styles.annotation}>
                    输的时候去BOSS看下,一字不差的输入
                  </span>
                </div>
              </div>

              <Form.Item name='city' initialValue={cityOptions[0]?.value}>
                <Select
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={cityOptions}
                  className={styles.selectCitys}
                />
              </Form.Item>
            </div>

            {/* 工作职位 */}
            <div className={styles.inputRow}>
              <div className={styles.labelContainer}>
                <FormOutlined className={styles.iconJob} />
                <div className={styles.labelContainer_text}>
                  <span className={styles.labelJob}>工作职位</span>
                  <span className={styles.annotation}>
                    搜索栏输入职位的时候用
                  </span>
                </div>
              </div>
              <Form.Item
                name='job'
                className={styles.inputContainer}
                rules={[{ required: true, message: '请输入工作职位' }]}>
                <Input placeholder='例如: 初级前端开发工程师' />
              </Form.Item>
            </div>

            {/* 端口号 */}
            <div className={styles.inputRow}>
              <div className={styles.labelContainer}>
                <BranchesOutlined className={styles.portNumberIcon} />
                <div className={styles.labelContainer_text}>
                  <span className={styles.portNumber}>端口号</span>
                  <span className={styles.annotation}>
                    方便调试,本地每次改两个地方太麻烦了
                  </span>
                </div>
              </div>
              <Form.Item
                name='portNumber'
                className={styles.inputContainer}
                rules={[{ required: true, message: '请输入端口号' }]}>
                <Input placeholder='例如: 5123' />
              </Form.Item>
            </div>

            {/* 无头模式 */}
            <div className={styles.inputRow}>
              <div className={styles.labelContainer}>
                <DesktopOutlined className={styles.iconAcephalous} />
                <div className={styles.labelContainer_text}>
                  <span className={styles.labelAcephalous}>无头模式</span>
                  <span className={styles.annotation}>
                    浏览器在无头模式下运行，不会打开浏览器窗口
                  </span>
                </div>
              </div>

              <Form.Item name='isHeadless'>
                <Switch defaultChecked onChange={handleIsHeadlessOnChange} />
              </Form.Item>
            </div>

            {/* 配置文件路径 */}
            <div className={styles.inputRow}>
              <div
                className={styles.labelContainer}
                style={{ cursor: 'pointer' }}
                onClick={handleConfigPathOnClick}>
                <CopyOutlined className={styles.iconPath} />
                <div className={styles.labelContainer_text}>
                  <span className={styles.labelPath}>配置文件路径</span>
                  <span className={styles.annotation}>
                    用来保存配置文件的信息
                  </span>
                </div>
              </div>
              <Tooltip title={configPath} placement='top'>
                <span className={styles.right_container_text}>
                  {configPath}
                </span>
              </Tooltip>
            </div>

            {/* 浏览器用户数据目录 */}
            <div className={styles.inputRow} style={{ marginTop: '20px' }}>
              <div className={styles.labelContainer}>
                <UserOutlined className={styles.iconBrowser} />
                <div className={styles.labelContainer_text}>
                  <span className={styles.labelBrowser}>
                    浏览器用户数据目录
                  </span>
                  <span className={styles.annotation}>
                    用来保存浏览器用户数据
                  </span>
                </div>
              </div>
              <Tooltip title={browserUserDataDir} placement='top'>
                <span className={styles.right_container_text}>
                  {browserUserDataDir}
                </span>
              </Tooltip>
            </div>

            <Form.Item>
              <Button type='primary' htmlType='submit'>
                保存配置
              </Button>
            </Form.Item>
          </Form>
        </div>
      </section>
    </div>
  )
}
export default Config
