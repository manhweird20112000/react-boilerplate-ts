---
description: Implement a CRUD feature end-to-end (routes, layout/sidebar, validation i18n only, hardcoded UI copy, services, UI; hooks/local state by default)
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

## Copy / i18n (required — strict)
- **Only validation messages** (Zod resolver / field errors) are loaded from i18n (`public/locales/ja/translation.json` under `validation.*`).
- **Everything else is hardcoded** in JSX/TS: page titles, headings, buttons, filters, table headers, empty states, dialog titles, alert-dialog copy, placeholders (except where you intentionally mirror validation), sidebar labels.
- **API result toasts** (success/error after mutations): **not** covered by “hardcoded UI copy” — see **Toasts after API calls** in step 4 (backend `message` only; no frontend fallback text).
- **Do not** add `features.*` UI keys, `t("...")` for labels, or extra locale entries for non-validation copy unless the product explicitly requires full localization later.

## Responsive by default (required)
- **Mobile-first mindset**: all pages, forms, filters, dialogs, and tables must be usable on mobile viewports (`≥ 320px`) without horizontal scroll or clipped content.
- **Breakpoint strategy**: start with a single-column stacked layout, then add columns with `sm:`/`md:` breakpoints.
- **Key responsive checkpoints**:
  - **Filters**: stack to `col-span-12` on mobile, split into columns on `md:`.
  - **Forms**: single column by default; two-column grids only from `md:` up.
  - **Tables**: ensure the table container scrolls horizontally (`overflow-x-auto`) if columns exceed viewport width; avoid hiding columns without a clear design spec.
  - **Dialogs**: use `max-w-[calc(100%-2rem)]` on mobile (the Dialog component default) so the dialog never touches screen edges.
  - **Action buttons**: use `flex flex-col-reverse gap-2 sm:flex-row sm:justify-end` for form footers so the primary action is reachable on small screens.
  - **Page heading + action**: stack vertically on mobile (`flex-col`), side-by-side from `md:` up — already handled by `LayoutPage`.
- **Content safety**: use `min-w-0` + `truncate` for bounded text; `break-words` for user-generated content; never rely on fixed widths for text containers.
- **Testing reminder**: after implementation, visually verify at **320px**, **768px**, and **1280px** widths.

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
  - **Locale**: default is `ja`; add or extend **only** `validation.*` keys in `translation.json` when new validation rules need messages.
  - **Tracking** (if any): logs/toasts, analytics, audit.

### 2) Create a plan and confirm requirements
- **Confirmation checklist**:
  - **Screens**: list, create, edit, detail (if needed).
  - **Data behavior**: data source, caching/invalidation, pagination.
  - **Edge cases**: empty, error, retry, concurrent edits.
  - **Definition of Done**: UI (hardcoded copy), validation + **validation-only** i18n, route/sidebar, tests (if applicable).
- **Execution plan (recommended)**:
  - **Types + contracts** → **Services** → **State management (hooks/local state by default)** → **Pages** → **Components/Form** → **validation keys in `translation.json` (if new rules)** → **Routes + Sidebar** → **Smoke test**.

### 3) Define required components (form must be separate)
- **Feature structure (recommended for this template)**:
  - `src/features/<feature-name>/types/`:
    - **Entity/DTO types**: `.../types/*.ts`
  - `src/features/<feature-name>/schemas/`:
    - **Validation schemas** (Zod + i18n for error messages only): `.../schemas/<feature>.schema.ts`
    - **Pattern**: export a hook (e.g. `useFeatureSchemas`) that wraps `useTranslation()` and returns `{ createSchema, updateSchema }`.
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
    - **Convention**: `(必須)` for required fields.
    - **UI rule**: required fields must show `(必須)` next to the field label (hardcoded), styled with `<span className="text-destructive font-bold text-xs ml-1">(必須)</span>`.
    - **Scope reminder**: only validation messages are i18n-based; this required marker is **not** a validation message.
  - **Field width consistency (required)**:
    - **All fields must use consistent width** (prefer `w-full`).
    - **Inputs/selects/textareas must be 100% width by default** (`w-full`).
    - **Use a consistent layout wrapper** (prefer a `grid` container) so label/input/error blocks align across fields.
    - **Avoid per-field width styling** (e.g. mixing `w-1/2`, `max-w-*`, custom margins) unless a design spec explicitly requires it.
  - **Form dialog width (create/edit) (required)**:
    - **When create/update is implemented in a `Dialog`** (not a full routed page), **`DialogContent` must use `max-w-xl` and `sm:max-w-xl`** on `DialogContent` (36rem / ~576px).
    - **Purpose**: consistent form density across features and avoids overly wide dialogs on large viewports.

