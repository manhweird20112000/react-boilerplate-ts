---
name: implement-feature
description: Admin-only implementation skill for React/TypeScript features under `admin/` with local types, repositories, hooks, pages, MSW mocks, and exports. Use for new admin feature, admin scaffold, admin CRUD, admin list page, làm tính năng admin, tạo feature admin, scaffold admin, dựng feature admin.
---

# Implement Feature

## Scope Guard

Use this skill only for Admin frontend work under `admin/`.

Before applying this skill, verify the target path is inside `admin/`. If the requested work targets `app/`, `api/`, or shared root code, do not use this skill.

Use nearby code first. Load only the reference/template needed for the current step; never bulk-read the skill folder.

**Scaffold:** read `templates/manifest.md` first (~1 file), then copy **one manifest row** at a time.

**Canonical template sources:** `templates/generic-crud/` and `templates/account-like/` only. Do not use any other template folder.

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

1. Inspect similar feature code and the integration points it touches: routes, navigation, i18n, MSW handler aggregation, public exports, query keys.
2. Identify entity fields, searchable/filterable fields, enum values, unique constraints, required fields, and API response shape before copying templates.
3. Replace sample fields everywhere they appear: types, payloads, schemas, UI, query helpers, and MSW db/factory/validation.
4. Add only needed `types`, `services`, `hooks`, `components`, `pages`, `msw`, `index.ts`, and integration edits.
5. Wire routes, redirects, navigation/title, MSW handler aggregation, and translations when the feature is user-facing or mocked.
6. Run the smallest useful check: `pnpm typecheck`, `pnpm lint <touched paths>`, or `pnpm build` when wiring affects bundling/routes. Full command list: `codebase-folder-structure` → Project commands. Unit tests are out of scope — use `write-unit-tests` when requested.
7. Render `checklists/feature-checklist.md` to the user as the final step. Walk every item, mark each `[x]` done / `[ ]` skipped (with one-line reason) / `[!]` blocked, and stop the flow only when every item is resolved.

## UI Rules

- Use function components only; never add React class components.
- Use Ant Design / ProComponents before custom UI primitives.
- For antd component usage, API lookups, theming, and migration concerns, defer to the `ant-design` skill. Do not duplicate its guidance here.
- Use documented antd props/APIs only.
- Do not couple code to `.ant-*` selectors or internal antd DOM.
- Prefer antd tokens, component `styles`, and documented props over global CSS overrides.
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
