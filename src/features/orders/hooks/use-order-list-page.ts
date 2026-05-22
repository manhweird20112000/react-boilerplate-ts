import { useQueryClient } from '@tanstack/react-query'
import type { Dayjs } from 'dayjs'
import { useCallback, useMemo, useState } from 'react'

import { ORDER_QUERY_KEY } from '../constants/order-query-key'
import type { CreateOrderDto } from '../types/create-order.dto.type'
import type { OrderFormMode } from '../types/order-form-mode.type'
import type { Order } from '../types/order.type'
import { toOrderListParams } from '../utils/order-list-params'
import {
  useCreateOrderMutation,
  useDeleteOrderMutation,
  useUpdateOrderMutation
} from './use-order-mutations'
import { useOrderDetailQuery, useOrderListQuery } from './use-order-queries'

export const useOrderListPage = () => {
  const queryClient = useQueryClient()
  const [draftDateRange, setDraftDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null)
  const [appliedDateRange, setAppliedDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(
    null
  )
  const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([])
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
  const orderQuery = useOrderListQuery(orderParams)
  const orderDetailQuery = useOrderDetailQuery(viewOrderId)
  const createOrderMutation = useCreateOrderMutation()
  const updateOrderMutation = useUpdateOrderMutation()
  const deleteOrderMutation = useDeleteOrderMutation()
  const { mutateAsync: createOrderAsync, isPending: isCreatingOrder } = createOrderMutation
  const { mutateAsync: updateOrderAsync, isPending: isUpdatingOrder } = updateOrderMutation
  const { mutateAsync: deleteOrderAsync, isPending: isDeletingOrder } = deleteOrderMutation

  const openCreateForm = useCallback(() => {
    setFormMode('create')
    setSelectedOrder(null)
    setFormOpen(true)
  }, [])

  const openEditForm = useCallback((order: Order) => {
    setFormMode('edit')
    setSelectedOrder(order)
    setFormOpen(true)
  }, [])

  const closeForm = useCallback(() => {
    setFormOpen(false)
  }, [])

  const viewOrder = useCallback((order: Order) => {
    setViewOrderId(order.id)
  }, [])

  const closeDetail = useCallback(() => {
    setViewOrderId(null)
  }, [])

  const refreshOrders = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY.all }),
    [queryClient]
  )

  const applyFilters = useCallback(() => {
    setPagination((current) => ({ ...current, page: 1 }))
    setAppliedDateRange(draftDateRange)
  }, [draftDateRange])

  const resetFilters = useCallback(() => {
    setDraftDateRange(null)
    setAppliedDateRange(null)
    setPagination((current) => ({ ...current, page: 1 }))
  }, [])

  const changePage = useCallback((page: number, pageSize?: number) => {
    setPagination((current) => ({ page, pageSize: pageSize ?? current.pageSize }))
  }, [])

  const submitOrder = useCallback(
    async (dto: CreateOrderDto) => {
      if (formMode === 'edit' && selectedOrder) {
        await updateOrderAsync({ id: selectedOrder.id, dto })
        setFormOpen(false)
        setSelectedOrder(null)
        return 'updated' as const
      }

      await createOrderAsync(dto)
      setFormOpen(false)
      setPagination((current) => ({ ...current, page: 1 }))
      return 'created' as const
    },
    [createOrderAsync, formMode, selectedOrder, updateOrderAsync]
  )

  const deleteOrder = useCallback(
    async (orderId: number) => {
      await deleteOrderAsync(orderId)
      setSelectedOrderIds([])
    },
    [deleteOrderAsync]
  )

  const deleteSelectedOrders = useCallback(async () => {
    const results = await Promise.allSettled(selectedOrderIds.map((id) => deleteOrderAsync(id)))
    const failedCount = results.filter((result) => result.status === 'rejected').length
    const deletedCount = results.length - failedCount

    if (deletedCount > 0) {
      setSelectedOrderIds([])
    }

    return { deletedCount, failedCount }
  }, [deleteOrderAsync, selectedOrderIds])

  const updateSelectedOrderIds = useCallback((orderIds: readonly number[]) => {
    setSelectedOrderIds([...orderIds])
  }, [])

  const clearSelectedOrderIds = useCallback(() => {
    setSelectedOrderIds([])
  }, [])

  const listMeta = orderQuery.data
  const orders = listMeta?.data ?? []
  const isFormSubmitting = isCreatingOrder || isUpdatingOrder
  const isFilterDirty = Boolean(draftDateRange?.[0] || draftDateRange?.[1])

  const paginationState = useMemo(
    () => ({
      current: listMeta?.current_page ?? pagination.page,
      pageSize: listMeta?.per_page ?? pagination.pageSize,
      total: listMeta?.total ?? 0,
      onChange: changePage
    }),
    [changePage, listMeta?.current_page, listMeta?.per_page, listMeta?.total, pagination]
  )

  return {
    filters: {
      draftDateRange,
      isDirty: isFilterDirty,
      onDraftDateRangeChange: setDraftDateRange,
      onReset: resetFilters,
      onSearch: applyFilters
    },
    pagination: paginationState,
    selection: {
      selectedOrderIds,
      selectedCount: selectedOrderIds.length,
      onChange: updateSelectedOrderIds,
      onClear: clearSelectedOrderIds
    },
    list: {
      orders,
      loading: orderQuery.isFetching
    },
    form: {
      loading: isFormSubmitting,
      mode: formMode,
      open: formOpen,
      order: selectedOrder,
      onClose: closeForm,
      onCreate: openCreateForm,
      onEdit: openEditForm,
      onSubmit: submitOrder
    },
    detail: {
      loading: orderDetailQuery.isFetching,
      open: viewOrderId !== null,
      order: orderDetailQuery.data,
      onClose: closeDetail,
      onView: viewOrder
    },
    actions: {
      deleteOrder,
      deleteSelectedOrders,
      isDeleting: isDeletingOrder,
      refresh: refreshOrders
    }
  }
}
