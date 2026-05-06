---
name: fe-implement-feature
description: |
  Single source of truth for implementing a frontend feature in the React + Vite + i18n codebase.
  Classify complexity (Simple/Standard/Complex) and flow (A — form only, B — list only, C — full
  CRUD, D — detail/read view), gather requirements (max 2 Q&A rounds, then proceed with labeled
  assumptions), apply design-system standards, build forms with React Hook Form + Zod + i18n, and
  build lists/detail pages on the established repository pattern. Default validation = i18n.
  Default create/edit delivery = modal dialog. Run a pre-merge review with a severity-tagged checklist.
user-invocable: false
allowed-tools: [Read, Glob, Grep, Bash, Edit, Write, ReadLints]
---

# FE implement feature

## How to use this skill

Read this file fully. Then read references **on demand only**:

| Reference                                  | Read when                                                                                                                                       |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `references/project-patterns.md`           | First time touching this project's HTTP/i18n/master-data/hook patterns                                                                          |
| `references/design-system-rules.md`        | **Step 2** — read once per session before any UI code                                                                                           |
| `references/q-and-a-template.md`           | **Step 1** Round 1 — when drafting the question prompt                                                                                          |
| `references/templates.md`                  | **Step 1** plan output — copy the matching block (Simple vs Standard/Complex)                                                                   |
| `references/validation-i18n.md`            | **Step 3** before writing `useFeatureSchemas` (locale key contract); also when adding/extending any `validation.*` or `<feature>.fields.*` keys |
| `references/repository-factory-pattern.md` | Feature truly needs both http + mock at runtime (target pattern; see decision matrix in §"Data layer")                                          |
| `references/mock-repo-patterns.md`         | Building a `Mock<Feature>Repository` (read alongside `repository-factory-pattern.md`)                                                           |

**Sister skills** (read on demand):

- `@.claude/skills/bks-design-system/SKILL.md` — UI kit deep-dive
- `@.claude/skills/react-hook-form-zod/SKILL.md` — advanced form patterns
- `@.claude/skills/frontend-code-review/SKILL.md` — Step 5 checklist
- `@.claude/skills/vercel-react-best-practices/SKILL.md` — **Trigger when tier=Complex or list >100 rows**

**Reference UX/CRUD shape:** `features/customers/` shows the established list, detail, and dialog
patterns. **Known tech debt — DO NOT copy** (auto-checks may fire on it; treat as pre-existing):

- `result as any` casts to bypass paginated response shapes
- Hardcoded VN/EN toast fallback strings
- `className` on shadcn primitives (`Button`, `Badge`, `DropdownMenuItem`, `AlertDialogAction`, etc.)
- `shadow-*` classes in feature code
- `new HttpRepository()` at module scope **when the feature also has a mock in scope** (use the factory — see decision matrix below)

If a 🟡 auto-check (`rg 'shadow-' …`, `rg 'className=' …`, `rg 'new (Http|Mock)\w+Repository' …`)
fires on existing `customers/` files you did not edit, **do not fix as part of your feature** unless
the user explicitly asks. Note the pre-existing hits in your plan and move on.

---

## Quickstart

1. **Assess complexity** — Simple / Standard / Complex (see tier table)
2. **Classify flow** — A (form only) / B (list only) / C (full CRUD) / D (detail/read view)
3. **Step 1** — Gather requirements: max 2 Q&A rounds → produce plan → proceed
4. **Step 2** — Apply design-system standards (read `design-system-rules.md` once per session)
5. **Implementation steps by flow** — Steps 1, 2, 5 always run; only the implementation step changes:

   | Flow | Implementation step(s)  | Skip                |
   | ---- | ----------------------- | ------------------- |
   | A    | Step 3                  | Step 4              |
   | B    | Step 4                  | Step 3              |
   | C    | Step 3 → Step 4         | —                   |
   | D    | Step 4 (detail variant) | Step 3 if read-only |

6. **Step 5** — `pnpm lint` → severity checklist → fix blockers → ship

---

## Complexity tiers

