---
description: Implement a CRUD feature end-to-end (routes, layout/sidebar, i18n validation, store/services, UI)
---

## Workflow: Implement a CRUD feature (in order)

### 1) Analyze requirements (input)
- **CRUD scope**: what is the entity, which operations are required (Create / Read list / Read detail / Update / Delete).
- **API docs (if available)**: treat API docs (OpenAPI/Swagger/Postman/MD) as the source of truth for request/response shapes and **field keys**, to keep frontend types and payload keys consistent with the backend.
- **User flows**:
  - **List**: filter/sort/pagination/search? empty state? loading/error?
  - **Create/Update**: page vs dialog/drawer? cancel behavior? optimistic updates?
  - **Delete**: confirmation dialog? soft delete or hard delete?
- **Data & constraints**:
  - **Model fields**: name, data type, required/optional, default, unique.
  - **Validation rules**: min/max, regex, cross-field, server-side constraints.
  - **API contract**: endpoints, request/response shape, error codes, paging format.
- **Non-functional**:
  - **Permissions**: who can view/edit/delete.
  - **i18n**: supported languages; keys to add.
  - **Tracking** (if any): logs/toasts, analytics, audit.

### 2) Create a plan and confirm requirements
- **Confirmation checklist**:
  - **Screens**: list, create, edit, detail (if needed).
  - **Data behavior**: data source, caching/invalidation, pagination.
  - **Edge cases**: empty, error, retry, concurrent edits.
  - **Definition of Done**: UI, validation, i18n, route/sidebar, tests (if applicable).
- **Execution plan (recommended)**:
  - **Types + contracts** → **Services** → **Store (slice/saga)** → **Pages** → **Components/Form** → **i18n messages** → **Routes + Sidebar** → **Smoke test**.

### 3) Define required components (form must be separate)
- **Feature structure (recommended for this template)**:
  - `src/features/<feature-name>/types/`:
    - **Entity/DTO types**: `.../types/*.ts`
  - `src/features/<feature-name>/services/`:
    - **API client**: `.../services/*.ts`
  - `src/features/<feature-name>/store/`:
    - **slice + saga + selectors**: `.../store/*.ts`
  - `src/features/<feature-name>/pages/`:
    - **List page**: `.../pages/<feature>-list-page.tsx`
    - **Create page** (if routed): `.../pages/<feature>-create-page.tsx`
    - **Edit page** (if routed): `.../pages/<feature>-edit-page.tsx`
    - **Detail page** (if needed): `.../pages/<feature>-detail-page.tsx`
  - `src/features/<feature-name>/components/` (if needed):
    - **Form component (separate)**: `.../components/<feature>-form.tsx`
    - **Table/List components**: `.../components/<feature>-table.tsx`, `.../components/<feature>-filters.tsx`
- **Form rules**:
  - **Do not keep the form inside the page**; the page should only wire data + handlers.
  - **The form is a separate component** with RO-RO props: initialValues, onSubmit, isSubmitting, mode.
  - **Separate the validation schema** (zod) from UI so it can be reused for create/update.

### 4) Validation messages must come from i18n
- **Scope note**:
  - **Only validation messages must be i18n-based**. Other UI text can be hardcoded unless there is a requirement to localize it.
  - **Toasts after API calls** should prefer the message returned by the API; only use hardcoded/i18n fallback when the API does not provide a message.
- **Key conventions (recommended)**:
  - `validation.required`
  - `validation.minLength`
  - `validation.maxLength`
  - `validation.invalidFormat`
  - `features.<featureName>.<fieldName>.label`
  - `features.<featureName>.messages.createSuccess` / `updateSuccess` / `deleteSuccess`
- **In the schema**:
  - **Do not hardcode strings** in zod rules.
  - **Use i18n** to build messages via key + params (min/max, field label).
- **In the UI**:
  - **Field errors** come from the resolver (already translated).
  - **Toasts/alerts**: for API calls, prefer API-provided messages; otherwise they can be hardcoded unless the project/feature explicitly requires i18n.

