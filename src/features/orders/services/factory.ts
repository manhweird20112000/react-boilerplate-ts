import { HttpOrderRepositoryImpl } from './http-order.repository.impl'
import { MockOrderRepositoryImpl } from './mock-order.repository.impl'
import type { OrderRepository } from './repository'

class OrderRepositoryFactory {
  private static instance: OrderRepositoryFactory

  private constructor() {}

  public static getInstance(): OrderRepositoryFactory {
    if (!OrderRepositoryFactory.instance) {
      OrderRepositoryFactory.instance = new OrderRepositoryFactory()
    }
    return OrderRepositoryFactory.instance
  }

  public createRepository(): OrderRepository {
    const isMock = import.meta.env.VITE_USE_MOCK === 'true'
    const isMSW = import.meta.env.VITE_USE_MSW === 'true'

    // If using MSW, we want to use the HttpOrderRepository because MSW intercepts HTTP calls
    if (isMSW || !isMock) {
      return new HttpOrderRepositoryImpl()
    } else {
      return new MockOrderRepositoryImpl()
    }
  }
}

export const orderRepositoryFactory = OrderRepositoryFactory.getInstance()
export const orderRepo = orderRepositoryFactory.createRepository()
