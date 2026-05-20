import type { CreateOrderDto } from '../types/create-order.dto.type'
import type { Order } from '../types/order.type'
import { createOrder, createOrderFromDto } from './order-factory'

export const orderDb = {
  orders: Array.from({ length: 67 }, (_, index) => createOrder(index))
}

export const addOrder = (dto: Partial<CreateOrderDto>): Order => {
  const nextId = Math.max(1000, ...orderDb.orders.map((order) => order.id)) + 1
  const order = createOrderFromDto(nextId, dto)
  orderDb.orders.unshift(order)
  return order
}

export const updateOrder = (id: number, dto: Partial<CreateOrderDto>): Order | null => {
  const index = orderDb.orders.findIndex((order) => order.id === id)
  if (index === -1) {
    return null
  }

  const updated = createOrderFromDto(id, {
    date: dto.date ?? orderDb.orders[index].date,
    customer_id: dto.customer_id ?? orderDb.orders[index].customer.id,
    items:
      dto.items ??
      orderDb.orders[index].items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        product_variant_id: item.product_variant_id
      }))
  })
  orderDb.orders[index] = updated
  return updated
}

export const deleteOrder = (id: number): boolean => {
  const index = orderDb.orders.findIndex((order) => order.id === id)
  if (index === -1) {
    return false
  }
  orderDb.orders.splice(index, 1)
  return true
}
