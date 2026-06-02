# Folder Structure

Repo-wide layout (`src/app`, `src/shared`, `src/infra`, aliases, anti-patterns): see `codebase-folder-structure`. This file is **scaffold-specific** — the exact tree to produce when implementing one feature.

## Default Feature Structure (ref: `templates/generic-crud/`)

```txt
src/
  features/
    {{feature}}/
      types/
        {{feature}}.type.ts
        {{feature}}-payload.type.ts
        {{feature}}-form.type.ts

      constants/
        {{feature}}-messages.ts
        {{feature}}-query-key.ts
        {{feature}}-routes.ts

      services/
        {{feature}}.repository.ts
        {{feature}}.factory.ts
        http-{{feature}}.repository.impl.ts
        mock-{{feature}}.repository.impl.ts

      utils/
        {{feature}}-query.ts

      msw/
        {{feature}}-factory.ts
        {{feature}}-db.ts
        {{feature}}-validation.ts
        {{feature}}-operations.ts
        {{feature}}-handlers.ts

      hooks/
        use-list-{{feature}}.ts
        use-{{feature}}-detail.ts
        use-create-{{feature}}.ts
        use-update-{{feature}}.ts
        use-delete-{{feature}}.ts

      schemas/
        {{feature}}.schema.ts

      components/
        {{feature}}-table-list.tsx
        {{feature}}-table-filter.tsx
        {{feature}}-form.tsx
        create-{{feature}}-dialog.tsx
        edit-{{feature}}-dialog.tsx

      pages/
        list-{{feature}}.page.tsx

      index.ts
```

## Notes

- CRUD list + create/edit dialogs on one page (modal via router `state`), not separate create/edit pages.
- MSW mock data lives in `msw/`; shared list/filter logic in `utils/{{feature}}-query.ts`.
- HTTP + mock repositories share `{{feature}}.repository.ts` contract; factory picks impl via env.
- Scaffold order: `templates/manifest.md`.
- Generic templates use sample fields `name`, `description`, `is_enabled`; replace them with target domain fields in every copied template before writing files.
- User-facing features usually also need route entries, route-state redirects for create/edit URLs, `src/features/navigation/admin-navigation.tsx` (nav item + `getPageTitle`), `src/infra/msw/handlers.ts`, and i18n translation keys.
