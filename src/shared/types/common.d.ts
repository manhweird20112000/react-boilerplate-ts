export type Future<T> = Promise<AxiosResponse<ResponseData<T>>>;

interface ResponseData<T> {
  message: string;
  errors?: FormErrors;
  data: T;
}
