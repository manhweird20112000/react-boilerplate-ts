---
description: Implement a CRUD feature end-to-end (routes, layout/sidebar, i18n validation, services, UI; hooks/local state by default)
---

## Workflow: Implement a CRUD feature (in order)

## Required Inputs (gating)
- **At least ONE of**:
  - **UI design** (Figma / images)
  - **Text requirements**
- **Strongly recommended**:
  - **API documentation** (OpenAPI / Swagger / MD)
- **If missing**:
  - **STOP and ask for clarification**

## Form behavior (required)
- **Reset form after success (create)**
- **Keep values (edit)**
- **Disable submit when submitting**
- **Show server errors inline if available**

## Do NOT (required)
- **Do NOT hardcode API field names**
- **Do NOT duplicate UI components**
- **Do NOT bypass shared components**
- **Do NOT inline form inside page**
- **Do NOT match wireframe colors pixel-perfect** — **always base colors on the existing UI library tokens/variants** to keep the app visually consistent.

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
  - **Types + contracts** → **Services** → **State management (hooks/local state by default)** → **Pages** → **Components/Form** → **i18n messages** → **Routes + Sidebar** → **Smoke test**.

### 3) Define required components (form must be separate)
- **Feature structure (recommended for this template)**:
  - `src/features/<feature-name>/types/`:
    - **Entity/DTO types**: `.../types/*.ts`
  - `src/features/<feature-name>/services/`:
    - **API client**: `.../services/*.ts`
  - `src/features/<feature-name>/hooks/` (recommended):
    - **Feature hooks** (data loading/mutations, derived UI state): `.../hooks/*.ts`
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
  - **Required field marker (JP projects) (required)**:
    - **Convention**: `* = (必須)` for required fields.
    - **UI rule**: required fields must show `* (必須)` next to the field label (hardcoded).
    - **Scope reminder**: only validation messages are i18n-based; this required marker is **not** a validation message.
  - **Field width consistency (required)**:
    - **All fields must use consistent width** (prefer `w-full`).
    - **Inputs/selects/textareas must be 100% width by default** (`w-full`).
    - **Use a consistent layout wrapper** (prefer a `grid` container) so label/input/error blocks align across fields.
    - **Avoid per-field width styling** (e.g. mixing `w-1/2`, `max-w-*`, custom margins) unless a design spec explicitly requires it.

### 4) Validation messages must come from i18n
- **Scope note**:
  - **Only validation messages must be i18n-based**. Other UI text can be hardcoded unless there is a requirement to localize it.
  - **Toasts after API calls** should prefer the message returned by the API (available via `ResponseData.message` from `@/shared/types/common.d.ts`); only use hardcoded/i18n fallback when the API does not provide a message.
- **Locale-safe formatting (required)**:
  - **Dates/times**: do **not** hardcode formats (e.g. `YYYY-MM-DD`). Use `Intl.DateTimeFormat`.
  - **Numbers/currency**: use `Intl.NumberFormat` (do not hardcode separators/suffixes).
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
- **State management (default)**:
  - **Default approach**: keep async calls inside feature hooks/pages using the feature services; model loading/error states locally (or via a dedicated feature hook).
  - **State shape (recommended)**: data + pagination + `isLoading`/`isSubmitting` + `error` + `lastMutation`.
  - **Error handling**: add context (operation name), and prefer API-provided message when available.
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
    - **Filter layout (required)**:
      - **Layout**: use a `grid` with **12 columns** (`grid grid-cols-12 gap-3`) for filters to allow for more granular control over field widths (e.g., name/email usually wider than status/role).
      - **Reset filter (required)**:
        - Must have a **Reset filter** button.
        - Button should be **inline** with the filters (usually the last column) to minimize vertical space and improve interaction flow.
        - Button must be **disabled when not dirty** (no changes vs default values).
        - Reset must restore **default filter values** and trigger the list refresh using those defaults.
      - **Accessibility & UX**:
        - **Decorative icons**: Icons adjacent to text (e.g., in a Reset button) must have `aria-hidden="true"`.
        - **Input metadata**: Inputs must have meaningful `name`, `autocomplete`, and appropriate `type` (e.g., `email`). Set `spellCheck={false}` on email/ID fields.
        - **Typography**: Always use the ellipsis character `…` (U+2026) instead of three dots `...` in placeholders and loading text.
      - **Text rule reminder**: only validation messages use i18n; filter labels/button text can be hardcoded.
      - **Control width (required)**:
        - **All filter controls** (inputs/selects/date pickers) must be `w-full` (100% width) inside their grid column.
        - Avoid mixing `max-w-*` on form controls unless a design spec explicitly requires it.
    - **Example** (follows the codebase convention: arrow function + `memo` + `export default`):

