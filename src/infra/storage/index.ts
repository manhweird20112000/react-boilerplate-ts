import Cookies from 'js-cookie'

type StorageType = 'cookie' | 'storage' | 'session'

abstract class IStorageAdapter {
  abstract getStorage(key: string): string | null
  abstract deleteStorage(key: string): void
  abstract setStorage(key: string, value: string): void
  abstract clearStorage(): void
}

class StorageService implements IStorageAdapter {
  private readonly type: StorageType = 'cookie'

  constructor(type: StorageType) {
    this.type = type
  }

  getStorage(key: string): string | null {
    switch (this.type) {
      case 'cookie':
        return Cookies.get(key) || null
      case 'storage':
        return localStorage.getItem(key)
      case 'session':
        return sessionStorage.getItem(key)
    }
  }

  deleteStorage(key: string): void {
    switch (this.type) {
      case 'cookie':
        Cookies.remove(key)
        break
      case 'storage':
        localStorage.removeItem(key)
        break
      case 'session':
        sessionStorage.removeItem(key)
        break
    }
  }

  setStorage(key: string, value: string): void {
    switch (this.type) {
      case 'cookie':
        Cookies.set(key, value)
        break
      case 'storage':
        localStorage.setItem(key, value)
        break
      case 'session':
        sessionStorage.setItem(key, value)
        break
    }
  }

  clearStorage(): void {
    switch (this.type) {
      case 'storage':
        localStorage.clear()
        break
      case 'session':
        sessionStorage.clear()
        break
    }
  }
}

export const LocalStorage = new StorageService('storage')
export const SessionStorage = new StorageService('session')
export const CookieStorage = new StorageService('cookie')
