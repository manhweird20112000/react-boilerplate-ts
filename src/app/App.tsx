import { Suspense, type ReactElement } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { AppRoutes } from './routes'
import { Toaster } from 'sonner'

import { AuthProvider } from '~/features/auth/hooks/auth-provider'
import { ConfigProvider } from 'antd'

import en from 'antd/locale/en_US'

function App(): ReactElement {
  return (
    <ConfigProvider
      locale={en}
      theme={{ token: { colorPrimary: '#6f43fd', fontFamily: 'Be Vietnam Pro' } }}
    >
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
          <Toaster />
        </Suspense>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