```tsx
import { memo } from "react";

import { Button } from "@/shared/components/ui/button";
import DataTable, { DataTableColumnHeader } from "@/shared/components/data-table/data-table";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/shared/components/ui/empty";
import { LayoutPage } from "@/shared/layouts/page-layout";

const FeatureListPage = () => {
  const items: readonly Feature[] = [];
  const columns: readonly import("@tanstack/react-table").ColumnDef<Feature>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => row.original.name,
    },
  ];

  return (
    <LayoutPage
      heading="Feature"
      action={<Button>Create</Button>}
      filter={<div>Filters go here</div>}
      paginationBarProps={{ currentPage: 1, totalPages: 10 }}
    >
      {items.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No data</EmptyTitle>
            <EmptyDescription>Try adjusting filters or create a new item.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>Create</Button>
          </EmptyContent>
        </Empty>
      ) : (
        <DataTable columns={columns} data={items} />
      )}
    </LayoutPage>
  );
};

export default memo(FeatureListPage);
```
    - **Table/empty state rule (required)**:
      - **Table data must render with** `src/shared/components/data-table/data-table.tsx` (`DataTable`).
      - **Empty state must render with** `src/shared/components/ui/empty.tsx` (use the `Empty` component family).
      - **Do not rely on `DataTable`'s `emptyText`** for feature empty states; use `Empty` to keep consistent layout/CTA and allow richer content.
    - **Table header/body alignment (required)**:
      - **Always keep header and body columns aligned** by applying the same alignment/width rules to both.
      - **Preferred approach**: use `columnDef.meta` with `headerClassName` + `cellClassName` so `TableHead` and `TableCell` share the same layout constraints.
      - **Actions column UX**:
        - Avoid `text-right` + `justify-end` unless the design explicitly wants actions pushed to the far edge.
        - If right-aligned actions are required, keep consistent padding (don’t let buttons feel glued to the cell edge).
  - **Create/Edit page**: load detail (edit), wire submit → dispatch create/update.
  - **Confirm actions (required)**:
    - **All confirm flows** (delete, destructive update, discard changes, etc.) must use `src/shared/components/ui/alert-dialog.tsx`.
    - **Do not implement custom confirm modals** (or browser `confirm`) for CRUD flows.
    - **Never execute destructive actions immediately** from a table row/menu without a confirm modal (or an explicit undo window requirement).
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
- **Web Interface Guidelines review (required)**:
  - **Gating rule (must-do before merge)**: you **must** review the relevant UI files using `@.agents/skills/web-design-guidelines/SKILL.md`.
  - **Scope**: include all touched UI files (typically `pages/*.tsx`, `components/*.tsx`, `shared/components/ui/*` used/modified, and any new styles/layout wrappers).
  - **Timing**: do this **after** the UI is functionally complete (states + empty/loading/error) and before final review/merge.
  - **Always fetch the latest rules** from `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` before reviewing.
  - **Report findings** in the required `file:line` format.
- **Review outcome**:
  - **If it deviates**: align with existing features first, or move the pattern into shared UI components for reuse.
