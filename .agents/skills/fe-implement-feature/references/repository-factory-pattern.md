# Repository Factory + Adapter Pattern (target pattern)

> **Status:** Target pattern. **Not yet adopted by any feature** in this codebase as of 2026-05.
> Use this only when the **decision matrix** in `SKILL.md` → "Data layer" sends you to the
> "Both, runtime-switchable" row (e.g. UI-first build with API landing later, demo vs staging
> toggle, comprehensive Storybook / integration tests). For single-mode features (HTTP only or
> Mock only), the established pattern is a single `Http<Feature>Repository` instantiated once at
> module scope (or `Mock<Feature>Repository` via `useMemo`) — see `project-patterns.md`. Don't
> retrofit existing single-mode features.

Combines **Adapter** (decouples data source from consumers) and **Factory** (centralizes the choice
between adapters).

---

## When to use it

Adopt the factory pattern only if **at least two** of the following are true:

- The plan explicitly says "API not ready yet — start with mock, switch to HTTP later".
- QA / demo needs to flip the data source via env / feature flag.
- Storybook stories or integration tests need to force the mock variant.
- The feature has multiple personas with very different data shapes (rare).

Otherwise stay with the single-adapter convention from `project-patterns.md`.

---

## File layout

```
features/<feature>/services/
├── <feature>.repository.ts             # Abstract (the port)
├── http-<feature>.repository.ts        # HTTP adapter
├── mock-<feature>.repository.ts        # In-memory adapter (see mock-repo-patterns.md)
└── <feature>-repository.factory.ts     # Single injection point
```

**Naming rules:**

- Abstract: `<Feature>Repository` (PascalCase class), file `<feature>.repository.ts` (kebab-case).
- Adapters: `Http<Feature>Repository`, `Mock<Feature>Repository`.
- Factory: `create<Feature>Repository` (function), file `<feature>-repository.factory.ts`.
- Mode union: `RepositoryMode = 'http' | 'mock'` (extend with `'msw'` only when MSW is in scope).

---

## Abstract repository (the port)

```ts
// features/<feature>/services/<feature>.repository.ts
import type { Future } from '@/shared/types/common'
import type {
  CreateCustomerInput,
  Customer,
  CustomerFilters,
  UpdateCustomerInput
} from '../types/customer'

export abstract class CustomerRepository {
  abstract list(params?: CustomerFilters): Future<Customer[]>
  abstract get(id: number): Future<Customer>
  abstract create(data: CreateCustomerInput): Future<Customer>
  abstract update(id: number, data: UpdateCustomerInput): Future<Customer>
  abstract delete(id: number): Future<Customer>
}
```

**Rules:**

- Every method returns `Future<T>` (= `Promise<AxiosResponse<ResponseData<T>>>`). No bare `Promise<T>`.
- No HTTP-specific types leak through (no `AxiosRequestConfig` on the public surface).
- No mock-specific helpers leak through (no `seed()`, no `clear()` — those go on the concrete mock).

---

## HTTP adapter

```ts
// features/<feature>/services/http-customer.repository.ts
import type { AxiosResponse } from 'axios'
import { HttpService } from '@/infra/api/http-service'
import type { Future, ResponseData } from '@/shared/types/common'
import { CustomerRepository } from './customer.repository'

export class HttpCustomerRepository extends CustomerRepository {
  public list(params?: CustomerFilters): Future<Customer[]> {
    return HttpService.get<Record<string, unknown>, AxiosResponse<ResponseData<Customer[]>>>(
      'company',
      this.transformParams(params)
    )
  }

  public create(data: CreateCustomerInput): Future<Customer> {
    return HttpService.post<CreateCustomerInput, AxiosResponse<ResponseData<Customer>>>(
      'company',
      data
    )
  }

  // ...get, update, delete

  private transformParams(params?: CustomerFilters): Record<string, unknown> {
    if (!params) return {}
    // map indexed filters/orders — see project-patterns.md
    return { ...params }
  }
}
```

