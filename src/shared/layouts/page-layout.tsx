import { SearchOutlined, FilterOutlined } from '@ant-design/icons'
import { Grid, Row, Col, Button, Typography, Flex, Drawer, Pagination } from 'antd'
import { useState } from 'react'
import { Content } from 'antd/es/layout/layout'

interface Props {
  heading?: string | React.ReactNode
  content?: React.ReactNode
  filters?: React.ReactNode
  actions?: React.ReactNode
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
      {isFilterDirty ? (
        <Col xs={24} md="auto">
          <Button block={isMobile} color="default" onClick={handleResetFilters} variant="filled">
            Reset
          </Button>
        </Col>
      ) : null}
      {isMobile ? (
        <Col xs={24}>
          <Button block icon={<SearchOutlined />} onClick={handleSearch} type="primary">
            Search
          </Button>
        </Col>
      ) : null}
    </Row>
  )

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
          <Flex align="center" gap="small" justify={isMobile ? 'start' : 'end'} wrap>
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
            placement="right"
            size={320}
            title="Filters"
          >
            {filterFields}
          </Drawer>
        </>
      ) : (
        <Flex vertical style={{ marginBlock: 24 }}>
          {filterFields}
        </Flex>
      )}

      <Row>{content}</Row>

      {pagination ? (
        <Flex
          justify="end"
          style={{
            background: '#fff',
            borderTop: '1px solid rgba(5, 5, 5, 0.06)',
            bottom: 0,
            boxShadow: '0 -6px 16px rgba(0, 0, 0, 0.04)',
            left: 'var(--layout-sider-width, 0px)',
            paddingBlock: 16,
            paddingInline: 20,
            position: 'fixed',
            right: 0,
            zIndex: 20
          }}
        >
          <Pagination
            onShowSizeChange={(evt) => console.log(evt)}
            defaultCurrent={pagination.current}
            onChange={pagination.onChange}
            responsive
            showQuickJumper
            total={pagination.total}
          />
        </Flex>
      ) : null}
    </Content>
  )
}
