import { SendOutlined } from '@ant-design/icons'
import {
  App as AntdApp,
  Button,
  Col,
  Flex,
  Form,
  Grid,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Tabs,
  Typography
} from 'antd'
import { useMemo, useState, type ReactElement } from 'react'

import { KeyValueEditor } from '../components/key-value-editor'
import { ResponseInspector } from '../components/response-inspector'
import { apiWorkbenchSendEngine } from '../services'
import type {
  ApiWorkbenchAuth,
  ApiWorkbenchHttpMethod,
  ApiWorkbenchRawBodyLanguage,
  ApiWorkbenchRequest,
  ApiWorkbenchResponse
} from '../types'
import { createApiWorkbenchId } from '../utils'

const { TextArea } = Input

const HTTP_METHODS: readonly ApiWorkbenchHttpMethod[] = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'HEAD',
  'OPTIONS'
]

const METHOD_OPTIONS: { readonly label: ApiWorkbenchHttpMethod; readonly value: ApiWorkbenchHttpMethod }[] =
  HTTP_METHODS.map((method) => ({ label: method, value: method }))

const RAW_LANGUAGE_OPTIONS: {
  readonly label: string
  readonly value: ApiWorkbenchRawBodyLanguage
}[] = [
  { label: 'JSON', value: 'json' },
  { label: 'Text', value: 'text' },
  { label: 'XML', value: 'xml' },
  { label: 'HTML', value: 'html' }
]

function createInitialRequest(): ApiWorkbenchRequest {
  const now = new Date().toISOString()

  return {
    id: createApiWorkbenchId(),
    name: 'Untitled request',
    method: 'GET',
    url: '',
    params: [],
    headers: [],
    auth: { type: 'none' },
    body: { mode: 'raw', raw: '', language: 'json' },
    timeoutMs: 30000,
    createdAt: now,
    updatedAt: now
  }
}

function getAuthType(auth: ApiWorkbenchAuth): ApiWorkbenchAuth['type'] {
  return auth.type
}

function getRequestName(request: ApiWorkbenchRequest): string {
  if (request.name.trim()) {
    return request.name
  }

  return `${request.method} request`
}

