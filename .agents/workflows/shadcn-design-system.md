---
description: Shadcn/UI design system notes (tokens, spacing, layout rules, states, a11y, governance). Use this as the default UI contract for all new/updated screens.
---

## Workflow: Shadcn/UI design system (Core Principles + rules)

## Core Principles (required)
- **Consistency over creativity**: prefer a few well-used patterns over many one-offs.
- **Token-first (single source of truth)**: use semantic tokens for colors/typography/radius/shadow/motion; avoid hardcoding.
- **Composition over customization**: compose primitives and shared layouts; avoid deep per-screen styling.
- **Accessibility is non-negotiable**: keyboard-first, focus-visible ring, semantic HTML/ARIA, sufficient contrast.
- **Predictable layout rules**: use the same spacing scale and layout primitives everywhere.
- **Responsive by default**: mobile-first; content-safe for long text/i18n.
- **Clarity of hierarchy**: one primary action per view; clear information hierarchy.
- **Scalable governance**: document Do/Don't; keep an inventory of patterns; enforce via review checklist.

## Required Inputs (gating)
- **At least ONE of**:
  - **UI design** (Figma / screenshots)
  - **Text requirements** describing layout + interactions
- **If missing**:
  - **STOP and ask for clarification**

## Tokens & Theming (required)
- **Use semantic tokens** (e.g. `--primary`, `--muted`, `--border`, `--ring`) rather than raw colors.
- **Dark mode support**:
  - Never tune a component only for light mode.
  - Ensure text-muted, borders, and focus rings are still legible.
- **Avoid hardcoding**:
  - No raw hex colors.
  - No arbitrary spacing values outside the spacing scale.

## Spacing scale (required)
- **Primary scale** (Tailwind): `gap-2`, `gap-3`, `gap-4`, `gap-6`, `gap-8` (8/12/16/24/32px)
- **Usage by relationship**:
  - **Inside a control** (icon + label, label + hint): `gap-2` / `space-y-2`
  - **Inside a group** (fields in a form, controls in a toolbar cluster): `gap-4` / `space-y-4`
  - **Between sections** (page blocks): `space-y-6` or `space-y-8`
- **Buttons spacing**:
  - Between 2 adjacent action buttons: **default `gap-2`**, use `gap-3` only when the design requires more breathing room.
- **Prefer `gap-*`/`space-*`** over scattered `mt-*`/`mb-*`.

## Layout rules: Flex vs Grid (required)
- **Use `flex` when**:
  - The layout is primarily one-dimensional (row or column).
  - You need alignment distribution: `items-center`, `justify-between`, `flex-wrap`.
- **Use `grid` when**:
  - You need stable columns/rows alignment across items.
  - Building forms with multiple columns or dashboards of cards.
- **Mobile-first**:
  - Start with single-column; add columns with `sm:`/`md:` breakpoints.

## Standard layout patterns (recommended defaults)
- **Button group (footer/actions)**:
  - Desktop: `flex items-center justify-end gap-2`
  - Mobile: `flex flex-col-reverse gap-2 sm:flex-row sm:justify-end`
- **Toolbar (filters left, actions right)**:
  - `flex flex-col gap-3 md:flex-row md:items-center md:justify-between`
- **Filters**:
  - Few controls: `flex flex-wrap items-center gap-2`
  - Many controls / need alignment: `grid gap-3 md:grid-cols-3` (or a 12-col grid if the app uses that pattern)
- **Forms**:
  - Default: field stack `space-y-4`
  - Two columns: `grid gap-4 md:grid-cols-2` and use `md:col-span-2` for long fields.

## Component states (required)
- Every interactive component must handle:
  - **default, hover, active**
  - **focus-visible** (ring)
  - **disabled**
  - **loading** (if action can submit/fetch)
- **Loading must not shift layout** (keep button width / skeleton shape consistent).

## Action hierarchy (required)
- **One primary action per view**.
- **Destructive actions**:
  - Require confirmation (Alert Dialog) unless the flow explicitly uses undo.
  - Use clear copy describing impact.

## A11y rules (required)
- **Keyboard-first**: all interactions reachable by keyboard; dialogs/popovers manage focus correctly.
- **Accessible names**: buttons must have text or `aria-label`.
- **Decorative icons**: must be `aria-hidden="true"`.
- **Hit targets**: ensure comfortable click/tap sizes, especially on mobile.

## Content safety (required)
- **i18n/long text**:
  - Do not rely on fixed widths.
  - Use `min-w-0` where needed; apply `truncate` intentionally; prefer `break-words` for user content.
- **Numbers/dates**:
  - Use locale-safe formatting (`Intl.NumberFormat`, `Intl.DateTimeFormat`) when displaying values.

## Data views (tables/lists) (required)
- Always implement:
  - **Loading state** (skeleton/spinner), **Empty state** (with next action), **Error state** (with retry).
- **Row actions**:
  - If there are more than 2 actions, prefer a menu (e.g. `...`).
  - Never run destructive actions immediately without confirmation (unless undo is explicitly required).

## Do NOT (required)
- **Do NOT** introduce new spacing values outside the spacing scale.
- **Do NOT** hardcode colors; use tokens and existing variants.
- **Do NOT** create one-off variants unless there is a cross-feature need.
- **Do NOT** omit focus-visible styling and keyboard flows.
- **Do NOT** ship UI without empty/loading/error states.

## Review checklist (required before merge)
- **Tokens**: no hardcoded colors; semantic tokens/variants used.
- **Spacing**: uses the agreed scale; `gap/space-*` preferred; no random margins.
- **Layout**: flex for 1D; grid for 2D; responsive mobile-first.
- **States**: hover/focus/disabled/loading done; no layout shift on loading.
- **A11y**: keyboard flows, focus management, accessible names, decorative icons hidden.
- **Content**: long text/i18n safe; numbers/dates formatted appropriately.
- **Hierarchy**: single primary action; destructive guarded by confirm/undo.