| Tier         | Criteria                                                       | Step 1 behavior                              | Extra skills                        |
| ------------ | -------------------------------------------------------------- | -------------------------------------------- | ----------------------------------- |
| **Simple**   | ≤3 fields/columns, 1 screen, standard CRUD                     | 3–5 questions, abbreviated plan              | —                                   |
| **Standard** | 4–10 fields/columns, 2–3 screens                               | 5–8 questions, full plan                     | E2E smoke test                      |
| **Complex**  | 10+ fields, 4+ screens, custom logic, multi-step, file uploads | 5–8 questions + 1 follow-up round, full plan | E2E + `vercel-react-best-practices` |

Default to **Standard** when unsure.

---

## Flow classification

| Type                       | When                                                                    | Steps                    | Skip                |
| -------------------------- | ----------------------------------------------------------------------- | ------------------------ | ------------------- |
| **A — Form only**          | Settings, auth, wizard, standalone create/edit page (no list)           | 1→2→3→5                  | Step 4              |
| **B — List only**          | Read-only table, no mutations                                           | 1→2→4→5                  | Step 3              |
| **C — Full CRUD**          | List + create/edit + delete                                             | 1→2→3→4→5                | —                   |
| **D — Detail / read view** | Single-record detail page (read-only or read + per-section inline edit) | 1→2→4→5 (detail variant) | Step 3 if read-only |

**Decision rules:** Any create/edit/delete on a list → C. Only table, no mutation → B. Only form,
no list → A. Single-record detail → D. Hybrid (list + dialog form) → C with dialogs.

**Data mode:** `http` when API ready (default). `mock` when UI-first or API unready. `http+mock`
(via factory) only when the feature genuinely needs to switch (demo vs staging). `msw` only when
the plan explicitly calls for network-level mocking.

---

## Project layout

| Path               | Role                                                                                |
| ------------------ | ----------------------------------------------------------------------------------- |
| `app/`             | Shell: `App.tsx`, `routes.tsx` (lazy pages), `store.ts` (Redux — global state only) |
| `features/<name>/` | Domain module: `pages/`, `components/`, `services/`, `hooks/`, `types/`, `schemas/` |
| `shared/`          | Cross-feature UI (`components/ui/`), layouts, hooks, `lib/`, `services/`, `common/` |
| `infra/`           | HTTP client (`api/`), MSW dev tooling (`msw/`), Storage service (`storage/`)        |

**Aliases:** `~/` and `@/` → `src/`. **Files/dirs:** kebab-case. Feature business logic never in
`app/` (except route registration). No cross-feature imports of `pages/` or `store/`.

**State:** Default = local React state (`useState`, `useCallback`, `useMemo`, `useRef`) inside a
custom hook per feature. Redux is reserved for cross-feature global state (auth, notifications,
workspace) via `useAppDispatch` / `useAppSelector`.

---

## Data layer

### Decision matrix — pick instantiation pattern

Decide **once per feature**, before writing the repository. The choice is binary and depends only
on whether the feature needs to switch between HTTP and Mock at runtime.

| Scenario                                                                                        | Pattern                                        | Hook does                                                              |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------- |
| HTTP only (API ready, no demo/storybook switching)                                              | **Single-mode** — abstract + HTTP adapter      | `const repo = new HttpFeatureRepository()` at module scope             |
| Mock only (UI-first prototype, no HTTP yet)                                                     | **Single-mode** — abstract + Mock adapter      | `useMemo(() => new MockFeatureRepository(), [])` inside the hook       |
| Both, runtime-switchable (mock now → HTTP later, demo vs staging, Storybook, integration tests) | **Factory** — abstract + HTTP + Mock + factory | `useMemo(() => createFeatureRepository(options.mode), [options.mode])` |

**Rules:**

- Never have **both** `new HttpFeatureRepository()` at module scope **and** a `Mock<Feature>Repository`
  in the same feature. If a mock exists in scope, the factory is mandatory and is the **only** file
  allowed to import concrete adapters.
- Never retrofit existing single-mode features just to follow the factory pattern; promote only when
  a real second adapter lands.
- Never instantiate the same repo more than once per render path (use module scope for HTTP-only,
  `useMemo` otherwise).

### Repository contract (all patterns)

