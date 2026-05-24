import React, { useEffect, useRef, useState } from 'react'
import { Alert, Button, Spin, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/use-auth'
import { getApiErrorMessage } from '../utils/api-error'
import { isAbsoluteRedirectUrl } from '../utils/oauth-redirect'

type CallbackStatus = 'loading' | 'error'

export const GoogleCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { completeGoogleLogin } = useAuth()
  const { t } = useTranslation()
  const [status, setStatus] = useState<CallbackStatus>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const hasHandledRef = useRef(false)

  useEffect(() => {
    if (hasHandledRef.current) {
      return
    }
    hasHandledRef.current = true
    const oauthError = searchParams.get('error')
    if (oauthError) {
      setStatus('error')
      setErrorMessage(
        t('auth.callback_oauth_denied', 'Google sign-in was cancelled or denied.')
      )
      return
    }
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    if (!code || !state) {
      setStatus('error')
      setErrorMessage(
        t('auth.callback_missing_params', 'Invalid sign-in callback. Please try again.')
      )
      return
    }
    void (async () => {
      try {
        const redirectTo = await completeGoogleLogin({ code, state })
        if (isAbsoluteRedirectUrl(redirectTo)) {
          window.location.assign(redirectTo)
          return
        }
        navigate(redirectTo, { replace: true })
      } catch (error: unknown) {
        setStatus('error')
        setErrorMessage(
          getApiErrorMessage(
            error,
            t('auth.callback_failed', 'Google sign-in failed. Please try again.')
          )
        )
      }
    })()
  }, [completeGoogleLogin, navigate, searchParams, t])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Spin size="large" />
        <Typography.Text type="secondary">
          {t('auth.callback_loading', 'Completing Google sign-in...')}
        </Typography.Text>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-4">
        <Alert
          showIcon
          type="error"
          message={t('auth.callback_error_title', 'Sign-in failed')}
          description={errorMessage}
        />
        <Button block type="primary" onClick={() => navigate('/auth/login', { replace: true })}>
          {t('auth.back_to_login', 'Back to login')}
        </Button>
      </div>
    </div>
  )
}
