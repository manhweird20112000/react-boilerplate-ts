import { faker } from '@faker-js/faker'

import { orderCustomers, orderPaymentStatuses, orderProducts } from '../constants/order-options'
import type { CreateOrderDto } from '../types/create-order.dto.type'
import type { Order } from '../types/order.type'

const formatVnd = (value: number): string => `${new Intl.NumberFormat('en-US').format(value)} VND`

export const createOrder = (index = 0): Order => {
  const selectedProducts = faker.helpers.arrayElements(
    orderProducts,
    faker.number.int({ min: 1, max: 3 })
  )
  const items = selectedProducts.map((product, itemIndex) => {
    const quantity = faker.number.int({ min: 1, max: 4 })

    return {
      id: index * 10 + itemIndex + 1,
      product_id: product.id,
      product_variant_id: product.id,
      name: product.name,
      quantity,
      price: product.price,
      price_format: formatVnd(product.price)
    }
  })
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const customerIndex = index % orderCustomers.length

  return {
    id: 1001 + index,
    date: faker.date.recent({ days: 45 }).toISOString().slice(0, 10),
    customer: {
      id: orderCustomers[customerIndex].id,
      name: orderCustomers[customerIndex].name
    },
    payment_status: orderPaymentStatuses[index % orderPaymentStatuses.length],
    total_price: totalPrice,
    total_price_format: formatVnd(totalPrice),
    items
  }
}

export const createOrderFromDto = (id: number, dto: Partial<CreateOrderDto>): Order => {
  const items = (
    dto.items?.length ? dto.items : [{ product_id: 1, product_variant_id: 1, quantity: 1 }]
  ).map((item, index) => {
    const product = orderProducts.find((entry) => entry.id === item.product_id) ?? orderProducts[0]
    const quantity = item.quantity ?? 1

    return {
      id: id * 10 + index,
      product_id: product.id,
      product_variant_id: item.product_variant_id ?? product.id,
      name: product.name,
      quantity,
      price: product.price,
      price_format: formatVnd(product.price)
    }
  })
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const customerId = dto.customer_id ?? 1

  return {
    id,
    date: dto.date ?? new Date().toISOString().slice(0, 10),
    customer: {
      id: customerId,
      name:
        orderCustomers.find((customer) => customer.id === customerId)?.name ??
        orderCustomers[0].name
    },
    payment_status: orderPaymentStatuses[1],
    total_price: totalPrice,
    total_price_format: formatVnd(totalPrice),
    items
  }
}
