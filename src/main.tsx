import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './app/App.tsx'
import { store } from './app/store.ts'

import '@/infra/i18n'
import { TanstackQueryProvider } from '@/infra/tanstack-query/tanstack-query-provider'
import { AntdProvider } from '@/infra/antd/antd-provider'

import '~/assets/styles/tailwind.css'

async function bootstrap(): Promise<void> {
  createRoot(document.getElementById('root')!).render(
    <TanstackQueryProvider>
      <Provider store={store}>
        <AntdProvider>
          <App />
        </AntdProvider>
      </Provider>
    </TanstackQueryProvider>
  )
}

void bootstrap()
