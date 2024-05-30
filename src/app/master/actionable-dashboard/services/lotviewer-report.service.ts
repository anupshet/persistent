// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';

import { LotViewerService } from '../../../shared/api/lotViewer.service';
import { LotviewerReportType } from '../../../contracts/enums/lotviewer/lotviewer-reporttype.enum';

@Injectable({
  providedIn: 'root'
})
export class LotviewerReportService {
  lotviewerReportType: LotviewerReportType;

  constructor(private lotViewerService: LotViewerService) { }

  public getLotviewerReport(lotviewerReportType: LotviewerReportType,locationPayload: any) {
    return this.lotViewerService.getLotviewerReport(lotviewerReportType, locationPayload);
  }

}
