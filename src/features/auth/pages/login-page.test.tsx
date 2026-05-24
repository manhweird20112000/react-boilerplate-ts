import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LoginPage } from './login-page'
import { BrowserRouter } from 'react-router-dom'
import { useAuth } from '../hooks/use-auth'

vi.mock('../hooks/use-auth', () => ({
  useAuth: vi.fn()
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (_key: string, defaultValue?: string) => defaultValue || _key
  })
}))

describe('LoginPage', () => {
  const mockLoginWithGoogle = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAuth as any).mockReturnValue({
      loginWithGoogle: mockLoginWithGoogle
    })
  })

  it('should render Google sign-in button', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    expect(screen.getByRole('button', { name: /Continue with Google/i })).toBeInTheDocument()
  })

  it('should call loginWithGoogle on button click', async () => {
    mockLoginWithGoogle.mockResolvedValueOnce(undefined)

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /Continue with Google/i }))

    await waitFor(() => {
      expect(mockLoginWithGoogle).toHaveBeenCalled()
    })
  })

  it('should keep button enabled after login failure', async () => {
    mockLoginWithGoogle.mockRejectedValueOnce(new Error('Google sign-in failed'))

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /Continue with Google/i }))

    await waitFor(() => {
      expect(mockLoginWithGoogle).toHaveBeenCalled()
      expect(screen.getByRole('button', { name: /Continue with Google/i })).not.toBeDisabled()
    })
  })
})
