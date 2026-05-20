import type { Future, PaginatedData } from '@/shared/types/common'
import type { CreateOrderDto } from '../types/create-order.dto.type'
import type { Order } from '../types/order.type'
import type { UpdateOrderDto } from '../types/update-order.dto.type'
import { OrderRepository } from './repository'
import { HttpService } from '@/infra/api/http-service'

export class MockOrderRepositoryImpl extends OrderRepository {
  private endpoint = '/orders'

  list(query?: Record<string, any>): Future<PaginatedData<Order>> {
    return HttpService.get(this.endpoint, query)
  }

  detail(id: number): Future<Order> {
    return HttpService.get(`${this.endpoint}/${id}`)
  }

  create(dto: Partial<CreateOrderDto>): Future<boolean> {
    return HttpService.post(this.endpoint, dto)
  }

  update(id: number, dto: Partial<UpdateOrderDto>): Future<boolean> {
    return HttpService.put(`${this.endpoint}/${id}`, dto)
  }

  delete(id: number): Future<boolean> {
    return HttpService.delete(`${this.endpoint}/${id}`)
  }
}
