# Template Manifest

Load **one row** per step. Do not bulk-read template folders.

## Template source

| Domain shape | Copy from | Sample fields |
|--------------|-----------|---------------|
| Simple CRUD entity | `templates/generic-crud/` | `name`, `description`, `is_enabled` — replace everywhere |
| Account-like entity | `templates/account-like/` | `email`, `name`, `status`, `role`, date-range filters — replace if domain differs |
| UX / responsive patterns | existing feature in the target project (if any) | Read only the matching file when templates are insufficient |

Integration wiring (routes, navigation, MSW aggregator, i18n): follow the app integration row in this manifest and match the conventions of any existing feature in the target project.

Before copying templates, identify target entity fields, list columns, filters, required fields,
unique constraints, enum values, API paths, and translation keys. Replace sample fields wherever
they appear, including types, payloads, schemas, query helpers, factories, MSW db/validation, and UI.

| Step | Template(s) → output |
|------|----------------------|
| types | `{source}/types/{{feature}}.type`, `{source}/types/{{feature}}-payload.type`, `{source}/types/{{feature}}-form.type` |
| constants | `{source}/constants/{{feature}}-messages`, `{source}/constants/{{feature}}-query-key`, `{source}/constants/{{feature}}-routes` |
| repository | `{source}/services/{{feature}}.repository`, `{source}/services/{{feature}}.factory`, `{source}/services/http-{{feature}}.repository.impl`, `{source}/services/mock-{{feature}}.repository.impl` |
| query | `{source}/utils/{{feature}}-query` |
| msw | `{source}/msw/{{feature}}-factory`, `{source}/msw/{{feature}}-db`, `{source}/msw/{{feature}}-validation`, `{source}/msw/{{feature}}-operations`, `{source}/msw/{{feature}}-handlers` |
| hooks | `{source}/hooks/use-list-{{feature}}`, `{source}/hooks/use-{{feature}}-detail`, `{source}/hooks/use-create-{{feature}}`, `{source}/hooks/use-update-{{feature}}`, `{source}/hooks/use-delete-{{feature}}` |
| schema | `{source}/schemas/{{feature}}.schema` |
| ui-table | `{source}/components/{{feature}}-table-list`, `{source}/components/{{feature}}-table-filter` |
| ui-form | `{source}/components/{{feature}}-form`, `{source}/components/create-{{feature}}-dialog`, `{source}/components/edit-{{feature}}-dialog` |
| page | `{source}/pages/list-{{feature}}.page` |
| barrel | `{source}/index` |
| app-integration | wire `src/app/routes.tsx` (list route + create/edit redirects), `src/features/navigation/admin-navigation.tsx` (nav item + `getPageTitle`), `src/infra/msw/handlers.ts`, and `public/locales/*/translation.json` when applicable |

`{source}` is `generic-crud` or `account-like`, both under `templates/`.

Replace placeholders: `{{feature}}`, `{{featurePlural}}`, `{{featureCamel}}`, `{{featurePluralCamel}}`, `{{Feature}}`, `{{FeaturePlural}}`, `{{FEATURE}}` (UPPER_SNAKE of `{{feature}}`, e.g. `account` → `ACCOUNT`).

Rename `.template` → target extension when writing files.

Unit tests are not part of this manifest. Add them with `write-unit-tests` after scaffold (10 happy + 10 bad).
