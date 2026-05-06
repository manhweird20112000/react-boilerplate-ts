import { useEffect, useMemo, useState, type MouseEvent, type ReactElement } from 'react'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/shared/components/ui/pagination'
import { Input } from '@/shared/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select'
import { cn } from '@/shared/lib/utils'

const DEFAULT_SIBLING_COUNT: number = 1
const FIRST_PAGE: number = 1

type PaginationItemType =
  | { readonly kind: 'page'; readonly page: number }
  | { readonly kind: 'ellipsis'; readonly key: 'start' | 'end' }

type PaginationBarProps = {
  readonly totalItems: number
  readonly currentPage: number
  readonly totalPages: number
  readonly pageSize: number
  readonly pageSizeOptions: readonly number[]
  readonly onPageChange?: (page: number) => void
  readonly onPageSizeChange?: (pageSize: number) => void
  readonly createPageHref?: (page: number) => string
  readonly siblingCount?: number
  readonly className?: string
  readonly isJumpToPageVisible?: boolean
}

function getClampedPage(page: number, totalPages: number): number {
  if (totalPages <= 0) {
    return FIRST_PAGE
  }
  if (page < FIRST_PAGE) {
    return FIRST_PAGE
  }
  if (page > totalPages) {
    return totalPages
  }
  return page
}

function getInclusiveRange(start: number, end: number): readonly number[] {
  if (end < start) {
    return []
  }
  const result: number[] = []
  for (let i: number = start; i <= end; i += 1) {
    result.push(i)
  }
  return result
}

function getPaginationItems(params: {
  readonly currentPage: number
  readonly totalPages: number
  readonly siblingCount: number
}): readonly PaginationItemType[] {
  const { currentPage, totalPages, siblingCount } = params
  if (totalPages <= 0) {
    return []
  }
  if (totalPages <= 7 + siblingCount * 2) {
    return getInclusiveRange(FIRST_PAGE, totalPages).map((page: number) => ({
      kind: 'page',
      page
    }))
  }
  const leftSiblingIndex: number = Math.max(currentPage - siblingCount, FIRST_PAGE)
  const rightSiblingIndex: number = Math.min(currentPage + siblingCount, totalPages)
  const shouldShowStartEllipsis: boolean = leftSiblingIndex > FIRST_PAGE + 2
  const shouldShowEndEllipsis: boolean = rightSiblingIndex < totalPages - 2
  const items: PaginationItemType[] = []
  items.push({ kind: 'page', page: FIRST_PAGE })
  if (shouldShowStartEllipsis) {
    items.push({ kind: 'ellipsis', key: 'start' })
  } else {
    getInclusiveRange(FIRST_PAGE + 1, leftSiblingIndex - 1).forEach((page: number) => {
      items.push({ kind: 'page', page })
    })
  }
  getInclusiveRange(leftSiblingIndex, rightSiblingIndex).forEach((page: number) => {
    if (page === FIRST_PAGE || page === totalPages) {
      return
    }
    items.push({ kind: 'page', page })
  })
  if (shouldShowEndEllipsis) {
    items.push({ kind: 'ellipsis', key: 'end' })
  } else {
    getInclusiveRange(rightSiblingIndex + 1, totalPages - 1).forEach((page: number) => {
      items.push({ kind: 'page', page })
    })
  }
  items.push({ kind: 'page', page: totalPages })
  return items
}

function getPageHref(params: {
  readonly page: number
  readonly createPageHref?: (page: number) => string
}): string {
  const { page, createPageHref } = params
  if (createPageHref) {
    return createPageHref(page)
  }
  return '#'
}

function executePageChange(params: {
  readonly event: MouseEvent<HTMLAnchorElement>
  readonly page: number
  readonly onPageChange?: (page: number) => void
}): void {
  const { event, page, onPageChange } = params
  if (!onPageChange) {
    return
  }
  event.preventDefault()
  onPageChange(page)
}

