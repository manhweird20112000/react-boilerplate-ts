import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusOutlined,
  UploadOutlined
} from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  App as AntdApp,
  Button,
  Col,
  Dropdown,
  Grid,
  Space,
  Table,
  Tag,
  Typography,
  type TableProps
} from 'antd'
import type { Dayjs } from 'dayjs'
import { lazy, Suspense, useCallback, useMemo, useState, type Key } from 'react'

import { OrderDetailModal } from '../components/order-detail-modal'
import { OrderFormDrawer, type OrderFormMode } from '../components/order-form-drawer'
import { orderRepo } from '../services/factory'
import type { CreateOrderDto } from '../types/create-order.dto.type'
import type { Order } from '../types/order.type'
import { PageLayout } from '@/shared/layouts/page-layout'

const AdaptiveRangePicker = lazy(() =>
  import('@/shared/ui/adaptive-range-picker').then((m) => ({ default: m.AdaptiveRangePicker }))
)

type OrderTableActions = {
  readonly onView: (order: Order) => void
  readonly onEdit: (order: Order) => void
  readonly onDelete: (order: Order) => void
}

const paymentColors = ['success', 'warning', 'error'] as const

const createColumns = (
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
    render: (payment_status) => {
      return <Tag color={paymentColors[payment_status.id]}>{payment_status.name}</Tag>
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
  const { message, modal } = AntdApp.useApp()
  const queryClient = useQueryClient()
  const screens = Grid.useBreakpoint()
  const isMobile = screens.md === false
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null)
  const [appliedDateRange, setAppliedDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(
    null
  )
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20 })
  const [formMode, setFormMode] = useState<OrderFormMode>('create')
  const [formOpen, setFormOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [viewOrderId, setViewOrderId] = useState<number | null>(null)
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
  const orderDetailQuery = useQuery({
    queryKey: ['orders', 'detail', viewOrderId],
    queryFn: () => orderRepo.detail(viewOrderId!),
    enabled: viewOrderId !== null,
    select: (response) => response.data.data
  })
  const createOrderMutation = useMutation({
    mutationFn: (dto: CreateOrderDto) => orderRepo.create(dto),
    onSuccess: async () => {
      message.success('Order created')
      setFormOpen(false)
      setPagination((current) => ({ ...current, page: 1 }))
      await queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: () => {
      message.error('Could not create order')
    }
  })
  const updateOrderMutation = useMutation({
    mutationFn: ({ id, dto }: { readonly id: number; readonly dto: CreateOrderDto }) =>
      orderRepo.update(id, dto),
    onSuccess: async () => {
      message.success('Order updated')
      setFormOpen(false)
      setSelectedOrder(null)
      await queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: () => {
      message.error('Could not update order')
    }
  })
  const deleteOrderMutation = useMutation({
    mutationFn: (id: number) => orderRepo.delete(id),
    onSuccess: async () => {
      message.success('Order deleted')
      setSelectedRowKeys([])
      await queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: () => {
      message.error('Could not delete order')
    }
  })

  const openCreateDrawer = useCallback(() => {
    setFormMode('create')
    setSelectedOrder(null)
    setFormOpen(true)
  }, [])

  const openEditDrawer = useCallback((order: Order) => {
    setFormMode('edit')
    setSelectedOrder(order)
    setFormOpen(true)
  }, [])

  const handleDeleteOrder = useCallback(
    (order: Order) => {
      modal.confirm({
        title: `Delete order #${order.id}?`,
        content: 'This action cannot be undone.',
        okText: 'Delete',
        okButtonProps: { danger: true, loading: deleteOrderMutation.isPending },
        cancelText: 'Cancel',
        onOk: async () => {
          await deleteOrderMutation.mutateAsync(order.id)
        }
      })
    },
    [deleteOrderMutation, modal]
  )

  const columns = useMemo(
    () =>
      createColumns(isMobile, {
        onView: (order) => setViewOrderId(order.id),
        onEdit: openEditDrawer,
        onDelete: handleDeleteOrder
      }),
    [handleDeleteOrder, isMobile, openEditDrawer]
  )

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

  const handleSubmitOrder = async (dto: CreateOrderDto) => {
    if (formMode === 'edit' && selectedOrder) {
      await updateOrderMutation.mutateAsync({ id: selectedOrder.id, dto })
      return
    }

    await createOrderMutation.mutateAsync(dto)
  }

  const isFilterDirty = Boolean(dateRange?.[0] || dateRange?.[1])
  const orders = orderQuery.data?.data ?? []
  const meta = orderQuery.data
  const formLoading = createOrderMutation.isPending || updateOrderMutation.isPending

  return (
    <>
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
                  { key: 'refresh', label: 'Refresh' },
                  {
                    key: 'delete-selected',
                    danger: true,
                    disabled: selectedRowKeys.length === 0,
                    label: `Delete selected (${selectedRowKeys.length})`
                  }
                ],
                onClick: ({ key }) => {
                  if (key === 'refresh') {
                    void queryClient.invalidateQueries({ queryKey: ['orders'] })
                    return
                  }

                  if (key === 'delete-selected') {
                    modal.confirm({
                      title: `Delete ${selectedRowKeys.length} selected orders?`,
                      content: 'This action cannot be undone.',
                      okText: 'Delete',
                      okButtonProps: { danger: true },
                      cancelText: 'Cancel',
                      onOk: async () => {
                        await Promise.all(
                          selectedRowKeys.map((id) => deleteOrderMutation.mutateAsync(Number(id)))
                        )
                      }
                    })
                  }
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
            <Button
              block={isMobile}
              icon={<PlusOutlined />}
              onClick={openCreateDrawer}
              type="primary"
            >
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

      <OrderFormDrawer
        loading={formLoading}
        mode={formMode}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmitOrder}
        open={formOpen}
        order={selectedOrder}
      />
      <OrderDetailModal
        loading={orderDetailQuery.isFetching}
        onClose={() => setViewOrderId(null)}
        open={viewOrderId !== null}
        order={orderDetailQuery.data}
      />
    </>
  )
}
