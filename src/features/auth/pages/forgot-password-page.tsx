import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Form, Typography, App } from 'antd'
import { MailOutlined } from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom'
import { authRepo } from '../services/factory'
import { useAuthSchemas, type ForgotPasswordRequest } from '../schemas/auth.schema'
import { useTranslation } from 'react-i18next'

const { Title, Text } = Typography

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { forgotPasswordSchema } = useAuthSchemas()
  const { message } = App.useApp()

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors }
  } = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = async (values: ForgotPasswordRequest) => {
    try {
      const { data: res } = await authRepo.forgotPassword(values)
      if (res.message) message.success(res.message)
      navigate('/auth/login')
    } catch (error: any) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message)
      } else {
        message.error('Failed to send recovery email')
      }
    }
  }

  return (
    <div className="forgot-pwd-container">
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={3}>{t('auth.forgot_pwd_title', 'Forgot Password')}</Title>
        <Text type="secondary">
          {t('auth.forgot_pwd_subtitle', 'Enter your email to reset your password')}
        </Text>
      </div>

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item validateStatus={errors.email ? 'error' : ''} help={errors.email?.message}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                prefix={<MailOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
                placeholder={t('auth.email_placeholder', 'Email')}
                autoComplete="email"
              />
            )}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block loading={isSubmitting}>
            {t('auth.reset_button', 'Reset Password')}
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          <Link to="/auth/login" style={{ fontSize: 14 }}>
            {t('auth.back_to_login', 'Back to Login')}
          </Link>
        </div>
      </Form>
    </div>
  )
}
