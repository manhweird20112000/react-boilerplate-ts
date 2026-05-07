# Design System Rules (Step 2 reference)

These rules are non-negotiable during implementation. Apply without asking the user.

For the **deviation policy** (when you must legitimately break a rule), see SKILL.md → Step 5.

---

## Layout shells

- **List page** → `LayoutPage` wrapping `ProTable` or `ProList`.
- **Detail page** → `LayoutPage` wrapping `ProDescriptions` and `Tabs`.
- **Forms** → `ProForm` (routed) or `ProForm.ModalForm` / `ProForm.DrawerForm` (dialogs).

### Modal & Drawer Standards (STRICT)

- **Selection:** Use `Modal` for focused creation/editing; use `Drawer` for detail views or complex configurations.
- **Provider:** All messages, notifications, and modals must come from the `App` component via `App.useApp()` hook.
- **Scrolling:** Modal/Drawer bodies must enforce reasonable height limits if content is dynamic. `ProForm` variants handle scrolling and footers automatically.
- **Footer:** Submit/Cancel buttons must be placed in the footer area. `ProForm` handled this by default.
- **Close behavior:** Always include a "Cancel" or "Close" button; clicking mask should not close if the form is "dirty" (has unsaved changes).

### Standard ProForm Pattern

```tsx
<ModalForm<FormInput>
  title={t('feature.dialogs.create')}
  trigger={<Button type="primary">{t('common.actions.create')}</Button>}
  onFinish={handleSubmit}
  modalProps={{
    destroyOnClose: true,
    maskClosable: false
  }}
>
  <ProFormText
    name="name"
    label={t('feature.fields.name')}
    placeholder={t('feature.placeholders.name')}
    rules={[{ required: true, message: t('validation.required') }]}
  />
  {/* ... fields */}
</ModalForm>
```

---

## Component rules (STRICT — zero tolerance)

**Core principle:** Use Ant Design core and ProComponents. Do not reinvent what antd provides.

### Styling & Tokens

- **Token First:** Use `theme.useToken()` for any custom styling. Do not hardcode colors or spacing.
- **classNames/styles:** Use the `classNames` and `styles` props of antd components for semantic styling of internal elements.
- **Tailwind:** Allowed for structural layout (`flex`, `grid`, `gap`, `p-4`) but **FORBIDDEN** for colors, borders, or shadows that should come from tokens.
- **Global CSS:** Avoid `.ant-*` global overrides. Use `ConfigProvider` for theme-level changes.

### Component usage

- **Inputs:** `ProFormText`, `ProFormSelect`, `ProFormDateRangePicker`, etc. from `@ant-design/pro-components`.
- **Tables:** `ProTable` for data-heavy lists; `Table` for simple ones.
- **Feedback:** `message`, `notification`, `modal` from `App.useApp()`.

### Button rules (STRICT)

- Use antd `Button` props: `type` (`primary`, `default`, `dashed`, `text`, `link`), `danger`, `shape`, `size`.
- **Icons:** Use `icon` prop with icons from `@ant-design/icons`.
- **Loading:** Always use `loading` prop for async actions.

### Reusable utility functions

- Any helper function used in **2+ places** MUST be extracted to a util file (`features/<feature>/utils/` or `shared/lib/`).
- Util functions must be **pure functions** — no side effects.
- Use `antd` built-in utils or `dayjs` for dates.

---

## Validation & i18n

- **Strategy:** Ant Design `rules` prop on form items.
- **i18n:** Always use `t()` for labels, placeholders, and error messages.
- **Validation Messages:** Centralize common messages in `translation.json` under `validation.*`.

---

## Feedback (Toasts & Notifications)

- **Toasts:** Use `message.success()` / `message.error()` from `App.useApp()`.
- **Notifications:** Use `notification` for persistent or complex feedback.
- **Source:** `ResponseData.message` only. If missing or empty → no feedback.

---

## Date/time formatting (STRICT)

- **Display:** Always use `dayjs` via shared helpers.
- **Format:** `DD-MM-YYYY` (Date) or `DD-MM-YYYY HH:mm` (DateTime).
- **Pickers:** `ProFormDatePicker` / `ProFormDateTimePicker`.

---

## Responsive

- Use `Row` and `Col` with `span` and `gutter`.
- Use `Grid.useBreakpoint()` for complex responsive logic.
- `ProTable` handles mobile responsiveness via `card` mode or horizontal scroll.

---

## Loading, error, empty states

- **Loading:** `Spin`, `Skeleton`, or component `loading` props.
- **Error:** Ant Design `Result` component for page-level errors.
- **Empty:** Ant Design `Empty` component.
  ack on failure and surface error via toast.
