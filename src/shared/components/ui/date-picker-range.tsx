import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { type DateRange } from 'react-day-picker'

import { cn } from '@/shared/lib/utils'
import { Button } from './button'
import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

interface Props {
  value?: DateRange
  onChange?: (value: DateRange | undefined) => void
  formatPattern?: string
  placeholder?: string
  className?: string
}

export function DatePickerWithRange({
  value,
  onChange,
  formatPattern = 'dd-MM-yyyy',
  placeholder = 'Pick a date',
  className
}: Props) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger>
          <Button
            id="date-picker-range"
            variant="outline"
            className={cn(
              'h-8 justify-start px-2.5 font-normal w-full',
              !value?.from && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="size-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, formatPattern)} - {format(value.to, formatPattern)}
                </>
              ) : (
                format(value.from, formatPattern)
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
