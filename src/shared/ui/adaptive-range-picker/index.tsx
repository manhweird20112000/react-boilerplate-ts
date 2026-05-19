import { DatePicker, Grid } from 'antd'
import type { Dayjs } from 'dayjs'
import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties } from 'react'

export type AdaptiveRangeValue = [Dayjs | null, Dayjs | null] | null

export type AdaptiveRangePickerProps = {
  readonly value?: AdaptiveRangeValue
  readonly onChange?: (value: AdaptiveRangeValue) => void
  readonly format?: string
  readonly placeholder?: [string, string]
  readonly allowClear?: boolean
  readonly disabledDate?: (date: Dayjs) => boolean
  readonly style?: CSSProperties
}

const MobileRangeDrawer = lazy(() =>
  import('./mobile-range-drawer').then((m) => ({ default: m.MobileRangeDrawer }))
)

export function AdaptiveRangePicker({
  value = null,
  onChange,
  format = 'YYYY-MM-DD',
  placeholder,
  allowClear = true,
  disabledDate,
  style
}: AdaptiveRangePickerProps) {
  const screens = Grid.useBreakpoint()
  const isMobile = screens.md === false
  const [drawerOpen, setDrawerOpen] = useState(false)
  const suppressFocusOpenRef = useRef(false)
  const focusTimerRef = useRef<number | undefined>(undefined)

  useEffect(
    () => () => {
      if (focusTimerRef.current) {
        window.clearTimeout(focusTimerRef.current)
      }
    },
    []
  )

  const openDrawer = () => {
    if (suppressFocusOpenRef.current) {
      return
    }

    setDrawerOpen(true)
  }

  const suppressFocusOpen = () => {
    suppressFocusOpenRef.current = true

    if (focusTimerRef.current) {
      window.clearTimeout(focusTimerRef.current)
    }

    focusTimerRef.current = window.setTimeout(() => {
      suppressFocusOpenRef.current = false
      focusTimerRef.current = undefined
    }, 200)
  }

  const closeDrawer = () => {
    suppressFocusOpen()
    setDrawerOpen(false)
  }

  if (!isMobile) {
    return (
      <DatePicker.RangePicker
        allowClear={allowClear}
        disabledDate={disabledDate}
        format={format}
        onChange={(dates) => onChange?.(dates)}
        placeholder={placeholder}
        style={{ width: '100%', ...style }}
        value={value}
      />
    )
  }

  return (
    <>
      <DatePicker.RangePicker
        allowClear={allowClear}
        disabledDate={disabledDate}
        format={format}
        inputReadOnly
        onChange={(dates) => onChange?.(dates)}
        onFocus={openDrawer}
        onOpenChange={(open) => {
          if (open) {
            openDrawer()
          }
        }}
        open={false}
        placeholder={placeholder}
        style={{ width: '100%', ...style }}
        value={value}
      />

      {drawerOpen ? (
        <Suspense fallback={null}>
          <MobileRangeDrawer
            disabledDate={disabledDate}
            onChange={onChange}
            onClose={closeDrawer}
            open={drawerOpen}
            value={value}
          />
        </Suspense>
      ) : null}
    </>
  )
}
