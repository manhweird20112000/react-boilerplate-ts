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

- `TResponse` is always `AxiosResponse<ResponseData<T>>`.
- Repository methods return `Future<T>` from `@/shared/types/common`.
- Multipart: pass `FormData` as body and `{ headers: { 'Content-Type': 'multipart/form-data' } }`.

---

## Response envelope

```ts
type ResponseData<T> = { message: string; errors?: FormErrors; data: T }
type Future<T> = Promise<AxiosResponse<ResponseData<T>>>
type FormErrors = Record<string, readonly string[]>
```

- `message` drives `message.success()` or `message.error()`.
- `errors` are mapped to `ProForm` fields via `rules` or manual `setFields`.

---

## Master-data / metadata fetch

Canonical pattern for `ProFormSelect` options:

```ts
public getMetadata(): Future<CustomerMetadata> {
  // ... build searchParams with resources
  return HttpService.get<unknown, AxiosResponse<ResponseData<CustomerMetadata>>>(
    `master-data?${searchParams.toString()}`,
  )
}
```

Hook usage:

```ts
const { data } = useQuery(['metadata'], () => repo.getMetadata())
// options = data?.data.industries.map(i => ({ label: i.name, value: i.id }))
```

---

## List filters (ProTable integration)

`ProTable` `request` prop handles pagination and filters. Repository transformation:

```ts
// repository.ts
transformParams(params: any) {
  return {
    page: params.current,
    per_page: params.pageSize,
    filters: mapToBackendFilters(params),
    orders: mapToBackendOrders(params.sorter),
  }
}
```

---

## i18n is the default validation strategy

Ant Design `rules` use `t()` or Zod schemas wrapped in hooks:

```tsx
// features/<feature>/schemas/<feature>.schema.ts
export const useFeatureSchemas = () => {
  const { t } = useTranslation()
  return useMemo(() => ({
    schema: z.object({
      email: z.string()
        .min(1, t('validation.required', { _field_: t('auth.fields.email') }))
        .email(t('validation.email'))
    })
  }), [t])
}
```

Ant Design `rules` example:
```tsx
<ProFormText
  name="email"
  rules={[
    { required: true, message: t('validation.required', { _field_: t('auth.fields.email') }) },
  ]}
/>
```

---

## Zod with React Hook Form

When using RHF, always use the `useFeatureSchemas` hook to ensure reactive translations:

```tsx
const { schema } = useFeatureSchemas()
const form = useForm({
  resolver: zodResolver(schema),
})
```

---

## Hook contract (return shape)

Hooks return an object. Never positional tuples for >2 values.

### Standard list hook

```ts
export function useFeature() {
  return {
    items,
    isLoading,
    pagination,
    refresh: () => void,
    // ... actions
  }
}
```

---

## Feedback Policy (STRICT)

Use `App.useApp()` to get `message`, `modal`, `notification`.

```ts
const { message } = App.useApp()

const handleFinish = async (values) => {
  const { data: res } = await repo.create(values)
  if (res.message) {
    message.success(res.message)
  }
}
```

---

## Anti-patterns to avoid

- Hardcoded colors: Use `token.colorPrimary` etc.
- Inline styles: Use `classNames` or `styles` props.
- Custom loading overlays: Use antd `Spin` or `Skeleton`.
- Raw `window.confirm`: Use `modal.confirm()` from `App.useApp()`.
- Mixing `react-hook-form` with `antd` Form: Use `antd` Form / `ProForm` state management directly unless explicitly requested otherwise.
