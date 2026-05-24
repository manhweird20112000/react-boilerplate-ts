import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { GoogleCallbackPage } from './google-callback-page'

const mockCompleteGoogleLogin = vi.fn()
const mockNavigate = vi.fn()

vi.mock('../hooks/use-auth', () => ({
  useAuth: () => ({
    completeGoogleLogin: mockCompleteGoogleLogin
  })
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

function renderCallback(path: string): void {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('GoogleCallbackPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should complete login and redirect when code and state are present', async () => {
    mockCompleteGoogleLogin.mockResolvedValueOnce('/dashboard')
    renderCallback('/auth/google/callback?code=abc&state=xyz')
    await waitFor(() => {
      expect(mockCompleteGoogleLogin).toHaveBeenCalledWith({ code: 'abc', state: 'xyz' })
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true })
    })
  })

  it('should show error when oauth error param is present', async () => {
    renderCallback('/auth/google/callback?error=access_denied')
    await waitFor(() => {
      expect(screen.getByText('Sign-in failed')).toBeInTheDocument()
    })
    expect(mockCompleteGoogleLogin).not.toHaveBeenCalled()
  })

  it('should show error when code or state is missing', async () => {
    renderCallback('/auth/google/callback?code=abc')
    await waitFor(() => {
      expect(screen.getByText('Sign-in failed')).toBeInTheDocument()
    })
    expect(mockCompleteGoogleLogin).not.toHaveBeenCalled()
  })

  it('should show error when callback API fails', async () => {
    mockCompleteGoogleLogin.mockRejectedValueOnce({
      response: {
        data: {
          errors: [{ code: 'UNAUTHORIZED', message: 'invalid OAuth state' }]
        }
      }
    })
    renderCallback('/auth/google/callback?code=abc&state=xyz')
    await waitFor(() => {
      expect(screen.getByText('invalid OAuth state')).toBeInTheDocument()
    })
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