```
features/<feature>/services/
├── <feature>.repository.ts             # Abstract — feature port (always)
├── http-<feature>.repository.ts        # HTTP adapter (when HTTP in scope)
├── mock-<feature>.repository.ts        # Mock adapter (when mock in scope; see mock-repo-patterns.md)
└── <feature>-repository.factory.ts     # Required only for the "both" row above
```

- `abstract class <Feature>Repository` — hooks depend only on this abstraction.
- Adapters extend the abstract; all public methods MUST return `Future<T>` (= `Promise<AxiosResponse<ResponseData<T>>>`).
- HTTP adapters call `HttpService` from `@/infra/api`. Param transformation (indexed filters, multipart, blob)
  lives **only** in the adapter, never leaked to the hook.
- Generic CRUD base: `shared/common/base.repository.ts` for vanilla CRUD. Custom abstract class
  for non-standard operations (file upload, master-data, assign-owner, etc.).
- Cross-feature APIs live in `src/shared/services/` (e.g. `UploadImageService`).

See `references/project-patterns.md` for `HttpService` API, response envelope, master-data
metadata, indexed-filter wire format, and the **hook return-shape contract**. See
`references/repository-factory-pattern.md` for the factory pattern internals when the matrix sends
you to the third row.

### File upload

`HttpUploadImageService` (in `@/shared/services/upload-image.service.ts`) +
`FileUploadDropzone` (in `@/shared/components/file-upload-dropzone/`). Repository exposes
`uploadImage(file: File)` or feature-specific `uploadAttachment(...)` returning `Future<Attachment>`.

### Storage

Use `LocalStorage` / `SessionStorage` / `CookieStorage` from `@/infra/storage` —
`getStorage(key)`, `setStorage(key, value)`, `deleteStorage(key)`, `clearStorage()`. Never the
browser globals directly.

---

## Step 1 — Requirements gathering (max 2 rounds)

**Goal:** Enough shared understanding to start. Perfection not required — labeled assumptions are
acceptable. Use `references/q-and-a-template.md` for the prompt template.

### Round 1 — Single message, 5–8 questions ordered by priority

**Must-answer (max 3)** — block implementation if unknown:

- What screens? (list, create, edit, detail?)
- Dialog or routed page for create/edit? (default: **dialog**)
- API ready or mock?

**Should-answer (2–5)** — proceed with defaults if unanswered:

- Business logic (empty state, soft/hard delete, post-create editable?)
- Scope cuts for v1 (filters, roles, exports, bulk actions)
- Data shape (paginated? sort default? nested entities?)
- UX (post-create navigation? confirm before delete?)
- Edge cases (max items? file size limits? long text?)

**Rules:** Ask ALL questions in **one** message. If a doc/API/prior chat already answers something,
state your assumption — don't re-ask. **Simple tier:** 3–5 questions max.

### Round 2 — Only for Complex tier or critical ambiguity

Trigger only if Round 1 left a **must-answer** ambiguous. Max 3 follow-ups. If still unanswered →
labeled assumption, proceed.

### Waivers

User says "skip" / "default" / "your choice" / "just start" / "go ahead" → waive remaining.
Partial answer → confirmed part recorded, rest assumed. **Never ask the same question twice.**

### Plan output (after Q&A, single message, no further questions)

Use `references/templates.md`. Always produce:

1. **Screen breakdown** — per screen: name, route (or "dialog"), layout choice
   (`LayoutPage` / `LayoutFormPage` / `FormDialogContent`), component map.
2. **Requirements capture** — flow, data mode, screens, API contract (agreed vs TBD), Q&A summary,
   labeled assumptions, out of scope. Per screen: 2–3 Given-When-Then acceptance criteria.
3. **Validation strategy** — `i18n` (default) or `inline English`.

**Standard/Complex tier** also produces:

4. **Detailed spec** — form fields (label, control, required, defaults, constraints, API key or TBD),
   table columns (header, property, sort, format), actions (placement, variant, outcome).

Mark unknowns as **"TBD — assumed: [default]"** throughout.

### Readiness check (proceed-by-default)

Proceed when **flow is chosen** AND **≥1 screen is defined**. Everything else can be a labeled
assumption refined later.

