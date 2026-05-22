import type { Dayjs } from 'dayjs'

export type OrderListQuery = {
  readonly page: number
  readonly pageSize: number
  readonly dateRange: [Dayjs | null, Dayjs | null] | null
}

export const toOrderListParams = (query: OrderListQuery): Record<string, string | number> => {
  const [dateFrom, dateTo] = query.dateRange ?? []

  return {
    page: query.page,
    pageSize: query.pageSize,
    ...(dateFrom ? { date_from: dateFrom.format('YYYY-MM-DD') } : {}),
    ...(dateTo ? { date_to: dateTo.format('YYYY-MM-DD') } : {})
  }
}
