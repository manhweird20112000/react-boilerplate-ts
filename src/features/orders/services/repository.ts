import type { Future, PaginatedData } from '@/shared/types/common'
import type { Order } from '../types/order.type'
import type { CreateOrderDto } from '../types/create-order.dto.type'
import type { UpdateOrderDto } from '../types/update-order.dto.type'

export abstract class OrderRepository<T = Order> {
  abstract list(query?: Record<string, any>): Future<PaginatedData<T>>
  abstract detail(id: number): Future<T>
  abstract create(dto: Partial<CreateOrderDto>): Future<boolean>
  abstract update(id: number, dto: Partial<UpdateOrderDto>): Future<boolean>
  abstract delete(id: number): Future<boolean>
}
