# Validation i18n Locale Contract

When using i18n for Zod (and related client validation), follow this contract in the locale file (e.g. `public/locales/vi/translation.json`).

## Key separation

- **`validation.*` = shared error templates only:** Reusable validation error message templates (e.g. `required`, `min`, `numberFinite`, `numberBetweenInclusive`). Do **not** put human-readable field titles or feature-specific labels under `validation`.
- **`<feature>.fields.*` = field display names:** Human-readable names for `{{_field_}}` interpolation. Add keys under `{ "systemSettings": { "fields": { ... } } }` or `departments.fields` — same shape as form/API field keys. In the schema hook: `t('validation.required', { _field_: t('systemSettings.fields.googleDriveRootCrm') })`.

## Rules

- **Single root for templates:** Do not add parallel trees for generic rules (e.g. `systemSettings.validation.*` for reusable validators). Feature-specific one-off business validation copy may still live under `departments.validation.codeDuplicate` when it is not a shared template.
- **Flat keys under `validation` for new templates:** Add new keys as direct children of `validation` only when they are sentence templates (e.g. `validation.numberFinite`). Avoid `validation.fieldSomeApiKey` for labels — use `<feature>.fields.someApiKey` instead.
- **Reuse before adding:** Prefer existing shared keys (`validation.required`, `validation.min`, `validation.max`, …) with interpolation when the sentence shape already matches. Add a new `validation.*` key only when no existing template fits.
- **Flexible messages:** Prefer templates with placeholders so one key works across fields and numeric bounds. Use the project's established placeholder style (`{{_field_}}`, `{{_length_}}`, `{{_min_}}`, `{{_max_}}`) and pass values from the schema hook (`useMemo` + `useTranslation`).

## Placeholder examples

- `validation.min` with `_field_` + `_length_` for minimum string length; `_field_` resolved via `t('<feature>.fields.<key>')`.
- `validation.numberBetweenInclusive` with `_field_`, `_min_`, `_max_` for inclusive numeric ranges.
- Generic number rules: `validation.numberFinite`, `validation.numberInteger`, `validation.numberPositive` with `_field_` from `<feature>.fields.*`.

## Reference implementation

- `features/system-settings/schemas/system-settings.schema.ts` — `t('validation.…')` for templates + `t('systemSettings.fields.…')` for field names.
- `public/locales/vi/translation.json` — `validation` for templates; `systemSettings.fields` for labels.
