import { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { ConfigProvider } from 'antd'

import App from '@/App'
import i18n from '@/lang'

import 'antd/dist/reset.css'
// eslint-disable-next-line import/extensions
import "@/assets/styles/index.scss"

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Suspense>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00b96b'
        }
      }}
    >
      <I18nextProvider i18n={i18n} >
        <App />
      </I18nextProvider>
    </ConfigProvider>
  </Suspense>

)
