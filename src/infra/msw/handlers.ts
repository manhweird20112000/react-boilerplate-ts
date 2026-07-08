import { authHandlers } from '@/features/auth/msw/auth-handlers'
import { orderHandlers } from '@/features/orders/msw/order-handlers'

export const mswHandlers = [...authHandlers, ...orderHandlers]
