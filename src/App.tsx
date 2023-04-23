import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { SignIn } from '@/pages'

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={'/login'}
          element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
