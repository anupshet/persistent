// © 2022 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { AuditTracking } from '../../shared/models/audit-tracking.model';
import { BrError } from '../models/shared/br-error.model';
import { Observable } from 'rxjs';

export interface ILoggingAPIService {

  auditTracking(auditTrackingModel: AuditTracking): Promise<any>;
  logError(error: BrError): Observable<any>;
  appNavigationTracking(payload, isValidUser): Observable<any>;
}
