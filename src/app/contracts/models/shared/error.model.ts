export class Error {
  constructor(
    public message: string,
    public source: string,
    public error: any,
    public stack: string
  ) { }
}
