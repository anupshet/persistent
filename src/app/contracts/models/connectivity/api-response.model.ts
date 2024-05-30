export class ApiResponse<T> {
  status: string;
  code: number;
  messages: Array<string>;
  dateTime: Date;
  details: T;
}
