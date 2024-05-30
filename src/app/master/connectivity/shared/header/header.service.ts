import { Injectable, OnDestroy } from '@angular/core';
import * as ngrxStore from '@ngrx/store';

import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import * as connectivityStateSelector from '../../state/selectors';
import * as fromConnectivity from '../../state';

@Injectable()
export class HeaderService implements OnDestroy {
  private destroy$ = new Subject<boolean>();

  public navState = new Subject<any>();
  private dialogComponent = new Subject<any>();
  private dialogComponentMapping = new Subject<any>();
  public initState = false;

  constructor(private store: ngrxStore.Store<fromConnectivity.ConnectivityStates>) {
    this.store.pipe(ngrxStore.select(connectivityStateSelector.getHasInstructions))
      .pipe(filter(_connectivity => _connectivity !== undefined && _connectivity !== null), takeUntil(this.destroy$))
      .subscribe(hasInstructions => {
        this.initState = hasInstructions;
      });
  }

  setMenuOptions(menuState: boolean) {
    this.navState.next(menuState);
  }

  getInitState() {
    return this.initState;
  }

  setDialogComponent(name: string) {
    this.dialogComponent.next({ componentName: name });
  }

  getDialogComponent(): Observable<any> {
    return this.dialogComponent.asObservable();
  }

  setDialogComponentMapping(name: string) {
    this.dialogComponentMapping.next({ componentName: name });
  }

  getDialogComponentMapping(): Observable<any> {
    return this.dialogComponentMapping.asObservable();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
