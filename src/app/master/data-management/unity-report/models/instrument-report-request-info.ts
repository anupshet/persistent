import { MonthlyReport } from './monthly-report';
import { InstrumentReportInfo } from './instrument-report-info';

export class InstrumentReportRequestInfo extends MonthlyReport {
  public instrumentInfo: InstrumentReportInfo;

  constructor() {
    super();
    this.instrumentInfo = new InstrumentReportInfo();
  }
}