| Item                       | Default if unknown                                      |
| -------------------------- | ------------------------------------------------------- |
| Flow (A/B/C/D)             | Infer from user description                             |
| Empty/loading/error states | Project defaults (`Empty`, `Skeleton`, `ErrorBoundary`) |
| Validation                 | i18n (project default)                                  |
| Form delivery              | Dialog (project default)                                |
| API contract               | TBD → mock repository (or stub HTTP if quick to land)   |
| Permissions                | Admin-only unless specified                             |

---

## Step 2 — Design-system standards

**Read `references/design-system-rules.md` once per session and apply.** No user interaction needed.

Non-negotiables (full rules in the reference):

- **Layout shells:** `LayoutPage` for lists/detail, `LayoutFormPage` for routed forms (rare in this
  codebase), `FormDialogContent` for dialog forms (the default).
- **Dialog forms:** `max-h-[75vh]` + `overflow-y-auto` on body; **all** action buttons inside
  `DialogFooter`; footer outside scroll area.
- **Components:** `shared/components/ui/*` first; **zero** `className` on shadcn primitives in
  feature code; **zero** `shadow-*`.
- **Buttons:** `variant` prop only on standard buttons; `size` prop only on icon-only buttons; never `className`.
- **Dates:** `DD-MM-YYYY` (date) or `DD-MM-YYYY HH:mm` (date+time) via `shared/lib/format-date.ts`.
- **Validation:** Pick **one** strategy per feature (default: i18n). Never mix.
- **Toasts:** Source from `ResponseData.message`; no fallback strings; guard with `shouldShowToast`
  (canonical helper in `references/project-patterns.md` → "Toast policy" — do not redefine per feature).
- **Responsive:** Mobile-first; verify 320 / 768 / 1280px.

---

## Step 3 — Feature form

**Deliverables:**

- `features/<feature>/types/<feature>.ts` — `CreateInput` / `UpdateInput` or unified `FormInput`
  aligned to API keys.
- `features/<feature>/schemas/<feature>.schema.ts` — hook (e.g. `useFeatureSchemas`) returning
  `{ schema }` (project default — single schema covers create + edit). Split only when create/edit
  truly diverge. Strategy must match Step 2. **For i18n schemas, read `references/validation-i18n.md`
  first** — the `validation.*` (templates) vs `<feature>.fields.*` (display names) split is strict.
- `features/<feature>/components/<feature>-form.tsx` — extracted component with RO-RO props:
  `defaultValues?: Partial<FormInput>`, `mode: "create" | "edit"`, `isSubmitting`, `onSubmit`,
  `onCancel?`.

**Implementation:**

- `useForm` + `zodResolver(schema)`; `defaultValues` for **every** registered field; `register`
  vs `Controller` per control type.
- Compose: `FieldGroup` → `Field` → `FieldLabel` + `FieldContent` + `FieldError` + `FieldDescription`.
- Errors: destructive border, `aria-invalid`, destructive focus ring. Required marker always destructive/red.
- Submit disabled while submitting; create may reset after success; edit keeps values.
- `useFieldArray`: `key={field.id}`; no bare `watch()` — watch specific fields only.
- A11y: labels + `htmlFor`, `FieldError` semantics, `aria-label` on icon-only controls, keyboard order.

**Server error mapping** (extract as shared util when used in 2+ features):

```ts
const mapServerErrorsToForm = (errors: FormErrors, setError: UseFormSetError<FormInput>): void => {
  Object.entries(errors).forEach(([key, messages]) => {
    const first: string | undefined = messages?.[0]
    if (!first) return // skip empty arrays — don't push undefined into setError
    setError(key as keyof FormInput, { message: first })
  })
}
```

- Guard `messages?.[0]` because `FormErrors` allows `readonly string[]` and the server may emit
  `{ field: [] }` for "field touched but no message" cases.
- Skip the field entirely on empty — passing `{ message: undefined }` into `setError` produces
  inconsistent UI states across RHF versions.

---

## Step 4 — CRUD / list / detail

**List page (Flow B/C):**

- `LayoutPage` with `heading`; use `pagination` and `filter` props.
- Filters: 12-col grid; debounce free-text via `import debounce from 'lodash/debounce'` + cleanup
  on unmount; reset button (`variant="outline"`), disabled when filters equal defaults.
