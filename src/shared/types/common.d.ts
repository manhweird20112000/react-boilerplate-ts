import type { AxiosResponse } from "axios";

export type Future<T> = Promise<AxiosResponse<ResponseData<T>>>;

export interface ResponseData<T> {
  message: string;
  errors?: FormErrors;
  data: T;
}
