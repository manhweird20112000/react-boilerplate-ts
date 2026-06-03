# Issue Creation Checklist: Local API Workbench MVP

## Pre-Creation Preparation

- [ ] Confirm scope is local-first and does not include login/register.
- [ ] Confirm storage choice: IndexedDB for web-only, or SQLite/plugin-backed storage for Tauri-first.
- [ ] Confirm MVP protocols: HTTP/HTTPS only.
- [ ] Confirm first supported auth types: Bearer Token, Basic Auth, API Key.
- [ ] Confirm first supported body types: raw JSON/text, form-data, x-www-form-urlencoded.
- [ ] Create GitHub milestone: `Local API Workbench MVP`.
- [ ] Create labels:
  - `epic`
  - `feature`
  - `user-story`
  - `enabler`
  - `task`
  - `test`
  - `priority-critical`
  - `priority-high`
  - `priority-medium`
  - `priority-low`
  - `value-high`
  - `value-medium`
  - `value-low`
  - `frontend`
  - `tauri`
  - `data`
  - `testing`

## Epic Level

### EPIC-001: Local API Workbench

- [ ] Create epic issue.
- [ ] Apply labels: `epic`, `priority-critical`, `value-high`.
- [ ] Add to milestone: `Local API Workbench MVP`.
- [ ] Add to project board column: `Backlog`.
- [ ] Link feature issue after creation.

```markdown
# Epic: Local API Workbench

## Epic Description

Build a local-first API testing workbench inspired by Postman. Users can create requests, send APIs, inspect responses, organize saved requests, manage local environments, and keep all data on their machine.

## Business Value

- **Primary Goal**: Provide a private local tool for repeatable API testing.
- **Success Metrics**: Core request flow completed in under 30 seconds; data persists after restart; smoke tests cover create-send-save-restore.
- **User Impact**: Developers and testers can debug APIs without account setup or cloud dependency.

## Epic Acceptance Criteria

- [ ] User can send HTTP requests from the UI.
- [ ] User can view response status, timing, headers, body, and errors.
- [ ] User can save and organize requests locally.
- [ ] User can define environments and use variables.
- [ ] User can export and import local workspace data.
- [ ] Desktop build works through Tauri.

## Features in this Epic

- [ ] Feature: MVP Local Postman-like Tool

## Definition of Done

- [ ] All MVP stories completed.
- [ ] Unit and E2E smoke tests passed.
- [ ] Local persistence migration covered.
- [ ] Documentation updated.
- [ ] Tauri build validated.

## Estimate

XL
```

## Feature Level

### FEAT-001: MVP Local Postman-like Tool

- [ ] Create feature issue.
- [ ] Apply labels: `feature`, `priority-critical`, `value-high`, `frontend`, `tauri`.
- [ ] Link to `EPIC-001`.
- [ ] Add to project board column: `Backlog`.
- [ ] Add dependencies after enabler/story issues are created.

```markdown
# Feature: MVP Local Postman-like Tool

## Feature Description

Deliver the first usable version of the local API workbench: request builder, response inspector, collections, environments, history, runner, and import/export.

## User Stories in this Feature

- [ ] User Story: Compose and send an HTTP request
- [ ] User Story: Inspect API responses
- [ ] User Story: Save requests into collections
- [ ] User Story: Manage local environments and variables
- [ ] User Story: Browse and restore request history
- [ ] User Story: Run saved collection requests
- [ ] User Story: Import and export workspace data

## Technical Enablers

- [ ] Technical Enabler: Local persistence architecture
- [ ] Technical Enabler: HTTP send engine
- [ ] Technical Enabler: Request/response domain model

## Acceptance Criteria

- [ ] User can create a request with method, URL, params, headers, auth, and body.
- [ ] User can send the request and inspect response details.
- [ ] User can save the request to a local collection/folder.
- [ ] User can define variables and use them in URL/headers/body.
- [ ] User can view history and restore past request state.
- [ ] User can export and import local workspace JSON.

## Estimate

XL
```

## Technical Enablers

### ENABLER-001: Request/Response Domain Model

