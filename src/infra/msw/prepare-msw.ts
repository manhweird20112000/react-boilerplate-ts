/**
 * Registers and starts MSW in development unless VITE_USE_MSW=false.
 */
export async function prepareMsw(): Promise<void> {
  if (!import.meta.env.DEV) {
    return
  }
  if (import.meta.env['VITE_USE_MSW'] === 'false') {
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
