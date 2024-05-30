// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { EntityType } from '../../contracts/enums/entity-type.enum';
import { LevelLoadRequest } from '../../contracts/models/portal-api/labsetup-data.model';
import { User } from '../../contracts/models/user-management/user.model';
import { PortalApiService } from '../../shared/api/portalApi.service';
import * as fromUsermanagement from '../../master/user-management/state';
import * as userManagementActions from '../../master/user-management/state/actions';
import { ErrorLoggerService } from '../services/errorLogger/error-logger.service';
import { componentInfo, blankSpace, Operations } from '../../core/config/constants/error-logging.const';
import { ErrorType } from '../../contracts/enums/error-type.enum';
import { TreePill } from '../../contracts/models/lab-setup';

// TODO: Delete file if not required.
@Injectable()
export class UserManagementAction {
  constructor(
    private portalApiService: PortalApiService,
    private store: Store<fromUsermanagement.UsersState>,
    private errorLoggerService: ErrorLoggerService
  ) { }

  // TODO: Rename to getUsers
  getUsersAWS(): Observable<User> {
    const labsetupObservable = this.portalApiService.getLabSetupNode<User>
      (EntityType.Account, null, LevelLoadRequest.LoadChildren, EntityType.User);

    labsetupObservable.pipe(
      take(1))
      .subscribe(filteredAccount => {
        try {
          this.store.dispatch(userManagementActions.UserManagementActions.GetUsers(
            { payload: filteredAccount.children?.filter((rec: TreePill) => rec.nodeType === EntityType.User) }
          ));
        } catch (error) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, error.message,
              (componentInfo.UserManagementAction + blankSpace + Operations.DispatchGetUsers)));
        }
      });

    return labsetupObservable;
  }

  getAllowedUserRoles(): Observable<Array<string>> {
    return this.portalApiService.getAllowedRoles();
  }
}