- [ ] Create enabler issue.
- [ ] Apply labels: `enabler`, `priority-critical`, `value-high`, `frontend`, `data`.
- [ ] Estimate: 5 points.
- [ ] Blocks: `ENABLER-002`, `ENABLER-003`, `STORY-001`, `STORY-002`, `STORY-003`, `STORY-004`, `STORY-005`.

```markdown
# Technical Enabler: Request/Response Domain Model

## Enabler Description

Define the canonical TypeScript models for workspace, collection, folder, request, response, environment, variable, history entry, and runner result.

## Technical Requirements

- [ ] Define request model with method, URL, params, headers, auth, body, timeout, and metadata.
- [ ] Define response model with status, statusText, headers, body, size, duration, and error.
- [ ] Define local workspace model with collections, environments, active environment, and history.
- [ ] Add Zod schemas or equivalent runtime validation for imported/local data.

## Acceptance Criteria

- [ ] Models are type-safe.
- [ ] Invalid imported data can be rejected with useful errors.
- [ ] Models support planned MVP features without schema rewrites.

## Definition of Done

- [ ] Types and schemas implemented.
- [ ] Unit tests cover valid and invalid models.
- [ ] Documentation added for model ownership and schema version.
```

### ENABLER-002: Local Persistence Architecture

- [ ] Create enabler issue.
- [ ] Apply labels: `enabler`, `priority-critical`, `value-high`, `data`, `tauri`.
- [ ] Estimate: 8 points.
- [ ] Blocked by: `ENABLER-001`.
- [ ] Blocks: `STORY-003`, `STORY-004`, `STORY-005`, `STORY-007`.

```markdown
# Technical Enabler: Local Persistence Architecture

## Enabler Description

Implement versioned local persistence for all user data without server authentication or cloud sync.

## Technical Requirements

- [ ] Choose storage backend and document the decision.
- [ ] Implement repository interfaces for workspace, collections, environments, and history.
- [ ] Add schema versioning and migration entry point.
- [ ] Add backup-safe write behavior where practical.

## Acceptance Criteria

- [ ] Data persists across browser reload and Tauri app restart.
- [ ] Repositories expose async typed APIs.
- [ ] Initial empty workspace is created automatically.
- [ ] Corrupt or incompatible data produces a recoverable error state.

## Definition of Done

- [ ] Persistence implementation completed.
- [ ] Unit/integration tests cover create, update, delete, load, migration.
- [ ] Storage decision documented.
```

### ENABLER-003: HTTP Send Engine

- [ ] Create enabler issue.
- [ ] Apply labels: `enabler`, `priority-critical`, `value-high`, `frontend`, `tauri`.
- [ ] Estimate: 8 points.
- [ ] Blocked by: `ENABLER-001`.
- [ ] Blocks: `STORY-001`, `STORY-002`, `STORY-005`, `STORY-006`.

```markdown
# Technical Enabler: HTTP Send Engine

## Enabler Description

Implement the request execution engine and normalize browser/Tauri HTTP behavior into a single API for the UI.

## Technical Requirements

- [ ] Support HTTP methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS.
- [ ] Resolve params, headers, auth, and body before send.
- [ ] Measure duration.
- [ ] Capture response status, headers, body, size, and errors.
- [ ] Support timeout and cancellation.
- [ ] Document browser CORS limitations and Tauri behavior.

## Acceptance Criteria

- [ ] Simple GET and POST requests work.
- [ ] Network errors are shown without crashing the app.
- [ ] Timeout and cancellation states are represented in the response model.
- [ ] Engine is testable without UI.

## Definition of Done

- [ ] Send engine implemented.
- [ ] Unit tests cover success, HTTP error, network error, timeout, cancellation.
- [ ] UI integration contract documented.
```

## User Stories

### STORY-001: Compose and Send an HTTP Request

- [ ] Create user story issue.
- [ ] Apply labels: `user-story`, `priority-critical`, `value-high`, `frontend`.
- [ ] Estimate: 8 points.
- [ ] Blocked by: `ENABLER-001`, `ENABLER-003`.

