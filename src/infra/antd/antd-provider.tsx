import { ConfigProvider, theme, App } from 'antd'
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
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            colorPrimary: '#6f43fd',
            fontFamily: 'Be Vietnam Pro'
          }
        }}
      >
        <App>{props.children}</App>
      </ConfigProvider>
    </StyleProvider>
  )
}
