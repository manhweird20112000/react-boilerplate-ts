import IconAntD from '@ant-design/icons'
import { type CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon'

interface IconProps extends Partial<CustomIconComponentProps>{
  component: any
}

export function Icon (props: IconProps) {
  const { component, ...rest } = props
  return (
      <IconAntD
      component={component}
      {...rest} />
  )
}
