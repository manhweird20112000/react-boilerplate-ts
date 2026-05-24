import React, { useState } from 'react'
import { GoogleOutlined } from '@ant-design/icons'
import { Alert, Button, Divider, Flex, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/use-auth'

const { Title, Text } = Typography

export const LoginPage: React.FC = () => {
  const { loginWithGoogle } = useAuth()
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleGoogleLogin = async () => {
    setIsSubmitting(true)
    try {
      await loginWithGoogle()
    } catch {
      setIsSubmitting(false)
    }
  }

  return (
    <Flex gap="middle" vertical>
      <Flex gap="small" vertical>
        <Title level={3}>{t('auth.login_title', 'Admin Login')}</Title>
        <Text type="secondary">
          {t('auth.login_subtitle', 'Sign in with your Google admin account')}
        </Text>
      </Flex>

      <Alert
        showIcon
        message={t(
          'auth.sso_notice',
          'Use your company Google account to access the admin console.'
        )}
        type="info"
      />

      <Divider plain>{t('auth.sso_divider', 'Single Sign-On')}</Divider>

      <Button
        block
        icon={<GoogleOutlined />}
        loading={isSubmitting}
        onClick={() => void handleGoogleLogin()}
        type="primary"
      >
        {t('auth.google_sso', 'Continue with Google')}
      </Button>
    </Flex>
  )
}
