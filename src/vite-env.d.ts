/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_MSW?: string
  readonly VITE_USERS_MODE?: string
  readonly VITE_USERS_HTTP_ENABLED?: string
  readonly VITE_SYSTEM_SETTINGS_MODE?: string
  readonly VITE_SYSTEM_SETTINGS_HTTP_ENABLED?: string
}
