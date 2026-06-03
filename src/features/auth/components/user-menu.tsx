import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Dropdown, Space, Spin, Typography, type MenuProps } from 'antd'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/use-auth'

export const UserMenu: React.FC = () => {
  const { user, logout } = useAuth()
  const { t } = useTranslation()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async (): Promise<void> => {
    setIsLoggingOut(true)
    try {
      await logout()
    } finally {
      setIsLoggingOut(false)
    }
  }

  const menuItems: MenuProps['items'] = [
    {
      key: 'logout',
      disabled: isLoggingOut,
      icon: isLoggingOut ? <Spin size="small" /> : <LogoutOutlined />,
      label: t('auth.logout', 'Sign out'),
      onClick: () => void handleLogout()
    }
  ]

  if (!user) {
    return (
      <Space style={{ marginInlineStart: 'auto' }}>
        <Avatar icon={<UserOutlined />} />
        <Typography.Text type="secondary">Local mode</Typography.Text>
      </Space>
    )
  }

  return (
    <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
      <Space style={{ cursor: 'pointer', marginInlineStart: 'auto' }}>
        <Avatar icon={<UserOutlined />} src={user?.avatar} />
        <Typography.Text>{user?.name || user?.email}</Typography.Text>
      </Space>
    </Dropdown>
  )
}
