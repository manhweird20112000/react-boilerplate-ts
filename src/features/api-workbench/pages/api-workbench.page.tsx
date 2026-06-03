import { useMemo, useState, type ReactElement } from 'react'
import {
  Activity,
  Clock,
  Code2,
  Copy,
  Database,
  FileJson,
  Folder,
  History,
  KeyRound,
  Menu,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles
} from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Textarea } from '@/shared/components/ui/textarea'
import { cn } from '@/shared/lib/utils'

import './api-workbench.page.css'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
type RequestTab = 'params' | 'headers' | 'body' | 'auth'
type ResponseTab = 'body' | 'headers' | 'preview'
type SendState = 'idle' | 'loading' | 'success' | 'error'

interface KeyValueRow {
  readonly id: string
  readonly key: string
  readonly value: string
  readonly enabled: boolean
}

interface SavedRequest {
  readonly id: string
  readonly name: string
  readonly method: HttpMethod
  readonly path: string
  readonly status?: number
}

const savedRequests: readonly SavedRequest[] = [
  { id: 'req-health', name: 'Health check', method: 'GET', path: '/v1/health', status: 200 },
  { id: 'req-users', name: 'List users', method: 'GET', path: '/v1/users', status: 200 },
  { id: 'req-create', name: 'Create user', method: 'POST', path: '/v1/users', status: 201 },
  { id: 'req-token', name: 'Refresh token', method: 'POST', path: '/v1/auth/refresh', status: 401 }
]

const historyItems: readonly SavedRequest[] = [
  { id: 'hist-orders', name: 'Orders search', method: 'POST', path: '/v1/orders/search', status: 200 },
  { id: 'hist-profile', name: 'Profile detail', method: 'GET', path: '/v1/profile/me', status: 200 },
  { id: 'hist-upload', name: 'Upload image', method: 'PUT', path: '/v1/assets/avatar', status: 422 }
]

const initialParams: readonly KeyValueRow[] = [
  { id: 'param-1', key: 'limit', value: '25', enabled: true },
  { id: 'param-2', key: 'include', value: 'roles,teams', enabled: true },
  { id: 'param-3', key: '', value: '', enabled: false }
]

const initialHeaders: readonly KeyValueRow[] = [
  { id: 'header-1', key: 'Accept', value: 'application/json', enabled: true },
  { id: 'header-2', key: 'X-Request-Source', value: 'workbench', enabled: true },
  { id: 'header-3', key: '', value: '', enabled: false }
]

const responseHeaders: readonly KeyValueRow[] = [
  { id: 'res-1', key: 'Content-Type', value: 'application/json; charset=utf-8', enabled: true },
  { id: 'res-2', key: 'Cache-Control', value: 'no-store', enabled: true },
  { id: 'res-3', key: 'X-Trace-Id', value: 'trc_8f31d9b2a44', enabled: true }
]

const responseBody = {
  ok: true,
  data: {
    service: 'w3rd-api',
    environment: 'Development',
    requestId: 'req_72ZP8JQ',
    users: [
      { id: 'usr_101', name: 'Nora Nguyen', role: 'Admin', active: true },
      { id: 'usr_102', name: 'Minh Tran', role: 'Developer', active: true },
      { id: 'usr_103', name: 'An Le', role: 'Tester', active: false }
    ]
  },
  meta: {
    limit: 25,
    returned: 3,
    elapsedMs: 184
  }
}

const requestBody = `{
  "name": "Nora Nguyen",
  "email": "nora@example.test",
  "role": "admin"
}`

function methodClass(method: HttpMethod): string {
  return {
    GET: 'api-workbench-method-get',
    POST: 'api-workbench-method-post',
    PUT: 'api-workbench-method-put',
    PATCH: 'api-workbench-method-patch',
    DELETE: 'api-workbench-method-delete'
  }[method]
}

function KeyValueTable({
  rows,
  emptyLabel
}: {
  readonly rows: readonly KeyValueRow[]
  readonly emptyLabel: string
}): ReactElement {
  return (
    <div className="api-workbench-kv" role="table" aria-label={emptyLabel}>
      <div className="api-workbench-kv-row api-workbench-kv-head" role="row">
        <span role="columnheader">On</span>
        <span role="columnheader">Key</span>
        <span role="columnheader">Value</span>
      </div>
      {rows.map((row) => (
        <div className="api-workbench-kv-row" role="row" key={row.id}>
          <label className="api-workbench-check">
            <input type="checkbox" defaultChecked={row.enabled} aria-label={`Enable ${row.key || 'row'}`} />
          </label>
          <Input aria-label="Key" defaultValue={row.key} placeholder="Key" />
          <Input aria-label="Value" defaultValue={row.value} placeholder="Value" />
        </div>
      ))}
    </div>
  )
}

