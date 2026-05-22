export const ORDER_QUERY_KEY = {
  all: ['orders'] as const,
  list: (params: Record<string, string | number>) => ['orders', 'list', params] as const,
  detail: (id: number | null) => ['orders', 'detail', id] as const
}
