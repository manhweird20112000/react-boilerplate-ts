import type { Future } from "@/shared/types/common";
import type { Account, AccountCreateInput, AccountUpdateInput, AccountFilters } from "@/features/accounts/types/account";
import axios from "axios";

export class AccountService {
  async create(data: AccountCreateInput): Future<Account> {
    // Mock implementation
    return axios.post("/api/accounts", data);
  }

  async get(id: string): Future<Account> {
    // Mock implementation
    return axios.get(`/api/accounts/${id}`);
  }

  async update(id: string, data: AccountUpdateInput): Future<Account> {
    // Mock implementation
    return axios.patch(`/api/accounts/${id}`, data);
  }

  async delete(id: string): Future<null> {
    // Mock implementation
    return axios.delete(`/api/accounts/${id}`);
  }

  async getAccounts(params?: AccountFilters & { page?: number; limit?: number }): Future<{ items: Account[]; total: number }> {
    // Mock implementation
    return axios.get("/api/accounts", { params });
  }
}

export const accountService = new AccountService();
