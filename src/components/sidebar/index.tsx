import { useState } from "react"
import { HomeOutlined } from "@ant-design/icons"
import { Menu, type MenuProps } from "antd"
import classNames from "classnames"

import { useAppSelector } from "@/hooks/redux-hook"


export function Sidebar () {
  const { isMenuCollapse } = useAppSelector((state) => state.app)

  const [indexActive, setIndexActive] = useState<string>('0')

  const menus : MenuProps['items'] = [
    {
      icon: <HomeOutlined />,
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
    classNames('fixed bottom-0 left-0 top-0 bg-slate-950 transition-all duration-500', {
      'w-[240px]': !isMenuCollapse,
      'w-[80px]': isMenuCollapse
    })
  }>
    <Menu
    defaultSelectedKeys={[indexActive]}
    onClick={handlePressMenu}
    mode="inline"
    items={menus}
    inlineCollapsed={isMenuCollapse}
    />
  </div>
  )
}
