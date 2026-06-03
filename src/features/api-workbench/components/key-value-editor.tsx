import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Checkbox, Col, Empty, Input, Row, Space } from 'antd'
import type { ReactElement } from 'react'

import type { ApiWorkbenchKeyValue } from '../types'

export type KeyValueEditorProps = {
  readonly items: readonly ApiWorkbenchKeyValue[]
  readonly keyPlaceholder?: string
  readonly valuePlaceholder?: string
  readonly onChange: (items: readonly ApiWorkbenchKeyValue[]) => void
  readonly onCreateId: () => string
}

export function KeyValueEditor({
  items,
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
  onChange,
  onCreateId
}: KeyValueEditorProps): ReactElement {
  const updateItem = (
    id: string,
    patch: Partial<Pick<ApiWorkbenchKeyValue, 'key' | 'value' | 'enabled'>>
  ) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  const addItem = () => {
    onChange([...items, { id: onCreateId(), key: '', value: '', enabled: true }])
  }

  const deleteItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id))
  }

  return (
    <Space direction="vertical" size={8} style={{ width: '100%' }}>
      {items.length === 0 ? (
        <Empty description="No rows" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : null}

      {items.map((item) => (
        <Row gutter={8} key={item.id} wrap={false}>
          <Col flex="32px">
            <Checkbox
              aria-label={`Enable ${item.key || 'row'}`}
              checked={item.enabled}
              onChange={(event) => updateItem(item.id, { enabled: event.target.checked })}
            />
          </Col>
          <Col flex="1 1 180px">
            <Input
              placeholder={keyPlaceholder}
              value={item.key}
              onChange={(event) => updateItem(item.id, { key: event.target.value })}
            />
          </Col>
          <Col flex="1 1 220px">
            <Input
              placeholder={valuePlaceholder}
              value={item.value}
              onChange={(event) => updateItem(item.id, { value: event.target.value })}
            />
          </Col>
          <Col flex="32px">
            <Button
              aria-label="Delete row"
              color="default"
              danger
              icon={<DeleteOutlined />}
              onClick={() => deleteItem(item.id)}
              variant="filled"
            />
          </Col>
        </Row>
      ))}

      <Button color="default" icon={<PlusOutlined />} onClick={addItem} variant="filled">
        Add row
      </Button>
    </Space>
  )
}