function SidebarRequest({
  request,
  active,
  onSelect
}: {
  readonly request: SavedRequest
  readonly active: boolean
  readonly onSelect: (request: SavedRequest) => void
}): ReactElement {
  return (
    <button
      className={cn('api-workbench-request-item', active && 'is-active')}
      type="button"
      onClick={() => onSelect(request)}
    >
      <span className={cn('api-workbench-method', methodClass(request.method))}>{request.method}</span>
      <span className="api-workbench-request-copy">
        <strong>{request.name}</strong>
        <small>{request.path}</small>
      </span>
      {request.status ? <span className="api-workbench-status-dot">{request.status}</span> : null}
    </button>
  )
}

export function ApiWorkbenchPage(): ReactElement {
  const [activeRequestId, setActiveRequestId] = useState(savedRequests[1]?.id ?? '')
  const [method, setMethod] = useState<HttpMethod>('GET')
  const [url, setUrl] = useState('https://api.example.test/v1/users?limit=25&include=roles,teams')
  const [requestTab, setRequestTab] = useState<RequestTab>('params')
  const [responseTab, setResponseTab] = useState<ResponseTab>('body')
  const [sendState, setSendState] = useState<SendState>('idle')

  const responseStatus = sendState === 'error' ? 500 : 200
  const responseStatusText = sendState === 'error' ? 'Server error' : 'OK'
  const prettyResponse = useMemo(() => JSON.stringify(responseBody, null, 2), [])

  function selectRequest(request: SavedRequest): void {
    setActiveRequestId(request.id)
    setMethod(request.method)
    setUrl(`https://api.example.test${request.path}`)
    setSendState('idle')
  }

  function sendRequest(): void {
    setSendState('loading')
    window.setTimeout(() => {
      setSendState(url.includes('fail') ? 'error' : 'success')
    }, 650)
  }

  return (
    <main className="api-workbench-shell" aria-label="API workbench">
      <aside className="api-workbench-sidebar" aria-label="Workspace navigation">
        <div className="api-workbench-brand">
          <div className="api-workbench-brand-mark" aria-hidden="true">
            <Code2 />
          </div>
          <div>
            <strong>W3rd Workbench</strong>
            <span>Development</span>
          </div>
        </div>

        <div className="api-workbench-search">
          <Search aria-hidden="true" />
          <input type="search" placeholder="Search requests" aria-label="Search requests" />
        </div>

        <section className="api-workbench-sidebar-section" aria-labelledby="collections-heading">
          <div className="api-workbench-section-title">
            <span id="collections-heading">Collections</span>
            <Button variant="ghost" size="icon-xs" aria-label="Create request">
              <Plus />
            </Button>
          </div>
          <div className="api-workbench-folder-label">
            <Folder aria-hidden="true" />
            Platform API
          </div>
          <div className="api-workbench-request-list">
            {savedRequests.map((request) => (
              <SidebarRequest
                active={activeRequestId === request.id}
                key={request.id}
                onSelect={selectRequest}
                request={request}
              />
            ))}
          </div>
        </section>

        <section className="api-workbench-sidebar-section" aria-labelledby="history-heading">
          <div className="api-workbench-section-title">
            <span id="history-heading">History</span>
            <History aria-hidden="true" />
          </div>
          <div className="api-workbench-request-list">
            {historyItems.map((request) => (
              <SidebarRequest
                active={activeRequestId === request.id}
                key={request.id}
                onSelect={selectRequest}
                request={request}
              />
            ))}
          </div>
        </section>
      </aside>

      <section className="api-workbench-main">
        <header className="api-workbench-topbar">
          <div className="api-workbench-topbar-title">
            <Button className="api-workbench-mobile-menu" variant="ghost" size="icon" aria-label="Open sidebar">
              <Menu />
            </Button>
            <div>
              <span>Platform API</span>
              <h1>List users</h1>
            </div>
          </div>
          <div className="api-workbench-topbar-actions">
            <Badge variant="outline">
              <ShieldCheck aria-hidden="true" />
              Auth ready
            </Badge>
            <Button variant="outline" size="sm">
              <Settings />
              Env
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="More actions">
              <MoreHorizontal />
            </Button>
          </div>
        </header>

        <div className="api-workbench-urlbar" aria-label="Request URL">
          <Select value={method} onValueChange={(value) => setMethod(value as HttpMethod)}>
            <SelectTrigger className="api-workbench-method-select" aria-label="HTTP method">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start">
              {(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as readonly HttpMethod[]).map((item) => (
                <SelectItem key={item} value={item}>
                  <span className={cn('api-workbench-method', methodClass(item))}>{item}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            aria-label="Request URL"
            className="api-workbench-url-input"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            spellCheck={false}
          />
          <Button className="api-workbench-send" disabled={sendState === 'loading'} onClick={sendRequest}>
            {sendState === 'loading' ? <RefreshCw className="api-workbench-spin" /> : <Send />}
            Send
          </Button>
        </div>

        <div className="api-workbench-panels">
          <section className="api-workbench-panel api-workbench-request-panel" aria-label="Request builder">
            <Tabs value={requestTab} onValueChange={(value) => setRequestTab(value as RequestTab)}>
              <div className="api-workbench-panel-head">
                <TabsList variant="line">
                  <TabsTrigger value="params">Params</TabsTrigger>
                  <TabsTrigger value="headers">Headers</TabsTrigger>
                  <TabsTrigger value="body">Body</TabsTrigger>
                  <TabsTrigger value="auth">Auth</TabsTrigger>
                </TabsList>
                <Button variant="ghost" size="sm">
                  <Copy />
                  Duplicate
                </Button>
              </div>

              <TabsContent value="params">
                <KeyValueTable rows={initialParams} emptyLabel="Query parameters" />
              </TabsContent>
              <TabsContent value="headers">
                <KeyValueTable rows={initialHeaders} emptyLabel="Request headers" />
              </TabsContent>
              <TabsContent value="body">
                <label className="api-workbench-field-label" htmlFor="request-body">
                  JSON body
                </label>
                <Textarea id="request-body" className="api-workbench-code-textarea" defaultValue={requestBody} />
              </TabsContent>
              <TabsContent value="auth">
                <div className="api-workbench-auth">
                  <KeyRound aria-hidden="true" />
                  <div>
                    <strong>Bearer token</strong>
                    <span>Using Development environment token. Header will be attached on send.</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </section>

          <section className="api-workbench-panel api-workbench-response-panel" aria-label="Response inspector">
            <div className="api-workbench-response-summary">
              <div>
                <span>Response</span>
                <strong className={sendState === 'error' ? 'is-error' : 'is-success'}>
                  {sendState === 'idle' ? 'No response yet' : `${responseStatus} ${responseStatusText}`}
                </strong>
              </div>
              <div className="api-workbench-response-metrics">
                <Badge variant="outline">
                  <Clock aria-hidden="true" />
                  {sendState === 'loading' ? 'Pending' : '184 ms'}
                </Badge>
                <Badge variant="outline">
                  <Database aria-hidden="true" />
                  4.8 KB
                </Badge>
                <Badge variant="outline">
                  <Activity aria-hidden="true" />
                  HTTP/2
                </Badge>
              </div>
            </div>

            <Tabs value={responseTab} onValueChange={(value) => setResponseTab(value as ResponseTab)}>
              <div className="api-workbench-panel-head">
                <TabsList variant="line">
                  <TabsTrigger value="body">Body</TabsTrigger>
                  <TabsTrigger value="headers">Headers</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <Button variant="ghost" size="sm">
                  <FileJson />
                  Pretty
                </Button>
              </div>

              <TabsContent value="body" className="api-workbench-response-content">
                {sendState === 'idle' ? (
                  <div className="api-workbench-empty">
                    <Sparkles aria-hidden="true" />
                    <strong>No response yet</strong>
                    <span>Send a request to inspect status, headers, timing, and body.</span>
                  </div>
                ) : sendState === 'loading' ? (
                  <div className="api-workbench-skeleton" aria-label="Loading response">
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                ) : sendState === 'error' ? (
                  <div className="api-workbench-error" role="status">
                    <strong>Request failed</strong>
                    <span>The server returned 500. Check the URL or retry after inspecting headers.</span>
                  </div>
                ) : (
                  <pre className="api-workbench-code" aria-label="Formatted JSON response">
                    {prettyResponse}
                  </pre>
                )}
              </TabsContent>
              <TabsContent value="headers">
                <KeyValueTable rows={responseHeaders} emptyLabel="Response headers" />
              </TabsContent>
              <TabsContent value="preview">
                <div className="api-workbench-preview">
                  <strong>3 users returned</strong>
                  <span>The response body is valid JSON and includes pagination metadata.</span>
                </div>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </section>
    </main>
  )
}
