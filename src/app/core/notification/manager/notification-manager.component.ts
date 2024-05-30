import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { AuthenticationService } from '../../../security/services/authentication.service';
import * as fromSecurity from '../../../security/state/selectors';
import * as fromRoot from '../../../state/app.state';
import { AudienceType } from '../interfaces/audience-type';
import { NotificationManagerService } from '../services/notification-manager.service';

// TASK 165687
// const labStateSelector = (state: AppState): LabLocation =>
//   state.labLocationState.currentLabLocation;

// TASK 165687
// const labStateSelector = (state: AppState): LabLocation =>
//   state.labLocationState.currentLabLocation;

@Component({
  selector: 'unext-notification-manager',
  template: ``,
  styleUrls: ['./notification-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationManagerComponent implements OnInit, OnDestroy {

  private cleanUp$ = new Subject<boolean>();
  private labLocationId: string;
  private userId: string;
  private isConnecting = false;
  private isConnected = false;
  private disconnectCalled = false;

  constructor(
    private manager: NotificationManagerService,
    private authenticationService: AuthenticationService,
    private store: Store<fromRoot.State>
  ) { }

  ngOnInit() {
    this.authenticationService.authenticationState
      .pipe(filter(isAuthorized => !!isAuthorized), takeUntil(this.cleanUp$))
      .subscribe(isAuthorized => {
        if (isAuthorized) {
          this.disconnectCalled = false;
          if (!this.isConnecting && !this.isConnected) {
            this.manager.$isConnected.pipe(takeUntil(this.cleanUp$)).subscribe(isConnected => {
              this.onNotificationServiceConnected(isConnected);
            });
          }
          this.store.pipe(select(fromSecurity.getCurrentUser))
          .pipe(filter(currentUser => !!currentUser), takeUntil(this.cleanUp$))
          .subscribe(currentUser => {
            if (currentUser && currentUser.accountNumber && !this.isConnecting && !this.isConnected) {
              this.isConnecting = true;
              this.userId = currentUser.userOktaId;
              this.labLocationId = currentUser.labLocationId;
              this.manager.connect(currentUser.accountNumber, currentUser.userOktaId);
            }
          });
        } else {
          if (!this.disconnectCalled) {
            this.disconnectCalled = true;
            this.userId = '';
            this.labLocationId = '';
            this.cleanUp$.next(true);
            this.manager.disconnect();
            this.isConnected = false;
            this.isConnecting = false;
          }
        }
      });
  }

  private onNotificationServiceConnected = (isConnected: boolean) => {
    this.isConnecting = false;
    this.isConnected = isConnected;
    if (isConnected) {
      this.subscribeLab(this.labLocationId);
      this.subscribeUser(this.userId);
    }
  }

  private subscribeLab(labLocationId: string) {
    this.manager.subscribe(AudienceType.Lab, labLocationId);
  }

  private subscribeUser(userId: string) {
    this.manager.subscribe(AudienceType.User, userId);
  }

  ngOnDestroy() {
    this.cleanUp$.next(true);
    this.cleanUp$.unsubscribe();
  }
}
