import type { Future } from "../types/common";

export abstract class CRUDRepository<T> {
  abstract create(data: T): Future<T>;
  abstract get(id: string): Future<T>;
  abstract update(id: string, data: T): Future<boolean>;
  abstract delete(id: string): Future<boolean>;
}