```markdown
# User Story: Compose and Send an HTTP Request

## Story Statement

As a developer, I want to configure and send an HTTP request so that I can debug an API endpoint manually.

## Acceptance Criteria

- [ ] User can select method.
- [ ] User can enter URL.
- [ ] User can add, edit, disable, and delete query params.
- [ ] User can add, edit, disable, and delete headers.
- [ ] User can configure Bearer Token, Basic Auth, or API Key auth.
- [ ] User can define raw JSON/text, form-data, or urlencoded body.
- [ ] User can click Send and see loading/cancel states.
- [ ] Invalid URL shows validation feedback.

## Technical Tasks

- [ ] Build method and URL bar.
- [ ] Build request tabs: Params, Auth, Headers, Body.
- [ ] Implement request state reducer/form state.
- [ ] Integrate HTTP send engine.
- [ ] Add dirty-state handling.

## Testing Requirements

- [ ] Unit tests for request state transformations.
- [ ] Component tests for params/headers/body editing.
- [ ] Playwright smoke: compose GET request and send.
```

### STORY-002: Inspect API Responses

- [ ] Create user story issue.
- [ ] Apply labels: `user-story`, `priority-critical`, `value-high`, `frontend`.
- [ ] Estimate: 5 points.
- [ ] Blocked by: `ENABLER-001`, `ENABLER-003`.

```markdown
# User Story: Inspect API Responses

## Story Statement

As a developer, I want to inspect response details so that I can understand whether an API behaved correctly.

## Acceptance Criteria

- [ ] User can see status code and status text.
- [ ] User can see request duration.
- [ ] User can see response size when available.
- [ ] User can view response body as pretty JSON when valid.
- [ ] User can view response body as raw text.
- [ ] User can view response headers.
- [ ] User can copy response body.
- [ ] Network and timeout errors have clear messages.

## Technical Tasks

- [ ] Build response summary bar.
- [ ] Build response body viewer.
- [ ] Build response headers table.
- [ ] Build empty/loading/error states.

## Testing Requirements

- [ ] Unit tests for JSON formatting fallback.
- [ ] Component tests for response states.
- [ ] Playwright smoke: send request and inspect status/body.
```

### STORY-003: Save Requests Into Collections

- [ ] Create user story issue.
- [ ] Apply labels: `user-story`, `priority-high`, `value-high`, `frontend`, `data`.
- [ ] Estimate: 8 points.
- [ ] Blocked by: `ENABLER-001`, `ENABLER-002`.

```markdown
# User Story: Save Requests Into Collections

## Story Statement

As a developer, I want to save requests into collections and folders so that I can reuse API workflows.

## Acceptance Criteria

- [ ] User can create, rename, duplicate, and delete a collection.
- [ ] User can create, rename, duplicate, and delete a folder.
- [ ] User can save current request into a collection/folder.
- [ ] User can open a saved request.
- [ ] User can update an existing saved request.
- [ ] User sees unsaved changes before switching requests.

## Technical Tasks

- [ ] Build collection tree.
- [ ] Implement create/rename/delete actions.
- [ ] Implement save and save-as flow.
- [ ] Wire collection repository.
- [ ] Add empty states.

## Testing Requirements

- [ ] Repository tests for collection CRUD.
- [ ] Component tests for collection tree actions.
- [ ] Playwright smoke: save request and reopen it.
```

### STORY-004: Manage Local Environments and Variables

- [ ] Create user story issue.
- [ ] Apply labels: `user-story`, `priority-high`, `value-high`, `frontend`, `data`.
- [ ] Estimate: 8 points.
- [ ] Blocked by: `ENABLER-001`, `ENABLER-002`.

```markdown
# User Story: Manage Local Environments and Variables

## Story Statement

As a developer, I want to define environments and variables so that I can reuse requests across local, dev, staging, and production APIs.

## Acceptance Criteria

- [ ] User can create, rename, duplicate, and delete environments.
- [ ] User can add, edit, disable, and delete variables.
- [ ] User can select active environment.
- [ ] User can use `{{variable_name}}` in URL, params, headers, auth, and body.
- [ ] Missing variables are clearly highlighted.
- [ ] Variable scope order is documented and deterministic.

## Technical Tasks

- [ ] Build environment selector.
- [ ] Build environment editor drawer/modal.
- [ ] Implement variable resolver.
- [ ] Add resolved preview for request send.
- [ ] Persist active environment.

## Testing Requirements

- [ ] Unit tests for variable resolution.
- [ ] Component tests for environment editor.
- [ ] Playwright smoke: create env, use variable in URL, send request.
```

