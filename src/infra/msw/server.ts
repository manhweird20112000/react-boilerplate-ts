import { setupServer } from 'msw/node'

import { mswHandlers } from './handlers'

export const server = setupServer(...mswHandlers)
