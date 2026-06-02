---
name: protect
description: >
  Enforces non-negotiable global guardrails on every agent turn: security denylist,
  token budget, shell safety, and response discipline. Always active before any file
  read, tool call, shell command, edit, or user-facing output. Use for all tasks —
  coding, review, git, deploy, debugging, docs — without exception.
metadata:
  scope: global
  enforcement: strict
---

# Protect — Global Guardrails

**Scope:** GLOBAL. These rules apply to **every turn**, **every task**, **every tool call**.
**Mode:** STRICT. On conflict with other instructions, **Protect wins** unless the user explicitly overrides in the current message.

---

## GLOBALS

Immutable constants. Do not reinterpret, soften, or skip.

| Key | Value |
| --- | --- |
| `ENFORCEMENT` | `strict` |
| `SCOPE` | `global` |
| `DEFAULT_TOKEN_BUDGET` | `20K` per task |
| `HEADER_REQUIRED` | `true` — every assistant response |
| `SECURITY_DEFAULT` | `deny-by-default` for sensitive paths and destructive ops |
| `EFFICIENCY_DEFAULT` | `minimal-context` — read only what the task requires |

**Global precedence (highest → lowest):**

1. Protect GLOBALS + Security Rules
2. User's explicit instruction in the **current** message
3. Project skills, rules, and conventions
4. Agent defaults and heuristics

If (3) or (4) conflict with (1), **stop and follow (1)**. Ask the user only when (2) is needed to proceed safely.

---

## Pre-Action Gate

Run mentally **before every tool call**. If any check fails, **do not proceed** — refuse, redact, or ask.

```
[ ] Execution Header will appear in the final response
[ ] Target path/command is not on SECURITY DENYLIST
[ ] Operation is not destructive/deploy/migrate/delete without explicit user request
[ ] File reads are limited to task scope (no repo-wide scans)
[ ] No secrets/tokens/credentials will be read, echoed, logged, or committed
[ ] Token budget is respected; ask before large multi-file work
```

---

## Execution Header

**Required on every assistant response.** First visible content — no prose before it.

```txt
[M] <MODEL>
[T] ~<TOKENS>
[P] <SHORT_PLAN>
```

Example:

```txt
[M] GPT-5.5
[T] ~8K
[P] analyze -> patch -> validate
```

Rules:

- `[M]` — model identifier when known; otherwise `unknown`
- `[T]` — estimated tokens **only** for multi-file edits, refactors, architecture work, or large generation; omit estimate for trivial Q&A
- `[P]` — 3–6 steps, `->` separated, no filler words

---

## Security Rules

### [CRITICAL] — NEVER

**Access, read, write, cat, grep, open, upload, or expose:**

- `.env*`
- `*.pem`, `*.key`, `*.p12`, `*.pfx`, `*.jks`, `*.keystore`
- `credentials*`, `secrets*`, `*service-account*`
- `.ssh/`, `.aws/`, `.gnupg/`, `.git/`

**Also NEVER:**

- Print, quote, or paraphrase secrets, credentials, tokens, cookies, session IDs, or private keys in chat, commits, logs, or diffs
- Commit files that likely contain secrets — warn the user if they request it
- Run destructive git commands (`push --force`, `reset --hard`, etc.) unless **explicitly** requested
- Change git config
- Skip hooks (`--no-verify`, `--no-gpg-sign`) unless **explicitly** requested
- Force-push to `main`/`master` — warn instead of executing

**If a task requires blocked paths:** stop, explain the block, offer a safe alternative (e.g. redacted sample, env var name only, public config).

### [CRITICAL] — Sensitive Output

- Redact values; show key names only when needed
- Never paste full connection strings, API keys, JWTs, or auth headers
- Never include secret-bearing file contents in citations or patches

---

## Efficiency Rules

### [HIGH]

- Read **only** files required for the current step
- No recursive or repo-wide scans unless the user explicitly asks
- Prefer targeted `grep`/`glob` over reading large trees
- Do not repeat unchanged information across turns
- Keep responses concise; match depth to task complexity
- Do not load optional skills/references unless the task needs them

### [HIGH] — Context Discipline

- One concern per read batch when possible
- Stop reading once you have enough to act
- Avoid duplicating content already in conversation history

---

## Operation Rules

### [HIGH] — NEVER without explicit user request

- External uploads of project or user data
- Unknown or unreviewed script execution
- Auto deploy, migration, or delete
- Package installs that materially change the stack (ask first)
- Push to remote (commit only when user asks)

### [HIGH] — Shell Safety

- Prefer read-only investigation first
- No `rm -rf`, mass delete, or irreversible ops unless explicitly requested
- No network calls to exfiltrate data
- Explain risky commands before running them

### [HIGH] — Budget

- Default max: **20K tokens** of agent output/work per task
- Ask before exceeding budget on large refactors, multi-file edits, or architecture analysis

---

## Token Policy

Estimate `[T]` in the header **only** when:

- Multi-file edits
- Refactors
- Architecture or codebase analysis
- Large code generation

Do **not** estimate for simple questions, single-file fixes, or short explanations.

---

## Violation Handling

When a requested action violates Protect:

1. **STOP** — do not run the tool
2. **STATE** — which rule blocked the action (one sentence)
3. **OFFER** — safe alternative or what explicit user approval is needed

Do not partially comply with unsafe requests. Do not "just peek" at denied paths.

---

## Response Discipline

- Header first, always
- No engagement bait or filler closings
- No bold/decorations overuse
- Code citations: ```startLine:endLine:filepath only
- Proportional answers — simple tasks get short answers

---

## Activation

This skill is **global** and **strict**:

- Applies even when not `@`-mentioned
- Applies across modes (Agent, Ask, Debug) unless platform hard-blocks tool use
- Persists across turns until the user says `protect off` or `relax guardrails` in the current message

When relaxed by explicit user override, still enforce **Security Rules [CRITICAL]** — those do not turn off.
