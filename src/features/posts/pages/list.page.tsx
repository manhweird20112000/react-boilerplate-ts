import { DeleteOutlined, DownOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons'
import {
  Button,
  Col,
  DatePicker,
  Dropdown,
  Row,
  Space,
  Table,
  Typography,
  type TableProps
} from 'antd'
import { Content } from 'antd/es/layout/layout'
import { useState } from 'react'

interface DataType {
  id: number
  date: string
  customer: {
    id: number
    name: string
  }
  payment_status: 'paid' | 'pending' | 'failed'
  payment_status_format: string
  total_price: number
  total_price_format: string
  items: {
    id: number
    name: string
    quantity: number
    price: number
    price_format: string
  }[]
}

const columns: TableProps<DataType>['columns'] = [
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
    dataIndex: 'payment_status_format',
    key: 'payment_status_format'
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
    title: 'Actions',
    key: 'actions',
    width: 120,
    align: 'center',
    render: (_, record) => (
      <Space>
        <Button
          onClick={() => console.log(record)}
          color="default"
          icon={<EyeOutlined />}
          variant="filled"
        ></Button>
        <Button
          onClick={() => console.log(record)}
          color="default"
          icon={<DeleteOutlined />}
          danger
          variant="filled"
        ></Button>
      </Space>
    )
  }
]

const datasource: DataType[] = [
  {
    id: 1001,
    date: '2026-05-17',
    customer: {
      id: 1,
      name: 'Nguyen Van An'
    },
    payment_status: 'paid',
    payment_status_format: 'Paid',
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
    payment_status: 'pending',
    payment_status_format: 'Pending',
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
    payment_status: 'failed',
    payment_status_format: 'Failed',
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
    payment_status: 'paid',
    payment_status_format: 'Paid',
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
    payment_status: 'pending',
    payment_status_format: 'Pending',
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

export const ListPostPage = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys)
    }
  }

  return (
    <Content>
      <Row>
        <Col span={18}>
          <Typography.Title level={3}>Orders</Typography.Title>
        </Col>
        <Col span={6} style={{ textAlign: 'right' }}>
          <Space wrap>
            <Space.Compact>
              <Button variant="filled" color="default" icon={<UploadOutlined />}>
                Export
              </Button>
            </Space.Compact>
            <Space.Compact>
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
                  icon={<DownOutlined />}
                  iconPlacement="end"
                  variant="filled"
                  color="default"
                >
                  More actions
                </Button>
              </Dropdown>
            </Space.Compact>
            <Space.Compact>
              <Button type="primary">Create order</Button>
            </Space.Compact>
          </Space>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={4}>
          <DatePicker.RangePicker format={'YYYY-MM-DD'} style={{ width: '100%' }} />
        </Col>
        <Col span={4}>
          <Button color="default" variant="filled">
            Reset
          </Button>
        </Col>
      </Row>

      <Row>
        <Table
          rowSelection={rowSelection}
          style={{ width: '100%' }}
          columns={columns}
          dataSource={datasource}
          pagination={false}
        />
      </Row>
    </Content>
  )
}
