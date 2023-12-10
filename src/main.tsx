import { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import * as Sentry from "@sentry/react"
import { ConfigProvider } from 'antd'

import App from '@/App'
import i18n from '@/lang'
import { store } from '@/store'
import { theme } from '@/themes'

import 'antd/dist/reset.css'
// eslint-disable-next-line import/extensions
import "@/assets/styles/index.scss"

Sentry.init({
  dsn: `https://${process?.env?.SENTRY_PUBLIC_KEY ?? ''}.ingest.sentry.io/4506371955359744`,
  integrations: [
    new Sentry.BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/]
    }),
    new Sentry.Replay()
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0,
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Suspense>
    <ConfigProvider
      theme={theme}
    >
      <I18nextProvider i18n={i18n} >
        <Provider store={store}>
          <App />
        </Provider>
      </I18nextProvider>
    </ConfigProvider>
  </Suspense>

)
