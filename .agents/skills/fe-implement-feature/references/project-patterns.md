# Project-specific patterns (read once per session)

Concrete patterns already in this codebase. Don't reinvent — extend.

---

## HttpService API

Single import: `import { HttpService } from '@/infra/api/http-service'`

```ts
HttpService.get<TParams, TResponse>(path, params?, config?)
HttpService.post<TBody, TResponse>(path, body, config?)
HttpService.put<TBody, TResponse>(path, body, config?)
HttpService.delete<TResponse>(path, config?)
```

- `TResponse` is always `AxiosResponse<ResponseData<T>>` (= `Future<T>`).
- Repository methods return `Future<T>` from `@/shared/types/common` so toasts and `setError` mapping work.
- Multipart: pass `FormData` as body and `{ headers: { 'Content-Type': 'multipart/form-data' } }`.
- Blob download: pass `{ responseType: 'blob' }` as the third (axios config) arg.

---

## Response envelope

```ts
type ResponseData<T> = { message: string; errors?: FormErrors; data: T }
type Future<T> = Promise<AxiosResponse<ResponseData<T>>>
type FormErrors = Record<string, readonly string[]>
```

- `message` drives toast copy. Empty string → no toast.
- `errors` shape feeds `setError` in forms.

---

## Master-data / metadata fetch (forms with selects)

Canonical pattern from `customers/`:

```ts
public getMetadata(): Future<CustomerMetadata> {
  const resources = { industries: {}, sizes: {}, statuses: {}, sources: {}, users: {}, /* … */ }
  const searchParams = new URLSearchParams()
  for (const [resource, params] of Object.entries(resources)) {
    searchParams.set(`resources[${resource}]`, JSON.stringify(params))
  }
  return HttpService.get<unknown, AxiosResponse<ResponseData<CustomerMetadata>>>(
    `master-data?${searchParams.toString()}`,
  )
}
```

Hook fetches metadata once on mount and passes it down to the form via props. Don't refetch per-render.

---

## List filters (server-side, indexed)

Backend expects array-of-objects style filters and orders:

```
filters[0][key]=search_name
filters[0][data]=acme
filters[1][key]=industry_id
filters[1][data]=3
orders[0][key]=created_at
orders[0][dir]=desc
```

Implement the mapping inside the HTTP repository's `transformParams` (private). Hooks pass the typed `<Feature>Filters` object; the repository handles the wire format.

---

## i18n is the default validation strategy in this project

Every schema in `features/*/schemas/*.ts` uses `useTranslation()`:

```ts
export const useFeatureSchemas = () => {
  const { t } = useTranslation()
  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, {
          message: t('validation.required', { _field_: t('feature.fields.name') })
        })
      }),
    [t]
  )
  return { schema }
}
```

- Single `schema` (covers create + edit) is the established norm. Only split into `createSchema` / `updateSchema` when the two truly diverge.
- Locale keys live in `frontend/public/locales/{vi,en}/translation.json`.
- See `validation-i18n.md` for the `validation.*` vs `<feature>.fields.*` contract.

Inline English is acceptable only for throwaway prototypes or features explicitly marked non-localized.

---

## Hook contract (return shape)

**Hooks return an object with named fields. Never positional tuples for >2 values.** This keeps call
sites readable and lets consumers destructure only what they need.

### Standard list hook

```ts
export function useFeature() {
  // ...internal state + repository
  return {
    items, // T[]
    isLoading, // boolean
    error, // string | null
    filters, // FeatureFilters
    pagination, // { page, perPage, total, totalPages }

    setFilters, // (next: Partial<FeatureFilters>) => void
    refetch, // () => Promise<void>
    create, // (input: CreateInput) => Promise<Feature | null>
    update, // (id: number, input: UpdateInput) => Promise<Feature | null>
    delete: remove // (id: number) => Promise<boolean>
  }
}
```

### Standard detail hook

```ts
export function useFeatureDetail(id: number) {
  return {
    item, // Feature | null
    isLoading, // boolean
    error, // string | null

    refetch, // () => Promise<void>
    update // (input: UpdateInput) => Promise<Feature | null>
  }
}
```

### Rules

- **Naming:** boolean flags use `isX` / `hasX` / `canX`. Mutation methods use verbs (`create`, `update`,
  `delete`, `refetch`, `assignOwner`). State setters use `setX`.
