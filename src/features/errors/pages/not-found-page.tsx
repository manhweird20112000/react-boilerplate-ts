import { memo, type ReactElement } from 'react'
import { Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { ErrorScreen } from '~/features/errors/components/error-screen'
import { useHead } from '~/shared/hooks/use-head'
import { Button } from '~/shared/components/ui/button'

function NotFoundPage(): ReactElement {
  const { t } = useTranslation()
  useHead({ title: t('features.errors.notFound.documentTitle') })
  return (
    <ErrorScreen
      code="404"
      eyebrow={t('features.errors.notFound.eyebrow')}
      title={t('features.errors.notFound.title')}
      description={t('features.errors.notFound.description')}
    >
      <Button nativeButton={false} render={<Link to="/" />} size="lg">
        <Home data-icon="inline-start" />
        {t('features.errors.notFound.backHome')}
      </Button>
    </ErrorScreen>
  )
}

export default memo(NotFoundPage)