- `DataTable` (from `@/shared/components/data-table/`) + `Empty` family.
- Pagination via `LayoutPage` `pagination` prop.
- Loading: `Skeleton` rows. `spellCheck={false}` for id-like inputs.

**Detail page (Flow D):**

- `LayoutPage` with `heading=null` and a back-button `action`. Custom header component renders
  record identity (name + status badge).
- Tabs / sections via `Tabs` for related collections (e.g. contacts, attachments, interactions).
- Read-only fields rendered with `Field` family or extracted display components — no editable
  inputs on the detail page itself.
- Inline edit → open `FormDialogContent` per section; never inline a form on the page.
- Lazy-load each tab with its own hook; URL query param (`?tab=…`) drives active tab so deep
  links work. Per-tab `Skeleton`.
- Header actions (assign owner, delete, export) via `Button` + dropdown menu; destructive actions
  go through shared `AlertDialog`.

**Create / edit / delete (Flow C, default delivery = dialog):**

- `customer-dialogs.tsx`-style: `Dialog` + `FormDialogContent` wrapping the extracted `<feature>-form`.
- Routed form pages (`LayoutFormPage`) only when explicitly requested or when the form is too large
  for a 720px dialog (>10 fields with multiple sections).
- Destructive actions: shared `AlertDialog` — no `window.confirm`.
- Toasts: Step 2 policy only.

**Routes and sidebar:**

- Lazy routes in `src/app/routes.tsx`; `default` exports for `React.lazy`.
- Admin routes nested under `/` with `<Outlet />` inside `LayoutAppShell`.
- `APP_SHELL_NAV_ITEMS` in `src/shared/layouts/app-shell.tsx`; `isActive` via
  `pathname.startsWith("/<feature>")`.
- Navigation: `Button` + `useNavigate()` from `react-router-dom`. Do not use `<a>` or `<Link>` in feature UI.

**Smoke test:** Create → row appears → edit → delete; deep links refresh correctly.

---

## Step 5 — Pre-merge review

### Deviation policy (kill-switch)

A 🟡 rule may be broken if and only if **all four** conditions are met:

1. The deviation is **necessary** — no design-system-compliant alternative exists or works.
2. The deviation is **scoped** — affects exactly one component / file, not a pattern shift.
3. The deviation is **documented in the plan before the change**, with this block:

   ```
   ### Deviation
   - Rule: <e.g. "no className on shadcn primitives">
   - File: <path>
   - Reason: <why the standard fix doesn't work>
   - Approved by: <user / designer / reviewer name from the chat>
   - Reverts on: <condition under which this should be undone, e.g. "DS adds X variant">
   ```

4. A `// DEVIATION: <rule> — see plan` comment sits on the offending line so the next reviewer
   doesn't blindly "fix" it.

🔴 Blockers and the design-system "STRICT" rules in `references/design-system-rules.md`
(layout shells, dialog scrolling, button compliance, date formatting) are **not** waivable through
this policy — they require a SKILL.md update, not a per-feature deviation.

If the user explicitly says "skip the rule" mid-conversation: still record it as a deviation with
"Approved by: user (chat)" so the audit trail survives.

### Checklist (severity-tagged)

#### 🔴 Blockers (must fix — block merge)

- [ ] **Lint:** `cd frontend && pnpm lint` — zero errors
- [ ] **Build:** `cd frontend && pnpm build` (skip if dev-server only) — zero errors
- [ ] **Runtime sanity:** Page mounts without console errors; routes load without 404
- [ ] **Deep-link refresh:** Direct URL navigation works for all routes

#### 🟡 Required (must fix — design / architecture violations)

- [ ] **Layout:** Feature UI inside existing shells; no unrelated `shared/layouts/` edits
- [ ] **Design system:** Reuse `shared/components/ui/*`; **zero** `className` on shadcn primitives;
      **zero** `shadow-*` in feature code
  - Auto-check: `rg 'shadow-' frontend/src/features/<name>`
  - Auto-check (className on primitives — manual review): `rg 'className=' frontend/src/features/<name>/components`