### STORY-005: Browse and Restore Request History

- [ ] Create user story issue.
- [ ] Apply labels: `user-story`, `priority-high`, `value-medium`, `frontend`, `data`.
- [ ] Estimate: 5 points.
- [ ] Blocked by: `ENABLER-001`, `ENABLER-002`, `ENABLER-003`.

```markdown
# User Story: Browse and Restore Request History

## Story Statement

As a developer, I want to browse request history so that I can quickly repeat previous API calls.

## Acceptance Criteria

- [ ] Each send creates a history entry.
- [ ] History shows method, URL, status, timestamp, and duration.
- [ ] User can open a history item and restore request state.
- [ ] User can delete one history item.
- [ ] User can clear all history after confirmation.
- [ ] History storage has a configurable max item limit.

## Technical Tasks

- [ ] Implement history repository.
- [ ] Build history panel/list.
- [ ] Add restore action.
- [ ] Add clear/delete flows.

## Testing Requirements

- [ ] Repository tests for history limit and clear behavior.
- [ ] Playwright smoke: send request, open history, restore request.
```

### STORY-006: Run Saved Collection Requests

- [ ] Create user story issue.
- [ ] Apply labels: `user-story`, `priority-medium`, `value-medium`, `frontend`.
- [ ] Estimate: 8 points.
- [ ] Blocked by: `STORY-001`, `STORY-003`, `STORY-005`.

```markdown
# User Story: Run Saved Collection Requests

## Story Statement

As a tester, I want to run saved requests in a collection so that I can quickly validate a repeated API flow.

## Acceptance Criteria

- [ ] User can run all requests in a collection/folder.
- [ ] Runner executes requests sequentially.
- [ ] User can stop a running collection.
- [ ] Runner summary shows pass/fail/error counts.
- [ ] Runner result shows each request status and duration.
- [ ] Failed request does not crash the runner.

## Technical Tasks

- [ ] Build runner queue engine.
- [ ] Build runner modal/page.
- [ ] Persist optional runner results.
- [ ] Add stop/cancel behavior.

## Testing Requirements

- [ ] Unit tests for runner queue.
- [ ] Integration tests for mixed success/failure run.
- [ ] Playwright smoke: run a small collection.
```

### STORY-007: Import and Export Workspace Data

- [ ] Create user story issue.
- [ ] Apply labels: `user-story`, `priority-medium`, `value-medium`, `frontend`, `data`.
- [ ] Estimate: 5 points.
- [ ] Blocked by: `ENABLER-001`, `ENABLER-002`, `STORY-003`, `STORY-004`.

```markdown
# User Story: Import and Export Workspace Data

## Story Statement

As a developer, I want to import and export local data so that I can back up my workspace or move it between machines.

## Acceptance Criteria

- [ ] User can export workspace data as JSON.
- [ ] Export includes collections, folders, requests, environments, and settings.
- [ ] User can import a valid workspace JSON file.
- [ ] Import validates schema version before writing.
- [ ] Import has a replace/merge decision.
- [ ] Invalid import shows readable validation errors.

## Technical Tasks

- [ ] Implement export serializer.
- [ ] Implement import validator.
- [ ] Build import/export UI.
- [ ] Add conflict handling for merge mode.

## Testing Requirements

- [ ] Unit tests for import validation.
- [ ] Integration tests for export then import.
- [ ] Playwright smoke: export workspace JSON.
```

## Test Issues

### TEST-001: Unit and Integration Coverage

- [ ] Create test issue.
- [ ] Apply labels: `test`, `priority-high`, `value-high`, `testing`.
- [ ] Estimate: 5 points.

```markdown
# Test: Unit and Integration Coverage

## Test Description

Add tests for domain models, variable resolution, persistence repositories, HTTP send engine, and runner queue.

## Acceptance Criteria

- [ ] Domain schema tests cover valid and invalid data.
- [ ] Variable resolver tests cover active environment, missing variables, disabled variables, and nested values if supported.
- [ ] Persistence tests cover create/update/delete/load/migration.
- [ ] HTTP engine tests cover success/error/timeout/cancel.
- [ ] Runner tests cover sequential execution and stop behavior.

## Definition of Done

- [ ] Tests run in CI/local test command.
- [ ] Critical logic has deterministic tests.
- [ ] No network dependency in unit tests.
```

