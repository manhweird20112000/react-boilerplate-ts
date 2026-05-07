import { render, screen, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthProvider } from './auth-provider'
import { useAuth } from './use-auth'
import { App } from 'antd'
import { authRepo } from '../services/factory'

// Mocking antd App
const TestComponent = () => {
  const { user, isLoading, login, logout } = useAuth()
  return (
    <div>
      <div data-testid="user-email">{user?.email}</div>
      <div data-testid="is-loading">{isLoading.toString()}</div>
      <button onClick={() => login({ email: 'admin@example.com', password: 'password' })}>Login</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should initialize with no user', async () => {
    vi.spyOn(authRepo, 'me').mockRejectedValueOnce(new Error('Unauthorized'))

    render(
      <App>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </App>
    )

    expect(screen.getByTestId('is-loading')).toHaveTextContent('true')

    await waitFor(() => {
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false')
    })

    expect(screen.getByTestId('user-email')).toHaveTextContent('')
  })

  it('should fetch user on mount if logged in', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' }
    vi.spyOn(authRepo, 'me').mockResolvedValueOnce({
      data: { success: true, data: { user: mockUser }, message: 'Success' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    } as any)

    render(
      <App>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </App>
    )

    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com')
    })
  })

  it('should login successfully', async () => {
    vi.spyOn(authRepo, 'me').mockRejectedValueOnce(new Error('Unauthorized'))
    const mockUser = { id: '1', email: 'admin@example.com', name: 'Admin' }
    vi.spyOn(authRepo, 'login').mockResolvedValueOnce({
      data: { success: true, data: { user: mockUser }, message: 'Login Success' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    } as any)

    render(
      <App>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </App>
    )

    await waitFor(() => {
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false')
    })

    act(() => {
      screen.getByText('Login').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('admin@example.com')
    })
  })

  it('should logout successfully', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' }
    vi.spyOn(authRepo, 'me').mockResolvedValueOnce({
      data: { success: true, data: { user: mockUser }, message: 'Success' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    } as any)
    vi.spyOn(authRepo, 'logout').mockResolvedValueOnce({} as any)

    render(
      <App>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </App>
    )

    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com')
    })

    act(() => {
      screen.getByText('Logout').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('')
    })
  })
})
