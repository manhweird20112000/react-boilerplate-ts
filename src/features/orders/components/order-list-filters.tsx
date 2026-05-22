import { Col } from 'antd'
import type { Dayjs } from 'dayjs'
import { lazy, Suspense, type ReactElement } from 'react'

const AdaptiveRangePicker = lazy(() =>
  import('@/shared/ui/adaptive-range-picker').then((m) => ({ default: m.AdaptiveRangePicker }))
)

export type OrderListFiltersProps = {
  readonly dateRange: [Dayjs | null, Dayjs | null] | null
  readonly onDateRangeChange: (dateRange: [Dayjs | null, Dayjs | null] | null) => void
}

export function OrderListFilters({
  dateRange,
  onDateRangeChange
}: OrderListFiltersProps): ReactElement {
  return (
    <Col xs={24} md={6} lg={5}>
      <Suspense fallback={<div style={{ height: 32 }} />}>
        <AdaptiveRangePicker
          format="YYYY-MM-DD"
          onChange={onDateRangeChange}
          style={{ width: '100%' }}
          value={dateRange}
        />
      </Suspense>
    </Col>
  )
}