- **Return type:** export a `UseFeatureReturn` type when the hook is consumed by 2+ files; lets
  consumers type their props without re-declaring the shape.
- **Error surface:** mutation methods return the success value or `null` / `false` on failure, never
  throw. The hook converts thrown errors to local `error` state and (when applicable) toasts.
- **Loading granularity:** if mutations need their own pending state, expose `isCreating`,
  `isUpdating`, `isDeleting` separately from `isLoading`. Don't multiplex one boolean.
- **Memoization:** all returned functions are stable across renders (`useCallback`); the returned
  object itself need not be memoized unless a downstream `React.memo` consumer requires it.
- **No tuple returns** like `const [items, setItems] = useFeature()` for non-trivial hooks. Tuples
  are reserved for primitives that mirror `useState` semantics.

---

## Repository instantiation

The matrix lives in `SKILL.md` → "Data layer / Decision matrix". Quick recap:

| Scenario  | Hook does                                                                        |
| --------- | -------------------------------------------------------------------------------- |
| HTTP only | `const repo = new HttpFeatureRepository()` at module scope                       |
| Mock only | `useMemo(() => new MockFeatureRepository(), [])` inside the hook                 |
| Both      | `useMemo(() => createFeatureRepository(options.mode), [options.mode])` (factory) |

Mocks (`pipelines/`) currently use the Mock-only row. The factory pattern (see
`repository-factory-pattern.md`) is the **target** when a feature legitimately needs both adapters
— don't retrofit existing single-mode features.

---

## Toast policy (canonical — single source of truth)

Feature hooks orchestrate toasts after API calls. Source is **always** `ResponseData.message`. No
fallback strings invented in the client.

### `shouldShowToast` helper

Add this helper **once** to `shared/lib/toast.ts` (or an existing file there). Every feature
imports the shared helper — do not redefine per feature.

```ts
// shared/lib/toast.ts
import { toast } from 'sonner'

export const shouldShowToast = (msg?: string): boolean => !!msg?.trim()

export { toast }
```

### Usage

```ts
import { shouldShowToast, toast } from '@/shared/lib/toast'

const { data: response } = await repo.create(input)
if (shouldShowToast(response.message)) {
  toast.success(response.message)
}
```

- Empty / whitespace-only message → no toast. Server is authoritative.
- The current `customers/` hooks have hardcoded VN fallbacks — that's tech debt, not the target.
  Don't copy that pattern in new code.
- For mocks, always pass a non-empty `message` in success/error responses so the guard fires
  during dev (see `mock-repo-patterns.md`).

---

## Layouts in practice

| Layout              | Source file                               | Used by                                      | When                            |
| ------------------- | ----------------------------------------- | -------------------------------------------- | ------------------------------- |
| `LayoutPage`        | `src/shared/layouts/layout-page.tsx`      | `customers`, `contacts`, `pipelines`, etc.   | List page, detail page          |
| `LayoutFormPage`    | `src/shared/layouts/layout-form-page.tsx` | (none yet)                                   | Reserved for full-page forms    |
| `FormDialogContent` | `src/shared/components/ui/dialog.tsx`     | `customer-dialogs`, `assign-owner-dialog`, … | All create/edit forms (default) |

**Default for create/edit = dialog**. Use `LayoutFormPage` only when explicitly requested or when the form is too large for a 720px dialog (>10 fields with multiple sections).

---

## Detail pages

- Lazy-load each tab's data with its own hook (`useCustomerContacts`, `useCustomerInteractions`, `useFilesHub`).
- Tab state via URL query param (`?tab=contacts`) using `useSearchParams` so deep links work.
- Hard skeleton on first load; per-tab skeleton afterwards.
- Edit a section → open `FormDialogContent`; never inline a form on the detail page.

---

## Anti-patterns to avoid (existing-code lessons)

- `result as any` to bypass the paginated response shape — declare a proper `PaginatedResponse<T>` instead.
- Cross-feature hook imports (e.g. `customers/` importing `interaction-log/services/` directly) — use `shared/services/` if shared, or duplicate the call inside the consuming feature's repository.
- `window.breadcrumbLabels` global mutation — should be a Zustand or Redux slice, not `window.*`. Don't extend; refactor when touched.
- Hardcoded VN/EN strings in toasts and validation messages — always go through `t()` + server `message`.
- Positional tuple returns from non-trivial hooks — see "Hook contract" above.
- Redefining `shouldShowToast` per feature — import from `@/shared/lib/toast`.
