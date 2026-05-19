import { http, HttpResponse } from 'msw'

import type { CreateOrderDto } from '../types/create-order.dto.type'
import type { Order } from '../types/order.type'
import type { UpdateOrderDto } from '../types/update-order.dto.type'
import { addOrder, deleteOrder, orderDb, updateOrder } from './order-db'

const ordersPath = (suffix = ''): RegExp => new RegExp(`/(?:api/)?orders${suffix}(?:[?#].*)?$`)

const getNumberParam = (params: URLSearchParams, keys: string[], fallback: number): number => {
  const value = keys.map((key) => params.get(key)).find(Boolean)
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

const ok = <T>(message: string, data: T) =>
  HttpResponse.json({
    success: true,
    message,
    data
  })

const notFound = (message: string) =>
  HttpResponse.json(
    {
      success: false,
      message,
      data: null
    },
    { status: 404 }
  )

const filterOrders = (orders: readonly Order[], params: URLSearchParams): readonly Order[] => {
  const search = params.get('search')?.trim().toLowerCase()
  const customer = params.get('customer')?.trim().toLowerCase()
  const paymentStatus = params.get('payment_status') ?? params.get('paymentStatus')
  const dateFrom = params.get('date_from') ?? params.get('start_date') ?? params.get('from')
  const dateTo = params.get('date_to') ?? params.get('end_date') ?? params.get('to')

  return orders.filter((order) => {
    const matchesSearch =
      !search ||
      String(order.id).includes(search) ||
      order.customer.name.toLowerCase().includes(search) ||
      order.items.some((item) => item.name.toLowerCase().includes(search))
    const matchesCustomer = !customer || order.customer.name.toLowerCase().includes(customer)
    const matchesPaymentStatus =
      !paymentStatus ||
      String(order.payment_status.id) === paymentStatus ||
      order.payment_status.name.toLowerCase() === paymentStatus.toLowerCase()
    const matchesDateFrom = !dateFrom || order.date >= dateFrom
    const matchesDateTo = !dateTo || order.date <= dateTo

    return (
      matchesSearch && matchesCustomer && matchesPaymentStatus && matchesDateFrom && matchesDateTo
    )
  })
}

export const orderHandlers = [
  http.get(ordersPath(), ({ request }) => {
    const url = new URL(request.url)
    const page = getNumberParam(url.searchParams, ['page', 'current_page'], 1)
    const perPage = getNumberParam(url.searchParams, ['pageSize', 'per_page', 'limit'], 20)
    const filteredOrders = [...filterOrders(orderDb.orders, url.searchParams)].sort((a, b) =>
      b.date.localeCompare(a.date)
    )
    const start = (page - 1) * perPage
    const data = filteredOrders.slice(start, start + perPage)

    return ok('Orders fetched', {
      data,
      current_page: page,
      total_page: Math.max(1, Math.ceil(filteredOrders.length / perPage)),
      per_page: perPage,
      total: filteredOrders.length
    })
  }),

  http.get(ordersPath('/(\\d+)'), ({ params }) => {
    const id = Number(params[0])
    const order = orderDb.orders.find((entry) => entry.id === id)

    return order ? ok('Order fetched', order) : notFound('Order not found')
  }),

  http.post(ordersPath(), async ({ request }) => {
    addOrder((await request.json()) as Partial<CreateOrderDto>)

    return ok('Order created', true)
  }),

  http.put(ordersPath('/(\\d+)'), async ({ params, request }) => {
    const id = Number(params[0])
    const order = updateOrder(id, (await request.json()) as Partial<UpdateOrderDto>)

    return order ? ok('Order updated', true) : notFound('Order not found')
  }),

  http.delete(ordersPath('/(\\d+)'), ({ params }) => {
    const id = Number(params[0])

    return deleteOrder(id) ? ok('Order deleted', true) : notFound('Order not found')
  })
]
