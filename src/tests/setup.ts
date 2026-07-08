import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from '@/infra/msw/server'

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// Simple localStorage polyfill for environments where it might be missing or broken
if (typeof window !== 'undefined' && (!window.localStorage || typeof window.localStorage.clear !== 'function')) {
  const store: Record<string, string> = {}
  const localStorageMock = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { Object.keys(store).forEach(key => delete store[key]) },
    length: 0,
    key: (index: number) => Object.keys(store)[index] || null,
  }
  
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
    configurable: true
  })
  
  // Also set on global for good measure
  if (typeof globalThis !== 'undefined') {
    (globalThis as any).localStorage = localStorageMock
  }
}