- [ ] **Button compliance:** Only `variant` on standard buttons; `size` only on icon-only buttons; no `className`
- [ ] **Dialog form (if any):** `max-h-[75vh]` + `overflow-y-auto` on body; all actions inside
      `DialogFooter`; footer outside scroll area
- [ ] **Date formatting:** All dates use `DD-MM-YYYY` or `DD-MM-YYYY HH:mm` via shared util — no
      raw ISO or `toLocaleDateString()`
  - Auto-check: `rg 'toLocaleDateString|toISOString' frontend/src/features/<name>`
- [ ] **Navigation:** `Button` + `useNavigate()`; no `<a>` / `<Link>`
  - Auto-check: `rg '<Link |<a ' frontend/src/features/<name>`
- [ ] **Form (if any):** Separate component, RO-RO props, schema hook, validation strategy
      consistent, Field family, `setError` for API errors, no bare `watch()`, field-array keys
- [ ] **List (if any):** Repository pattern, `LayoutPage` + filters + debounced search,
      `DataTable` + `Empty`, pagination prop, sidebar `startsWith`
- [ ] **Service layer:** Abstract `<Feature>Repository` exists; `Http<Feature>Repository` extends
      it; hook depends on the abstract, not the concrete adapter
  - Auto-check (target factory pattern only — when in scope):
    `rg 'new (Http|Mock)\w+Repository' frontend/src/features/<name>` — should hit only the factory file
- [ ] **Toasts:** Only when `message?.trim()`; **no fallback strings** — copy comes from server
  - Auto-check: `rg "toast\.(success|error|info)\(['\"]" frontend/src/features/<name>` — should be empty
- [ ] **i18n:** All user-visible strings via `t()`; new keys added to both `vi/` and `en/`
- [ ] **Reusable utils:** Helper used 2+ places extracted to util; pure, typed, one concern per file
- [ ] **State:** Local hooks default; Redux only for cross-feature global state
- [ ] **Plan-vs-code drift:** Final code matches plan (screens, routes, actions, API keys). If
      drifted → update the plan **before** shipping.

#### 🟢 Recommended (fix when feasible)

- [ ] **Clean code:** Small focused components (<40 lines render), single responsibility, no dead code
- [ ] **Responsive:** 320 / 768 / 1280 verified
- [ ] **Accessibility:** Keyboard navigation, focus visible, `aria-label` on icon-only controls
- [ ] **E2E smoke (Standard/Complex):** Playwright happy-path test for the primary flow
- [ ] **Performance (Complex tier or list >100 rows):** Apply
      `vercel-react-best-practices/SKILL.md` — memo, lazy, virtualization
- [ ] **Code review:** Apply `frontend-code-review/SKILL.md` checklist to changed files

### Done definition

A feature is **done** when:

1. All 🔴 Blockers pass
2. All 🟡 Required pass (or have a documented deviation in the plan — see "Deviation policy" above)
3. ≥80 % of 🟢 Recommended pass (≥5/6 with the current list — or have a documented reason)
4. Plan reflects what was actually shipped (no drift)

---

## Resume protocol

If conversation was interrupted or context was reset:

1. **Locate the plan first.** Look in: current chat thread, `docs/tasks/<feature>.md` (PM-driven —
   only if the task explicitly references the file via `@`), or the most recent commit message body.
2. **Inventory existing files:** `ls features/<feature>/` — categorize by type (`types/`,
   `schemas/`, `components/`, `pages/`, `hooks/`).
3. **Infer current step:**
   - Nothing → Step 1–2.
   - Types/schemas only → past Step 2, mid Step 3.
   - Form component exists → past Step 3.
   - List / detail page exists → past Step 4.
   - All exist → enter Step 5.
4. **Detect drift:** Compare files against the plan. If a file contradicts the plan, ask the user:
   (a) update plan, (b) refactor file, or (c) skip.
5. **Health check:** `cd frontend && pnpm lint` (scoped if possible). Note pre-existing errors
   **before** adding more.
6. **Don't re-ask answered questions.** If a plan exists, use it. If files exist, they are decided answers.
7. **State current state explicitly.** Output: "Resuming at Step N. Existing files: [...].
   Drift: [none|listed]. Lint: [clean|N pre-existing errors]." Then proceed.
