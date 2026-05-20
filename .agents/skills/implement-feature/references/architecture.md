# Frontend Feature Architecture

Use feature-based architecture

Each feature owns its own:

- types
- constants
- services
- hooks
- components
- pages
- utils
- public exports

Feature-specific code must stay inside the feature folder.

Shared reusable code may be imported from:

```txt
src/shared/
```

## Layer

### types/

Contains TypeScript types and interfaces only.

### constants/

Contains stable constants:

- query keys
- routes
- options
- labels

### services/

Contains API calls only.

### hooks/

Contains data-fetching and mutation logic.

### components/

Contains UI components.

### pages/

Contains route-level composition.

### utils/

Contains mapping and transformation logic.

### Allowed Dependency Direction

```txt
pages -> hooks
pages -> components
pages -> utils
hooks -> services
hooks -> constants
services -> api client
services -> types
components -> types
utils -> types
```

### Forbidden Dependency Direction

```txt
services -> hooks
services -> components
hooks -> components
components -> services
components -> api client
types -> runtime logic
```
