import { Button, Drawer, Flex, theme } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { DayPicker, type DateRange, type Matcher } from 'react-day-picker'

import type { AdaptiveRangePickerProps, AdaptiveRangeValue } from './index'

import 'react-day-picker/style.css'
import './style.css'

type MobileRangeDrawerProps = Pick<
  AdaptiveRangePickerProps,
  'disabledDate' | 'onChange' | 'value'
> & {
  readonly open: boolean
  readonly onClose: () => void
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

export function MobileRangeDrawer({
  disabledDate,
  onChange,
  onClose,
  open,
  value
}: MobileRangeDrawerProps) {
  const { token } = theme.useToken()
  const [draftRange, setDraftRange] = useState<DateRange | undefined>(() => toDateRange(value))

  useEffect(() => {
    if (!open) {
      setDraftRange(toDateRange(value))
    }
  }, [open, value])

  useEffect(() => {
    document.body.classList.toggle(BODY_DRAWER_OPEN_CLASS, open)

    return () => {
      document.body.classList.remove(BODY_DRAWER_OPEN_CLASS)
    }
  }, [open])

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

  const clearRange = () => {
    setDraftRange(undefined)
    onChange?.(null)
    onClose()
  }

  const closeDrawer = () => {
    setDraftRange(toDateRange(value))
    onClose()
  }

  const applyRange = () => {
    if (!isCompleteOrEmpty(draftRange)) {
      return
    }

    onChange?.(toDayjsRange(draftRange))
    onClose()
  }

  return (
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
          <Button
            block
            disabled={!isCompleteOrEmpty(draftRange)}
            onClick={applyRange}
            type="primary"
          >
            Done
          </Button>
        </Flex>
      }
      onClose={closeDrawer}
      open={open}
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
  )
}
