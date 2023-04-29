import { Outlet } from 'react-router-dom'

export function AuthLayout () {
  return (
    <div className='auth'>
        <Outlet />
    </div>
  )
}
