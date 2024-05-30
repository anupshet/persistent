// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';

import { unApi } from '../../../../core/config/constants/un-api-methods.const';
import { LabDataApiService } from '../../../../shared/api/labDataApi.service';

@Injectable()
export class LabDataService {
  constructor(
    private labDataApi: LabDataApiService
  ) {}

  getLogRecords(accountId: string) {
    let nodeId = accountId;
    const data = {
      nodeId
    };
    const url = unApi.connectivity.status;
    return this.labDataApi.post(url, data);
  }
}
