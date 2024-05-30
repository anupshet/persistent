// © 2021 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';

import { ConfigService } from '../../core/config/config.service';
import { AuthenticationService } from '../services/authentication.service';
import { ApiConfig } from '../../core/config/config.contract';
import { flatMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private auth: AuthenticationService;
  constructor(private config: ConfigService,
    private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const config = this.config;

    // Only append token to request, if needed.
    if (config && config.getConfig('api') && this.isApiUrl(req.url, config.getConfig('api'))) {
      this.auth = this.injector.get(AuthenticationService);
      return combineLatest([this.auth.getAccessToken()]).pipe(flatMap(([accessToken]) => {
        const clonedRequest = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
            .set('Cache-Control', 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0')
        });
        return next.handle(clonedRequest);
      }));
    }
    return next.handle(req);
  }

  // Check API urls, prior to making API calls.
  private isApiUrl(url: string, apiList: ApiConfig): boolean {
    for (const prop in apiList) {
      if (typeof apiList[prop] === 'string' && url.startsWith(apiList[prop])) {
        return true;
      }
    }

    return false;
  }
}
