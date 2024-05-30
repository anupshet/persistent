import { AnalyteReportInfo } from './analyte-report-info';

export class ProductReportInfo {
  public productMasterLotId: number;
  public analyteInfos: AnalyteReportInfo[];
  public productLotComment: string;
  public sortOrder: number;

  public constructor() {
    this.analyteInfos = [];
    this.sortOrder = 0;
  }
}
