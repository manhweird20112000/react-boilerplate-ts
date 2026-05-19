import { SearchOutlined, FilterOutlined } from '@ant-design/icons'
import { Grid, Row, Col, Button, Typography, Flex, Drawer, Pagination, theme } from 'antd'
import { useState, type CSSProperties, type ReactNode } from 'react'
import { Content } from 'antd/es/layout/layout'

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
  const screens = Grid.useBreakpoint()
  const { token } = theme.useToken()
  const isMobile = screens.md === false
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
    <Row gutter={[16, 16]}>
      {filters}
      {!isMobile && isFilterDirty ? (
        <Col xs={24} md="auto">
          <Button block={isMobile} color="default" onClick={handleResetFilters} variant="filled">
            Reset
          </Button>
        </Col>
      ) : null}
    </Row>
  )

  const paginationBarStyle: CSSProperties = {
    background: token.colorBgContainer,
    borderTop: `1px solid ${token.colorBorderSecondary}`,
    bottom: 0,
    boxShadow: '0 -6px 16px rgba(0, 0, 0, 0.04)',
    left: 'var(--layout-sider-width, 0px)',
    paddingBlock: isMobile ? '12px calc(12px + env(safe-area-inset-bottom))' : 16,
    paddingInline: isMobile ? 12 : 20,
    position: 'fixed',
    right: 0,
    zIndex: 20
  }

  return (
    <Content
      style={{
        display: 'flex',
        flexDirection: 'column',
        margin: 'calc(var(--layout-content-padding, 24px) * -1)',
        minHeight: 'calc(100dvh - 64px)',
        padding: 'var(--layout-content-padding, 24px) var(--layout-content-padding, 24px) 88px'
      }}
    >
      <Row align="middle" gutter={[16, 16]}>
        <Col xs={24} md={10}>
          {typeof heading === 'string' ? (
            <Typography.Title level={4} style={{ margin: 0 }}>
              {heading}
            </Typography.Title>
          ) : (
            heading
          )}
        </Col>
        <Col xs={24} md={14}>
          <Flex
            align={isMobile ? 'stretch' : 'center'}
            gap="small"
            justify={isMobile ? 'start' : 'end'}
            style={isMobile ? { width: '100%' } : undefined}
            vertical={isMobile}
            wrap={!isMobile}
          >
            {actions}
          </Flex>
        </Col>
      </Row>

      {isMobile ? (
        <>
          <Flex style={{ marginBlock: 16 }}>
            <Button
              block
              color="default"
              icon={<FilterOutlined />}
              onClick={() => setFilterDrawerOpen(true)}
              variant="filled"
            >
              Filters
            </Button>
          </Flex>

          <Drawer
            onClose={() => setFilterDrawerOpen(false)}
            open={filterDrawerOpen}
            placement="bottom"
            size="min(82dvh, 640px)"
            title="Filters"
            footer={
              <Flex gap={8}>
                {isFilterDirty ? (
                  <Button block color="default" onClick={handleResetFilters} variant="filled">
                    Reset
                  </Button>
                ) : null}
                <Button block icon={<SearchOutlined />} onClick={handleSearch} type="primary">
                  Apply
                </Button>
              </Flex>
            }
            styles={{
              body: { paddingBottom: 16 },
              footer: { padding: 16 }
            }}
          >
            {filterDrawerOpen ? filterFields : null}
          </Drawer>
        </>
      ) : (
        <Flex vertical style={{ marginBlock: 24 }}>
          {filterFields}
        </Flex>
      )}

      <Row style={{ minWidth: 0, width: '100%' }}>{content}</Row>

      {pagination ? (
        <Flex justify={isMobile ? 'center' : 'end'} style={paginationBarStyle}>
          <Pagination
            current={pagination.current}
            onChange={pagination.onChange}
            pageSize={pagination.pageSize}
            responsive
            showLessItems={isMobile}
            showQuickJumper={!isMobile}
            showSizeChanger={!isMobile}
            simple={isMobile ? { readOnly: true } : false}
            size={isMobile ? 'small' : 'medium'}
            total={pagination.total}
          />
        </Flex>
      ) : null}
    </Content>
  )
}
