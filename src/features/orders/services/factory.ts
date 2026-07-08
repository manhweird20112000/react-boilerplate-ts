import { HttpOrderRepositoryImpl } from './http-order.repository.impl'
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
    return new HttpOrderRepositoryImpl()
  }
}

export const orderRepositoryFactory = OrderRepositoryFactory.getInstance()
export const orderRepo = orderRepositoryFactory.createRepository()
