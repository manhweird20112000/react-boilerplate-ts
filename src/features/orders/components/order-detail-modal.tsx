import { Descriptions, Modal, Table, Tag, Typography, type TableProps } from 'antd'
import type { ReactElement } from 'react'

import type { Order } from '../types/order.type'

export type OrderDetailModalProps = {
  readonly open: boolean
  readonly order?: Order | null
  readonly loading?: boolean
  readonly onClose: () => void
}

const paymentColors = ['success', 'warning', 'error'] as const

const itemColumns: TableProps<Order['items'][number]>['columns'] = [
  {
    title: 'Product',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Qty',
    dataIndex: 'quantity',
    key: 'quantity',
    width: 80
  },
  {
    title: 'Price',
    dataIndex: 'price_format',
    key: 'price_format',
    width: 160
  }
]

export function OrderDetailModal({
  open,
  order,
  loading,
  onClose
}: OrderDetailModalProps): ReactElement {
  return (
    <Modal
      destroyOnHidden
      footer={null}
      loading={loading}
      onCancel={onClose}
      open={open}
      title={order ? `Order #${order.id}` : 'Order detail'}
      width={760}
    >
      {order ? (
        <>
          <Descriptions
            bordered
            column={{ xs: 1, md: 2 }}
            items={[
              { key: 'date', label: 'Date', children: order.date },
              { key: 'customer', label: 'Customer', children: order.customer.name },
              {
                key: 'payment',
                label: 'Payment',
                children: (
                  <Tag color={paymentColors[order.payment_status.id]}>
                    {order.payment_status.name}
                  </Tag>
                )
              },
              { key: 'total', label: 'Total', children: order.total_price_format }
            ]}
            size="small"
          />

          <Typography.Title level={5} style={{ marginTop: 24 }}>
            Items
          </Typography.Title>
          <Table
            columns={itemColumns}
            dataSource={[...order.items]}
            pagination={false}
            rowKey="id"
            size="small"
          />
        </>
      ) : null}
    </Modal>
  )
}
