// © 2021 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';

import { unApi } from '../../../../core/config/constants/un-api-methods.const';
import { urlPlaceholders } from '../../../../core/config/constants/un-url-placeholder.const';
import { OrchestratorApiService } from '../../../../shared/api/orchestratorApi.service';

@Injectable()
export class OrchestratorService {
  constructor(
    private orchestratorApi: OrchestratorApiService
  ) {}

  getLogRecords(accountId: string) {
    let nodeId = accountId;
    const data = {
      nodeId
    };
    const url = unApi.connectivity.status;
    return this.orchestratorApi.post(url, data);
  }
}
