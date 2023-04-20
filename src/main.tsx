import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'

import App from '@/App'

import 'antd/dist/reset.css'
// eslint-disable-next-line import/extensions
import "@/assets/styles/index.scss"

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#00b96b'
      }
    }}
  >
    <App />
  </ConfigProvider>
)
