import { Outlet } from 'react-router-dom'
import classNames from 'classnames'

import { Navbar, Sidebar } from '@/components'
import { useAppSelector } from '@/hooks/redux-hook'

export function MainLayout () {
  const { isMenuCollapse } = useAppSelector((state) => state.app)
  return (
    <div className='app-container relative'>
      <Sidebar />
      <div className={
        classNames('float-right transition-all duration-500', {
          'w-[calc(100%_-_240px)]': !isMenuCollapse
        },
        {
          'w-[calc(100%_-_80px)]': isMenuCollapse
        }
        )
      }>
        <Navbar />
        <Outlet />
      </div>
    </div>
  )
}
