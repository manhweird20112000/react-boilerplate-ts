import { createRoot } from 'react-dom/client'

import App from './app/App.tsx'

import { prepareMsw } from '@/infra/msw/prepare-msw'
import { AntdProvider } from '@/infra/antd/antd-provider'

import '~/assets/styles/tailwind.css'

async function bootstrap(): Promise<void> {
  await prepareMsw()

  createRoot(document.getElementById('root')!).render(
    <AntdProvider>
      <App />
    </AntdProvider>
  )
}

void bootstrap()
