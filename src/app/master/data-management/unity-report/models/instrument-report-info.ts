import { ProductReportInfo } from './product-report-info';

export class InstrumentReportInfo {
  public instrumentId: string;
  public instrumentName: string;
  public productInfos: ProductReportInfo[];

  public constructor() {
    this.productInfos = [];
  }
}