### TEST-002: Playwright MVP Smoke Tests

- [ ] Create test issue.
- [ ] Apply labels: `test`, `priority-high`, `value-high`, `testing`.
- [ ] Estimate: 5 points.

```markdown
# Test: Playwright MVP Smoke Tests

## Test Description

Cover the critical user journeys for the Local API Workbench MVP.

## Acceptance Criteria

- [ ] User can compose and send a GET request.
- [ ] User can inspect response status and body.
- [ ] User can save request into a collection.
- [ ] User can create an environment and use a variable.
- [ ] User can restore request from history.
- [ ] User can export workspace data.

## Definition of Done

- [ ] Smoke tests are stable locally.
- [ ] Tests avoid real external network dependency by using MSW/local fixture server where possible.
- [ ] Failure output is actionable.
```

### TEST-003: Tauri Build Validation

- [ ] Create test issue.
- [ ] Apply labels: `test`, `priority-medium`, `value-medium`, `testing`, `tauri`.
- [ ] Estimate: 3 points.

```markdown
# Test: Tauri Build Validation

## Test Description

Validate the local API workbench works in desktop packaging mode.

## Acceptance Criteria

- [ ] Tauri dev mode can start.
- [ ] Tauri production build completes.
- [ ] Local storage backend works after app restart.
- [ ] HTTP send behavior works in desktop context.
- [ ] No obvious blank screen or route loading failure.

## Definition of Done

- [ ] Build command documented.
- [ ] Manual smoke checklist completed.
- [ ] Known desktop limitations documented.
```

## Task Checklist by Sprint

### Sprint 1

- [ ] Create `EPIC-001`.
- [ ] Create `FEAT-001`.
- [ ] Create `ENABLER-001`.
- [ ] Create `ENABLER-002`.
- [ ] Create `ENABLER-003`.
- [ ] Create partial `STORY-001` implementation tasks.
- [ ] Add all Sprint 1 issues to `Sprint Ready`.

### Sprint 2

- [ ] Create `STORY-001`.
- [ ] Create `STORY-002`.
- [ ] Create partial `STORY-005`.
- [ ] Create `TEST-001`.
- [ ] Add all Sprint 2 issues to `Sprint Ready`.

### Sprint 3

- [ ] Create `STORY-003`.
- [ ] Create `STORY-004`.
- [ ] Finish `STORY-005`.
- [ ] Create `TEST-002`.
- [ ] Add all Sprint 3 issues to `Sprint Ready`.

### Sprint 4

- [ ] Create `STORY-006`.
- [ ] Create `STORY-007`.
- [ ] Create `TEST-003`.
- [ ] Finish remaining `TEST-001` and `TEST-002` items.
- [ ] Add all Sprint 4 issues to `Sprint Ready`.

## Dependency Checklist

- [ ] Link `ENABLER-001` as prerequisite for model-dependent work.
- [ ] Link `ENABLER-002` as blocker for collections, environments, history, import/export.
- [ ] Link `ENABLER-003` as blocker for request send, response inspect, history, runner.
- [ ] Link `STORY-001` and `STORY-003` as blockers for runner.
- [ ] Link `STORY-003` and `STORY-004` as blockers for import/export.
- [ ] Link test issues to all stories they validate.

## Definition of Done Checklist

- [ ] User-facing acceptance criteria completed.
- [ ] Local persistence verified.
- [ ] Core logic tested.
- [ ] Playwright smoke tests passing.
- [ ] Accessibility basics checked.
- [ ] Tauri build validated.
- [ ] Documentation updated.
- [ ] Known limitations documented.

## Automated Tracking Recommendations

- [ ] Use GitHub Project custom fields: Priority, Value, Component, Estimate, Sprint, Epic.
- [ ] Use PR title or body issue references to auto-link work.
- [ ] Move issues to `In Review` when PR opens.
- [ ] Move issues to `Done` only after PR merge and acceptance checks.
- [ ] Track cycle time from `In Progress` to `Done`.
- [ ] Track sprint predictability by committed vs completed points.
