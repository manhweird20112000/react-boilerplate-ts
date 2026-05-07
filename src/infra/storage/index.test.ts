import { describe, it, expect, beforeEach, vi } from 'vitest'
import Cookies from 'js-cookie'
import { CookieStorage, LocalStorage, SessionStorage } from './index'

vi.mock('js-cookie', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn()
  }
}))

describe('StorageService', () => {
  describe('CookieStorage', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('should get value from cookies', () => {
      vi.mocked(Cookies.get).mockReturnValue('test-value' as any)
      const value = CookieStorage.getStorage('test-key')
      expect(Cookies.get).toHaveBeenCalledWith('test-key')
      expect(value).toBe('test-value')
    })

    it('should return null if cookie is not found', () => {
      vi.mocked(Cookies.get).mockReturnValue(undefined as any)
      const value = CookieStorage.getStorage('test-key')
      expect(value).toBeNull()
    })

    it('should set value in cookies', () => {
      CookieStorage.setStorage('test-key', 'test-value')
      expect(Cookies.set).toHaveBeenCalledWith('test-key', 'test-value')
    })

    it('should remove value from cookies', () => {
      CookieStorage.deleteStorage('test-key')
      expect(Cookies.remove).toHaveBeenCalledWith('test-key')
    })
  })

  describe('LocalStorage', () => {
    beforeEach(() => {
      localStorage.clear()
      vi.clearAllMocks()
    })

    it('should get value from localStorage', () => {
      localStorage.setItem('test-key', 'test-value')
      const value = LocalStorage.getStorage('test-key')
      expect(value).toBe('test-value')
    })

    it('should set value in localStorage', () => {
      LocalStorage.setStorage('test-key', 'test-value')
      expect(localStorage.getItem('test-key')).toBe('test-value')
    })

    it('should remove value from localStorage', () => {
      localStorage.setItem('test-key', 'test-value')
      LocalStorage.deleteStorage('test-key')
      expect(localStorage.getItem('test-key')).toBeNull()
    })

    it('should clear localStorage', () => {
      localStorage.setItem('test-key', 'test-value')
      LocalStorage.clearStorage()
      expect(localStorage.getItem('test-key')).toBeNull()
    })
  })

  describe('SessionStorage', () => {
    beforeEach(() => {
      sessionStorage.clear()
      vi.clearAllMocks()
    })

    it('should get value from sessionStorage', () => {
      sessionStorage.setItem('test-key', 'test-value')
      const value = SessionStorage.getStorage('test-key')
      expect(value).toBe('test-value')
    })

    it('should set value in sessionStorage', () => {
      SessionStorage.setStorage('test-key', 'test-value')
      expect(sessionStorage.getItem('test-key')).toBe('test-value')
    })

    it('should remove value from sessionStorage', () => {
      sessionStorage.setItem('test-key', 'test-value')
      SessionStorage.deleteStorage('test-key')
      expect(sessionStorage.getItem('test-key')).toBeNull()
    })

    it('should clear sessionStorage', () => {
      sessionStorage.setItem('test-key', 'test-value')
      SessionStorage.clearStorage()
      expect(sessionStorage.getItem('test-key')).toBeNull()
    })
  })
})
