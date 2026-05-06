import { memo, type ReactElement } from 'react'
import { Home, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { ErrorScreen } from '~/features/errors/components/error-screen'
import { useHead } from '~/shared/hooks/use-head'
import { Button } from '~/shared/components/ui/button'

function ServerErrorPage(): ReactElement {
  const { t } = useTranslation()
  useHead({ title: t('features.errors.serverError.documentTitle') })
  return (
    <ErrorScreen
      code="500"
      eyebrow={t('features.errors.serverError.eyebrow')}
      title={t('features.errors.serverError.title')}
      description={t('features.errors.serverError.description')}
    >
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={() => {
          window.location.reload()
        }}
      >
        <RefreshCw data-icon="inline-start" />
        {t('features.errors.serverError.retry')}
      </Button>
      <Button nativeButton={false} render={<Link to="/" />} size="lg" variant="secondary">
        <Home data-icon="inline-start" />
        {t('features.errors.serverError.home')}
      </Button>
    </ErrorScreen>
  )
}

export default memo(ServerErrorPage)
