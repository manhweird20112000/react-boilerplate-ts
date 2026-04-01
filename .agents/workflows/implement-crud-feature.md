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
  - **Field width consistency (required)**:
    - **All fields must use consistent width** (prefer `w-full`).
    - **Use a consistent layout wrapper** (prefer a `grid` container) so label/input/error blocks align across fields.
    - **Avoid per-field width styling** (e.g. mixing `w-1/2`, `max-w-*`, custom margins) unless a design spec explicitly requires it.

### 4) Validation messages must come from i18n
- **Scope note**:
  - **Only validation messages must be i18n-based**. Other UI text can be hardcoded unless there is a requirement to localize it.
  - **Toasts after API calls** should prefer the message returned by the API (available via `ResponseData.message` from `@/shared/types/common.d.ts`); only use hardcoded/i18n fallback when the API does not provide a message.
- **Current locale setup**: only `ja` exists (`public/locales/ja/translation.json`). Do not add other locale files unless explicitly required.
- **Interpolation syntax**: this project uses `{_placeholder_}` (e.g. `{_field_}`, `{_length_}`, `{_max_}`). Do **not** use the i18next default `{{placeholder}}`.
- **Key conventions (recommended)**:
  - `validation.required` — `"{_field_}が入力されていません。"`
  - `validation.min` — `"{_field_}には少なくとも{_length_}文字を含める必要があります。"`
  - `validation.max` — `"{_field_}は{_length_}文字以内にしてください。"`
  - `validation.format` — `"{_field_}の形式が正しくありません。"`
  - `features.<featureName>.<fieldName>.label`
  - `features.<featureName>.messages.createSuccess` / `updateSuccess` / `deleteSuccess`
- **In the schema**:
  - **Do not hardcode strings** in zod rules.
  - **Use i18n** to build messages via key + params (min/max, field label) using the `{_placeholder_}` syntax.
- **In the UI**:
  - **Field errors** come from the resolver (already translated).
  - **Toasts/alerts**: for API calls, prefer API-provided messages; otherwise they can be hardcoded unless the project/feature explicitly requires i18n.

### 5) Define feature pages and register them in routes + sidebar layout
- **Routes**:
  - **Register in** `src/app/routes.tsx` using `React.lazy()` with a default import:

```tsx
const FeatureListPage = lazy(
  () => import("@/features/<feature>/pages/<feature>-list-page"),
);
```

  - **Pages must use `export default`** (or `export default memo(...)`) because `React.lazy()` expects a default export.
  - **Use the correct layout** (e.g. `src/shared/layouts/admin.tsx` for the admin area). Nest the `<Route>` inside the layout route:

```tsx
<Route path="/admin" element={<LayoutAdmin />}>
  <Route path="<feature-plural>" element={<FeatureListPage />} />
</Route>
```

  - **Suspense boundary**: `App.tsx` must wrap the router outlet with `<Suspense>` for lazy-loaded pages. Verify this is in place; if not, add it.
- **Sidebar**:
  - **Add a menu item** to the `ADMIN_NAV_ITEMS` array in `src/shared/layouts/admin.tsx`.
  - **Follow the `AdminNavItem` type shape**:

```tsx
{
  to: "/admin/<feature-plural>",
  label: "表示ラベル",
  icon: <SomeIcon />,
  isActive: (pathname: string) => pathname.startsWith("/admin/<feature-plural>"),
}
```

  - **Ensure active state** matches all sub-routes (list/detail/edit) via `startsWith`.
- **Access control** (if any):
  - **Guard/role checks** live at the route level or inside the layout.

### 6) Implement the required logic (end-to-end)
- **Types**:
  - **Define** `Entity`, `CreateInput`, `UpdateInput`, `ListQuery`, `PagedResult` using **API docs** to match field names and payload keys.
  - **Reuse shared types** from `@/shared/types/common.d.ts`:
    - `Future<T>` — `Promise<AxiosResponse<ResponseData<T>>>` (standard return type for API calls).
    - `ResponseData<T>` — `{ message: string; errors?: FormErrors; data: T }` (all API responses follow this shape).
- **Services**:
  - **Base class**: `@/shared/common/base.repository.ts` provides `CRUDRepository<T>` with `create`, `get`, `update`, `delete`. It does **not** include a list method — add `getXList` in the feature service when needed.
  - **Implement** `createX`, `getXList`, `getXById`, `updateX`, `deleteX`.
  - **Return type**: all service methods should return `Future<T>` (or the appropriate `Future<PagedResult<T>>` for list).
  - **Map errors** into a consistent shape for UI/store.
