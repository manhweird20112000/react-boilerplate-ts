import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

export const usePostSchema = () => {
  const { t } = useTranslation()

  return useMemo(() => {
    const createPostSchema = z.object({
      title: z
        .string()
        .min(1, t('validation.required', { _field_: t('auth.fields.title') }))
        .max(255, t('validation.max', { _field_: t('auth.fields.title'), _length_: 255 })),
      content: z
        .string()
        .min(1, t('validation.required', { _field_: t('auth.fields.content') }))
        .max(5000, t('validation.max', { _field_: t('auth.fields.content'), _length_: 5000 })),
      thumbnailUrl: z.string().url(t('validation.url')),
      status: z.enum(
        ['published', 'draft', 'archived'],
        t('validation.invalid', { _field_: t('auth.fields.status') })
      ),
      images: z.array(z.string().url(t('validation.url'))).optional()
    })

    return {
      createPostSchema
    }
  }, [t])
}

export type CreatePostForm = z.infer<ReturnType<typeof usePostSchema>['createPostSchema']>
