import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation
} from 'react-router-dom'

import { useAuthentication } from '@/hooks/use-authentication'
import { AuthLayout, MainLayout } from '@/layouts'
import { SignIn } from '@/pages'

function Authentication ({ children } : { children: JSX.Element }) {
  const [isAuth] = useAuthentication()
  const location = useLocation()

  if(!isAuth) {
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
            element={<SignIn />} />
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