### 5) Define feature pages and register them in routes + sidebar layout
- **Routes**:
  - **Register in** `src/app/routes.tsx` (lazy-load from `~/features/<feature>/pages/...`).
  - **Use the correct layout** (e.g. `src/shared/layouts/admin.tsx` for the admin area).
- **Sidebar**:
  - **Add a menu item** in the layout/sidebar config (where this project defines it).
  - **Ensure active state** matches route patterns (list/detail/edit).
- **Access control** (if any):
  - **Guard/role checks** live at the route level or inside the layout.

### 6) Implement the required logic (end-to-end)
- **Types**:
  - **Define** `Entity`, `CreateInput`, `UpdateInput`, `ListQuery`, `PagedResult` using **API docs** to match field names and payload keys.
- **Services**:
  - **Implement** `createX`, `getXList`, `getXById`, `updateX`, `deleteX`.
  - **Map errors** into a consistent shape for UI/store.
- **Store (slice/saga)**:
  - **Actions**: request/success/failure for list/create/update/delete.
  - **State**: data, pagination, isLoading flags, error, lastMutation.
  - **Saga**: call service, dispatch success/failure, invalidate/refetch list when needed.
- **Pages**:
  - **List page (required layout reuse)**:
    - **Always wrap** the list screen with `src/shared/layouts/page-layout.tsx` (`LayoutPage`) to keep a consistent page header/actions/filter/pagination area across features.
    - **Map layout slots consistently**:
      - `heading`: page title (string or i18n node)
      - `action`: primary actions (e.g. Create button)
      - `filter`: filters/search UI
      - `children`: table/list + empty/loading/error states
      - `pagination`: custom pagination node (optional)
      - `paginationBarProps`: preferred for standard paging using `PaginationBar` (optional)
      - `isPaginationVisible`: toggle pagination area (default `true`)
    - **Example**:

```tsx
import { type ReactElement } from "react";

import { LayoutPage } from "@/shared/layouts/page-layout";

export function FeatureListPage(): ReactElement {
  return (
    <LayoutPage
      heading="Feature"
      action={<button type="button">Create</button>}
      filter={<div>Filters go here</div>}
      paginationBarProps={{ currentPage: 1, totalPages: 10 }}
    >
      <div>Table goes here</div>
    </LayoutPage>
  );
}
```
  - **Create/Edit page**: load detail (edit), wire submit → dispatch create/update.
  - **Delete**: confirm → dispatch delete → refetch/navigate.
- **Form component**:
  - **React Hook Form + Zod resolver** (schema uses i18n messages).
  - **Clear props contract**, no direct dependency on the store.
- **UX polish**:
  - **Loading/disabled states**, empty state, error + retry.
  - **Toasts**: prefer the message returned by the API (success/failure). If the API does not provide a message, fall back to hardcoded text (or i18n if required by the project/feature).
- **Smoke test**:
  - **Manual**: create → list updates → edit → delete.
  - **Routing**: refresh list/edit pages still works (deep links).

### 7) Review UI alignment & consistency with existing features (required before merge)
- **Design system consistency**:
  - **Prefer using** components from `src/shared/components/ui/` (button, field, dialog, table...) instead of creating new ones.
  - **Do not introduce new variants** if an equivalent pattern exists in older features; refactor to reuse.
- **Cross-feature UI consistency check**:
  - **Typography/spacing**: heading scale, padding/margins, table/form density.
  - **Colors & states**: hover/active/disabled, focus ring, error/success/warning.
  - **Empty/loading/error**: standardized states, consistent wording (i18n).
  - **Form UX**: labels, hints, required markers, error placement, submit/cancel placement.
- **Routing & layout consistency**:
  - **Page header/actions** (if used): title format, action buttons (Create/Edit/Delete) follow existing conventions.
  - **Sidebar active state**: list/detail/edit routes still highlight the correct menu item.
- **Quick a11y check**:
  - **Keyboard**: tab order, focus trap for dialog/drawer.
  - **ARIA/labels**: inputs have labels, buttons have accessible names.
- **Review outcome**:
  - **If it deviates**: align with existing features first, or move the pattern into shared UI components for reuse.
