import { Subject } from 'rxjs';

export const authEventNames: any = {
  UNAUTHENTICATE: 'unauthenticate',
  AUTH_EVENT_LOGOUT: 'logout',
  AUTH_EVENT_TOKEN_REFRESHED: 'token_refreshed',
  AUTH_EVENT_TOKEN_EXPIRED: 'token_expired',
  AUTH_EVENT_TOKEN_ERROR: 'token_error',
  AUTH_EVENT_SESSION_EXPIRED: 'session_expired',
  AUTH_EVENT_AUTHENTICATED: 'authenticate',
  AUTH_EVENT_SESSION_LOADED: 'session_loaded',
  AUTH_EVENT_TOKEN_NOTFOUND: 'token_not_found'
};

const _authEvents = new Subject<{ event: string; data: any }>();

import { Injectable } from '@angular/core';

@Injectable()
export class AuthEventService {
  private authEvents = _authEvents;
  private authEventsChanges = this.authEvents.asObservable();

  constructor() {}

  raise(event: string, data: any = null) {
    this.authEvents.next({ event, data });
  }

  changes() {
    return this.authEventsChanges;
  }
}
