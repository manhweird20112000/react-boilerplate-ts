import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Form, Typography } from 'antd'
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/use-auth'
import { useAuthSchemas, type RegisterRequest } from '../schemas/auth.schema'
import { useTranslation } from 'react-i18next'

const { Title } = Typography

export const RegisterPage: React.FC = () => {
  const { register: registerAuth } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { registerSchema } = useAuthSchemas()

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors }
  } = useForm<RegisterRequest>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: ''
    }
  })

  const onSubmit = async (values: RegisterRequest) => {
    try {
      await registerAuth(values)
      navigate('/')
    } catch {
      // Error handled in useAuth
    }
  }

  return (
    <div className="register-container">
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={3}>{t('auth.register_title', 'Create Account')}</Title>
      </div>

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item validateStatus={errors.name ? 'error' : ''} help={errors.name?.message}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                prefix={<UserOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
                placeholder={t('auth.name_placeholder', 'Full Name')}
              />
            )}
          />
        </Form.Item>

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
                autoComplete="new-password"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          validateStatus={errors.password_confirmation ? 'error' : ''}
          help={errors.password_confirmation?.message}
        >
          <Controller
            name="password_confirmation"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                size="large"
                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
                placeholder={t('auth.confirm_password_placeholder', 'Confirm Password')}
                autoComplete="new-password"
              />
            )}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block loading={isSubmitting}>
            {t('auth.register_button', 'Sign Up')}
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          <span style={{ color: 'rgba(0,0,0,0.45)', fontSize: 14 }}>
            {t('auth.have_account', 'Already have an account?')}{' '}
          </span>
          <Link to="/auth/login" style={{ fontSize: 14 }}>
            {t('auth.login_now', 'Login now')}
          </Link>
        </div>
      </Form>
    </div>
  )
}
