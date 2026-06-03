import { Alert, Empty, Space, Table, Tabs, Tag, Typography, type TableProps } from 'antd'
import type { ReactElement } from 'react'

import type { ApiWorkbenchResponse, ApiWorkbenchResponseHeader } from '../types'

export type ResponseInspectorProps = {
  readonly response: ApiWorkbenchResponse | null
}

const headerColumns: TableProps<ApiWorkbenchResponseHeader>['columns'] = [
  {
    title: 'Header',
    dataIndex: 'key',
    key: 'key',
    width: '35%'
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value'
  }
]

function formatBody(body: string): string {
  try {
    return JSON.stringify(JSON.parse(body), null, 2)
  } catch {
    return body
  }
}

export function ResponseInspector({ response }: ResponseInspectorProps): ReactElement {
  if (!response) {
    return (
      <div style={{ display: 'grid', minHeight: 320, placeItems: 'center' }}>
        <Empty description="Send a request to inspect the response" />
      </div>
    )
  }

  if (response.type === 'failure') {
    return (
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Alert
          showIcon
          type={response.errorType === 'timeout' ? 'warning' : 'error'}
          message={response.errorType}
          description={response.message}
        />
        <Typography.Text type="secondary">
          {response.durationMs != null ? `${response.durationMs} ms` : 'No duration recorded'}
        </Typography.Text>
      </Space>
    )
  }

  return (
    <Space direction="vertical" size={12} style={{ width: '100%' }}>
      <Space wrap>
        <Tag color={response.status >= 400 ? 'error' : 'success'}>{response.status}</Tag>
        <Typography.Text>{response.statusText || 'No status text'}</Typography.Text>
        <Typography.Text type="secondary">{response.durationMs} ms</Typography.Text>
        <Typography.Text type="secondary">{response.bodySizeBytes ?? 0} bytes</Typography.Text>
      </Space>

      <Tabs
        items={[
          {
            key: 'body',
            label: 'Body',
            children: (
              <pre
                style={{
                  background: '#f5f5f5',
                  border: '1px solid rgba(5, 5, 5, 0.08)',
                  borderRadius: 8,
                  margin: 0,
                  maxHeight: 520,
                  overflow: 'auto',
                  padding: 12,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}
              >
                {formatBody(response.body)}
              </pre>
            )
          },
          {
            key: 'headers',
            label: `Headers (${response.headers.length})`,
            children: (
              <Table
                columns={headerColumns}
                dataSource={[...response.headers]}
                pagination={false}
                rowKey={(row) => row.key}
                size="small"
              />
            )
          }
        ]}
      />
    </Space>
  )
}

