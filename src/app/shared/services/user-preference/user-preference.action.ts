// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable, OnDestroy } from '@angular/core';
import * as ngrxStore from '@ngrx/store';

import { Observable, Subject, of } from 'rxjs';
import { switchMap, take, filter, takeUntil } from 'rxjs/operators';

import { UserPreference, BasePortalDataEntity } from '../../../contracts/models/portal-api/portal-data.model';
import { UserPreferenceService } from '../../user-preference.service';
import * as fromRoot from '../../../state/app.state';
import * as fromUserPreference from '../../state/selectors';
import { UserPreferenceActions } from '../../state/actions';
import { UserPreferenceState } from '../../state/reducers/userPreference.reducer';

@Injectable()
export class UserPreferenceAction implements OnDestroy {
  private destroy$ = new Subject<boolean>();
  constructor(
    private store: ngrxStore.Store<fromRoot.State>,
    private userPreferenceService: UserPreferenceService
  ) { }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getUserPreference(): Observable<BasePortalDataEntity> {
    const basePortalDataEntityObservable = this.store.pipe(ngrxStore.select(fromUserPreference.getUserPreferenceState))
      .pipe(take(1), switchMap((userPreferenceState: UserPreferenceState) => {
        return of(userPreferenceState.userPreference);
      }));
    basePortalDataEntityObservable.pipe(filter(userPreference => !!userPreference), takeUntil(this.destroy$))
      .subscribe((userPreference: UserPreference) => {
        this.store.dispatch(UserPreferenceActions.GetUserPreference({ payload: userPreference }));
      });

    return basePortalDataEntityObservable;
  }

  updateUserPreference(userPreference: UserPreference): void {
    const userPreference$ = this.userPreferenceService.updateUserPreferenceFromDB(userPreference);

    userPreference$.pipe(filter(updatedUserPreference => !!updatedUserPreference),
      takeUntil(this.destroy$))
      .subscribe((updatedUserPreference: UserPreference) => {
        this.store.dispatch(UserPreferenceActions.UpdateUserPreference({ payload: updatedUserPreference }));
      });
  }

  updateIsLoading(isLoadingState: boolean) {
    this.store.dispatch(UserPreferenceActions.UpdateIsLoading({ payload: isLoadingState }));
  }
}
