import { App as AntdApp, Grid, type TableProps } from 'antd'
import { useCallback, useMemo, type Key } from 'react'

import { OrderDetailModal } from '../components/order-detail-modal'
import { OrderFormDrawer } from '../components/order-form-drawer'
import { OrderListFilters } from '../components/order-list-filters'
import { OrderListTable } from '../components/order-list-table'
import { OrderListToolbar } from '../components/order-list-toolbar'
import { useOrderListPage } from '../hooks/use-order-list-page'
import type { CreateOrderDto } from '../types/create-order.dto.type'
import type { Order } from '../types/order.type'
import { createOrderTableColumns } from '../utils/order-table-columns'
import { PageLayout } from '@/shared/layouts/page-layout'

export const ListOrderPage = () => {
  const { actions, detail, filters, form, list, pagination, selection } = useOrderListPage()
  const { message, modal } = AntdApp.useApp()
  const screens = Grid.useBreakpoint()
  const isMobile = screens.md === false
  const { deleteOrder, deleteSelectedOrders, isDeleting, refresh } = actions
  const { onView } = detail
  const { mode, onCreate, onEdit, onSubmit } = form
  const { onChange: onSelectionChange, selectedCount, selectedOrderIds } = selection

  const handleSubmitOrder = useCallback(
    async (dto: CreateOrderDto) => {
      try {
        const result = await onSubmit(dto)
        message.success(result === 'created' ? 'Order created' : 'Order updated')
      } catch {
        message.error(mode === 'edit' ? 'Could not update order' : 'Could not create order')
      }
    },
    [message, mode, onSubmit]
  )

  const handleDeleteOrder = useCallback(
    (order: Order) => {
      modal.confirm({
        title: `Delete order #${order.id}?`,
        content: 'This action cannot be undone.',
        okText: 'Delete',
        okButtonProps: { danger: true, loading: isDeleting },
        cancelText: 'Cancel',
        onOk: async () => {
          try {
            await deleteOrder(order.id)
            message.success('Order deleted')
          } catch {
            message.error('Could not delete order')
          }
        }
      })
    },
    [deleteOrder, isDeleting, message, modal]
  )

  const handleDeleteSelected = useCallback(() => {
    modal.confirm({
      title: `Delete ${selectedCount} selected orders?`,
      content: 'This action cannot be undone.',
      okText: 'Delete',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: async () => {
        const result = await deleteSelectedOrders()

        if (result.failedCount > 0) {
          message.error(`Deleted ${result.deletedCount}, failed ${result.failedCount}`)
          return
        }

        message.success(`Deleted ${result.deletedCount} orders`)
      }
    })
  }, [deleteSelectedOrders, message, modal, selectedCount])

  const handleRefresh = useCallback(() => {
    void refresh()
  }, [refresh])

  const columns = useMemo(
    () =>
      createOrderTableColumns(isMobile, {
        onView,
        onEdit,
        onDelete: handleDeleteOrder
      }),
    [handleDeleteOrder, isMobile, onEdit, onView]
  )

  const rowSelection = useMemo<TableProps<Order>['rowSelection']>(
    () => ({
      selectedRowKeys: selectedOrderIds,
      onChange: (selectedRowKeys: Key[]) => {
        onSelectionChange(selectedRowKeys.map(Number))
      }
    }),
    [onSelectionChange, selectedOrderIds]
  )

  return (
    <>
      <PageLayout
        heading={'Orders'}
        actions={
          <OrderListToolbar
            isMobile={isMobile}
            selectedCount={selectedCount}
            onCreate={onCreate}
            onRefresh={handleRefresh}
            onDeleteSelected={handleDeleteSelected}
          />
        }
        filters={
          <OrderListFilters
            dateRange={filters.draftDateRange}
            onDateRangeChange={filters.onDraftDateRangeChange}
          />
        }
        isFilterDirty={filters.isDirty}
        onResetFilters={filters.onReset}
        onSearch={filters.onSearch}
        content={
          <OrderListTable
            columns={columns}
            orders={list.orders}
            loading={list.loading}
            rowSelection={rowSelection}
          />
        }
        pagination={pagination}
      />

      <OrderFormDrawer
        loading={form.loading}
        mode={form.mode}
        onClose={form.onClose}
        onSubmit={handleSubmitOrder}
        open={form.open}
        order={form.order}
      />
      <OrderDetailModal
        loading={detail.loading}
        onClose={detail.onClose}
        open={detail.open}
        order={detail.order}
      />
    </>
  )
}
