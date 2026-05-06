import { setupWorker } from 'msw/browser'

import { mswHandlers } from './handlers'

/**
 * Browser Service Worker for intercepting HTTP during local development.
 */
export const worker = setupWorker(...mswHandlers)
