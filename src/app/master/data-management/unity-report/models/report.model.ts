export class Report {
  constructor(
    public filename: string,
    public labTestId: string,
    public reportType: string,
    public comments: string,
    public reportMonth: string,
    public reportYear: string,
    public dateCreated: string
  ) {}
}
