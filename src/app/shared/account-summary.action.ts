import { Store } from '@ngrx/store';
import { Injectable, OnDestroy } from '@angular/core';
import {
  from as observableFrom,
  Observable,
  Subject,
  Subscription
} from 'rxjs';

import * as fromRoot from '../state/app.state';
import { Account } from '../contracts/models/account-management/account';
import { unsubscribe } from '../core/helpers/rxjs-helper';
import { Utility } from '../core/helpers/utility';
import { AccountActions } from './state/actions';

@Injectable()
export class AccountSummaryAction implements OnDestroy {
  private ngUnsubscribe: Subject<boolean> = new Subject();
  private accountSummarySubscription: Subscription;

  constructor(
    private store: Store<fromRoot.State>,
  ) {}

  setAccountSummary(account: Account): Observable<Account> {
    const pr = Utility.promiseFactory<Account>();

    this.store.dispatch(AccountActions.setAccount({ account }));

    pr.resolve(account);

    return observableFrom(pr.promise);
  }

  ngOnDestroy() {
    unsubscribe(this.accountSummarySubscription);
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
