---
name: fe-implement-feature
description: |
  Single source of truth for implementing a frontend feature in the React + Vite + i18n codebase using Ant Design 6.x.
  Classify complexity (Simple/Standard/Complex) and flow (A — form only, B — list only, C — full
  CRUD, D — detail/read view), gather requirements, apply antd design-system standards, build forms with ProForm, and
  build lists/detail pages with ProTable/ProDescriptions.
user-invocable: false
allowed-tools: [Read, Glob, Grep, Bash, Edit, Write, ReadLints]
---

# FE implement feature (Ant Design Edition)

## How to use this skill

Read this file fully. Then read references **on demand only**:

| Reference                                  | Read when                                                              |
| ------------------------------------------ | ---------------------------------------------------------------------- |
| `references/project-patterns.md`           | First time touching this project's HTTP/i18n/master-data/hook patterns |
| `references/design-system-rules.md`        | **Step 2** — read once per session before any UI code                  |
| `references/q-and-a-template.md`           | **Step 1** Round 1 — when drafting the question prompt                 |
| `references/templates.md`                  | **Step 1** plan output — copy the matching block                       |
| `references/validation-i18n.md`            | **Step 3** before writing validation rules (locale key contract)       |
| `references/repository-factory-pattern.md` | Feature truly needs both http + mock at runtime                        |

**Sister skills**:

- `@.claude/skills/ant-design/SKILL.md` — Ant Design deep-dive (MANDATORY)

---

## Quickstart

1. **Assess complexity** — Simple / Standard / Complex
2. **Classify flow** — A (form) / B (list) / C (CRUD) / D (detail)
3. **Step 1** — Gather requirements (max 2 rounds)
4. **Step 2** — Apply antd design-system standards (tokens, ProComponents)
5. **Implementation steps by flow**
6. **Step 5** — `pnpm lint` → severity checklist → fix blockers
7. **Step 6** — add unit tests and E2E tests for the feature

---

## Data layer

Hooks depend on `abstract class <Feature>Repository`. Adapters (HTTP/Mock) extend it.

- **HTTP adapter**: uses `HttpService` from `@/infra/api`.
- **MSW Mocking (Preferred)**: We use MSW to intercept HTTP calls. When `VITE_USE_MSW=true` is set, the repository factory should return the `HttpAdapter`, and MSW handles the data.
- **Mock adapter (Legacy/Fallback)**: In-memory class used only if MSW is not suitable.
- Param transformation (filters, sorting) lives in the adapter.

---

## Mocking with MSW

**Standards:**

- Handlers live in `src/mocks/handlers/<feature>.ts`.
- Data definitions and factories live in `src/mocks/factories.ts` and `src/mocks/db.ts`.
- MSW should be initialized in `src/main.tsx`.
- Enable via `.env`: `VITE_USE_MSW=true`.

---

## Step 3 — Feature form & Validation

**Deliverables:**

- `schemas/` folder containing `<feature>.schema.ts`.
- `use<Feature>Schemas` hook: uses `useTranslation` and `useMemo` to return i18n-aware Zod schemas.
- **Contract:** Templates from `validation.*` (locale) + labels from `<feature>.fields.*` (locale).
- `ProForm` variant (ModalForm, DrawerForm, or routed ProForm).
- Use `ProFormText`, `ProFormSelect`, etc.
- Validation via `rules` prop using Zod-backed logic or `react-hook-form` with `zodResolver`.
- Source data mapping in `onFinish`.

---

## Step 4 — CRUD / list / detail

**List page (Flow B/C):**

- `ProTable` is the primary component.
- Use `request` prop for data fetching (connected to repository).
- Filters handled via `columns` definition.

**Detail page (Flow D):**

- `ProDescriptions` for record identity.
- `Tabs` for related collections.
- Action buttons in page header or descriptions extra.

---

## Step 5 — Pre-merge review

### Checklist (severity-tagged)

#### 🔴 Blockers (must fix)

- [ ] **Lint:** `pnpm lint` — zero errors
- [ ] **Build:** `pnpm build` — zero errors
- [ ] **Antd Provider:** Use `App.useApp()` for feedback (message/modal).
- [ ] **Stable Keys:** `Table` / `ProTable` has stable `rowKey`.

#### 🟡 Required (design / architecture)

- [ ] **Tokens:** Use `theme.useToken()`; no hardcoded colors.
- [ ] **ProComponents:** Use `ProTable`, `ProForm`, `ProDescriptions` instead of custom equivalents.
- [ ] **Buttons:** Use antd `Button` props (`type`, `icon`, `loading`).
- [ ] **i18n:** All strings via `t()`.
- [ ] **Dates:** Use `dayjs` via shared helpers.
- [ ] **Tests:** Add unit tests for component logic/hooks and E2E coverage for the feature flow.

#### 🟢 Recommended (polish)

- [ ] **Responsive:** Verify with `Grid.useBreakpoint()`.
- [ ] **UX:** `destroyOnClose` on modals; `loading` states on buttons.

## Step 6 — Testing the feature

- **Unit tests**: cover component rendering, validation rules, event callbacks, repository adapters, and hook behavior.
- **E2E tests**: cover the full feature path in `tests/` using user flows.
  - For form features: open form, fill fields, submit, assert success and side effects.
  - For list/detail flows: load data, filter/sort, navigate to detail, perform actions.
- **Mocks**: prefer `msw` in tests for network stubbing; use real repository interface contracts.
- **Commands**:
  - `pnpm test -- --runInBand` or project-specific unit test command
  - `pnpm playwright test` for E2E coverage
- **Review**: make sure new tests are added to `src/tests/` and any feature story/seed if needed.
