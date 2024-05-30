// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Observable } from 'rxjs';
import { InstrumentInfo, InstrumentListRequest } from '../models/shared/list-duplicate-lot-instruments.model';

export interface ILabConfigurationAPIService {
  getDuplicateLotInstruments(duplicateLotInstrumentrequest: InstrumentListRequest): Observable<Array<InstrumentInfo>>;
}
