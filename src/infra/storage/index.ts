import Cookies from 'js-cookie'

type StorageType = 'cookie' | 'storage' | 'session'

abstract class StorageAdapter {
  abstract getStorage(key: string): string | null
  abstract deleteStorage(key: string): void
  abstract setStorage(key: string, value: string): void
  abstract clearStorage(): void
}

function readWebStorage(storage: Storage, key: string): string | null {
  try {
    return storage.getItem(key)
  } catch {
    return null
  }
}

function writeWebStorage(storage: Storage, key: string, value: string): void {
  try {
    storage.setItem(key, value)
  } catch {
    // Private mode / quota / disabled storage
  }
}

function removeWebStorage(storage: Storage, key: string): void {
  try {
    storage.removeItem(key)
  } catch {
    // Private mode / disabled storage
  }
}

function clearWebStorage(storage: Storage): void {
  try {
    storage.clear()
  } catch {
    // Private mode / disabled storage
  }
}

class StorageService implements StorageAdapter {
  private readonly type: StorageType = 'cookie'

  constructor(type: StorageType) {
    this.type = type
  }

  getStorage(key: string): string | null {
    switch (this.type) {
      case 'cookie':
        return Cookies.get(key) || null
      case 'storage':
        return readWebStorage(localStorage, key)
      case 'session':
        return readWebStorage(sessionStorage, key)
    }
  }

  deleteStorage(key: string): void {
    switch (this.type) {
      case 'cookie':
        Cookies.remove(key)
        break
      case 'storage':
        removeWebStorage(localStorage, key)
        break
      case 'session':
        removeWebStorage(sessionStorage, key)
        break
    }
  }

  setStorage(key: string, value: string): void {
    switch (this.type) {
      case 'cookie':
        Cookies.set(key, value)
        break
      case 'storage':
        writeWebStorage(localStorage, key, value)
        break
      case 'session':
        writeWebStorage(sessionStorage, key, value)
        break
    }
  }

  clearStorage(): void {
    switch (this.type) {
      case 'cookie':
        // js-cookie cannot enumerate all cookies; clear by known keys at call sites
        break
      case 'storage':
        clearWebStorage(localStorage)
        break
      case 'session':
        clearWebStorage(sessionStorage)
        break
    }
  }
}

export const LocalStorage = new StorageService('storage')
export const SessionStorage = new StorageService('session')
export const CookieStorage = new StorageService('cookie')
