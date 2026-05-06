# Q&A prompt templates per tier

Use the matching template based on the assessed complexity tier. Always send all questions in a **single message**; never drip-feed.

---

## Simple tier (3–5 questions)

```
## Requirements — Round 1 (Simple)

### Must-answer
1. **Screens:** Single page (form? list? both?) — confirm the only screen we'll build.
2. **API:** Endpoint ready, or use mock?
3. **Primary action:** What does success look like (e.g. "row saved and toast shown")?

### Should-answer
4. **Validation:** Any business-specific rule beyond required/length?
5. **Permissions:** Admin-only, or open to all users?
```

---

## Standard tier (5–8 questions)

```
## Requirements — Round 1 (Standard)

### Must-answer
1. **Screens:** Which pages? (list, create, edit, detail, settings?)
2. **Form delivery:** Routed page or modal dialog for create/edit?
3. **API status:** Endpoints agreed and live, or mock-first?

### Should-answer
4. **Business rules:** Soft delete vs hard delete? Editable after creation? Restore?
5. **Scope cuts for v1:** Filters, roles, exports, bulk actions to defer?
6. **Data shape:** Pagination type? Default sort? Nested entities?
7. **UX:** Post-create navigation? Confirm before delete? Auto-save?
8. **Constraints:** Max items? File size limits? Long-text fields?
```

---

## Complex tier (5–8 + Round 2 follow-up)

```
## Requirements — Round 1 (Complex)

### Must-answer
1. **Architecture:** What entities and relationships? Multi-step wizard? Multi-tenant?
2. **State machine:** Status flow (e.g. draft → review → approved → archived)?
3. **API status:** Which endpoints exist now vs TBD?

### Should-answer
4. **Permissions matrix:** Per-role abilities (read/write/admin) per entity?
5. **Data volume:** Expected list size; pagination strategy (cursor vs offset)?
6. **Side effects:** Background jobs, notifications, audit log entries?
7. **Dependencies:** Other features this couples to (uploads, search, reports)?
8. **Edge cases:** Concurrency, deletion guards, denormalized data refresh?

### Round 2 (only if Round 1 leaves must-answer ambiguous)
- Pin down ambiguous must-answer items in ≤3 follow-up questions.
- If still unanswered → label as assumption and proceed.
```

---

## Anti-patterns to avoid

- ❌ Drip-feeding questions across multiple messages.
- ❌ Asking what's already in the requirement doc / API doc / chat history.
- ❌ Asking the same question twice in different words.
- ❌ Holding implementation hostage on a `should-answer` question — proceed with default.
- ❌ Asking yes/no when the choices materially differ — offer the named alternatives explicitly.
