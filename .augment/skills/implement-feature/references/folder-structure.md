# Folder Structure

## Default Feature Structure

```txt
src/
  features/
    {{feature-name}}/
      types/
        {{entity}}.type.ts
        {{entity}}-request.type.ts
        {{entity}}-response.type.ts
        {{entity}}-form.type.ts

      constants/
        {{entity}}-query-key.ts
        {{entity}}-routes.ts
        {{entity}}-options.ts

      services/
        {{entity}}.service.ts

      hooks/
        use-{{entity}}-list.ts
        use-{{entity}}-detail.ts
        use-create-{{entity}}.ts
        use-update-{{entity}}.ts
        use-delete-{{entity}}.ts

      components/
        {{entity}}-table.tsx
        {{entity}}-form.tsx
        {{entity}}-filters.tsx
        {{entity}}-actions.tsx

      pages/
        {{entity}}-list-page.tsx
        {{entity}}-create-page.tsx
        {{entity}}-edit-page.tsx
        {{entity}}-detail-page.tsx

      utils/
        {{entity}}-mapper.ts

      index.ts
```
