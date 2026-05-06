# BKS Auth Hub Frontend & SDK

This repository contains the **BKS Auth Hub** frontend (built with React 19, Vite, and Tailwind CSS v4) and the shared **@bks/auth-sdk**.

## @bks/auth-sdk

The SDK provides a centralized way to handle authentication across the BKS ecosystem.

### Key Features

1.  **Multi-site Session**: Each site (Auth Hub, CRM, HRM, etc.) manages its own session in `localStorage`. Tokens are not shared directly across domains for security.
2.  **SSO Handshake**: Automatic handling of cross-domain authentication via temporary codes.
3.  **Preemptive Refresh**: Background token refresh logic to keep users logged in seamlessly.
4.  **Reusable Components**: Standardized UI components for common auth flows.

### Reusable Callback Page

You can reuse the entire SSO callback logic in any client application by using the `BksSsoCallback` component. It handles code exchange, handshake redirects, and profile fetching.

```tsx
import { BksSsoCallback } from '@/sdk' // or '@bks/auth-sdk'

export default function MyCallbackPage() {
  return (
    <BksSsoCallback
      loadingComponent={<MySpinner />}
      errorComponent={(message) => <MyAlert message={message} />}
      onFinish={(targetUrl) => {
        // Optional: custom logic after successful login
      }}
    />
  )
}
```

### startLogin Optimization (`sso-service`)

The `startLogin` method is optimized to provide a faster experience:

- **Logged-in Detection**: If a user is already authenticated at the Auth Hub, `startLogin` skips the external redirect and navigates internally to the callback page with the necessary handshake parameters.
- **Service Awareness**:
  - `auth-service`: Always redirects to the home page (`/`) after login.
  - `sso-service`: Follows the redirection logic provided by the API (handshake) or the requested `redirect_url`.

## Tech Stack

| Layer     | Technologies                             |
| --------- | ---------------------------------------- |
| **Core**  | React 19, Vite 6, TypeScript 5           |
| **State** | Redux Toolkit & Saga                     |
| **UI**    | Tailwind CSS v4, shadcn/ui, Lucide React |
| **Auth**  | Axios with interceptors, PKCE, OAuth2    |

## Development

### Common Commands

- `pnpm dev` — Start Vite dev server
- `pnpm build:sdk` — Build the SDK package using `tsup`
- `pnpm lint` — Run ESLint and Prettier

### SDK Integration

To use this SDK in another project:

1. Build the SDK: `pnpm run build:sdk`
2. Link or install the package: `pnpm add ../erp-auth/frontend` (or via registry)
3. Wrap your app with `BksAuthProvider`.
