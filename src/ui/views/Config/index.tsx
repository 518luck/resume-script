import { useEffect, useState } from 'react'
import {
  Form,
  Input,
  message,
  Button,
  Tooltip,
  Switch,
  Select,
  Modal,
} from 'antd'
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

import type { Config } from '../../../types/electron'
import Guide from './components/guide'
import { cityOptions } from './config'
import { loadSavedConfig, formSaveConfigOnFinish } from '../../utils'
import styles from './index.module.scss'

const Config = () => {
  const [configPath, setConfigPath] = useState<string>('')
  const [browserUserDataDir, setBrowserUserDataDir] = useState<string>('')
  const [isGuideVisible, setIsGuideVisible] = useState<boolean>(false)
  const [form] = Form.useForm()

  useEffect(() => {
    loadSavedConfig(form)
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

  const handleInputOnchange = async (
    fieldName: keyof Config,
    value: string | number | boolean
  ) => {
    form.setFieldsValue({ [fieldName]: value })

    const currentValues = form.getFieldsValue()
    const newValues = { ...currentValues, [fieldName]: value }
    try {
      await form.validateFields()
      formSaveConfigOnFinish(newValues)
    } catch (error) {
      console.error('表单校验失败:', error)
    }
  }

  return (
    <div className={styles.config}>
      <section className={styles.section}>
        <div className={styles.header}>
          <div className={styles.header_left}>
            <BugOutlined style={{ fontSize: '20px', color: '#ed701a' }} />
            <span>自动投递配置</span>
          </div>
          <Button
            variant='solid'
            className={styles.header_Button}
            onClick={() => setIsGuideVisible(true)}>
            新手指引
          </Button>
        </div>

        <div className={styles.content}>
          <Form form={form}>
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
                <Input
                  placeholder='请输入手机号'
                  onChange={(e) => handleInputOnchange('phone', e.target.value)}
                />
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
                  allowClear
                  options={cityOptions}
                  className={styles.selectCitys}
                  onChange={(value) => handleInputOnchange('city', value)}
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
                <Input
                  placeholder='例如: 初级前端开发工程师'
                  onChange={(e) => handleInputOnchange('job', e.target.value)}
                />
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
                <Input
                  placeholder='例如: 5123'
                  onChange={(e) =>
                    handleInputOnchange('portNumber', e.target.value)
                  }
                />
              </Form.Item>
            </div>

            {/* 无头模式 */}
            <div className={styles.inputRow}>
              <div className={styles.labelContainer}>
                <DesktopOutlined className={styles.iconAcephalous} />
                <div className={styles.labelContainer_text}>
                  <span className={styles.labelAcephalous}>无头模式</span>
                  <span className={styles.annotation}>
                    可以理解为是否会打开浏览器窗口,默认是打开的
                  </span>
                </div>
              </div>

              <Form.Item name='isHeadless'>
                <Switch
                  defaultChecked
                  onChange={(checked) =>
                    handleInputOnchange('isHeadless', checked)
                  }
                />
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
          </Form>
        </div>
      </section>

      <Modal
        title={null}
        closable={false}
        open={isGuideVisible}
        footer={null}
        className={styles.guideModal}
        onCancel={() => setIsGuideVisible(false)}>
        <Guide />
      </Modal>
    </div>
  )
}
export default Config
