import { useState, type CSSProperties, type ReactNode } from 'react'

import { useIsMobile } from '@/shared/hooks/use-mobile'

interface Props {
  heading?: string | ReactNode
  content?: ReactNode
  filters?: ReactNode
  actions?: ReactNode
  pagination?: {
    total: number
    pageSize: number
    current: number
    onChange: (page: number, pageSize?: number) => void
  }
  isFilterDirty?: boolean
  onSearch?: () => void
  onResetFilters?: () => void
}
export const PageLayout = ({
  content,
  filters,
  pagination,
  heading,
  actions,
  isFilterDirty,
  onSearch,
  onResetFilters
}: Props) => {
  const isMobile = useIsMobile()
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)

  const handleResetFilters = () => {
    onResetFilters?.()
    setFilterDrawerOpen(false)
  }

  const handleSearch = () => {
    onSearch?.()
    setFilterDrawerOpen(false)
  }

  const filterFields = (
    <div className="flex flex-wrap gap-4">
      {filters}
      {!isMobile && isFilterDirty ? (
        <>
          <div className="w-full md:w-auto">
            <button
              className="min-h-9 w-full rounded-md bg-gray-100 px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
              onClick={handleResetFilters}
              type="button"
            >
              Reset
            </button>
          </div>
          <div className="w-full md:w-auto">
            <button
              className="min-h-9 w-full rounded-md bg-[#6f43fd] px-3 text-sm font-medium text-white transition hover:bg-[#5f35e8]"
              onClick={handleSearch}
              type="button"
            >
              Apply
            </button>
          </div>
        </>
      ) : null}
    </div>
  )

  const paginationBarStyle: CSSProperties = {
    background: '#fff',
    borderTop: '1px solid #e5e7eb',
    bottom: 0,
    boxShadow: '0 -6px 16px rgba(0, 0, 0, 0.04)',
    left: 'var(--layout-sider-width, 0px)',
    paddingBlock: isMobile ? '12px calc(12px + env(safe-area-inset-bottom))' : 16,
    paddingInline: isMobile ? 12 : 20,
    position: 'fixed',
    right: 0,
    zIndex: 20
  }

  const totalPages = pagination ? Math.max(1, Math.ceil(pagination.total / pagination.pageSize)) : 1
  const goToPage = (page: number) => pagination?.onChange(Math.min(totalPages, Math.max(1, page)))

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        margin: 'calc(var(--layout-content-padding, 24px) * -1)',
        minHeight: 'calc(100dvh - 64px)',
        padding: 'var(--layout-content-padding, 24px) var(--layout-content-padding, 24px) 88px'
      }}
    >
      <div className="grid items-center gap-4 md:grid-cols-[minmax(0,10fr)_minmax(0,14fr)]">
        <div>
          {typeof heading === 'string' ? (
            <h2 className="m-0 text-xl font-semibold">{heading}</h2>
          ) : (
            heading
          )}
        </div>
        <div className="flex w-full flex-col gap-2 md:flex-row md:flex-wrap md:items-center md:justify-end">
          {actions}
        </div>
      </div>

      {isMobile ? (
        <>
          <div className="my-4">
            <button
              className="min-h-10 w-full rounded-md bg-gray-100 px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
              onClick={() => setFilterDrawerOpen(true)}
              type="button"
            >
              Filters
            </button>
          </div>

          {filterDrawerOpen ? (
            <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
              <button
                aria-label="Close filters"
                className="absolute inset-0 h-full w-full bg-black/30"
                onClick={() => setFilterDrawerOpen(false)}
                type="button"
              />
              <div className="absolute inset-x-0 bottom-0 max-h-[min(82dvh,640px)] rounded-t-lg bg-white shadow-2xl">
                <div className="border-b border-gray-200 px-4 py-3 text-base font-semibold">
                  Filters
                </div>
                <div className="overflow-auto p-4 pb-6">{filterFields}</div>
                <div className="flex gap-2 border-t border-gray-200 p-4">
                  {isFilterDirty ? (
                    <button
                      className="min-h-10 flex-1 rounded-md bg-gray-100 px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                      onClick={handleResetFilters}
                      type="button"
                    >
                      Reset
                    </button>
                  ) : null}
                  <button
                    className="min-h-10 flex-1 rounded-md bg-[#6f43fd] px-3 text-sm font-medium text-white transition hover:bg-[#5f35e8]"
                    onClick={handleSearch}
                    type="button"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <div className="my-6">{filterFields}</div>
      )}

      <div style={{ minWidth: 0, width: '100%' }}>{content}</div>

      {pagination ? (
        <div
          className={`flex ${isMobile ? 'justify-center' : 'justify-end'}`}
          style={paginationBarStyle}
        >
          <div className="flex items-center gap-2 text-sm">
            <button
              className="min-h-9 rounded-md border border-gray-300 px-3 text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={pagination.current <= 1}
              onClick={() => goToPage(pagination.current - 1)}
              type="button"
            >
              Previous
            </button>
            <span className="min-w-20 text-center text-gray-700">
              {pagination.current} / {totalPages}
            </span>
            <button
              className="min-h-9 rounded-md border border-gray-300 px-3 text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={pagination.current >= totalPages}
              onClick={() => goToPage(pagination.current + 1)}
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </main>
  )
}
