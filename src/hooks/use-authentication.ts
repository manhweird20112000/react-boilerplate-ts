import { useEffect, useState } from 'react'

import { getStorage } from '@/utils'

export function useAuthentication () {
  const [isAuth, setIsAuth] = useState<boolean>(false)
  useEffect(() => {
    const token = getStorage('access_token')

    setIsAuth(token?.trim() !== '')
  }, [])

  return [isAuth]
}
