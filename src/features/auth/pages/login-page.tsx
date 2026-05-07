import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Checkbox, Form, Typography } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/use-auth'
import { useAuthSchemas, type LoginCredentials } from '../schemas/auth.schema'
import { useTranslation } from 'react-i18next'

const { Title, Text } = Typography

export const LoginPage: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { loginSchema } = useAuthSchemas()

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors }
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: true
    }
  })

  const onSubmit = async (values: LoginCredentials) => {
    try {
      await login(values)
      navigate('/')
    } catch {
      // Error handled in useAuth
    }
  }

  return (
    <div className="login-container">
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ marginBottom: 8 }}>
          {t('auth.login_title', 'Login')}
        </Title>
        <Text type="secondary">{t('auth.login_subtitle', 'Welcome back to Antgravity')}</Text>
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
                prefix={<UserOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
                placeholder={t('auth.email_placeholder', 'Email')}
                autoComplete="email"
              />
            )}
          />
        </Form.Item>

        <Form.Item validateStatus={errors.password ? 'error' : ''} help={errors.password?.message}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                size="large"
                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
                placeholder={t('auth.password_placeholder', 'Password')}
                autoComplete="current-password"
              />
            )}
          />
        </Form.Item>

        <div
          style={{
            marginBottom: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Controller
            name="remember"
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <Checkbox {...field} checked={value} onChange={(e) => onChange(e.target.checked)}>
                {t('auth.remember_me', 'Remember me')}
              </Checkbox>
            )}
          />
          <Link to="/auth/forgot-password" style={{ fontSize: 14 }}>
            {t('auth.forgot_password', 'Forgot password?')}
          </Link>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block loading={isSubmitting}>
            {t('auth.login_button', 'Sign In')}
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          <span style={{ color: 'rgba(0,0,0,0.45)', fontSize: 14 }}>
            {t('auth.no_account', "Don't have an account?")}{' '}
          </span>
          <Link to="/auth/register" style={{ fontSize: 14 }}>
            {t('auth.register_now', 'Register now')}
          </Link>
        </div>
      </Form>
    </div>
  )
}
