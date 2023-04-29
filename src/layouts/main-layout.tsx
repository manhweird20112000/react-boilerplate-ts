import { Outlet } from 'react-router-dom'

export function MainLayout () {
  return (
    <div className='app-container'>
      <Outlet />
    </div>
  )
}
