import { ConfigProvider, theme, App } from 'antd'
import viVN from 'antd/locale/vi_VN'
import { StyleProvider } from '@ant-design/cssinjs'
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
        locale={viVN}
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            colorPrimary: '#6f43fd',
            fontFamily: 'Inter'
          }
        }}
      >
        <App>{props.children}</App>
      </ConfigProvider>
    </StyleProvider>
  )
}
