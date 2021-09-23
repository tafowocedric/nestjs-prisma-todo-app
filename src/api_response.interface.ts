export interface Response<T> {
  success: boolean;
  message: string;
  status: number;
  data: T;
}
