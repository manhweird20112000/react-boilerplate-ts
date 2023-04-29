import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { getStorage } from '@/utils'

export function AuthLayout () {
  const navigate = useNavigate()

  useEffect(() => {
    if(getStorage('access_token') != null) {
      navigate('/')
    }
  }, [])

  return (
    <div className='auth'>
        <Outlet />
    </div>
  )
}
