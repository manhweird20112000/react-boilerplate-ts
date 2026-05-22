import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ORDER_QUERY_KEY } from '../constants/order-query-key'
import { orderRepo } from '../services/factory'
import type { CreateOrderDto } from '../types/create-order.dto.type'
import type { UpdateOrderDto } from '../types/update-order.dto.type'

export type UpdateOrderMutationPayload = {
  readonly id: number
  readonly dto: UpdateOrderDto
}

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreateOrderDto) => orderRepo.create(dto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY.all })
    }
  })
}

export const useUpdateOrderMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, dto }: UpdateOrderMutationPayload) => orderRepo.update(id, dto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY.all })
    }
  })
}

export const useDeleteOrderMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => orderRepo.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY.all })
    }
  })
}
