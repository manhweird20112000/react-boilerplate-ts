export interface Order {
  id: number
  date: string
  customer: {
    id: number
    name: string
  }
  payment_status: {
    id: number
    name: string
  }
  total_price: number
  total_price_format: string
  items: {
    id: number
    name: string
    quantity: number
    price: number
    price_format: string
  }[]
}