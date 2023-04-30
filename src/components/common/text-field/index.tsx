import { Form, Input } from 'antd'

import { type TextFieldProps } from './text-field.props'

export function TextField (props: TextFieldProps) {
  const {
    label,
    refForm,
    id,
    isShowLabel = false,
    isRequired = false,
    rules = [],
    name,
    ...rest } = props

  const handleResetValidateField = () => {
    if(name != null && refForm.getFieldError(name).length > 0) {
      refForm.setFields([{ errors: [], name }])
    }
  }

  const handleValidateField = () => {
    if(name != null) {
      void refForm.validateFields([name])
    }
  }
  return (
    <div>
      {
        (isShowLabel) && <label htmlFor={id}>
        <span>{label}</span>
          {isRequired && <span>*</span>}
        </label>
      }
      <Form.Item
        name={name}
        colon={false}
        rules={rules}
        labelCol={{
          span: 24
        }}
        wrapperCol={{
          span: 24
        }}
      >
        <Input
          onBlur={handleValidateField}
          onFocus={handleResetValidateField}
          size='large'
          {...rest} />
      </Form.Item>
    </div>

  )
}
