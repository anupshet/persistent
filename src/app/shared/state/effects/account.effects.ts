// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { map, tap, catchError, flatMap, take } from 'rxjs/operators';
import { of } from 'rxjs';

import { AccountActions } from '../actions';
import { Account } from '../../../contracts/models/account-management/account';
import { PortalApiService } from '../../api/portalApi.service';
import { LevelLoadRequest } from '../../../contracts/models/portal-api/labsetup-data.model';
import { AppLoggerService } from '../../services/applogger/applogger.service';
import { MigrationStates } from '../../../contracts/enums/migration-state.enum';
import { EntityType } from '../../../contracts/enums/entity-type.enum';

@Injectable()
export class AccountEffects {
  constructor(
    private actions$: Actions<AccountActions.AccountActionsUnion>,
    private portalApiService: PortalApiService,
    private appLogger: AppLoggerService,
  ) { }

  setAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.setAccount.type),
      map(action => action.account),
      map((account: Account) => {
        return AccountActions.setAccountSuccess({ account });
      })
    )
  );

  getAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.getAccount.type),
      map(action => action.accountId),
      flatMap(() => {
        return this.portalApiService.getLabSetupNode(EntityType.Account, null, LevelLoadRequest.None)
          .pipe(take(1))
          .pipe(map((directoryResponse) => {
            // Map directory obj to account object. Only include relevant summary properties.
            const account = {
              accountAddress: directoryResponse['accountAddress'],
              accountAddressId: directoryResponse['accountAddressId'],
              accountContact: directoryResponse['accountContact'],
              accountContactId: directoryResponse['accountContactId'],
              accountLicenseType: directoryResponse['accountLicenseType'],
              accountNumber: directoryResponse['accountNumber'],
              comments: directoryResponse['comments'],
              displayName: directoryResponse['displayName'],
              formattedAccountNumber: directoryResponse['formattedAccountNumber'],
              id: directoryResponse.id.toString(),
              licenseAssignDate: directoryResponse['licenseAssignDate'],
              licenseExpirationDate: directoryResponse['licenseExpirationDate'],
              licenseNumberUsers: directoryResponse['licenseNumberUsers'],
              licensedProducts: directoryResponse['licensedProducts'],
              migrationStatus: String(directoryResponse['migrationStatus'] || MigrationStates.Empty).trim().toLowerCase(),
              nodeType: directoryResponse['nodeType'],
              orderNumber: directoryResponse['orderNumber'],
              parentNodeId: directoryResponse['parentNodeId'],
              primaryUnityLabNumbers: directoryResponse['primaryUnityLabNumbers'],
              sapNumber: directoryResponse['sapNumber'],
              usedArchive: directoryResponse['usedArchive']
            } as Account;

            // TODO (20200220): Clearing out primnaryUnityLabNumbers if account already exists, to prevent retrigger of migration State
            if (account.id.length + account.accountNumber.length + account.formattedAccountNumber.length > 0) {
              account.primaryUnityLabNumbers = null;
            }
            return AccountActions.getAccountSuccess({ account });
          }),
            catchError(error => of(AccountActions.getAccountFailure({ error })))
          );
      })
    )
  );

  getAccountSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.getAccountSuccess.type)
    ),
    { dispatch: false }
  );

  getAccountFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.getAccountFailure.type),
      tap((x) => {
        this.appLogger.error(x);
      })
    ),
    { dispatch: false }
  );
}
