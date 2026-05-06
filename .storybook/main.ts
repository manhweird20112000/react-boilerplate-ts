import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { mergeConfig, type UserConfig } from 'vite'
import type { StorybookConfig } from '@storybook/react-vite'

const projectRoot: string = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-a11y', '@storybook/addon-docs'],
  viteFinal: async (config): Promise<UserConfig> => {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@': path.resolve(projectRoot, '../src'),
          '~': path.resolve(projectRoot, '../src')
        }
      }
    })
  }
}

export default config