### 4) Validation messages only — i18n; all other copy — hardcoded
- **Hard rule**:
  - **i18n (`t()`, `translation.json`)**: **only** for strings returned by Zod (and passed through the resolver to `<FieldError>`). Reuse or add keys under `validation.*` only.
  - **Hardcode** all visible UI strings everywhere else (labels, buttons, dialogs, tables, filters, empty states). **Do not** invent toast text for API outcomes (see below).
- **Toasts after API calls (required)**:
  - **Source of truth**: show **only** `ResponseData.message` from `@/shared/types/common.d.ts` (read from the successful or error response body your API returns).
  - **If `message` is missing, empty, or whitespace** (after `trim()`): **do not** show a toast with any frontend-written copy — **skip the toast** entirely. **Do not** substitute i18n, hardcoded Japanese, or generic strings (“保存しました”, “エラーが発生しました”, etc.).
  - **Same rule for `toast.error`**: use the backend-provided message from the error payload when the API exposes it in the same `ResponseData` shape; otherwise omit the toast (rely on inline `errors` / validation / empty state as designed).
  - **Allowed without backend text**: non-toast UI feedback (loading spinners, disabling buttons, inline field errors from `errors`, list refresh) — not a Sonner message.
- **Locale-safe formatting (required)**:
  - **Dates/times**: do **not** hardcode formats (e.g. `YYYY-MM-DD`). Use `Intl.DateTimeFormat`.
  - **Numbers/currency**: use `Intl.NumberFormat` (do not hardcode separators/suffixes).
- **Locale file**: only `ja` exists (`public/locales/ja/translation.json`). Extend it **only** with new `validation.*` entries when needed. Do not add other locale files or `features.*` message trees unless the product explicitly requires full UI localization.
- **Interpolation syntax** (in `translation.json` for validation only): i18next double-brace `{{_placeholder_}}` (e.g. `{{_field_}}`, `{{_length_}}`, `{{_max_}}`). Underscores are a naming convention for param names passed to `t()`.
- **Key conventions** (`validation.*` only):
  - `validation.required` — `"{{_field_}}が入力されていません。"`
  - `validation.min` — `"{{_field_}}には少なくとも{{_length_}}文字を含める必要があります。"`
  - `validation.max` — `"{{_field_}}は{{_length_}}文字以内にしてください。"`
  - `validation.format` — `"{{_field_}}の形式が正しくありません。"`
- **In the schema**:
  - **Do not hardcode validation error strings** in zod rules; use `t("validation....", { ... })` with `{{_placeholder_}}` in JSON.
  - **Field names** passed into `t()` for `_field_` can be **hardcoded Japanese** strings in the schema file (they are not i18n keys — they are literals for the message template).
  - **Pattern**: export a hook (e.g. `useFeatureSchemas`) that calls `useTranslation()` internally so validation messages stay reactive. Return `{ createSchema, updateSchema }` from the hook. Place in `schemas/<feature>.schema.ts`.
- **In the UI**:
  - **Field errors** come from the resolver (i18n-backed).
  - **Never** use `useTranslation()` / `t()` for non-validation labels or buttons; write copy directly in components.

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
  - **Reference interface**: `@/shared/common/base.repository.ts` provides `CRUDRepository<T>` with `create`, `get`, `update`, `delete` as a **reference contract**. Feature services may extend it or implement their own class — real API contracts often diverge from a rigid generic shape (e.g. different return types for `update`).
  - **Implement** `createX`, `getXList`, `getXById`, `updateX`, `deleteX`.
  - **Return type**: all service methods should return `Future<T>` (or the appropriate `Future<PagedResult<T>>` for list).
  - **Map errors** into a consistent shape for UI/store.
