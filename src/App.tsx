import React, { Suspense } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation
} from 'react-router-dom'

import { AuthLayout, MainLayout } from '@/layouts'
import { getStorage } from '@/utils'

const SignIn = React.lazy(async () => await import('@/pages/auth/sign-in'))
const ForgotPassword = React.lazy(async () => await import('@/pages/auth/forgot-password'))

function Authentication ({ children } : { children: JSX.Element }) {
  const location = useLocation()
  if(getStorage('access_token') == null) {
    return <Navigate
      to='/login'
      state={{ from: location }}
      replace={true}/>
  }
  return children
}

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={<AuthLayout />}>
          <Route
            path='/login'
            element={
            <Suspense>
              <SignIn />
            </Suspense>
            } />
            <Route
              path='/forgot-password'
              element={<Suspense>
              <ForgotPassword />
            </Suspense>} />
        </Route>
        <Route
          path={'/'}
          element={
          <Authentication>
            <MainLayout />
          </Authentication>
          } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
