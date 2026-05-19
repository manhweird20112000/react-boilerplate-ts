import {
  DeleteOutlined,
  DownOutlined,
  EyeOutlined,
  MoreOutlined,
  UploadOutlined
} from '@ant-design/icons'
import {
  Button,
  Col,
  DatePicker,
  Dropdown,
  Grid,
  Space,
  Table,
  Tag,
  Typography,
  type TableProps
} from 'antd'
import type { Dayjs } from 'dayjs'
import { useMemo, useState } from 'react'
import type { Order } from '../types/order.type'
import { PageLayout } from '@/shared/layouts'

const createColumns = (isMobile: boolean): TableProps<Order>['columns'] => [
  {
    title: 'Order',
    dataIndex: 'id',
    key: 'id',
    render: (text) => (
      <Typography.Link color="primary" href={`/order/${text}`}>
        #{text}
      </Typography.Link>
    )
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date'
  },
  {
    title: 'Customer',
    dataIndex: 'customer',
    key: 'customer',
    render: (customer) => customer.name
  },
  {
    title: 'Payment',
    dataIndex: 'payment_status',
    key: 'payment_status',
    render: (payment_status) => {
      const colors = ['success', 'warning', 'error'] as const
      return <Tag color={colors[payment_status.id]}>{payment_status.name}</Tag>
    }
  },
  {
    title: 'Total',
    dataIndex: 'total_price_format',
    key: 'total_price_format'
  },
  {
    title: 'Delivery',
    dataIndex: 'delivery_status',
    key: 'delivery_status',
    render: () => 'N/A'
  },
  {
    title: 'Items',
    dataIndex: 'items',
    key: 'items',
    render: (items) => `${items.length} items`
  },
  {
    title: isMobile ? '' : 'Actions',
    key: 'actions',
    width: isMobile ? 56 : 120,
    align: 'center',
    fixed: 'right',
    render: (_, record) =>
      isMobile ? (
        <Dropdown
          menu={{
            items: [
              { key: 'view', icon: <EyeOutlined />, label: 'View' },
              { key: 'delete', danger: true, icon: <DeleteOutlined />, label: 'Delete' }
            ],
            onClick: ({ key }) => {
              console.log(key, record)
            }
          }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Button
            aria-label="Open order actions"
            color="default"
            icon={<MoreOutlined />}
            variant="filled"
          />
        </Dropdown>
      ) : (
        <Space>
          <Button
            onClick={() => console.log(record)}
            color="default"
            icon={<EyeOutlined />}
            variant="filled"
          />
          <Button
            onClick={() => console.log(record)}
            color="default"
            icon={<DeleteOutlined />}
            danger
            variant="filled"
          />
        </Space>
      )
  }
]

const datasource: Order[] = [
  {
    id: 1001,
    date: '2026-05-17',
    customer: {
      id: 1,
      name: 'Nguyen Van An'
    },
    payment_status: {
      id: 0,
      name: 'Paid'
    },
    total_price: 1290000,
    total_price_format: '1,290,000 VND',
    items: [
      {
        id: 1,
        name: 'Wireless Keyboard',
        quantity: 1,
        price: 790000,
        price_format: '790,000 VND'
      },
      {
        id: 2,
        name: 'USB-C Cable',
        quantity: 2,
        price: 250000,
        price_format: '250,000 VND'
      }
    ]
  },
  {
    id: 1002,
    date: '2026-05-16',
    customer: {
      id: 2,
      name: 'Tran Thi Bich'
    },
    payment_status: {
      id: 1,
      name: 'Pending'
    },
    total_price: 2190000,
    total_price_format: '2,190,000 VND',
    items: [
      {
        id: 3,
        name: 'Bluetooth Speaker',
        quantity: 1,
        price: 2190000,
        price_format: '2,190,000 VND'
      }
    ]
  },
  {
    id: 1003,
    date: '2026-05-15',
    customer: {
      id: 3,
      name: 'Le Minh Khoa'
    },
    payment_status: {
      id: 2,
      name: 'Failed'
    },
    total_price: 4590000,
    total_price_format: '4,590,000 VND',
    items: [
      {
        id: 4,
        name: '27-inch Monitor',
        quantity: 1,
        price: 4590000,
        price_format: '4,590,000 VND'
      }
    ]
  },
  {
    id: 1004,
    date: '2026-05-14',
    customer: {
      id: 4,
      name: 'Pham Hoang Nam'
    },
    payment_status: {
      id: 0,
      name: 'Paid'
    },
    total_price: 3450000,
    total_price_format: '3,450,000 VND',
    items: [
      {
        id: 5,
        name: 'Ergonomic Mouse',
        quantity: 3,
        price: 650000,
        price_format: '650,000 VND'
      },
      {
        id: 6,
        name: 'Laptop Stand',
        quantity: 1,
        price: 1500000,
        price_format: '1,500,000 VND'
      }
    ]
  },
  {
    id: 1005,
    date: '2026-05-13',
    customer: {
      id: 5,
      name: 'Do Thuy Linh'
    },
    payment_status: {
      id: 1,
      name: 'Pending'
    },
    total_price: 980000,
    total_price_format: '980,000 VND',
    items: [
      {
        id: 7,
        name: 'Desk Lamp',
        quantity: 2,
        price: 490000,
        price_format: '490,000 VND'
      }
    ]
  },
  {
    id: 1001,
    date: '2026-05-17',
    customer: {
      id: 1,
      name: 'Nguyen Van An'
    },
    payment_status: {
      id: 0,
      name: 'Paid'
    },
    total_price: 1290000,
    total_price_format: '1,290,000 VND',
    items: [
      {
        id: 1,
        name: 'Wireless Keyboard',
        quantity: 1,
        price: 790000,
        price_format: '790,000 VND'
      },
      {
        id: 2,
        name: 'USB-C Cable',
        quantity: 2,
        price: 250000,
        price_format: '250,000 VND'
      }
    ]
  },
  {
    id: 1002,
    date: '2026-05-16',
    customer: {
      id: 2,
      name: 'Tran Thi Bich'
    },
    payment_status: {
      id: 1,
      name: 'Pending'
    },
    total_price: 2190000,
    total_price_format: '2,190,000 VND',
    items: [
      {
        id: 3,
        name: 'Bluetooth Speaker',
        quantity: 1,
        price: 2190000,
        price_format: '2,190,000 VND'
      }
    ]
  },
  {
    id: 1003,
    date: '2026-05-15',
    customer: {
      id: 3,
      name: 'Le Minh Khoa'
    },
    payment_status: {
      id: 2,
      name: 'Failed'
    },
    total_price: 4590000,
    total_price_format: '4,590,000 VND',
    items: [
      {
        id: 4,
        name: '27-inch Monitor',
        quantity: 1,
        price: 4590000,
        price_format: '4,590,000 VND'
      }
    ]
  },
  {
    id: 1004,
    date: '2026-05-14',
    customer: {
      id: 4,
      name: 'Pham Hoang Nam'
    },
    payment_status: {
      id: 0,
      name: 'Paid'
    },
    total_price: 3450000,
    total_price_format: '3,450,000 VND',
    items: [
      {
        id: 5,
        name: 'Ergonomic Mouse',
        quantity: 3,
        price: 650000,
        price_format: '650,000 VND'
      },
      {
        id: 6,
        name: 'Laptop Stand',
        quantity: 1,
        price: 1500000,
        price_format: '1,500,000 VND'
      }
    ]
  },
  {
    id: 1005,
    date: '2026-05-13',
    customer: {
      id: 5,
      name: 'Do Thuy Linh'
    },
    payment_status: {
      id: 1,
      name: 'Pending'
    },
    total_price: 980000,
    total_price_format: '980,000 VND',
    items: [
      {
        id: 7,
        name: 'Desk Lamp',
        quantity: 2,
        price: 490000,
        price_format: '490,000 VND'
      }
    ]
  }
]

export const ListOrderPage = () => {
  const screens = Grid.useBreakpoint()
  const isMobile = screens.md === false
  const columns = useMemo(() => createColumns(isMobile), [isMobile])
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys)
    }
  }

  return (
    <PageLayout
      heading={'Orders'}
      actions={
        <>
          <Button block={isMobile} variant="filled" color="default" icon={<UploadOutlined />}>
            Export
          </Button>
          <Dropdown
            menu={{
              items: [
                { key: '1', label: 'Action 1' },
                { key: '2', label: 'Action 2' },
                { key: '3', label: 'Action 3' }
              ],
              onClick: ({ key }) => {
                console.log(`Clicked on action ${key}`)
              }
            }}
          >
            <Button
              block={isMobile}
              icon={<DownOutlined />}
              iconPlacement="end"
              variant="filled"
              color="default"
            >
              More actions
            </Button>
          </Dropdown>
          <Button block={isMobile} type="primary">
            Create order
          </Button>
        </>
      }
      filters={
        <>
          <Col xs={24} md={6} lg={5}>
            <DatePicker.RangePicker
              format="YYYY-MM-DD"
              onChange={(dates) => setDateRange(dates)}
              style={{ width: '100%' }}
              value={dateRange}
            />
          </Col>
        </>
      }
      content={
        <Table
          rowSelection={rowSelection}
          style={{ width: '100%' }}
          columns={columns}
          dataSource={datasource}
          pagination={false}
          scroll={{ x: 1200 }}
        />
      }
      pagination={{
        pageSize: 20,
        total: 500,
        current: 1,
        onChange: () => console.log('ok')
      }}
    />
  )
}
