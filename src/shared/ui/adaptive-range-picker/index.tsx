import { DatePicker, Drawer, Button, Flex, Grid, theme } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { DayPicker, type DateRange, type Matcher } from 'react-day-picker'
import 'react-day-picker/style.css'
import './style.css'

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

const BODY_DRAWER_OPEN_CLASS = 'adaptive-range-picker-drawer-open'

function toDateRange(value?: AdaptiveRangeValue): DateRange | undefined {
  if (!value?.[0] && !value?.[1]) {
    return undefined
  }

  return {
    from: value?.[0]?.toDate(),
    to: value?.[1]?.toDate()
  }
}

function toDayjsRange(value?: DateRange): AdaptiveRangeValue {
  if (!value?.from && !value?.to) {
    return null
  }

  return [value.from ? dayjs(value.from) : null, value.to ? dayjs(value.to) : null]
}

function isCompleteOrEmpty(value?: DateRange): boolean {
  return !value?.from || Boolean(value.to)
}

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
  const { token } = theme.useToken()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [draftRange, setDraftRange] = useState<DateRange | undefined>(() => toDateRange(value))
  const suppressFocusOpenRef = useRef(false)
  const focusTimerRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!drawerOpen) {
      setDraftRange(toDateRange(value))
    }
  }, [drawerOpen, value])

  useEffect(() => {
    document.body.classList.toggle(BODY_DRAWER_OPEN_CLASS, drawerOpen)

    return () => {
      document.body.classList.remove(BODY_DRAWER_OPEN_CLASS)
    }
  }, [drawerOpen])

  useEffect(
    () => () => {
      if (focusTimerRef.current) {
        window.clearTimeout(focusTimerRef.current)
      }
    },
    []
  )

  const dayPickerStyle = useMemo(
    () =>
      ({
        '--adaptive-range-picker-primary': token.colorPrimary,
        '--adaptive-range-picker-primary-bg': token.colorPrimaryBg,
        '--adaptive-range-picker-hover-bg': token.colorFillTertiary,
        '--adaptive-range-picker-panel-bg': token.colorBgContainer,
        '--adaptive-range-picker-border': token.colorBorderSecondary,
        '--adaptive-range-picker-text': token.colorText,
        '--adaptive-range-picker-muted': token.colorTextSecondary,
        '--adaptive-range-picker-selected-text': token.colorTextLightSolid,
        '--adaptive-range-picker-radius': `${token.borderRadius}px`,
        '--adaptive-range-picker-font-family': token.fontFamily
      }) as CSSProperties,
    [token]
  )

  const disabledMatcher = useMemo<Matcher | undefined>(() => {
    if (!disabledDate) {
      return undefined
    }

    return (date: Date) => disabledDate(dayjs(date))
  }, [disabledDate])

  const openDrawer = () => {
    if (suppressFocusOpenRef.current) {
      return
    }

    setDraftRange(toDateRange(value))
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
    setDraftRange(toDateRange(value))
    setDrawerOpen(false)
  }

  const clearRange = () => {
    suppressFocusOpen()
    setDraftRange(undefined)
    onChange?.(null)
    setDrawerOpen(false)
  }

  const applyRange = () => {
    if (!isCompleteOrEmpty(draftRange)) {
      return
    }

    suppressFocusOpen()
    onChange?.(toDayjsRange(draftRange))
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

      <Drawer
        className="adaptive-range-picker-drawer"
        footer={
          <Flex gap={8}>
            <Button block color="default" onClick={clearRange} variant="filled">
              Clear
            </Button>
            <Button block onClick={closeDrawer}>
              Cancel
            </Button>
            <Button block disabled={!isCompleteOrEmpty(draftRange)} onClick={applyRange} type="primary">
              Done
            </Button>
          </Flex>
        }
        onClose={closeDrawer}
        open={drawerOpen}
        placement="bottom"
        size="min(82dvh, 640px)"
        styles={{
          body: { padding: 16 },
          footer: { padding: 16 }
        }}
        title="Select date range"
        zIndex={1300}
      >
        <div className="adaptive-range-picker-mobile-panel" style={dayPickerStyle}>
          <DayPicker
            className="adaptive-range-picker-day-picker"
            disabled={disabledMatcher}
            mode="range"
            onSelect={setDraftRange}
            resetOnSelect
            selected={draftRange}
          />
        </div>
      </Drawer>
    </>
  )
}
