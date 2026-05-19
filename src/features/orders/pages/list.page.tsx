import {
  DeleteOutlined,
  DownOutlined,
  EyeOutlined,
  MoreOutlined,
  UploadOutlined
} from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Button, Col, Dropdown, Grid, Space, Table, Tag, Typography, type TableProps } from 'antd'
import type { Dayjs } from 'dayjs'
import { lazy, Suspense, useMemo, useState, type Key } from 'react'

import { orderRepo } from '../services/factory'
import type { Order } from '../types/order.type'
import { PageLayout } from '@/shared/layouts/page-layout'

const AdaptiveRangePicker = lazy(() =>
  import('@/shared/ui/adaptive-range-picker').then((m) => ({ default: m.AdaptiveRangePicker }))
)

const createColumns = (isMobile: boolean): TableProps<Order>['columns'] => [
  {
    title: 'Order',
    dataIndex: 'id',
    key: 'id',
    render: (text) => (
      <Typography.Link color="primary" href={`/order/${text}`}>
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
    render: (payment_status) => {
      const colors = ['success', 'warning', 'error'] as const
      return <Tag color={colors[payment_status.id]}>{payment_status.name}</Tag>
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
    width: isMobile ? 56 : 120,
    align: 'center',
    fixed: 'right',
    render: (_, record) =>
      isMobile ? (
        <Dropdown
          menu={{
            items: [
              { key: 'view', icon: <EyeOutlined />, label: 'View' },
              { key: 'delete', danger: true, icon: <DeleteOutlined />, label: 'Delete' }
            ],
            onClick: ({ key }) => {
              console.log(key, record)
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
            onClick={() => console.log(record)}
            color="default"
            icon={<EyeOutlined />}
            variant="filled"
          />
          <Button
            aria-label="Delete order"
            onClick={() => console.log(record)}
            color="default"
            icon={<DeleteOutlined />}
            danger
            variant="filled"
          />
        </Space>
      )
  }
]

type OrderListQuery = {
  readonly page: number
  readonly pageSize: number
  readonly dateRange: [Dayjs | null, Dayjs | null] | null
}

const toOrderListParams = (query: OrderListQuery): Record<string, string | number> => {
  const [dateFrom, dateTo] = query.dateRange ?? []

  return {
    page: query.page,
    pageSize: query.pageSize,
    ...(dateFrom ? { date_from: dateFrom.format('YYYY-MM-DD') } : {}),
    ...(dateTo ? { date_to: dateTo.format('YYYY-MM-DD') } : {})
  }
}

export const ListOrderPage = () => {
  const screens = Grid.useBreakpoint()
  const isMobile = screens.md === false
  const columns = useMemo(() => createColumns(isMobile), [isMobile])
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null)
  const [appliedDateRange, setAppliedDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(
    null
  )
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20 })
  const orderParams = useMemo(
    () =>
      toOrderListParams({
        page: pagination.page,
        pageSize: pagination.pageSize,
        dateRange: appliedDateRange
      }),
    [appliedDateRange, pagination.page, pagination.pageSize]
  )
  const orderQuery = useQuery({
    queryKey: ['orders', orderParams],
    queryFn: () => orderRepo.list(orderParams),
    select: (response) => response.data.data
  })

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys)
    }
  }

  const handleSearch = () => {
    setPagination((current) => ({ ...current, page: 1 }))
    setAppliedDateRange(dateRange)
  }

  const handleResetFilters = () => {
    setDateRange(null)
    setAppliedDateRange(null)
    setPagination((current) => ({ ...current, page: 1 }))
  }

  const isFilterDirty = Boolean(dateRange?.[0] || dateRange?.[1])
  const orders = orderQuery.data?.data ?? []
  const meta = orderQuery.data

  return (
    <PageLayout
      heading={'Orders'}
      actions={
        <>
          <Button block={isMobile} variant="filled" color="default" icon={<UploadOutlined />}>
            Export
          </Button>
          <Dropdown
            menu={{
              items: [
                { key: '1', label: 'Action 1' },
                { key: '2', label: 'Action 2' },
                { key: '3', label: 'Action 3' }
              ],
              onClick: ({ key }) => {
                console.log(`Clicked on action ${key}`)
              }
            }}
          >
            <Button
              block={isMobile}
              icon={<DownOutlined />}
              iconPlacement="end"
              variant="filled"
              color="default"
            >
              More actions
            </Button>
          </Dropdown>
          <Button block={isMobile} type="primary">
            Create order
          </Button>
        </>
      }
      filters={
        <>
          <Col xs={24} md={6} lg={5}>
            <Suspense fallback={<div style={{ height: 32 }} />}>
              <AdaptiveRangePicker
                format="YYYY-MM-DD"
                onChange={setDateRange}
                style={{ width: '100%' }}
                value={dateRange}
              />
            </Suspense>
          </Col>
        </>
      }
      isFilterDirty={isFilterDirty}
      onResetFilters={handleResetFilters}
      onSearch={handleSearch}
      content={
        <Table
          rowKey="id"
          rowSelection={rowSelection}
          style={{ width: '100%' }}
          columns={columns}
          dataSource={[...orders]}
          loading={orderQuery.isFetching}
          pagination={false}
          scroll={{ x: 1200 }}
        />
      }
      pagination={{
        pageSize: meta?.per_page ?? pagination.pageSize,
        total: meta?.total ?? 0,
        current: meta?.current_page ?? pagination.page,
        onChange: (page, pageSize) => {
          setPagination({ page, pageSize: pageSize ?? pagination.pageSize })
        }
      }}
    />
  )
}
