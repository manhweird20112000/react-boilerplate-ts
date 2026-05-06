---
name: react-hook-form-zod
description: |
  Build type-safe validated forms in React using React Hook Form and Zod. Single schema can validate on client and server with TypeScript inference via z.infer.

  Use when building forms with validation, integrating project Field/Input patterns, multi-step wizards, useFieldArray, fixing uncontrolled/controlled warnings, resolver errors, or async validation.
user-invocable: false
allowed-tools: Bash(npm *), Bash(pnpm *), Bash(bun *)
---

# React Hook Form + Zod

**Suggested versions** (verify against your lockfile): `react-hook-form`, `zod`, `@hookform/resolvers`.

```bash
npm install react-hook-form zod @hookform/resolvers
```

## Basic pattern

```typescript
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: { email: "", password: "" },
});

<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register("email")} />
  {errors.email && <span role="alert">{errors.email.message}</span>}
</form>
```

## useForm modes

- `mode: "onSubmit"` — default, fewer re-renders.
- `mode: "onBlur"` / `mode: "onChange"` — trade-off vs performance.
- `shouldUnregister: true` — often used with multi-step forms so unmounted fields drop from values.

## Registration

- Prefer `register` for native inputs (uncontrolled, best performance).
- Use `Controller` when the control has no ref or is a third-party component; always spread `{...field}` in `render`.

## Zod refinements (cross-field)

```typescript
z.object({ password: z.string(), confirm: z.string() }).refine(
  (data) => data.password === data.confirm,
  {
    message: "Passwords don't match",
    path: ['confirm']
  }
)
```

## useFieldArray

- Use `key={field.id}` on list rows, not array index.
- Register with `contacts.${index}.name` (or equivalent) and read nested errors with optional chaining.

## Server validation

Reuse the same `schema` (or a stricter server variant) on the API. Client validation is not a security boundary.

Map API field errors with `setError` from `useForm`.

## UI in this repo

Prefer project `Field`, `Input`, and related primitives from `@/shared/components/ui` per existing patterns. Wire them with `Controller` or `register` depending on whether the component forwards a ref.

## Performance

- Avoid `watch()` without arguments; prefer `watch("fieldName")` when you need one value.
- Prefer `register` over `Controller` for plain inputs.

## Rules of thumb

1. Always provide `defaultValues` for fields you register (avoids uncontrolled → controlled warnings).
2. Never skip server-side validation for persisted or privileged actions.
3. One primary resolver (`zodResolver`); merge Zod schemas instead of stacking competing resolvers.
4. Do not use array index as React `key` for `useFieldArray` rows.

## References

- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [@hookform/resolvers](https://github.com/react-hook-form/resolvers)
