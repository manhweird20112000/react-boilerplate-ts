import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

export const useAuthSchemas = () => {
  const { t } = useTranslation()

  return useMemo(() => {
    const loginSchema = z.object({
      email: z.string()
        .min(1, t('validation.required', { _field_: t('auth.fields.email') }))
        .email(t('validation.email')),
      password: z.string()
        .min(1, t('validation.required', { _field_: t('auth.fields.password') }))
        .min(8, t('validation.min', { _field_: t('auth.fields.password'), _length_: 8 })),
      remember: z.boolean().optional(),
    })

    const registerSchema = z
      .object({
        name: z.string()
          .min(1, t('validation.required', { _field_: t('auth.fields.name') }))
          .min(2, t('validation.min', { _field_: t('auth.fields.name'), _length_: 2 })),
        email: z.string()
          .min(1, t('validation.required', { _field_: t('auth.fields.email') }))
          .email(t('validation.email')),
        password: z.string()
          .min(1, t('validation.required', { _field_: t('auth.fields.password') }))
          .min(8, t('validation.min', { _field_: t('auth.fields.password'), _length_: 8 })),
        password_confirmation: z.string()
          .min(1, t('validation.required', { _field_: t('auth.fields.password_confirmation') })),
      })
      .refine((data) => data.password === data.password_confirmation, {
        message: t('validation.password_mismatch'),
        path: ['password_confirmation'],
      })

    const forgotPasswordSchema = z.object({
      email: z.string()
        .min(1, t('validation.required', { _field_: t('auth.fields.email') }))
        .email(t('validation.email')),
    })

    return {
      loginSchema,
      registerSchema,
      forgotPasswordSchema,
    }
  }, [t])
}

export type LoginCredentials = z.infer<ReturnType<typeof useAuthSchemas>['loginSchema']>
export type RegisterRequest = z.infer<ReturnType<typeof useAuthSchemas>['registerSchema']>
export type ForgotPasswordRequest = z.infer<ReturnType<typeof useAuthSchemas>['forgotPasswordSchema']>
