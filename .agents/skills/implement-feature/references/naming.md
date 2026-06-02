# Naming Rules

## File Names

Use kebab-case.

```txt
user.type.ts
user-payload.type.ts
user-form.type.ts
user-query-key.ts
use-list-user.ts
use-user-detail.ts
use-create-user.ts
use-update-user.ts
use-delete-user.ts
user-table-list.tsx
user-table-filter.tsx
user-form.tsx
create-user-dialog.tsx
edit-user-dialog.tsx
list-user.page.tsx
user-query.ts
user.repository.ts
user.factory.ts
http-user.repository.impl.ts
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
useListUser
useUserDetail
useCreateUser
useUpdateUser
useDeleteUser
```

## Service Names

Use PascalCase

```txt
UserRepoImpl
PostRepoImpl
CommentRepoImpl
OrderRepoImpl
MockUserRepositoryImpl
```

## Constants Names

Use uppercase snake case.

```txt
USER_QUERY_KEYS
ENDPOINT_USER_API
USER_STATUS_OPTIONS
```

## Import Rules

Use relative imports inside the same feature.

```ts
import { UserRepository } from '../services/user.repository'
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
