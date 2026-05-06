---
name: codebase-folder-structure
description: >-
  Describes the React + TypeScript template layout (app shell, feature modules,
  shared UI, infra). Use when placing new files, refactoring folders, onboarding,
  or when the user asks where code should live, project structure, or folder
  organization.
---

# Codebase folder structure

## When to use this skill

- Adding a feature, page, API client, hook, or layout
- Moving code between folders or splitting modules
- Explaining or enforcing where imports should point (`~/...`)

## Top-level `src/` map

| Path        | Role                                                                                                        |
| ----------- | ----------------------------------------------------------------------------------------------------------- |
| `app/`      | Application shell: root component, route tree, app-wide wiring (Redux/sagas only when explicitly requested) |
| `features/` | Domain slices: each folder is one product area (auth, posts, …)                                             |
| `shared/`   | Cross-feature UI, hooks, layouts, utilities used by multiple features                                       |
| `infra/`    | Technical adapters (HTTP client, external APIs) — not business UI                                           |
| `assets/`   | Static assets (global styles, images)                                                                       |
| `i18n/`     | Internationalization setup                                                                                  |

**Alias:** imports use `~/` → `src/` (see `tsconfig`).

## `app/` — shell only

- `App.tsx` — providers, router outlet, top-level composition
- `routes.tsx` — `Route` definitions; **lazy-load** feature pages from `~/features/.../pages`
- `store.ts`, `root-reducer.ts`, `root-saga.ts` — global Redux wiring (only when explicitly requested)

Do **not** put feature-specific business components or API logic here.

## `features/<feature-name>/` — feature module

Standard shape (extend only when needed):

```
features/posts/
├── index.ts           # public exports for this feature (barrel)
├── pages/             # route-level screens (often lazy-imported)
├── services/          # feature API calls (uses infra/http)
├── hooks/             # feature hooks (data loading/mutations, derived UI state)
├── types/             # feature-specific types
└── msw/               # optional: MSW handlers for this feature’s API (see “Feature MSW handlers”)
```

**Rules**

- **New screen** → `features/<name>/pages/` (or a subpath if multiple screens).
- **Feature state (default)** → `features/<name>/hooks/` + local state in pages/components.
- **Redux slice/saga for this feature (optional; only when explicitly requested)** → `features/<name>/store/`.
- **HTTP calls for this domain** → `features/<name>/services/` calling `~/infra/api/...`.
- **Types only this feature needs** → `features/<name>/types/`.
- Export what other layers may import through `features/<name>/index.ts` when appropriate.

Avoid importing one feature’s internals from another feature’s `pages/` or `store/`; prefer `shared/` or a thin shared contract type if truly shared.

## `shared/` — reusable across features

- `components/ui/` — design-system primitives (e.g. shadcn-style components)
- `layouts/` — shell layouts (header, sidebar wrappers) used by routes
- `hooks/` — hooks with no single-feature ownership
- `lib/` — small pure helpers (e.g. `cn()`)

If only one feature uses it, keep it inside that feature unless you expect reuse soon.

## `infra/` — infrastructure

- `api/` — HTTP module, base client, interceptors, shared request types
- `msw/` — Mock Service Worker bootstrap (`prepare-msw`, `browser`, root `handlers` that compose feature handlers), plus shared helpers (e.g. API base for handler URLs)

Feature `services/` compose **domain** calls; `infra` holds **transport** and config.

## Feature MSW handlers

- Put handlers for a domain’s HTTP API under `features/<feature-name>/msw/` (e.g. `topic-msw-handlers.ts`).
- Export a single array (or named group) per file; register it from `infra/msw/handlers.ts` so the worker stays one composition root.
- Keep handler paths and response shapes aligned with the same feature’s `services/` when you move from in-memory mocks to real HTTP.

## Naming and files

- **Directories and files:** `kebab-case` (e.g. `http-service.ts`, `root-saga.ts`).
- **One primary responsibility per file**; use feature `index.ts` as the module boundary for exports.
- **Routes:** register lazy imports in `app/routes.tsx` pointing at `~/features/.../pages`.

## Quick placement checklist

| Need                                                                   | Location                       |
| ---------------------------------------------------------------------- | ------------------------------ |
| New page for a domain                                                  | `features/<domain>/pages/`     |
| New global route                                                       | `app/routes.tsx` + lazy import |
| Feature hooks (default)                                                | `features/<domain>/hooks/`     |
| Redux slice/saga for domain (optional; only when explicitly requested) | `features/<domain>/store/`     |
| REST call for domain                                                   | `features/<domain>/services/`  |
| Button, input, dialog primitive                                        | `shared/components/ui/`        |
| Layout used by several routes                                          | `shared/layouts/`              |
| Axios/fetch wrapper, base URL                                          | `infra/api/`                   |
| MSW worker bootstrap, composed handlers                                | `infra/msw/`                   |
| MSW handlers for one domain’s REST API                                 | `features/<domain>/msw/`       |
| Strings / i18n bootstrap                                               | `i18n/`                        |

## Anti-patterns

- Dumping feature logic in `app/` or `main.tsx`
- Importing `features/posts/store` from `features/auth/pages` without a shared boundary
- Putting API transport in `shared/lib` — use `infra`
- Deep relative imports across `src/` — prefer `~/`

## Related

- Redux wiring (optional): `app/store.ts`, `app/root-reducer.ts`, `app/root-saga.ts`
- Example route wiring: `app/routes.tsx`
