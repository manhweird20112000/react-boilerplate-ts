import Cookie, { type CookieAttributes } from 'js-cookie'
export function setStorage (key: string, value: string, options?: CookieAttributes) : void {
  Cookie.set(key, value, options)
}

export function getStorage (key: string):string | undefined {
  return Cookie.get(key)
}

export function deleteStorageKey (key: string, options?: CookieAttributes): void {
  Cookie.remove(key, options)
}

