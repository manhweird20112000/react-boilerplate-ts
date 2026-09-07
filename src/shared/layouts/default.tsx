import { useMemo, useState, type CSSProperties } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { useIsMobile } from '@/shared/hooks/use-mobile'

type MenuItem = {
  readonly key: string
  readonly icon: string
  readonly label: string
}

const menuItems: MenuItem[] = [
  {
    key: '/dashboard',
    icon: 'D',
    label: 'Dashboard'
  },
  {
    key: '/orders',
    icon: 'O',
    label: 'Orders'
  }
]

export function DefaultLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const selectedKeys = useMemo(() => {
    const activeItem = menuItems.find((item) => location.pathname.startsWith(item.key))

    return activeItem?.key ? [String(activeItem.key)] : ['/dashboard']
  }, [location.pathname])

  const siderStyle: CSSProperties = {
    background: '#fff',
    borderInlineEnd: '1px solid rgba(5, 5, 5, 0.06)',
    height: '100dvh',
    insetBlockStart: 0,
    overflow: 'auto',
    position: 'fixed',
    zIndex: 100
  }

  const siderWidth = isMobile ? '0px' : collapsed ? '80px' : '240px'

  const handleMenuClick = (key: string) => {
    void navigate(key)
    setDrawerOpen(false)
  }

  const renderMenuContent = (showBrand = true) => (
    <>
      {showBrand ? (
        <div className="flex h-16 w-full items-center px-6 font-semibold">
          <span className="whitespace-nowrap text-xl">
            {collapsed && !isMobile ? 'RB' : 'React Base'}
          </span>
        </div>
      ) : null}

      <nav className="px-2">
        {menuItems.map((item) => {
          const selected = selectedKeys.includes(item.key)

          return (
            <button
              className={`flex min-h-10 w-full items-center gap-3 rounded-md px-3 text-left text-sm transition ${
                selected ? 'bg-[#f1edff] text-[#6f43fd]' : 'text-gray-700 hover:bg-gray-100'
              } ${collapsed && !isMobile ? 'justify-center' : ''}`}
              key={item.key}
              onClick={() => handleMenuClick(item.key)}
              type="button"
            >
              <span aria-hidden="true" className="font-semibold">
                {item.icon}
              </span>
              {collapsed && !isMobile ? null : <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>
    </>
  )

  return (
    <div style={{ minHeight: '100dvh', overflowX: 'hidden' }}>
      {isMobile ? (
        drawerOpen ? (
          <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
            <button
              aria-label="Close sidebar menu"
              className="absolute inset-0 h-full w-full bg-black/30"
              onClick={() => setDrawerOpen(false)}
              type="button"
            />
            <aside className="absolute inset-y-0 left-0 w-[280px] bg-white shadow-xl">
              <div className="flex h-16 items-center border-b border-gray-200 px-6 font-semibold">
                React Base
              </div>
              {renderMenuContent(false)}
            </aside>
          </div>
        ) : null
      ) : (
        <aside
          style={siderStyle}
          className={collapsed ? 'w-20 transition-[width]' : 'w-60 transition-[width]'}
        >
          {renderMenuContent()}
        </aside>
      )}

      <div
        style={{
          marginInlineStart: siderWidth,
          minHeight: '100dvh',
          transition: 'margin-inline-start 0.2s'
        }}
      >
        <header
          style={{
            alignItems: 'center',
            background: '#fff',
            borderBlockEnd: '1px solid rgba(5, 5, 5, 0.06)',
            display: 'flex',
            gap: 16,
            height: 64,
            insetBlockStart: 0,
            insetInlineEnd: 0,
            insetInlineStart: siderWidth,
            paddingInline: isMobile ? 16 : 24,
            position: 'fixed',
            transition: 'inset-inline-start 0.2s',
            zIndex: 90
          }}
        >
          <button
            aria-label={
              isMobile
                ? 'Open sidebar menu'
                : collapsed
                  ? 'Open sidebar menu'
                  : 'Collapse sidebar menu'
            }
            className="flex h-9 w-9 items-center justify-center rounded-md text-xl text-gray-700 transition hover:bg-gray-100"
            onClick={() => {
              if (isMobile) {
                setDrawerOpen(true)
                return
              }

              setCollapsed((value) => !value)
            }}
            type="button"
          >
            {isMobile || collapsed ? '>' : '<'}
          </button>

          <h1 className="m-0 text-xl font-semibold">
            {selectedKeys[0] === '/orders' ? 'Orders' : 'Dashboard'}
          </h1>
        </header>

        <main
          style={
            {
              '--layout-content-padding': isMobile ? '16px' : '24px',
              '--layout-sider-width': siderWidth,
              minHeight: 'calc(100dvh - 64px)',
              marginBlockStart: 64,
              padding: isMobile ? 16 : 24
            } as CSSProperties & Record<'--layout-content-padding' | '--layout-sider-width', string>
          }
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
