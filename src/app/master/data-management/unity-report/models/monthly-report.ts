// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { BaseReportRequestInfo } from './base-report-request-info';

export class MonthlyReport extends BaseReportRequestInfo {
  public entityId: string;
  public yearMonth: number;
  public locationId: string;
}
