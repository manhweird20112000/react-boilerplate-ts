import type { Decorator, Preview } from '@storybook/react'
import { Provider } from 'react-redux'

import { store } from '../src/app/store'
import { TanstackQueryProvider } from '../src/infra/tanstack-query/tanstack-query-provider'

import '../src/infra/i18n'
import '../src/assets/styles/tailwind.css'

const withAppProviders: Decorator = (Story) => {
  return (
    <TanstackQueryProvider>
      <Provider store={store}>
        <Story />
      </Provider>
    </TanstackQueryProvider>
  )
}

const preview: Preview = {
  decorators: [withAppProviders],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: { matchers: { color: /(background|color)$/iu, date: /Date$/iu } }
  }
}

export default preview
