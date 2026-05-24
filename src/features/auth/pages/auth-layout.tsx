import React from 'react'
import { Card } from 'antd'
import { Outlet } from 'react-router-dom'

export const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card>
        <Outlet />
      </Card>
    </div>
  )
}