- **Store (slice/saga)**:
  - **Actions**: request/success/failure for list/create/update/delete.
  - **State**: data, pagination, isLoading flags, error, lastMutation.
  - **Saga**: call service, dispatch success/failure, invalidate/refetch list when needed.
  - **Register the saga** in `src/app/root-saga.ts` (add it to the `all([...])` array).
  - **Minimal slice + saga example**:

```ts
// store/<feature>.slice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type FeatureState = {
  readonly items: readonly Feature[];
  readonly isLoading: boolean;
  readonly error: string | null;
};

const initialState: FeatureState = {
  items: [],
  isLoading: false,
  error: null,
};

const featureSlice = createSlice({
  name: "feature",
  initialState,
  reducers: {
    fetchListRequest(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchListSuccess(state, action: PayloadAction<Feature[]>) {
      state.items = action.payload;
      state.isLoading = false;
    },
    fetchListFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const featureActions = featureSlice.actions;
export default featureSlice.reducer;
```

```ts
// store/<feature>.saga.ts
import { call, put, takeLatest } from "redux-saga/effects";
import { featureActions } from "./<feature>.slice";
import { getFeatureList } from "../services/<feature>.service";

function* fetchListSaga() {
  try {
    const response = yield call(getFeatureList);
    yield put(featureActions.fetchListSuccess(response.data.data));
  } catch (err) {
    yield put(featureActions.fetchListFailure(err instanceof Error ? err.message : "Unknown error"));
  }
}

export default function* featureSaga() {
  yield takeLatest(featureActions.fetchListRequest.type, fetchListSaga);
}
```
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
    - **Example** (follows the codebase convention: arrow function + `memo` + `export default`):

```tsx
import { memo } from "react";

import { Button } from "@/shared/components/ui/button";
import { LayoutPage } from "@/shared/layouts/page-layout";

const FeatureListPage = () => {
  return (
    <LayoutPage
      heading="Feature"
      action={<Button>Create</Button>}
      filter={<div>Filters go here</div>}
      paginationBarProps={{ currentPage: 1, totalPages: 10 }}
    >
      <div>Table goes here</div>
    </LayoutPage>
  );
};

export default memo(FeatureListPage);
```
  - **Create/Edit page**: load detail (edit), wire submit → dispatch create/update.
  - **Confirm actions (required)**:
    - **All confirm flows** (delete, destructive update, discard changes, etc.) must use `src/shared/components/ui/alert-dialog.tsx`.
    - **Do not implement custom confirm modals** (or browser `confirm`) for CRUD flows.
    - **Styling constraint**: keep the dialog close to the library defaults; avoid custom styling/variants unless necessary for correctness (e.g. layout bug) or an explicit design requirement.
  - **Delete**: confirm → dispatch delete → refetch/navigate.
- **Form component**:
  - **React Hook Form + Zod resolver** (schema uses i18n messages).
  - **Clear props contract**, no direct dependency on the store.
  - **Use the `Field` component family** from `@/shared/components/ui/field.tsx`: `Field`, `FieldLabel`, `FieldError`, `FieldGroup`, `FieldDescription`, `FieldContent`. These provide consistent label/input/error layout and spacing.
  - **Field width consistency (required)**:
    - **Inputs/selects/textareas should be `w-full`** inside their container.
    - **Wrap all fields in `<FieldGroup>`** and each field in `<Field>` to keep widths, spacing, and error placement consistent.
    - **Display errors with `<FieldError>`** — do not create custom error rendering.
- **UX polish**:
  - **Loading/disabled states**, empty state, error + retry.
  - **Toasts**: use **Sonner** (`@/shared/components/ui/sonner.tsx`) — call `toast()` or `toast.error()`. Prefer the message returned by the API (`ResponseData.message`). If the API does not provide a message, fall back to hardcoded text (or i18n if required by the project/feature).
- **Smoke test**:
  - **Manual**: create → list updates → edit → delete.
  - **Routing**: refresh list/edit pages still works (deep links).

### 7) Review UI alignment & consistency with existing features (required before merge)
- **Design system consistency**:
  - **Prefer using** components from `src/shared/components/ui/` (button, field, dialog, table...) instead of creating new ones.
  - **Do not introduce new variants** if an equivalent pattern exists in older features; refactor to reuse.
  - **Styling constraint (required)**: prefer the default look/spacing/variants of the shared UI components; avoid custom Tailwind styling unless it is required for correctness or explicitly requested by a design spec.
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
