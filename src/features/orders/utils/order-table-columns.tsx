import { DeleteOutlined, EditOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons'
import { Button, Dropdown, Space, Tag, Typography, type TableProps } from 'antd'

import type { Order } from '../types/order.type'

export type OrderTableActions = {
  readonly onView: (order: Order) => void
  readonly onEdit: (order: Order) => void
  readonly onDelete: (order: Order) => void
}

const paymentColors = ['success', 'warning', 'error'] as const

export const createOrderTableColumns = (
  isMobile: boolean,
  actions: OrderTableActions
): TableProps<Order>['columns'] => [
  {
    title: 'Order',
    dataIndex: 'id',
    key: 'id',
    render: (text, record) => (
      <Typography.Link onClick={() => actions.onView(record)} color="primary">
        #{text}
      </Typography.Link>
    )
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date'
  },
  {
    title: 'Customer',
    dataIndex: 'customer',
    key: 'customer',
    render: (customer) => customer.name
  },
  {
    title: 'Payment',
    dataIndex: 'payment_status',
    key: 'payment_status',
    render: (paymentStatus) => {
      return <Tag color={paymentColors[paymentStatus.id]}>{paymentStatus.name}</Tag>
    }
  },
  {
    title: 'Total',
    dataIndex: 'total_price_format',
    key: 'total_price_format'
  },
  {
    title: 'Delivery',
    dataIndex: 'delivery_status',
    key: 'delivery_status',
    render: () => 'N/A'
  },
  {
    title: 'Items',
    dataIndex: 'items',
    key: 'items',
    render: (items) => `${items.length} items`
  },
  {
    title: isMobile ? '' : 'Actions',
    key: 'actions',
    width: isMobile ? 56 : 150,
    align: 'center',
    fixed: 'right',
    render: (_, record) =>
      isMobile ? (
        <Dropdown
          menu={{
            items: [
              { key: 'view', icon: <EyeOutlined />, label: 'View' },
              { key: 'edit', icon: <EditOutlined />, label: 'Edit' },
              { key: 'delete', danger: true, icon: <DeleteOutlined />, label: 'Delete' }
            ],
            onClick: ({ key }) => {
              if (key === 'view') {
                actions.onView(record)
                return
              }

              if (key === 'edit') {
                actions.onEdit(record)
                return
              }

              actions.onDelete(record)
            }
          }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Button
            aria-label="Open order actions"
            color="default"
            icon={<MoreOutlined />}
            variant="filled"
          />
        </Dropdown>
      ) : (
        <Space>
          <Button
            aria-label="View order"
            onClick={() => actions.onView(record)}
            color="default"
            icon={<EyeOutlined />}
            variant="filled"
          />
          <Button
            aria-label="Edit order"
            onClick={() => actions.onEdit(record)}
            color="default"
            icon={<EditOutlined />}
            variant="filled"
          />
          <Button
            aria-label="Delete order"
            onClick={() => actions.onDelete(record)}
            color="default"
            icon={<DeleteOutlined />}
            danger
            variant="filled"
          />
        </Space>
      )
  }
]