- **State management (default)**:
  - **Default approach**: keep async calls inside feature hooks/pages using the feature services; model loading/error states locally (or via a dedicated feature hook).
  - **State shape (recommended)**: data + pagination + `isLoading`/`isSubmitting` + `error` + `lastMutation`.
  - **Error handling**: for **toasts**, only backend `message` (see step 4). You may add operation context in **`console`** / logging for debugging — **not** as user-facing toast copy when the API omits `message`.
- **Pages**:
  - **List page (required layout reuse)**:
    - **Always wrap** the list screen with `src/shared/layouts/page-layout.tsx` (`LayoutPage`) to keep a consistent page header/actions/filter/pagination area across features.
    - **Map layout slots consistently**:
      - `heading`: page title (**hardcoded** string)
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
      - **Text rule reminder**: filter labels and buttons are **hardcoded** (not `t()`).
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
  - **Create/Edit dialog**: if using `Dialog` instead of a routed page, apply the **`max-w-xl`** `DialogContent` width rule from step 3 (Form rules → form dialog width).
  - **Confirm actions (required)**:
    - **All confirm flows** (delete, destructive update, discard changes, etc.) must use `src/shared/components/ui/alert-dialog.tsx`.
    - **Do not implement custom confirm modals** (or browser `confirm`) for CRUD flows.
    - **Never execute destructive actions immediately** from a table row/menu without a confirm modal (or an explicit undo window requirement).
    - **Styling constraint**: keep the dialog close to the library defaults; avoid custom styling/variants unless necessary for correctness (e.g. layout bug) or an explicit design requirement.
  - **Delete**: confirm → dispatch delete → refetch/navigate.
- **Form component**:
  - **React Hook Form + Zod resolver** (validation error messages from i18n only).
  - **Clear props contract**, no direct dependency on the store.
  - **Use the `Field` component family** from `@/shared/components/ui/field.tsx`: `Field`, `FieldLabel`, `FieldError`, `FieldGroup`, `FieldDescription`, `FieldContent`. These provide consistent label/input/error layout and spacing.
  - **Field width consistency (required)**:
    - **Inputs/selects/textareas should be `w-full`** inside their container.
    - **Wrap all fields in `<FieldGroup>`** and each field in `<Field>` to keep widths, spacing, and error placement consistent.
    - **Display errors with `<FieldError>`** — do not create custom error rendering.
- **UX polish**:
  - **Loading/disabled states**, empty state, error + retry.
  - **Toasts**: use **Sonner** (`@/shared/components/ui/sonner.tsx`). After API calls, call `toast()` / `toast.error()` **only** when there is a non-empty `ResponseData.message` (or equivalent from the error body). If there is no message, **do not** toast invented text.
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
  - **Empty/loading/error**: standardized states, consistent **hardcoded** wording across features.
  - **Form UX**: labels, hints, required markers, error placement, submit/cancel placement.
- **Routing & layout consistency**:
  - **Page header/actions** (if used): title format, action buttons (Create/Edit/Delete) follow existing conventions.
  - **Sidebar active state**: list/detail/edit routes still highlight the correct menu item.
- **Quick a11y check**:
  - **Keyboard**: tab order, focus trap for dialog/drawer.
  - **ARIA/labels**: inputs have labels, buttons have accessible names.
- **Shadcn design system review (required)**:
  - **Gating rule (must-do before merge)**: you **must** review the feature against `@.agents/workflows/shadcn-design-system.md`.
  - **Checklist scope**: tokens (no hardcoded colors), spacing scale, layout (flex vs grid), component states (hover/focus/disabled/loading), action hierarchy, a11y rules, content safety, responsive mobile-first, data view states (loading/empty/error).
  - **Timing**: do this **after** the UI is functionally complete and before the Web Interface Guidelines review.
- **Web Interface Guidelines review (required)**:
  - **Gating rule (must-do before merge)**: you **must** review the relevant UI files using `@.agents/skills/web-design-guidelines/SKILL.md`.
  - **Scope**: include all touched UI files (typically `pages/*.tsx`, `components/*.tsx`, `shared/components/ui/*` used/modified, and any new styles/layout wrappers).
  - **Timing**: do this **after** the shadcn design system review passes and before final merge.
  - **Always fetch the latest rules** from `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` before reviewing.
  - **Report findings** in the required `file:line` format.
- **Review outcome**:
  - **If it deviates**: align with existing features first, or move the pattern into shared UI components for reuse.
