# Plan Templates (Ant Design)

---

## Screen blueprint

```
Screen: <screen name>
Route:  <route or "dialog">
Layout: LayoutPage | ProForm.ModalForm | ProForm.DrawerForm

Component map:
- Container: LayoutPage | Modal | Drawer
- List: ProTable | ProList
- Detail: ProDescriptions
- Form: ProForm | ModalForm | DrawerForm
- Feedback: App (message, notification, modal)
- Navigation: antd Tabs | Button (type="link")
- Row actions: Dropdown menu | Button (type="text", icon=...)
```

---

## Requirements capture

```
## Requirements capture

### Flow & complexity
- Tier: Simple | Standard | Complex
- Flow: A | B | C | D
- Data mode: http | mock

### Screens
| Screen | Route | Component | Notes |
|---|---|---|---|
| | | | |

### API contract
| Action | Method | Endpoint | Status |
|---|---|---|---|
| | | | |

### Validation
- Strategy: antd rules + i18n
- Messages: validation.required, etc.

### Form fields
| Field | Label | Control | Rules | API key |
|---|---|---|---|---|
| | | | | |

### Table columns
| Header | DataIndex | Sort | Format |
|---|---|---|---|
| | | | |
```

---

## Test plan

```
## Test plan
- ProTable: data loads via request, filters/sorting work
- Form: validation triggers, onFinish calls repository, message.success shows
- Detail: ProDescriptions renders correct item data
- UX: Modal/Drawer closes on cancel/success
- Responsive: Check grid spans on mobile/tablet
```