All HTTP-specific concerns (param transformation, headers, FormData) live **only here**.

---

## Mock adapter

See `mock-repo-patterns.md` for the full skeleton (latency, error injection, pagination). Same
abstract:

```ts
import { CustomerRepository } from './customer.repository'

export class MockCustomerRepository extends CustomerRepository {
  // identical method signatures as HttpCustomerRepository
}
```

---

## Factory (single injection point)

```ts
// features/<feature>/services/customer-repository.factory.ts
import { CustomerRepository } from './customer.repository'
import { HttpCustomerRepository } from './http-customer.repository'
import { MockCustomerRepository } from './mock-customer.repository'

export type RepositoryMode = 'http' | 'mock'

const DEFAULT_MODE: RepositoryMode =
  (import.meta.env.VITE_CUSTOMER_REPO_MODE as RepositoryMode | undefined) ?? 'http'

export const createCustomerRepository = (
  mode: RepositoryMode = DEFAULT_MODE
): CustomerRepository => {
  switch (mode) {
    case 'mock':
      return new MockCustomerRepository()
    case 'http':
    default:
      return new HttpCustomerRepository()
  }
}
```

**Rules:**

- Factory exports a **function**, not a singleton — let the hook control lifecycle (memoize per render with `useMemo`).
- Default mode comes from `import.meta.env.VITE_<FEATURE>_REPO_MODE` (Vite); fall back to `'http'`.
  Document the env var in the feature's README or in the plan.
- `switch` with `default` branch — never let TypeScript's exhaustive check be the only safety net.
- The factory is the **only file** that imports concrete adapters. Hooks/components/pages MUST NOT.

---

## Hook integration

```ts
// features/<feature>/hooks/use-customers.ts
import { useMemo } from 'react'
import {
  createCustomerRepository,
  type RepositoryMode
} from '../services/customer-repository.factory'

interface UseCustomersOptions {
  mode?: RepositoryMode // optional override for tests / Storybook
}

export function useCustomers(options: UseCustomersOptions = {}) {
  const repository = useMemo(() => createCustomerRepository(options.mode), [options.mode])
  // ...rest depends only on `repository: CustomerRepository`
}
```

- Hooks **always** receive an instance from the factory — never `new HttpCustomerRepository()` directly.
- Memoize with `useMemo` so the same instance survives re-renders (important for in-memory mock state).
- Expose `mode?: RepositoryMode` so tests / stories can force mock without env vars.
- The hook return shape follows the contract in `project-patterns.md` → "Hook contract".

---

## Anti-patterns

- ❌ `const repo = new HttpCustomerRepository()` at module top of a hook — bypasses the factory
  (acceptable in single-mode features; **forbidden** once a mock is in scope).
- ❌ Hooks importing `Http<Feature>Repository` or `Mock<Feature>Repository` directly.
- ❌ `if (USE_MOCK) { ... } else { ... }` scattered across hooks/components — centralize in the factory.
- ❌ Returning a concrete subtype from the factory (`createCustomerRepository(): HttpCustomerRepository`)
  — must return the abstract `CustomerRepository`.
- ❌ Mock-only public methods (`repo.seed(...)`, `repo.clear()`) on the abstract — keep test-only
  API on the concrete mock and access via `instanceof` in tests if needed.
- ❌ Multiple factories per feature — one `<feature>-repository.factory.ts`, period.

---

## Migration checklist (when promoting an existing feature)

1. Create `<feature>-repository.factory.ts` with `createFeatureRepository`.
2. Replace module-level `repo` with `useMemo(() => createFeatureRepository(options.mode), [options.mode])` inside the hook.
3. Add `MockFeatureRepository` skeleton (see `mock-repo-patterns.md`).
4. Document the `VITE_<FEATURE>_REPO_MODE` env var (`.env.development` + plan).
5. Verify: `rg 'new (Http|Mock)\w+Repository' frontend/src/features/<feature>` — only the factory file should match.
