import { Outlet } from 'react-router-dom'

import { Sidebar } from '@/components'

export function MainLayout () {
  return (
    <div className='app-container relative'>
      <Sidebar />
      <div className=''>
        <div></div>
        <Outlet />
      </div>
    </div>
  )
}
