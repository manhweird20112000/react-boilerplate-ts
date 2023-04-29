import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { useAuthentication } from '@/hooks/use-authentication'

export function AuthLayout () {
  const [isAuth] = useAuthentication()
  const navigate = useNavigate()

  useEffect(() => {
    if(isAuth) {
      navigate('/')
    }
  }, [])

  return (
    <div className='auth'>
        <Outlet />
    </div>
  )
}
