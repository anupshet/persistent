import { createFeatureSelector } from '@ngrx/store';

import * as fromAccountManagement from './account-management.reducer';
import * as fromRoot from '../../../state/app.state';

export interface State extends fromRoot.State {
  accountManagement: fromAccountManagement.AccountManagementState;
}

export const accountManagementStateIdentifier = 'accountManagement';

// tslint:disable-next-line:max-line-length
const getAccountManagementFeatureState = createFeatureSelector<fromAccountManagement.AccountManagementState>(accountManagementStateIdentifier);

