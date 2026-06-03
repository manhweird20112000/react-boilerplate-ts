import { afterEach, describe, expect, it, vi } from 'vitest'

import type { ApiWorkbenchRequest } from '../types'
import { BrowserFetchSendEngine } from './browser-fetch-send-engine.impl'

function createRequest(input?: Partial<ApiWorkbenchRequest>): ApiWorkbenchRequest {
  return {
    id: 'request-1',
    name: 'Example',
    method: 'GET',
    url: 'https://api.example.com/users',
    params: [],
    headers: [],
    auth: { type: 'none' },
    body: { mode: 'none' },
    createdAt: '2026-06-03T00:00:00.000Z',
    updatedAt: '2026-06-03T00:00:00.000Z',
    ...input
  }
}

describe('BrowserFetchSendEngine', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends a request and normalizes a successful response', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 201,
        statusText: 'Created',
        headers: { 'Content-Type': 'application/json' }
      })
    )
    vi.stubGlobal('fetch', fetchMock)
    const engine = new BrowserFetchSendEngine()

    const response = await engine.send(
      createRequest({
        method: 'POST',
        url: 'https://api.example.com/users',
        params: [{ id: 'param-1', key: 'page', value: '1', enabled: true }],
        body: { mode: 'raw', raw: '{"name":"Ada"}', language: 'json' }
      })
    )

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/users?page=1',
      expect.objectContaining({
        method: 'POST',
        body: '{"name":"Ada"}'
      })
    )
    expect(response).toMatchObject({
      type: 'success',
      status: 201,
      statusText: 'Created',
      body: '{"ok":true}'
    })
  })

  it('returns invalid-request failure for invalid URLs', async () => {
    const engine = new BrowserFetchSendEngine()

    const response = await engine.send(createRequest({ url: '/relative' }))

    expect(response).toMatchObject({
      type: 'failure',
      errorType: 'invalid-request'
    })
  })

  it('returns network failure when fetch rejects', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network down')))
    const engine = new BrowserFetchSendEngine()

    const response = await engine.send(createRequest())

    expect(response).toMatchObject({
      type: 'failure',
      errorType: 'network',
      message: 'Network down'
    })
  })
})

