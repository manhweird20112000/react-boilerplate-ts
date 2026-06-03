import {
  ApiOutlined,
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons'
import { Button, Drawer, Grid, Layout, Menu, Space, Typography, type MenuProps } from 'antd'
import { useMemo, useState, type CSSProperties } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { UserMenu } from '~/features/auth/components/user-menu'

const { Header, Content, Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

const menuItems: MenuItem[] = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard'
  },
  {
    key: '/workbench',
    icon: <ApiOutlined />,
    label: 'Workbench'
  },
  {
    key: '/orders',
    icon: <ShoppingCartOutlined />,
    label: 'Orders'
  }
]

export function DefaultLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const screens = Grid.useBreakpoint()
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const isMobile = screens.lg === false

  const selectedKeys = useMemo(() => {
    const activeItem = menuItems.find(
      (item) => typeof item?.key === 'string' && location.pathname.startsWith(item.key)
    )

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

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    void navigate(key)
    setDrawerOpen(false)
  }

  const renderMenuContent = (showBrand = true) => (
    <>
      {showBrand ? (
        <Space
          align="center"
          size={12}
          style={{
            height: 64,
            paddingInline: collapsed && !isMobile ? 16 : 24,
            width: '100%'
          }}
        >
          <Typography.Text
            strong
            style={{ fontSize: collapsed && !isMobile ? 18 : 20, whiteSpace: 'nowrap' }}
          >
            {collapsed && !isMobile ? 'RB' : 'React Base'}
          </Typography.Text>
        </Space>
      ) : null}

      <Menu
        items={menuItems}
        mode="inline"
        onClick={handleMenuClick}
        selectedKeys={selectedKeys}
        style={{ borderInlineEnd: 0 }}
      />
    </>
  )

  return (
    <Layout hasSider={!isMobile} style={{ minHeight: '100dvh', overflowX: 'hidden' }}>
      {isMobile ? (
        <Drawer
          closable
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          placement="left"
          title="React Base"
          styles={{
            body: { padding: 0 }
          }}
          size={280}
        >
          {renderMenuContent(false)}
        </Drawer>
      ) : (
        <Sider
          collapsed={collapsed}
          collapsible
          onCollapse={setCollapsed}
          style={siderStyle}
          theme="light"
          trigger={null}
          width={240}
        >
          {renderMenuContent()}
        </Sider>
      )}

      <Layout
        style={{
          marginInlineStart: siderWidth,
          minHeight: '100dvh',
          transition: 'margin-inline-start 0.2s'
        }}
      >
        <Header
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
          <Button
            aria-label={
              isMobile
                ? 'Open sidebar menu'
                : collapsed
                  ? 'Open sidebar menu'
                  : 'Collapse sidebar menu'
            }
            icon={isMobile || collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => {
              if (isMobile) {
                setDrawerOpen(true)
                return
              }

              setCollapsed((value) => !value)
            }}
            type="text"
          />

          <Typography.Title level={4} style={{ margin: 0 }}>
            {selectedKeys[0] === '/orders'
              ? 'Orders'
              : selectedKeys[0] === '/workbench'
                ? 'Workbench'
                : 'Dashboard'}
          </Typography.Title>

          <UserMenu />
        </Header>

        <Content
          style={{
            '--layout-content-padding': isMobile ? '16px' : '24px',
            '--layout-sider-width': siderWidth,
            minHeight: 'calc(100dvh - 64px)',
            marginBlockStart: 64,
            padding: isMobile ? 16 : 24
          } as CSSProperties &
            Record<'--layout-content-padding' | '--layout-sider-width', string>}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
