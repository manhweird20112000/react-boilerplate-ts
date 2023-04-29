import { useEffect, useState } from 'react'

import { getStorage } from '@/utils'

export function useAuthentication () {
  const [isAuth, setIsAuth] = useState<boolean>(true)
  useEffect(() => {
    const token = getStorage('access_token')
    console.log(token)

    setIsAuth(Boolean(token?.trim() !== '' && token))
  }, [])

  return [isAuth]
}
