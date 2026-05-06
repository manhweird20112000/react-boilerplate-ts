import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type ColumnPinningState,
  type SortingState
} from '@tanstack/react-table'
import { memo, useMemo, useState, type CSSProperties, type ReactElement } from 'react'
import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/shared/components/ui/tooltip'

type DataTableProps<TData> = {
  readonly className?: string
  readonly columns: readonly ColumnDef<TData>[]
  readonly data: readonly TData[]
  readonly emptyText?: string
  readonly emptyComponent?: React.ReactNode
}

export { DataTableColumnHeader }

type DataTableColumnMeta = {
  readonly headerClassName?: string
  readonly cellClassName?: string
  readonly fixed?: 'left' | 'right'
}

type DataTableColumnHeaderProps<TData> = {
  readonly column: import('@tanstack/react-table').Column<TData>
  readonly title: string
}

function DataTableColumnHeader<TData>(props: DataTableColumnHeaderProps<TData>): ReactElement {
  const canSort: boolean = props.column.getCanSort()
  if (!canSort) {
    return <div className="whitespace-nowrap">{props.title}</div>
  }

  const sortState = props.column.getIsSorted()
  const icon =
    sortState === 'asc' ? (
      <ArrowUpIcon className="size-4" />
    ) : sortState === 'desc' ? (
      <ArrowDownIcon className="size-4" />
    ) : (
      <ArrowUpDownIcon className="size-4" />
    )

  const tooltipText: string =
    sortState === 'asc' ? 'Tăng dần' : sortState === 'desc' ? 'Giảm dần' : 'Sắp xếp'

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={<Button variant="ghost" size="sm" className="-ml-2 h-8 px-2" />}
          onClick={() => props.column.toggleSorting(sortState === 'asc')}
        >
          <span className="whitespace-nowrap">{props.title}</span>
          {icon}
        </TooltipTrigger>
        <TooltipContent>{tooltipText}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function getCommonPinningStyles<TData>(column: Column<TData>): CSSProperties {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left')
  const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right')

  const size = column.getSize()

  return {
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    width: size,
    minWidth: size,
    maxWidth: size,
    zIndex: isPinned ? (column.id === 'entity' || column.columnDef.header ? 50 : 30) : 0,
    backgroundColor: isPinned ? 'var(--background)' : undefined,
    boxShadow: isLastLeftPinnedColumn
      ? '4px 0 8px -4px rgba(0, 0, 0, 0.2), inset -1px 0 0 hsl(var(--border))'
      : isFirstRightPinnedColumn
        ? '-4px 0 8px -4px rgba(0, 0, 0, 0.2), inset 1px 0 0 hsl(var(--border))'
        : undefined
  }
}

function DataTableComponent<TData>(props: DataTableProps<TData>): ReactElement {
  const [sorting, setSorting] = useState<SortingState>([])

  const initialColumnPinning: ColumnPinningState = useMemo(() => {
    const left: string[] = []
    const right: string[] = []

    props.columns.forEach((col) => {
      const meta = col.meta as DataTableColumnMeta | undefined
      const id = col.id || (col as any).accessorKey
      if (id && meta?.fixed === 'left') {
        left.push(id)
      } else if (id && meta?.fixed === 'right') {
        right.push(id)
      }
    })

    return { left, right }
  }, [props.columns])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: props.data as TData[],
    columns: props.columns as ColumnDef<TData>[],
    state: { sorting, columnPinning: initialColumnPinning },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: true
  })

  const colSpan: number = useMemo(() => props.columns.length, [props.columns.length])

  return (
    <div className={cn('w-full overflow-x-auto bg-background', props.className)}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    (header.column.columnDef.meta as DataTableColumnMeta | undefined)
                      ?.headerClassName,
                    'sticky top-0 z-40 bg-[var(--background)]' // Solid background for sticky header
                  )}
                  style={getCommonPinningStyles(header.column)}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      (cell.column.columnDef.meta as DataTableColumnMeta | undefined)?.cellClassName
                    )}
                    style={getCommonPinningStyles(cell.column)}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={colSpan} className="h-24 text-center">
                {props.emptyComponent || (props.emptyText ?? 'No results.')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

const DataTable = memo(DataTableComponent) as <TData>(props: DataTableProps<TData>) => ReactElement

export default DataTable
