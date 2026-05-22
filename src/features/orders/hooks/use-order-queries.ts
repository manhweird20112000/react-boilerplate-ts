import { useQuery } from '@tanstack/react-query'

import { ORDER_QUERY_KEY } from '../constants/order-query-key'
import { orderRepo } from '../services/factory'

export const useOrderListQuery = (params: Record<string, string | number>) =>
  useQuery({
    queryKey: ORDER_QUERY_KEY.list(params),
    queryFn: () => orderRepo.list(params),
    select: (response) => response.data.data
  })

export const useOrderDetailQuery = (orderId: number | null) =>
  useQuery({
    queryKey: ORDER_QUERY_KEY.detail(orderId),
    queryFn: () => orderRepo.detail(orderId!),
    enabled: orderId !== null,
    select: (response) => response.data.data
  })
