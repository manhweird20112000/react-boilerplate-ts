import { faker } from '@faker-js/faker'

import type { CreateOrderDto } from '../types/create-order.dto.type'
import type { Order } from '../types/order.type'

const customers = [
  'Nguyen Van An',
  'Tran Thi Bich',
  'Le Minh Khoa',
  'Pham Hoang Nam',
  'Do Thuy Linh',
  'Hoang Minh Chau',
  'Vu Quang Huy',
  'Dang Thu Ha',
  'Bui Gia Bao',
  'Mai Anh Thu'
]

const products = [
  { id: 1, name: 'Wireless Keyboard', price: 790000 },
  { id: 2, name: 'USB-C Cable', price: 250000 },
  { id: 3, name: 'Bluetooth Speaker', price: 2190000 },
  { id: 4, name: '27-inch Monitor', price: 4590000 },
  { id: 5, name: 'Ergonomic Mouse', price: 650000 },
  { id: 6, name: 'Laptop Stand', price: 1500000 },
  { id: 7, name: 'Desk Lamp', price: 490000 },
  { id: 8, name: 'Webcam 2K', price: 1190000 },
  { id: 9, name: 'Noise Cancelling Headset', price: 2790000 },
  { id: 10, name: 'Portable SSD 1TB', price: 3290000 }
]

const paymentStatuses = [
  { id: 0, name: 'Paid' },
  { id: 1, name: 'Pending' },
  { id: 2, name: 'Failed' }
]

const formatVnd = (value: number): string => `${new Intl.NumberFormat('en-US').format(value)} VND`

export const createOrder = (index = 0): Order => {
  const selectedProducts = faker.helpers.arrayElements(
    products,
    faker.number.int({ min: 1, max: 3 })
  )
  const items = selectedProducts.map((product, itemIndex) => {
    const quantity = faker.number.int({ min: 1, max: 4 })

    return {
      id: index * 10 + itemIndex + 1,
      name: product.name,
      quantity,
      price: product.price,
      price_format: formatVnd(product.price)
    }
  })
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const customerIndex = index % customers.length

  return {
    id: 1001 + index,
    date: faker.date.recent({ days: 45 }).toISOString().slice(0, 10),
    customer: {
      id: customerIndex + 1,
      name: customers[customerIndex]
    },
    payment_status: paymentStatuses[index % paymentStatuses.length],
    total_price: totalPrice,
    total_price_format: formatVnd(totalPrice),
    items
  }
}

export const createOrderFromDto = (id: number, dto: Partial<CreateOrderDto>): Order => {
  const items = (dto.items?.length ? dto.items : [{ product_id: 1, quantity: 1 }]).map(
    (item, index) => {
      const product = products.find((entry) => entry.id === item.product_id) ?? products[0]
      const quantity = item.quantity ?? 1

      return {
        id: id * 10 + index,
        name: product.name,
        quantity,
        price: product.price,
        price_format: formatVnd(product.price)
      }
    }
  )
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const customerId = dto.customer_id ?? 1

  return {
    id,
    date: dto.date ?? new Date().toISOString().slice(0, 10),
    customer: {
      id: customerId,
      name: customers[(customerId - 1) % customers.length] ?? customers[0]
    },
    payment_status: paymentStatuses[1],
    total_price: totalPrice,
    total_price_format: formatVnd(totalPrice),
    items
  }
}
