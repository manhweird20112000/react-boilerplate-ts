import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Col, DatePicker, Drawer, Flex, Form, InputNumber, Row, Select } from 'antd'
import dayjs from 'dayjs'
import { useEffect, type ReactElement } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'

import { orderCustomers, orderProducts } from '../constants/order-options'
import { useOrderSchemas, type OrderFormValues } from '../schemas/order.schema'
import type { CreateOrderDto } from '../types/create-order.dto.type'
import type { OrderFormMode } from '../types/order-form-mode.type'
import type { Order } from '../types/order.type'

export type OrderFormDrawerProps = {
  readonly mode: OrderFormMode
  readonly open: boolean
  readonly order?: Order | null
  readonly loading?: boolean
  readonly onClose: () => void
  readonly onSubmit: (dto: CreateOrderDto) => Promise<void>
}

const productOptions = orderProducts.map((product) => ({
  label: `${product.name} - ${new Intl.NumberFormat('en-US').format(product.price)} VND`,
  value: product.id
}))

const customerOptions = orderCustomers.map((customer) => ({
  label: customer.name,
  value: customer.id
}))

const getDefaultValues = (order?: Order | null): OrderFormValues => ({
  date: order?.date ? dayjs(order.date) : dayjs(),
  customer_id: order?.customer.id ?? orderCustomers[0].id,
  items: order?.items.length
    ? order.items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity
      }))
    : [{ product_id: orderProducts[0].id, quantity: 1 }]
})

const toDto = (values: OrderFormValues): CreateOrderDto => ({
  date: values.date.format('YYYY-MM-DD'),
  customer_id: values.customer_id,
  items: values.items.map((item) => ({
    product_id: item.product_id,
    product_variant_id: item.product_variant_id ?? item.product_id,
    quantity: item.quantity
  }))
})

export function OrderFormDrawer({
  mode,
  open,
  order,
  loading,
  onClose,
  onSubmit
}: OrderFormDrawerProps): ReactElement {
  const { orderFormSchema } = useOrderSchemas()
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: getDefaultValues(order)
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  useEffect(() => {
    if (open) {
      reset(getDefaultValues(order))
    }
  }, [open, order, reset])

  const title = mode === 'create' ? 'Create order' : `Edit order #${order?.id ?? ''}`

  return (
    <Drawer
      destroyOnHidden
      footer={
        <Flex gap={8} justify="end">
          <Button color="default" onClick={onClose} variant="filled">
            Cancel
          </Button>
          <Button htmlType="submit" loading={loading} form="order-form" type="primary">
            {mode === 'create' ? 'Create' : 'Save'}
          </Button>
        </Flex>
      }
      mask={{ closable: !loading }}
      onClose={onClose}
      open={open}
      size="large"
      title={title}
    >
      <Form
        id="order-form"
        layout="vertical"
        onFinish={handleSubmit(async (values) => onSubmit(toDto(values)))}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Order date"
              validateStatus={errors.date ? 'error' : ''}
              help={errors.date?.message}
            >
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    allowClear={false}
                    format="YYYY-MM-DD"
                    style={{ width: '100%' }}
                  />
                )}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Customer"
              validateStatus={errors.customer_id ? 'error' : ''}
              help={errors.customer_id?.message}
            >
              <Controller
                control={control}
                name="customer_id"
                render={({ field }) => (
                  <Select
                    {...field}
                    options={customerOptions}
                    showSearch={{ optionFilterProp: 'label' }}
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <Flex align="center" justify="space-between" style={{ marginBottom: 12 }}>
          <strong>Items</strong>
          <Button
            color="default"
            icon={<PlusOutlined />}
            onClick={() =>
              append({
                product_id: orderProducts[0].id,
                quantity: 1
              })
            }
            variant="filled"
          >
            Add item
          </Button>
        </Flex>

        {errors.items?.root?.message ? (
          <Form.Item validateStatus="error" help={errors.items.root.message} />
        ) : null}

        <Flex gap={12} vertical>
          {fields.map((field, index) => (
            <div
              key={field.id}
              style={{
                border: '1px solid rgba(5, 5, 5, 0.08)',
                borderRadius: 8,
                padding: 12
              }}
            >
              <Row align="top" gutter={12}>
                <Col xs={24} md={14}>
                  <Form.Item
                    label="Product"
                    validateStatus={errors.items?.[index]?.product_id ? 'error' : ''}
                    help={errors.items?.[index]?.product_id?.message}
                  >
                    <Controller
                      control={control}
                      name={`items.${index}.product_id`}
                      render={({ field: productField }) => (
                        <Select
                          {...productField}
                          onChange={(value) => {
                            productField.onChange(value)
                          }}
                          options={productOptions}
                          showSearch={{ optionFilterProp: 'label' }}
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col xs={18} md={6}>
                  <Form.Item
                    label="Quantity"
                    validateStatus={errors.items?.[index]?.quantity ? 'error' : ''}
                    help={errors.items?.[index]?.quantity?.message}
                  >
                    <Controller
                      control={control}
                      name={`items.${index}.quantity`}
                      render={({ field: quantityField }) => (
                        <InputNumber
                          min={1}
                          max={99}
                          onChange={(value) => quantityField.onChange(value ?? 1)}
                          style={{ width: '100%' }}
                          value={quantityField.value}
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col xs={6} md={4}>
                  <Form.Item label=" ">
                    <Button
                      aria-label="Remove item"
                      color="default"
                      danger
                      disabled={fields.length === 1}
                      icon={<DeleteOutlined />}
                      onClick={() => remove(index)}
                      variant="filled"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          ))}
        </Flex>
      </Form>
    </Drawer>
  )
}
