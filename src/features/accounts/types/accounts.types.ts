export type AccountRole = "admin" | "staff";

export interface Account {
  id: string;
  name: string;
  email: string;
  role: AccountRole;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AccountCreateInput extends Omit<Account, "id" | "createdAt" | "updatedAt"> {
  password: string;
}

export interface AccountUpdateInput extends Partial<AccountCreateInput> {
  resetPassword?: boolean;
}

export interface AccountListQuery {
  name?: string;
  email?: string;
  role?: AccountRole;
  status?: boolean;
  page?: number;
  limit?: number;
}

export interface PagedResult<T> {
  items: readonly T[];
  total: number;
}
