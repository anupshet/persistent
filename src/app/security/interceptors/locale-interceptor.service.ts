import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, LOCALE_ID, Inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class LocaleInterceptor implements HttpInterceptor {

  constructor(
        @Inject(LOCALE_ID) private _locale: string
    ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clonedRequest = req.clone({
      headers: req.headers.set('Locale', this._locale)
    });

    return next.handle(clonedRequest);
  }
}
