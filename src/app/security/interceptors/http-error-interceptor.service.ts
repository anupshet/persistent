// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { StatusCode } from '../../shared/api/status-codes.enum';
import { HttpErrorService } from '../services/http-errors.service';
import { ErrorsInterceptor } from '../../contracts/enums/http-errors.enum';
import { Operations } from '../../core/config/constants/error-logging.const';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private httpErrorService: HttpErrorService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error instanceof HttpErrorResponse) {
            // Backend returns unsuccessful response codes such as 404, 500 etc.
            if (error.status === StatusCode.ServerError || error.status === StatusCode.BadRequest) {
              // below if is added to skip the generic message for this errorcode and show generic message for other error codes
              if (!(error.error?.errorCode === ErrorsInterceptor.labsetup102
                || error.error?.errorCode === ErrorsInterceptor.labsetup103
                || error.error?.errorCode === ErrorsInterceptor.labsetup109
                || error.error?.errorCode === ErrorsInterceptor.labsetup108
                || error.error?.errorCode === ErrorsInterceptor.labsetup112
                || error.error?.errorCode === ErrorsInterceptor.labsetup113
                || error.error?.error === ErrorsInterceptor.labsetup135
                || error.error?.error === ErrorsInterceptor.labsetup136
                || error.error?.error === ErrorsInterceptor.dynamicreports045)) {
                this.httpErrorService.setErrorCode(error.error?.errorCode || 'default');
              }
            } else if (error.error instanceof ErrorEvent || error.error instanceof ProgressEvent) {
              this.httpErrorService.setErrorCode(Operations.NetworkError);
            } else if (error.status !== StatusCode.OK) {
              // we will get NoStatus = 0,Forbidden = 403,NotFound = 404,NotAcceptable = 406, UnAuthorized = 401
              // show the usual error
              this.httpErrorService.setErrorCode('default');
            }
          } else {
            // A client-side or network error occurred.
            // we not need to show anything here
            return throwError(error);
          }
          return throwError(error);
        })
      );
  }
}
