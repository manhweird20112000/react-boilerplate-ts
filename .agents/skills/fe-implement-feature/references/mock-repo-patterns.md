> **IMPORTANT:** MSW (Mock Service Worker) is now the **preferred** way to mock data. 
> Only use the in-memory `Mock<Feature>Repository` pattern if you need to simulate complex state 
> that is difficult to represent in MSW handlers or for quick UI-only prototyping without MSW setup.
> See `src/mocks/handlers/` for MSW examples.

---

## Goals

- Identical method signatures and return shapes as `Http<Feature>Repository` (both extend the same
  abstract `<Feature>Repository`).
- Realistic latency to expose loading-state bugs.
- Triggerable error paths to validate `setError` mapping and toast policy.
- Stable, in-memory dataset (instance-scoped `Map`) so list → detail → edit → list cycles stay
  consistent within a session.
- **Non-empty `message` on every mutation success/error response** so `shouldShowToast` fires
  during dev (read-only `list` / `get` calls may pass `''`).

---

## Skeleton

```ts
import type { AxiosResponse } from 'axios'
import type { Future, ResponseData } from '@/shared/types/common'
import { CustomerRepository } from './customer.repository'
import type { Customer, CreateInput } from '../types/customer'

const SIMULATED_LATENCY_MS = import.meta.env.MODE === 'test' ? 0 : 300
const FAILURE_RATE = 0 // raise to e.g. 0.1 to simulate flaky network

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

const okResponse = <T>(data: T, message: string): AxiosResponse<ResponseData<T>> => ({
  data: { data, message, errors: {} },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {} as never
})

const errorResponse = <T>(
  status: number,
  message: string,
  errors: Record<string, string[]> = {}
): AxiosResponse<ResponseData<T | null>> => ({
  data: { data: null, message, errors },
  status,
  statusText: 'Error',
  headers: {},
  config: {} as never
})

export class MockCustomerRepository extends CustomerRepository {
  private readonly store: Map<string, Customer> = new Map()

  list(): Future<Customer[]> {
    return wait(SIMULATED_LATENCY_MS).then(() => okResponse(Array.from(this.store.values()), ''))
  }

  create(input: CreateInput): Future<Customer> {
    return wait(SIMULATED_LATENCY_MS).then(() => {
      if (Math.random() < FAILURE_RATE) {
        return errorResponse<Customer>(500, 'Mock failure')
      }
      const id: string = crypto.randomUUID()
      const customer: Customer = {
        id,
        ...input,
        createdAt: new Date().toISOString()
      }
      this.store.set(id, customer)
      return okResponse(customer, 'Customer created.')
    })
  }
}
```

> **Note:** `okResponse` requires an explicit `message` argument — pass `''` only for read-style
> calls (list / get) where no toast is desired. Pass a real message for mutations so dev can verify
> toast wiring without inventing fallback strings.

---

## Patterns

### Pagination

Mirror server-side pagination (matches the project's paginated envelope):

```ts
list(params: { page: number; per_page: number }): Future<PaginatedResponse<Customer>> {
  return wait(SIMULATED_LATENCY_MS).then(() => {
    const all: Customer[] = Array.from(this.store.values())
    const start: number = (params.page - 1) * params.per_page
    const items: Customer[] = all.slice(start, start + params.per_page)
    return okResponse({
      data: items,
      total: all.length,
      total_page: Math.ceil(all.length / params.per_page),
      page: params.page,
      per_page: params.per_page,
    }, '')
  })
}
```

### Server-side validation errors

Return `ResponseData.errors` to exercise `setError` in forms:

```ts
return wait(SIMULATED_LATENCY_MS).then(() =>
  errorResponse<Customer>(422, 'Validation failed', {
    name: ['Name already exists.']
  })
)
```

### Latency variance

For demos and bug-hunting:

```ts
const variableLatency = (): number => 200 + Math.floor(Math.random() * 600)
```

### Failure injection (toggle for QA)

```ts
import { getStorage } from '@/infra/storage'

const isFailureModeOn = (): boolean => getStorage('mock:failures') === 'on'

if (isFailureModeOn() && Math.random() < 0.3) {
  return errorResponse<Customer>(500, 'Simulated failure')
}
```

---

## Wiring

If the feature uses the factory (matrix row 3), the mock is wired through it — see
`repository-factory-pattern.md`. Hooks never instantiate the mock directly:

```ts
import { useMemo } from 'react'
import { createCustomerRepository } from '../services/customer-repository.factory'

const repository = useMemo(() => createCustomerRepository(), [])
```

If the feature is mock-only (matrix row 2), the hook instantiates directly:

```ts
import { useMemo } from 'react'
import { MockCustomerRepository } from '../services/mock-customer.repository'

const repository = useMemo(() => new MockCustomerRepository(), [])
```

To force the mock from a Storybook story or integration test (factory case):

```ts
const repository = useMemo(() => createCustomerRepository('mock'), [])
```

---

## Anti-patterns

- ❌ Returning bare `T` instead of `AxiosResponse<ResponseData<T>>` — breaks toast and error mapping.
- ❌ Zero-latency mocks in dev — hides loading/skeleton bugs. Test mode (`MODE === 'test'`) is the
  only place latency should be 0.
- ❌ `throw`ing instead of returning a non-2xx response — diverges from how axios actually behaves
  with the project's HTTP client (resolved with status, not rejected).
- ❌ Persisting to `localStorage` without the `LocalStorage` wrapper from `@/infra/storage`.
- ❌ Sharing module-level `Map` across mock instances — causes leaks across hot reload; keep it
  instance-scoped.
- ❌ Adding `seed()` / `clear()` / inspection methods to the abstract repository — keep test-only
  API on the concrete mock and access via `instanceof` in tests if needed.
- ❌ Empty `message` on mutation responses — `shouldShowToast` will silently never fire and you
  won't know if toast wiring works until production.
