import { authHandlers } from '@/mocks/handlers/auth'
import { orderHandlers } from '@/features/orders/msw/order-handlers'

export const mswHandlers = [...authHandlers, ...orderHandlers]