function executePageSizeChange(params: {
  readonly nextValue: string | null
  readonly onPageChange?: (page: number) => void
  readonly onPageSizeChange?: (pageSize: number) => void
}): void {
  if (params.nextValue === null) {
    return
  }
  const parsed: number = Number.parseInt(params.nextValue, 10)
  if (Number.isNaN(parsed)) {
    return
  }
  params.onPageSizeChange?.(parsed)
  params.onPageChange?.(FIRST_PAGE)
}

/**
 * Pagination bar for table-like lists.
 * Renders total count, page-size selector, page navigation, and jump-to-page controls.
 */
export function PaginationBar({
  totalItems,
  currentPage,
  totalPages,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  createPageHref,
  siblingCount = DEFAULT_SIBLING_COUNT,
  className,
  isJumpToPageVisible = true
}: PaginationBarProps): ReactElement | null {
  const shouldRender: boolean = totalPages > 0
  const clampedCurrentPage: number = getClampedPage(currentPage, totalPages)
  const items: readonly PaginationItemType[] = useMemo(() => {
    return getPaginationItems({
      currentPage: clampedCurrentPage,
      totalPages,
      siblingCount
    })
  }, [clampedCurrentPage, siblingCount, totalPages])
  const previousPage: number = clampedCurrentPage - 1
  const nextPage: number = clampedCurrentPage + 1
  const isPreviousDisabled: boolean = clampedCurrentPage <= FIRST_PAGE
  const isNextDisabled: boolean = clampedCurrentPage >= totalPages
  const [jumpInput, setJumpInput] = useState<string>(String(clampedCurrentPage))

  useEffect(() => {
    setJumpInput(String(clampedCurrentPage))
  }, [clampedCurrentPage])

  if (!shouldRender) {
    return null
  }

  return (
    <div
      className={cn(
        'flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end',
        className
      )}
    >
      <div className="text-muted-foreground text-sm">
        Tổng cộng <span className="text-foreground tabular-nums">{totalItems}</span> mục
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex flex-row items-center gap-2">
          <Select
            value={String(pageSize)}
            onValueChange={(value: string | null) => {
              executePageSizeChange({ nextValue: value, onPageChange, onPageSizeChange })
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {pageSizeOptions.map((size: number) => (
                  <SelectItem key={size} value={String(size)}>
                    {size} mục / trang
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Pagination className="w-auto justify-start">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={getPageHref({ page: previousPage, createPageHref })}
                aria-disabled={isPreviousDisabled}
                tabIndex={isPreviousDisabled ? -1 : 0}
                onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                  if (isPreviousDisabled) {
                    event.preventDefault()
                    return
                  }
                  executePageChange({ event, page: previousPage, onPageChange })
                }}
                text=""
              />
            </PaginationItem>
            {items.map((item: PaginationItemType) => {
              if (item.kind === 'ellipsis') {
                return (
                  <PaginationItem key={item.key}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }
              const page: number = item.page
              const isActive: boolean = page === clampedCurrentPage
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href={getPageHref({ page, createPageHref })}
                    isActive={isActive}
                    onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                      executePageChange({ event, page, onPageChange })
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            })}
            <PaginationItem>
              <PaginationNext
                href={getPageHref({ page: nextPage, createPageHref })}
                aria-disabled={isNextDisabled}
                tabIndex={isNextDisabled ? -1 : 0}
                onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                  if (isNextDisabled) {
                    event.preventDefault()
                    return
                  }
                  executePageChange({ event, page: nextPage, onPageChange })
                }}
                text=""
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        {isJumpToPageVisible ? (
          <div className="flex flex-row flex-wrap items-center gap-2">
            <div className="min-w-0 shrink-0">
              <Input
                type="number"
                className="text-center max-w-14"
                min={FIRST_PAGE}
                max={totalPages}
                value={jumpInput}
                onChange={(event) => {
                  setJumpInput(event.target.value)
                }}
                aria-label="Số trang"
              />
            </div>
            <p className="text-sm">Đến trang</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
