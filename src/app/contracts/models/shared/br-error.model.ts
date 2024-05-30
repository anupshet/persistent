import { ErrorType, Severity } from '../../enums/error-type.enum';

export class BrError {
  errorId?: string;
  errorDateTime: Date;
  errorType: ErrorType;
  errorMessage: string;
  operation: string;
  url: string;
  clientType: string;
  clientVersion: string;
  userId?: string;
  accountId?: string;
  startDateTime?: Date;
  endDateTime?: Date;
  source: string;
  sourceVersion: string;
  message?: string;
  application?: string;
  severity?: Severity;
  constructor(errorDateTime: any, errorType: ErrorType, errorMessage: string, operation: string, url: string,
    clientType: string, clientVersion: string, userId: string, accountId: string, source: string, sourceVersion: string,
    startDateTime?: Date, endDateTime?: Date, message?: string, application?: string, severity?: Severity, errorId?: string) {

    this.errorId = errorId;
    this.errorDateTime = errorDateTime;
    this.errorType = errorType;
    this.errorMessage = errorMessage;
    this.operation = operation;
    this.url = url;
    this.clientType = clientType;
    this.clientVersion = clientVersion;
    this.userId = userId;
    this.accountId = accountId;
    this.source = source;
    this.sourceVersion = sourceVersion;
    this.startDateTime = startDateTime || null;
    this.endDateTime = endDateTime || null;
    this.message = message || null;
    this.application = application || null;
    this.severity = severity || null;
  }
}
