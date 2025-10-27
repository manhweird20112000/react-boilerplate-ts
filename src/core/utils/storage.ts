import Cookies from "js-cookie";

export abstract class IStorageAdapter {
  abstract getStorage(key: string): string;
  abstract deleteStorage(key: string): void;
  abstract setStorage(key: string, value: string): void;
  abstract clearStorage(): void;
}

export class StorageService implements IStorageAdapter {
  private readonly type: "cookie" | "storage" = "cookie";

  constructor(type: "cookie" | "storage") {
    this.type = type;
  }

  getStorage(key: string): string {
    return this.type === "cookie"
      ? Cookies.get(key) || ""
      : localStorage.getItem(key) || "";
  }

  deleteStorage(key: string): void {
    this.type === "cookie" ? Cookies.remove(key) : localStorage.removeItem(key);
  }

  setStorage(key: string, value: string): void {
    this.type === "cookie"
      ? Cookies.set(key, value)
      : localStorage.setItem(key, value);
  }

  clearStorage(): void {
    this.type === "storage" && localStorage.clear();
  }
}

export const StorageData = new StorageService("storage");
export const CookieStorageData = new StorageService("cookie");
