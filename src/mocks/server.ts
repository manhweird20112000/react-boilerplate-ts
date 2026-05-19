import { setupServer } from 'msw/node'
import { mswHandlers } from '@/infra/msw/handlers'

export const server = setupServer(...mswHandlers)
