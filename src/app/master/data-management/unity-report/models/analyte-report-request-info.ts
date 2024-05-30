import { MonthlyReport } from './monthly-report';
import { AnalyteReportInfo } from './analyte-report-info';

export class AnalyteReportRequestInfo extends MonthlyReport {
  public analyteInfo: AnalyteReportInfo;
  public excludeLabSummary: boolean;

  public constructor() {
    super();
    this.analyteInfo = new AnalyteReportInfo();
  }
}
