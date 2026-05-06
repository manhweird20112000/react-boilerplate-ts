# Design System Rules (Step 2 reference)

These rules are non-negotiable during implementation. Apply without asking the user.

For the **deviation policy** (when you must legitimately break a rule), see SKILL.md → Step 5.

---

## Layout shells

- **List page** → `LayoutPage` with `heading`, `pagination`, `filter` props
- **Routed form** → `LayoutFormPage` with `heading`, `topAction`, `bottomAction` (sticky, centered max 730px)
- **Dialog form** → `FormDialogContent` + `DialogTitle` (pattern: max-w 720px, p-0, border-b header)

### Modal Form Standards (STRICT)

- **Structure:** `DialogHeader` with `px-6 py-4 border-b bg-background` for clean, premium separation.
- **Layout:** `FormDialogContent` typically uses `className="sm:max-w-[720px] p-0 overflow-hidden gap-0"` to create a unified container.
- **Scrolling:** Dialog form container **MUST** enforce `max-h-[75vh]` with `overflow-y-auto` on the scrollable body — non-negotiable for all dialog forms regardless of content length.
- **Footer:** All action buttons (submit, cancel, reset, etc.) inside a dialog form **MUST** be wrapped in `DialogFooter` — never place buttons outside `DialogFooter` or inline in the form body.
- `DialogFooter` must remain **outside** the scrollable area so actions are always visible.

### Standard Dialog pattern

```tsx
<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
  <FormDialogContent className="sm:max-w-[720px] p-0 overflow-hidden gap-0">
    <DialogHeader className="px-6 py-4 border-b bg-background">
      <DialogTitle>{t('feature.dialogs.create')}</DialogTitle>
    </DialogHeader>
    <FeatureForm
      mode="create"
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  </FormDialogContent>
</Dialog>
```

- Never modify `shared/layouts/` unless the task explicitly scopes an app-wide change; exception: update `shared/layouts/app-shell.tsx` to register the feature nav item.
- Match patterns from `features/customers/` and existing admin pages.

---

## Component rules (STRICT — zero tolerance)

**Core principle:** Clean code, single-responsibility components, easy to read and maintain. Every component must be small, focused, and composable. Extract sub-components when a render function exceeds ~40 lines.

### Styling prohibitions

- `className` on shared UI primitives in feature code is **FORBIDDEN** — use `variant` / `size` props or extend in `shared/components/ui/`.
- `className` **allowed only** on layout wrappers (`div`, grids, `flex` containers) for structural layout (grid, flex, gap).
- `shadow-*` classes are **FORBIDDEN** in feature code — shadows are design-system level only.
- Never add arbitrary Tailwind utilities to override design-system component appearance.

### Component usage

- Use `src/shared/components/ui/*` first. Add primitives via the project CLI if missing — do not invent parallel markup.
- Compose: `FieldGroup` → `Field` → `FieldLabel` + `FieldContent` + `FieldError` + `FieldDescription`.
- Spacing: `flex` + `gap-*`, not `space-x-*` / `space-y-*`.
- `FieldError` for validation messages; `FieldDescription` for static hints only.

### Button rules (STRICT)

- `Button` accepts **only `variant` prop** for visual differentiation (`default`, `outline`, `ghost`, `destructive`, `link`, etc.).
- `size` prop is **FORBIDDEN** on standard buttons — only allowed on **icon-only buttons** (e.g. `<Button variant="ghost" size="icon">`).
- Icons in `Button`: `data-icon` attribute, no extra sizing classes in features.
- Never add `className` to `Button` — if a button variant doesn't exist, extend it in `shared/components/ui/button.tsx`.

### Reusable utility functions

- Any helper function used in **2+ places** MUST be extracted to a util file (`features/<feature>/utils/` or `shared/lib/`).
- Util functions must be **pure functions** — no side effects, no dependencies on React state or hooks.
- Each util file must export **one focused concern** (e.g. `format-date.ts`, `parse-currency.ts`).
- Write clean, typed signatures with JSDoc for public utils; avoid generic names like `helper`, `utils`, `misc`.

---

## Validation & i18n

Pick **one** validation strategy per feature (from plan or default to inline English):

- **Inline English:** `z.string().min(1, "Name is required")`
- **i18n:** `t("validation.required", { _field_: t("<feature>.fields.name") })` — see `validation-i18n.md`

No mixing within a feature. When using i18n: list the keys in the plan before writing schemas.

### Copy rules

- Match the **existing locale strategy of the project**. New copy must follow the validation-i18n contract.
- If i18n: shared `validation.*` error templates + `<feature>.fields.*` for field display names.
- If existing screen is already localized, extend the same mechanism.

---

## Toasts

- **Hook responsibility:** Feature hooks orchestrate toasts after API calls.
- **Source:** `ResponseData.message` only. If missing or empty after `trim()` → **no toast**. No invented fallback messages.
- **Helper + import:** Use the shared `shouldShowToast` from `@/shared/lib/toast`. Single source of
  truth and the full example live in `project-patterns.md` → "Toast policy". **Do not redefine the
  helper per feature.**

---

## Date/time formatting (STRICT)

All date/time values displayed in tables and UI **MUST** use one of these two formats based on context:

| Context                                                          | Format             | Example            |
| ---------------------------------------------------------------- | ------------------ | ------------------ |
| Date only (created date, birth date, expiry date)                | `DD-MM-YYYY`       | `23-04-2026`       |
| Date + time (timestamps, activity logs, last login, audit trail) | `DD-MM-YYYY HH:mm` | `23-04-2026 14:30` |

- **Choose format by semantic context:** If the time component is meaningful for the user's decision-making → use `DD-MM-YYYY HH:mm`. If only the date matters → use `DD-MM-YYYY`.
- Use the typed helpers in `shared/lib/format-date.ts` (`formatDate(date)` and `formatDateTime(date)`).
- Never use raw `toLocaleDateString()` or unformatted ISO strings in the UI.
- Use `date-fns` (already in project: `format` from `date-fns`) for formatting — do not write manual date string manipulation.

---

## Responsive

- Mobile-first; verify 320 / 768 / 1280px.
- Tables: `overflow-x-auto`.
- Filters: `grid grid-cols-12 gap-3`.
- Form footer: `flex flex-col-reverse gap-2 sm:flex-row sm:justify-end`.
- Use `min-w-0`, `truncate`, `break-words` as needed.
- `Intl.NumberFormat` for locale-safe number/currency formatting.

---

## Loading, error, empty states

- **Loading:** Use `Skeleton` from the design system for content placeholders. Use ellipsis `…` only for inline transient states (e.g. button label while submitting).
- **Error:** Wrap pages in `ErrorBoundary` from `shared/components/`. Show retry CTA when recoverable. Toasts only for transient mutation errors.
- **Empty:** Use the `Empty` family (`Empty`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription`).
- **Optimistic update:** Allowed for list mutations when latency matters; **must** rollback on failure and surface error via toast.
