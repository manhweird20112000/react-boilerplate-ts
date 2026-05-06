import { memo, type ReactElement } from 'react'
import { Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { ErrorScreen } from '~/features/errors/components/error-screen'
import { useHead } from '~/shared/hooks/use-head'
import { Button } from '~/shared/components/ui/button'

function ForbiddenPage(): ReactElement {
  const { t } = useTranslation()
  useHead({ title: t('features.errors.forbidden.documentTitle', '403 Forbidden') })
  return (
    <ErrorScreen
      code="403"
      eyebrow={t('features.errors.forbidden.eyebrow', 'Access Denied')}
      title={t('features.errors.forbidden.title', 'Truy cập bị từ chối')}
      description={t(
        'features.errors.forbidden.description',
        'Bạn không có quyền truy cập trang này.'
      )}
    >
      <Button nativeButton={false} render={<Link to="/" />} size="lg">
        <Home data-icon="inline-start" />
        {t('features.errors.forbidden.backHome', 'Về trang chủ')}
      </Button>
    </ErrorScreen>
  )
}

export default memo(ForbiddenPage)
