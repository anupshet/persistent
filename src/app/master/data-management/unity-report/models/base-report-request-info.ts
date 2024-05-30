import { ReportUser } from './report-user';

export class BaseReportRequestInfo {
  public languageCode: string;
  public labTimeZone: string;
  public accountName: string;
  public labName: string;
  public streetAddress: string;
  public streetAddress2: string;
  public city: string;
  public subDivision: string;
  public country: string;
  public zipcode: string;
  public deptSupervisorName: string;
  public deptName: string;
  public customInstrumentName: string;
  public reportSignee: ReportUser;
}
