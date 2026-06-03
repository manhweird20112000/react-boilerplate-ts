import { describe, expect, it } from 'vitest'

import type { ApiWorkbenchRequest } from '../types'
import {
  prepareApiWorkbenchNativeRequest,
  prepareApiWorkbenchRequest
} from './api-workbench-request-builder'

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

describe('prepareApiWorkbenchRequest', () => {
  it('adds enabled query params and skips disabled params', () => {
    const prepared = prepareApiWorkbenchRequest(
      createRequest({
        params: [
          { id: 'param-1', key: 'page', value: '1', enabled: true },
          { id: 'param-2', key: 'debug', value: 'true', enabled: false }
        ]
      })
    )

    expect(prepared.url).toBe('https://api.example.com/users?page=1')
  })

  it('applies bearer auth and enabled headers', () => {
    const prepared = prepareApiWorkbenchRequest(
      createRequest({
        headers: [{ id: 'header-1', key: 'X-Trace', value: 'abc', enabled: true }],
        auth: { type: 'bearer', token: 'token-1' }
      })
    )

    expect(prepared.headers.get('X-Trace')).toBe('abc')
    expect(prepared.headers.get('Authorization')).toBe('Bearer token-1')
  })

  it('adds api key auth to query when target is query', () => {
    const prepared = prepareApiWorkbenchRequest(
      createRequest({
        auth: { type: 'api-key', key: 'api_key', value: 'secret', target: 'query' }
      })
    )

    expect(prepared.url).toBe('https://api.example.com/users?api_key=secret')
  })

  it('prepares raw JSON body and content type for body methods', () => {
    const prepared = prepareApiWorkbenchRequest(
      createRequest({
        method: 'POST',
        body: { mode: 'raw', raw: '{"ok":true}', language: 'json' }
      })
    )

    expect(prepared.body).toBe('{"ok":true}')
    expect(prepared.headers.get('Content-Type')).toBe('application/json')
  })

  it('does not attach a body for GET requests', () => {
    const prepared = prepareApiWorkbenchRequest(
      createRequest({
        method: 'GET',
        body: { mode: 'raw', raw: '{"ignored":true}', language: 'json' }
      })
    )

    expect(prepared.body).toBeUndefined()
  })

  it('throws for relative URLs', () => {
    expect(() => prepareApiWorkbenchRequest(createRequest({ url: '/users' }))).toThrow(
      'Request URL must be a valid absolute URL.'
    )
  })

  it('prepares a serializable native request for Tauri HTTP commands', () => {
    const prepared = prepareApiWorkbenchNativeRequest(
      createRequest({
        method: 'POST',
        url: 'https://api.example.com/users',
        auth: { type: 'api-key', key: 'X-Api-Key', value: 'secret', target: 'header' },
        body: {
          mode: 'urlencoded',
          items: [{ id: 'body-1', key: 'name', value: 'Ada', enabled: true }]
        },
        timeoutMs: 5000
      })
    )

    expect(prepared).toMatchObject({
      url: 'https://api.example.com/users',
      method: 'POST',
      body: 'name=Ada',
      timeoutMs: 5000
    })
    expect(prepared.headers).toEqual(
      expect.arrayContaining([
        { key: 'X-Api-Key', value: 'secret' },
        { key: 'Content-Type', value: 'application/x-www-form-urlencoded' }
      ])
    )
  })
})
