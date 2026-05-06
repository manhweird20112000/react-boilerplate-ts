/**
 * Registers and starts MSW in development unless disabled via VITE_ENABLE_MSW=false.
 */
export async function prepareMsw(): Promise<void> {
  if (!import.meta.env.DEV) {
    return
  }
  if (import.meta.env['VITE_ENABLE_MSW'] === 'false') {
    return
  }
  const { worker } = await import('./browser')
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js'
    }
  })
}
