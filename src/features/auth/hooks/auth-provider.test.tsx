import { render, screen, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from './auth-provider'
import { useAuth } from './use-auth'
import { App } from 'antd'
import { authRepo } from '../services/factory'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (_key: string, fallback: string) => fallback
  })
}))

const TestComponent = () => {
  const { user, isLoading, loginWithGoogle, logout } = useAuth()
  return (
    <div>
      <div data-testid="user-email">{user?.email}</div>
      <div data-testid="is-loading">{isLoading.toString()}</div>
      <button onClick={() => loginWithGoogle()}>Google Login</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  )
}

function renderAuthProvider(initialEntry = '/'): ReturnType<typeof render> {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <App>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </App>
    </MemoryRouter>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    vi.stubGlobal('location', { ...window.location, assign: vi.fn() })
  })

  it('should initialize with no user', async () => {
    vi.spyOn(authRepo, 'me').mockRejectedValueOnce(new Error('Unauthorized'))

    renderAuthProvider()

    expect(screen.getByTestId('is-loading')).toHaveTextContent('true')

    await waitFor(() => {
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false')
    })

    expect(screen.getByTestId('user-email')).toHaveTextContent('')
  })

  it('should fetch user on mount if logged in', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User', role: 'admin', permissions: [] }
    vi.spyOn(authRepo, 'me').mockResolvedValueOnce({
      data: { success: true, data: { user: mockUser }, message: 'Success' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    } as any)

    renderAuthProvider()

    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com')
    })
  })

  it('should start Google login successfully', async () => {
    vi.spyOn(authRepo, 'me').mockRejectedValueOnce(new Error('Unauthorized'))
    vi.spyOn(authRepo, 'getGoogleLoginUrl').mockResolvedValueOnce({
      data: {
        success: true,
        data: { url: 'https://accounts.google.com/o/oauth2/v2/auth?client_id=mock' },
        message: ''
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    } as any)

    renderAuthProvider()

    await waitFor(() => {
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false')
    })

    act(() => {
      screen.getByText('Google Login').click()
    })

    await waitFor(() => {
      expect(window.location.assign).toHaveBeenCalledWith(
        'https://accounts.google.com/o/oauth2/v2/auth?client_id=mock'
      )
    })
  })

  it('should skip me on google callback route until oauth completes', async () => {
    const meSpy = vi.spyOn(authRepo, 'me')

    renderAuthProvider('/auth/google/callback?code=abc&state=xyz')

    await waitFor(() => {
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false')
    })

    expect(meSpy).not.toHaveBeenCalled()
  })

  it('should logout successfully', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User', role: 'admin', permissions: [] }
    vi.spyOn(authRepo, 'me').mockResolvedValueOnce({
      data: { success: true, data: { user: mockUser }, message: 'Success' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    } as any)
    vi.spyOn(authRepo, 'logout').mockResolvedValueOnce(undefined)

    renderAuthProvider()

    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com')
    })

    act(() => {
      screen.getByText('Logout').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('')
      expect(authRepo.logout).toHaveBeenCalled()
    })
  })
})
