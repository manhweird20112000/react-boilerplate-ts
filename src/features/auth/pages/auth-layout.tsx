import React from 'react'
import { Layout, theme, Typography } from 'antd'
import { Outlet } from 'react-router-dom'

const { Content } = Layout
const { Title, Text } = Typography

export const AuthLayout: React.FC = () => {
  const { token } = theme.useToken()

  return (
    <Layout style={{ minHeight: '100vh', background: token.colorBgContainer }}>
      <Content
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 20px',
          background: `radial-gradient(circle at 20% 20%, ${token.colorPrimaryBg} 0%, transparent 40%), radial-gradient(circle at 80% 80%, ${token.colorInfoBg} 0%, transparent 40%)`
        }}
      >
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <Title level={2} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.02em' }}>
            ANTGRAVITY
          </Title>
          <Text type="secondary">Enterprise Precision Console</Text>
        </div>

        <div
          style={{
            width: '100%',
            maxWidth: 400,
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: token.borderRadiusLG,
            padding: 32,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
            border: `1px solid rgba(255, 255, 255, 0.18)`
          }}
        >
          <Outlet />
        </div>

        <div style={{ marginTop: 32 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            © {new Date().getFullYear()} Antgravity. All rights reserved.
          </Text>
        </div>
      </Content>
    </Layout>
  )
}
