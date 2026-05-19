export interface CreateOrderDto {
  date: string
  customer_id: number
  items: { product_id: number; quantity: number; product_variant_id: number }[]
}
