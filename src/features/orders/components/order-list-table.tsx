import { Table, type TableProps } from 'antd'
import type { ReactElement } from 'react'

import type { Order } from '../types/order.type'

export type OrderListTableProps = {
  readonly columns: TableProps<Order>['columns']
  readonly orders: readonly Order[]
  readonly loading: boolean
  readonly rowSelection: TableProps<Order>['rowSelection']
}

export function OrderListTable({
  columns,
  orders,
  loading,
  rowSelection
}: OrderListTableProps): ReactElement {
  return (
    <Table
      rowKey="id"
      rowSelection={rowSelection}
      style={{ width: '100%' }}
      columns={columns}
      dataSource={[...orders]}
      loading={loading}
      pagination={false}
      scroll={{ x: 1200 }}
    />
  )
}
