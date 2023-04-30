import { type FormInstance, type FormRule, type InputProps } from 'antd'


export interface TextFieldProps extends InputProps{
  label: string
  isShowLabel?: boolean
  isRequired?: boolean
  rules?: FormRule[]
  refForm : FormInstance
}
