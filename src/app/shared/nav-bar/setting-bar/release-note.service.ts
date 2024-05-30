// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import * as ngrxStore from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiConfig } from '../../../core/config/config.contract';
import { ConfigService } from '../../../core/config/config.service';
import { unApi } from '../../../core/config/constants/un-api-methods.const';
import { ApiService } from '../../../shared/api/api.service';
import { SpinnerService } from '../../services/spinner.service';
import * as fromRoot from '../../../state/app.state';

@Injectable()
export class ReleaseNotesService extends ApiService {
  constructor(_http: HttpClient, _config: ConfigService, _store: ngrxStore.Store<fromRoot.State>,
    spinnerService: SpinnerService) {
    super(_http, _config, _store, spinnerService);
    this.apiUrl = (<ApiConfig>_config.getConfig('api')).peerGroupReportingUrl;
  }

  getAll(fileName: string) {
    const path = unApi.dataManagement.reporting.releaseNotes
      .replace('{fileName}', fileName);
    const j = this.get(path, 'arraybuffer');
    return j;
  }
}
