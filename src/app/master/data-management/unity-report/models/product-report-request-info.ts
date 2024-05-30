import { MonthlyReport } from './monthly-report';
import { ProductReportInfo } from './product-report-info';

export class ProductReportRequestInfo extends MonthlyReport {
  public productInfo: ProductReportInfo;

  constructor() {
    super();
    this.productInfo = new ProductReportInfo();
  }
}
