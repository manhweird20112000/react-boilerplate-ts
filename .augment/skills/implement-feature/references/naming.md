# Naming Rules

## File Names

Use kebab-case.

```txt
user.type.ts
user-request.type.ts
user-response.type.ts
user-form.type.ts
user-query-key.ts
use-user-list.ts
use-user-detail.ts
use-create-user.ts
use-update-user.ts
use-delete-user.ts
user-table.tsx
user-form.tsx
user-filters.tsx
user-actions.tsx
user-list-page.tsx
user-create-page.tsx
user-edit-page.tsx
user-detail-page.tsx
user-mapper.ts
user.repository.ts
user.repository.impl.ts
mock-user.repository.impl.ts
```

## Type Names

Use PascalCase

```txt
User
UserStatus
GetUsersRequest
CreateUserRequest
UpdateUserRequest
GetUsersResponse
UserFormValues
```

## Components Names

Use PascalCase

```txt
UserTable
UserForm
UserFilters
UserActions
UserListPage
```

## Hook Names

Use camelCase and start with `use`.

```txt
useUserList
useUserDetail
useCreateUser
useUpdateUser
useDeleteUser
```

## Service Names

Use PascalCase

```txt
UserRepositoryImpl
PostRepositoryImpl
CommentRepositoryImpl
OrderRepositoryImpl
MockUserRepositoryImpl
```

## Constants Names

Use uppercase snake case.

```txt
USER_QUERY_KEY
ENDPOINT_USER_API
USER_STATUS_OPTIONS
```

## Import Rules

Use relative imports inside the same feature.

```ts
import { UserRepository } from '../services/user.repository.impl'
import type { User } from '../types/user.type'
```

Use alias imports for shared modules.

```ts
import { Toast } from '@/shared/toast'
```

Do not import another feature's internal files.
Bad:

```ts
import { useOrderList } from '@/features/orders/hooks/use-order-list'
```

Good:

```ts
import { OrderListPage } from '@/features/orders'
```
