export type AccountRole = "ADMIN" | "STAFF";
export type AccountStatus = "ACTIVE" | "INACTIVE";

export interface Account {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: AccountRole;
  readonly status: AccountStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface AccountCreateInput {
  readonly name: string;
  readonly email: string;
  readonly role: AccountRole;
  readonly password: string;
  readonly status: AccountStatus;
}

export interface AccountUpdateInput {
  readonly name?: string;
  readonly email?: string;
  readonly role?: AccountRole;
  readonly password?: string;
  readonly status?: AccountStatus;
}

export interface AccountFilters {
  readonly name?: string;
  readonly email?: string;
  readonly role?: AccountRole;
  readonly status?: AccountStatus;
}