export function WorkbenchPage(): ReactElement {
  const [request, setRequest] = useState<ApiWorkbenchRequest>(() => createInitialRequest())
  const [response, setResponse] = useState<ApiWorkbenchResponse | null>(null)
  const [isSending, setIsSending] = useState(false)
  const { message } = AntdApp.useApp()
  const screens = Grid.useBreakpoint()
  const isStacked = screens.lg === false

  const updateRequest = (patch: Partial<ApiWorkbenchRequest>) => {
    setRequest((current) => ({
      ...current,
      ...patch,
      updatedAt: new Date().toISOString()
    }))
  }

  const updateAuthType = (type: ApiWorkbenchAuth['type']) => {
    const nextAuth: ApiWorkbenchAuth =
      type === 'bearer'
        ? { type, token: '' }
        : type === 'basic'
          ? { type, username: '', password: '' }
          : type === 'api-key'
            ? { type, key: '', value: '', target: 'header' }
            : { type: 'none' }

    updateRequest({ auth: nextAuth })
  }

  const handleSend = async () => {
    if (!request.url.trim()) {
      message.error('Enter a request URL')
      return
    }

    setIsSending(true)
    try {
      setResponse(await apiWorkbenchSendEngine.send(request))
    } finally {
      setIsSending(false)
    }
  }

  const requestTabs = useMemo(
    () => [
      {
        key: 'params',
        label: `Params (${request.params.length})`,
        children: (
          <KeyValueEditor
            items={request.params}
            onChange={(params) => updateRequest({ params })}
            onCreateId={createApiWorkbenchId}
          />
        )
      },
      {
        key: 'headers',
        label: `Headers (${request.headers.length})`,
        children: (
          <KeyValueEditor
            items={request.headers}
            onChange={(headers) => updateRequest({ headers })}
            onCreateId={createApiWorkbenchId}
          />
        )
      },
      {
        key: 'auth',
        label: 'Auth',
        children: (
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <Form.Item label="Type" style={{ marginBottom: 0 }}>
              <Select
                value={getAuthType(request.auth)}
                onChange={updateAuthType}
                options={[
                  { label: 'No Auth', value: 'none' },
                  { label: 'Bearer Token', value: 'bearer' },
                  { label: 'Basic Auth', value: 'basic' },
                  { label: 'API Key', value: 'api-key' }
                ]}
                style={{ maxWidth: 280, width: '100%' }}
              />
            </Form.Item>

            {request.auth.type === 'bearer' ? (
              <Input
                placeholder="Token"
                value={request.auth.token}
                onChange={(event) =>
                  updateRequest({ auth: { type: 'bearer', token: event.target.value } })
                }
              />
            ) : null}

            {request.auth.type === 'basic' ? (
              <Row gutter={8}>
                <Col xs={24} md={12}>
                  <Input
                    placeholder="Username"
                    value={request.auth.username}
                    onChange={(event) =>
                      updateRequest({
                        auth: {
                          type: 'basic',
                          username: event.target.value,
                          password: request.auth.type === 'basic' ? request.auth.password : ''
                        }
                      })
                    }
                  />
                </Col>
                <Col xs={24} md={12}>
                  <Input.Password
                    placeholder="Password"
                    value={request.auth.password}
                    onChange={(event) =>
                      updateRequest({
                        auth: {
                          type: 'basic',
                          username: request.auth.type === 'basic' ? request.auth.username : '',
                          password: event.target.value
                        }
                      })
                    }
                  />
                </Col>
              </Row>
            ) : null}

            {request.auth.type === 'api-key' ? (
              <Row gutter={8}>
                <Col xs={24} md={8}>
                  <Input
                    placeholder="Key"
                    value={request.auth.key}
                    onChange={(event) =>
                      updateRequest({
                        auth: {
                          type: 'api-key',
                          key: event.target.value,
                          value: request.auth.type === 'api-key' ? request.auth.value : '',
                          target: request.auth.type === 'api-key' ? request.auth.target : 'header'
                        }
                      })
                    }
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Input
                    placeholder="Value"
                    value={request.auth.value}
                    onChange={(event) =>
                      updateRequest({
                        auth: {
                          type: 'api-key',
                          key: request.auth.type === 'api-key' ? request.auth.key : '',
                          value: event.target.value,
                          target: request.auth.type === 'api-key' ? request.auth.target : 'header'
                        }
                      })
                    }
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Select
                    value={request.auth.target}
                    onChange={(target: 'header' | 'query') =>
                      updateRequest({
                        auth: {
                          type: 'api-key',
                          key: request.auth.type === 'api-key' ? request.auth.key : '',
                          value: request.auth.type === 'api-key' ? request.auth.value : '',
                          target
                        }
                      })
                    }
                    options={[
                      { label: 'Header', value: 'header' },
                      { label: 'Query Param', value: 'query' }
                    ]}
                    style={{ width: '100%' }}
                  />
                </Col>
              </Row>
            ) : null}
          </Space>
        )
      },
      {
        key: 'body',
        label: 'Body',
        children: (
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <Select
              value={request.body.mode === 'raw' ? request.body.language : 'json'}
              onChange={(language: ApiWorkbenchRawBodyLanguage) =>
                updateRequest({
                  body: {
                    mode: 'raw',
                    raw: request.body.mode === 'raw' ? request.body.raw : '',
                    language
                  }
                })
              }
              options={RAW_LANGUAGE_OPTIONS}
              style={{ width: 160 }}
            />
            <TextArea
              autoSize={{ minRows: 12, maxRows: 18 }}
              placeholder='{"example": true}'
              value={request.body.mode === 'raw' ? request.body.raw : ''}
              onChange={(event) =>
                updateRequest({
                  body: {
                    mode: 'raw',
                    raw: event.target.value,
                    language: request.body.mode === 'raw' ? request.body.language : 'json'
                  }
                })
              }
              style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
            />
          </Space>
        )
      }
    ],
    [request]
  )

  return (
    <Flex
      vertical
      gap={16}
      style={{
        margin: 'calc(var(--layout-content-padding, 24px) * -1)',
        minHeight: 'calc(100dvh - 64px)',
        padding: 'var(--layout-content-padding, 24px)'
      }}
    >
      <Flex align="center" justify="space-between" gap={12} wrap>
        <div>
          <Typography.Title level={4} style={{ margin: 0 }}>
            API Workbench
          </Typography.Title>
          <Typography.Text type="secondary">{getRequestName(request)}</Typography.Text>
        </div>
        <Form.Item label="Timeout" style={{ marginBottom: 0 }}>
          <InputNumber
            min={1000}
            step={1000}
            value={request.timeoutMs}
            onChange={(value) => updateRequest({ timeoutMs: value ?? undefined })}
            addonAfter="ms"
            style={{ width: 180 }}
          />
        </Form.Item>
      </Flex>

      <Flex gap={8} vertical={isStacked}>
        <Select
          value={request.method}
          onChange={(method: ApiWorkbenchHttpMethod) => updateRequest({ method })}
          options={METHOD_OPTIONS}
          style={{ width: isStacked ? '100%' : 132 }}
        />
        <Input
          aria-label="Request URL"
          placeholder="https://api.example.com/users"
          value={request.url}
          onChange={(event) => updateRequest({ url: event.target.value })}
          onPressEnter={() => void handleSend()}
        />
        <Button
          icon={<SendOutlined />}
          loading={isSending}
          onClick={() => void handleSend()}
          type="primary"
        >
          Send
        </Button>
      </Flex>

      <Row gutter={[16, 16]} style={{ flex: 1, minHeight: 0 }}>
        <Col xs={24} xl={12}>
          <section
            style={{
              background: '#ffffff',
              border: '1px solid rgba(5, 5, 5, 0.08)',
              borderRadius: 8,
              minHeight: 480,
              padding: 16
            }}
          >
            <Tabs items={requestTabs} />
          </section>
        </Col>
        <Col xs={24} xl={12}>
          <section
            style={{
              background: '#ffffff',
              border: '1px solid rgba(5, 5, 5, 0.08)',
              borderRadius: 8,
              minHeight: 480,
              padding: 16
            }}
          >
            <Typography.Title level={5} style={{ marginTop: 0 }}>
              Response
            </Typography.Title>
            <ResponseInspector response={response} />
          </section>
        </Col>
      </Row>
    </Flex>
  )
}
