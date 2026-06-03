# Feature Architecture

Layer responsibilities (types, constants, services, hooks, components, pages, utils, msw): see `codebase-folder-structure`.

This file documents the **dependency direction** that scaffolded features must respect.

## Allowed direction

```txt
pages       → hooks
pages       → components
pages       → utils
hooks       → services
hooks       → constants
services    → api client (infra)
services    → types
components  → types
utils       → types
```

## Forbidden direction

```txt
services   → hooks
services   → components
hooks      → components
components → services
components → api client
types      → runtime logic
```

## Notes

- Feature-specific code stays inside its feature folder. Cross-feature reuse goes through `shared/` or a typed contract.
- Hooks orchestrate; they do not own domain rules. Model complex rules before scaffolding UI.
- Mutation hooks must invalidate the right query keys; query keys live in `constants/`.
