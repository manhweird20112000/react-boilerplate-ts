import { type AxiosResponse } from "axios";
import type { Future, ResponseData } from "@/shared/types/common";
import type {
  Account,
  AccountCreateInput,
  AccountUpdateInput,
  AccountListQuery,
  PagedResult,
} from "../types/accounts.types";

/**
 * Mock data for accounts.
 */
const MOCK_ACCOUNTS: Account[] = [
  {
    id: "1",
    name: "管理者",
    email: "admin@example.com",
    role: "admin",
    status: true,
    createdAt: "2026-04-01T10:00:00Z",
  },
  {
    id: "2",
    name: "担当者A",
    email: "staff.a@example.com",
    role: "staff",
    status: true,
    createdAt: "2026-04-01T11:00:00Z",
  },
];

export const AccountService = {
  /**
   * Get list of accounts with filters and pagination.
   */
  async getAccounts(query?: AccountListQuery): Future<PagedResult<Account>> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...MOCK_ACCOUNTS];
        if (query?.name) {
          filtered = filtered.filter((a) => a.name.includes(query.name!));
        }
        if (query?.email) {
          filtered = filtered.filter((a) => a.email.includes(query.email!));
        }
        if (query?.role) {
          filtered = filtered.filter((a) => a.role === query.role);
        }
        if (query?.status !== undefined) {
          filtered = filtered.filter((a) => a.status === query.status);
        }

        const response: AxiosResponse<ResponseData<PagedResult<Account>>> = {
          data: {
            message: "Success",
            data: {
              items: filtered,
              total: filtered.length,
            },
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config: {} as any,
        };
        resolve(response);
      }, 500);
    });
  },

  /**
   * Get a single account by ID.
   */
  async getAccountById(id: string): Future<Account> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const account = MOCK_ACCOUNTS.find((a) => a.id === id);
        if (account) {
          const response: AxiosResponse<ResponseData<Account>> = {
            data: { message: "Success", data: account },
            status: 200,
            statusText: "OK",
            headers: {},
            config: {} as any,
          };
          resolve(response);
        } else {
          reject(new Error("Account not found"));
        }
      }, 500);
    });
  },

  /**
   * Create a new account.
   */
  async createAccount(data: AccountCreateInput): Future<Account> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAccount: Account = {
          ...data,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
        };
        const response: AxiosResponse<ResponseData<Account>> = {
          data: { message: "Account created successfully", data: newAccount },
          status: 201,
          statusText: "Created",
          headers: {},
          config: {} as any,
        };
        resolve(response);
      }, 800);
    });
  },

  /**
   * Update an existing account.
   */
  async updateAccount(id: string, data: AccountUpdateInput): Future<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response: AxiosResponse<ResponseData<boolean>> = {
          data: { message: `Account ${id} updated with ${JSON.stringify(data)} successfully`, data: true },
          status: 200,
          statusText: "OK",
          headers: {},
          config: {} as any,
        };
        resolve(response);
      }, 800);
    });
  },

  /**
   * Delete an account.
   */
  async deleteAccount(id: string): Future<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response: AxiosResponse<ResponseData<boolean>> = {
          data: { message: `Account ${id} deleted successfully`, data: true },
          status: 200,
          statusText: "OK",
          headers: {},
          config: {} as any,
        };
        resolve(response);
      }, 500);
    });
  },
};
