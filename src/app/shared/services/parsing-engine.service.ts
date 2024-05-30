// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ParsingInfo } from '../../contracts/models/connectivity/parsing-engine/instruction-id-name.model';
import { unApi } from '../../core/config/constants/un-api-methods.const';
import { ParsingEngineApiService } from '../api/parsingEngineApi.service';

@Injectable()
export class ParsingEngineService {
  constructor(
    private parsingEngineApi: ParsingEngineApiService
  ) { }

  getInstructions(locationId: string): Observable<ParsingInfo> {
    const data = {
      locationId
    };
    const url = unApi.connectivity.postParsing;
    return this.parsingEngineApi.post<ParsingInfo>(url, data, true);
  }

  getInstructionsById(instructionId: string): Observable<ParsingInfo> {
    const url = unApi.connectivity.instructionsById
      .replace('{parsingJobConfigId}', instructionId);
    return this.parsingEngineApi.getWithError(url, null, true);
  }

  addInstructions(locationId: string, data) {
    const url = unApi.connectivity.getParsing;
    data.labLocationId = locationId;
    return this.parsingEngineApi.post(url, data, true).pipe(map(res => res));
  }

  updateInstructions(instructionId: string, locationId: string, data) {
    const url = unApi.connectivity.parsingInstructions
      .replace('{parsingJobConfigId}', instructionId);
    data.labLocationId = locationId;
    return this.parsingEngineApi.put(url, data, true);
  }

  removeInstructions(instructionId: string, data) {
    const url = unApi.connectivity.parsingInstructions.replace('{parsingJobConfigId}', instructionId);
    return this.parsingEngineApi.delWithData(url, data, true).pipe(map(res => res));
  }

}
