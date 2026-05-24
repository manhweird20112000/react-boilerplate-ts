import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { RegisterPage } from './register-page'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

describe('RegisterPage', () => {
  it('should redirect to login page', () => {
    render(
      <MemoryRouter initialEntries={['/auth/register']}>
        <Routes>
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    )

    expect(document.body.textContent).toContain('Login Page')
  })
})
