---
name: implement-feature
description: Implementation skill for React/TypeScript features under `src/features/` using the repo component stack, local types, repositories, hooks, pages, MSW mocks, and exports. Use for new feature, feature scaffold, CRUD/list page, tạo feature, scaffold feature, dựng feature.
---

# Implement Feature

## Scope Guard

Use this skill only for frontend feature work under `src/features/`.

Before applying this skill, verify the target path is inside `src/features/`. If the requested work targets `src/app/`, `src/infra/`, `src/shared/`, or root config, use this skill only for the feature-local portion and keep integration edits scoped.

Use nearby code first. Load only the reference/template needed for the current step; never bulk-read the skill folder.

**Scaffold:** read `templates/manifest.md` first (~1 file), then copy **one manifest row** at a time.

**Canonical template sources:** `templates/generic-crud/` and `templates/account-like/` only. Do not use any other template folder.

**Important:** existing template UI files may contain legacy antd examples. Treat them as structure/reference only unless the project actually depends on `antd`. Replace their UI imports and JSX with the repo component library conventions before writing generated files.

## Template source

```
Entity shape?
│
├─ Simple list + create/edit dialogs, few scalar/boolean fields
│   → templates/generic-crud/
│   → replace sample fields: name, description, is_enabled
│
├─ Account-like: email/login, status/role enums, date-range filters, richer validation
│   → templates/account-like/
│   → replace fields if target domain differs (keep structure)
│
└─ Responsive UX (mobile action menu, Modal.confirm delete) or edge-case behavior
    → read one matching file from an existing feature in the target project (if any) for that concern only
```

## Flow

1. Inspect similar feature code and the integration points it touches: routes, app providers, i18n, MSW handler aggregation, public exports, query keys, and `src/shared/ui`/component library usage.
2. Identify entity fields, searchable/filterable fields, enum values, unique constraints, required fields, and API response shape before copying templates.
3. Confirm the UI stack from `package.json` and local imports before creating components. Current repo baseline is React 19, Tailwind CSS, `clsx` + `tailwind-merge` via `cn`, `@base-ui/react`, `@radix-ui/react-slot`, `class-variance-authority`, `lucide-react`, `sonner`, `vaul`, `react-day-picker`, React Hook Form, and Zod. Do not introduce antd/ProComponents unless they already exist as project dependencies or the user explicitly asks to add them.
4. Replace sample fields everywhere they appear: types, payloads, schemas, UI, query helpers, and MSW db/factory/validation.
5. Add only needed `types`, `services`, `hooks`, `components`, `pages`, `msw`, `index.ts`, and integration edits.
6. Wire routes, redirects, navigation/title, MSW handler aggregation, and translations when the feature is user-facing or mocked.
7. Run the smallest useful check: `pnpm lint:check`, `pnpm lint:ci`, `pnpm build`, or a focused test command when wiring affects bundling/routes. Full command list: `codebase-folder-structure` → Project commands. Unit tests are out of scope unless requested.
8. Render `checklists/feature-checklist.md` to the user as the final step. Walk every item, mark each `[x]` done / `[ ]` skipped (with one-line reason) / `[!]` blocked, and stop the flow only when every item is resolved.

## UI Rules

- Use function components only; never add React class components.
- Prefer existing feature-local components and `src/shared/ui` components before adding new primitives.
- If a reusable primitive is missing, build it with the repo component stack: Base UI/Radix Slot for behavior/composition, CVA for variants, `cn` from `@/shared/lib/utils` for class merging, Tailwind utilities for styling, and lucide icons for icon buttons/actions.
- Keep primitives accessible: preserve labels, focus states, keyboard behavior, disabled/loading states, and ARIA relationships provided by the underlying component library.
- Use React Hook Form + Zod for validated forms when the feature has non-trivial validation.
- Use `sonner` for toast notifications, `vaul` for drawer-like mobile flows, and `react-day-picker` for date picking when those patterns are needed.
- Do not add antd imports, `.ant-*` selectors, ProComponents, or the `ant-design` skill workflow unless the project dependency exists or the user explicitly requests antd.
- Keep styling local and token-friendly: Tailwind utilities/CVA variants first, feature CSS only when utilities are insufficient, no broad global overrides.
- Keep templates executable: no placeholder JSX, unused imports, or `console.log`.

## On Demand

- Architecture: `references/architecture.md`
- Folder placement: `references/folder-structure.md`
- Naming: `references/naming.md`
- Audit: `checklists/feature-checklist.md`
- Scaffold: read `templates/manifest.md`, then copy only the current step from the chosen `{source}` folder
- Account-like example: `templates/account-like/` when the target feature matches that domain shape

## Placeholders

`{{feature}}` kebab singular, `{{featurePlural}}` kebab plural, `{{featureCamel}}` camel singular, `{{featurePluralCamel}}` camel plural, `{{Feature}}` Pascal singular, `{{FeaturePlural}}` Pascal plural, `{{FEATURE}}` UPPER_SNAKE of `{{feature}}`.

If pluralization is irregular, set every placeholder explicitly before writing files; do not infer by appending `s`.

Templates end in `.template`; generated files restore the intended extension.

## Coordination

- If feature has complex business rules, model those rules before scaffolding UI and update shared context/docs when new domain terms appear.
- If implementation changes shared contracts across features, isolate that contract change first and update affected feature docs/tests together.
- For unit tests after scaffolding, use `write-unit-tests` (10 happy + 10 bad per feature pass).
