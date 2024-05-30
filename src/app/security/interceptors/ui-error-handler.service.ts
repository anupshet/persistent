import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { ErrorType } from '../../contracts/enums/error-type.enum';
import { ErrorLoggerService } from '../../shared/services/errorLogger/error-logger.service';


@Injectable()
export class UIErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {
  }
  handleError(error) {
    const errorloggerService = this.injector.get(ErrorLoggerService);
    if (error instanceof Error) {
      errorloggerService.logErrorToBackend(
        errorloggerService.populateErrorObject(ErrorType.Script, error.stack, error.message, 'Unknown'));
    }
  }

}
