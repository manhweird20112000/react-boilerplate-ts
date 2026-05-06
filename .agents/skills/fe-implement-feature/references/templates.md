# Plan Templates

Copy-paste these blocks into your implementation plan. Choose the appropriate depth based on the complexity tier.

---

## Questions template (Round 1)

```
## Requirements — Round 1

### Must-answer
1. Q:
   A:
2. Q:
   A:
3. Q:
   A:

### Should-answer
4. Q:
   A:
5. Q:
   A:
6. Q:
   A:
```

If any must-answer is unanswered after Round 1 → ask max 3 follow-up questions in Round 2.
If still unanswered → assume and label "Assumed".

---

## Screen blueprint

```
Screen: <screen name>
Route:  <route or "dialog">
Layout: LayoutPage | LayoutFormPage | FormDialogContent

Component map:
- Page shell: LayoutPage (heading="…", action=…) | LayoutFormPage | FormDialogContent
- Data table: DataTable + column definitions
- Empty state: Empty + EmptyHeader + EmptyTitle + EmptyMedia
- Filters: Input, Select, Button(variant="outline") → LayoutPage filter prop
- Pagination: LayoutPage pagination prop
- Row actions: Button(variant="ghost") | DropdownMenu
- Delete confirm: AlertDialog
- Form fields: FieldGroup → Field → FieldLabel + FieldContent + FieldError
- Toast: sonner — only when message?.trim()
```

Remove rows that don't apply to the screen. Add feature-specific rows as needed.

---

## Requirements capture — Standard/Complex

```
## Requirements capture

### Flow & complexity
- Tier: Simple | Standard | Complex
- Flow: A | B | C
- Data mode: http | mock | http+mock

### Screens
| Screen | Route | Layout | Notes |
|---|---|---|---|
| | | | |

### API contract
| Action | Method | Endpoint | Status |
|---|---|---|---|
| List | GET | | agreed / TBD |
| Create | POST | | agreed / TBD |
| Update | PUT | | agreed / TBD |
| Delete | DELETE | | agreed / TBD |

- Pagination default: page=1, per_page=15
- Sort default: created_at desc
- Validation error shape: { errors: { field: string[] } }

### Validation strategy
- Strategy: inline English | i18n
- If i18n — keys: (list here)

### Form fields (if any)
| Field | Label | Control | Required | Default | Constraints | API key |
|---|---|---|---|---|---|---|
| | | | | | | |

### Table columns (if any)
| Header | Property | Sortable | Format | Align |
|---|---|---|---|---|
| | | | | |

### Q&A summary
| # | Question | Answer |
|---|---|---|
| 1 | | |
| 2 | | |

### Assumptions
- Assumed: …

### Out of scope
- …

### Acceptance criteria
Screen: …
- Given …, when …, then …
- Given …, when …, then …
- Given …, when …, then …
```

---

## Requirements capture — Simple (abbreviated)

```
## Requirements capture

- Tier: Simple
- Flow: A | B | C
- Data mode: http | mock
- Screen: <name> — route: <route> — layout: <layout>
- API: <endpoint> (<agreed/TBD>)
- Validation: inline English | i18n
- Key decisions: …
- Assumptions: …
- Out of scope: …

Acceptance:
- Given …, when …, then …
- Given …, when …, then …
```

---

## Test plan (add before Step 5)

```
## Test plan
- Create → success → expected navigation → row visible in list
- Edit → success → values persisted after refresh
- Delete → confirm dialog → success → row removed
- Empty state and loading state render correctly
- Responsive checks: 320 / 768 / 1280
- Deep-link refresh: direct URL works
```
