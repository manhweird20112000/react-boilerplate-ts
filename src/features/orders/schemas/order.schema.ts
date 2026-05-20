import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

export const useOrderSchemas = () => {
  const { t } = useTranslation()

  return useMemo(() => {
    const orderItemSchema = z.object({
      product_id: z.number().int().min(1, t('validation.no_selection')),
      product_variant_id: z.number().int().min(1, t('validation.no_selection')).optional(),
      quantity: z
        .number()
        .int(t('validation.numberInteger', { _field_: t('orders.fields.quantity') }))
        .min(
          1,
          t('validation.numberBetweenInclusive', {
            _field_: t('orders.fields.quantity'),
            _min_: 1,
            _max_: 99
          })
        )
        .max(
          99,
          t('validation.numberBetweenInclusive', {
            _field_: t('orders.fields.quantity'),
            _min_: 1,
            _max_: 99
          })
        )
    })

    const orderFormSchema = z.object({
      date: z.custom<Dayjs>((value) => dayjs.isDayjs(value) && value.isValid(), {
        message: t('validation.required', { _field_: t('orders.fields.date') })
      }),
      customer_id: z.number().int().min(1, t('validation.no_selection')),
      items: z
        .array(orderItemSchema)
        .min(1, t('validation.required', { _field_: t('orders.fields.items') }))
    })

    return {
      orderItemSchema,
      orderFormSchema
    }
  }, [t])
}

export type OrderFormValues = z.infer<ReturnType<typeof useOrderSchemas>['orderFormSchema']>
