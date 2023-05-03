import { useState } from "react"
import Icon from "@ant-design/icons"
import { type CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon"
import { Menu, type MenuProps } from "antd"
import classNames from "classnames"

import { useAppSelector } from "@/hooks/redux-hook"

const HomeIconSVG = () => {
  return (
    <svg width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg">
    <path opacity="0.4"
    d="M10.07 2.82L3.13999 8.37C2.35999 8.99 1.85999 10.3 2.02999 11.28L3.35999 19.24C3.59999 20.66 4.95999 21.81 6.39999 21.81H17.6C19.03 21.81 20.4 20.65 20.64 19.24L21.97 11.28C22.13 10.3 21.63 8.99 20.86 8.37L13.93 2.83C12.86 1.97 11.13 1.97 10.07 2.82Z"
    fill="currentColor"/>
    <path d="M12 15.5C12.663 15.5 13.2989 15.2366 13.7678 14.7678C14.2366 14.2989 14.5 13.663 14.5 13C14.5 12.337 14.2366 11.7011 13.7678 11.2322C13.2989 10.7634 12.663 10.5 12 10.5C11.337 10.5 10.7011 10.7634 10.2322 11.2322C9.76339 11.7011 9.5 12.337 9.5 13C9.5 13.663 9.76339 14.2989 10.2322 14.7678C10.7011 15.2366 11.337 15.5 12 15.5Z"
    fill="currentColor"/>
    </svg>
  )
}

const HomeIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon
    component={HomeIconSVG}
    {...props} />
}

export function Sidebar () {
  const { isMenuCollapse } = useAppSelector((state) => state.app)

  const [indexActive, setIndexActive] = useState<string>('0')

  const menus : MenuProps['items'] = [
    {
      icon: <HomeIcon />,
      label: 'Dashboard',
      title: 'Dashboard',
      key: '0'
    }
  ]

  const handlePressMenu = () => {
    console.log('ok')
  }

  return (
  <div className={
    classNames('fixed bottom-0 left-0 top-0 bg-black', {
      'w-[240px]': !isMenuCollapse,
      'w-[50px]': isMenuCollapse
    })
  }>
    <Menu
    defaultSelectedKeys={[indexActive]}
    className={classNames()}
    onClick={handlePressMenu}
    mode="inline"
    items={menus}
    inlineCollapsed={isMenuCollapse}
    />
  </div>
  )
}
