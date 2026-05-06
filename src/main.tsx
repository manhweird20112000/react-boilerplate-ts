import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './app/App.tsx'
import { store } from './app/store.ts'

import '@/infra/i18n'

import '~/assets/styles/tailwind.css'

async function bootstrap(): Promise<void> {
  createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <App />
    </Provider>
  )
}

void bootstrap()
