import * as ngrxStore from '@ngrx/store';

import { Injectable } from '@angular/core';

import { UIConfigState } from '../state/reducers/ui-config.reducer';
import { UIConfigActions } from '../state/actions';

@Injectable()
export class UIConfigService {
  constructor(private store: ngrxStore.Store<UIConfigState>) { }

  public updateAnalyticalSectionState(isAnalyticalSectionVisible: boolean) {
    this.store.dispatch(UIConfigActions.UpdateAnalyticalSectionState({ isAnalyticalSectionVisible }));
  }

  public updateTabOrderState(isTabOrderRunEntry: boolean) {
    this.store.dispatch(UIConfigActions.UpdateTabOrderState({ UpdateTabOrderState: isTabOrderRunEntry }));
  }

  public updateViewReportState(isViewReport: boolean) {
    this.store.dispatch(UIConfigActions.UpdateViewReportState({ UpdateViewReportState: isViewReport }));
  }
}
