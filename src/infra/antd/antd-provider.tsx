import { ConfigProvider, theme, App } from 'antd'
import { StyleProvider } from '@ant-design/cssinjs'
import vi_VN from 'antd/locale/vi_VN'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import type { ReactElement, ReactNode } from 'react'

dayjs.locale('vi')

export type AntdProviderProps = {
  readonly children: ReactNode
}

export function AntdProvider(props: AntdProviderProps): ReactElement {
  return (
    <StyleProvider hashPriority="high">
      <ConfigProvider
        locale={vi_VN}
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            colorPrimary: '#0070F2'
          }
        }}
      >
        <App>{props.children}</App>
      </ConfigProvider>
    </StyleProvider>
  )
}
