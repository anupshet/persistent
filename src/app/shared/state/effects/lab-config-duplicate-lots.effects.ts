// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable, OnDestroy } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of, Subject } from 'rxjs';
import { catchError, map, tap, flatMap, distinctUntilChanged, switchMap, take, filter, takeUntil } from 'rxjs/operators';

import { LabConfigDuplicateLotsActions } from '../actions';
import * as fromRoot from '../../../state/app.state';
import * as fromNavigationSelector from '../../navigation/state/selectors';
import { PortalApiService } from '../../api/portalApi.service';
import { AppLoggerService } from '../../services/applogger/applogger.service';
import { NavBarActions } from '../../navigation/state/actions';
import { DuplicateControlRequest, StartNewBrLotRequest } from '../../../contracts/models/shared/duplicate-control-request.model';
import { TreePill } from '../../../contracts/models/lab-setup';
import { DuplicateInstrumentRequest, NewCopyNode } from '../../../contracts/models/lab-setup/duplicate-copy-request.model';
import * as sharedStateSelector from '../../state/selectors';
import { NavigationService } from '../../navigation/navigation.service';
import { EntityType } from '../../../contracts/enums/entity-type.enum';
import { AppNavigationTrackingService } from '../../services/appNavigationTracking/app-navigation-tracking.service';
import { AppNavigationTracking, AuditTrackingAction, AuditTrackingActionStatus, AuditTrackingEvent } from '../../models/audit-tracking.model';

@Injectable()
export class LabConfigDuplicateLotsEffects implements OnDestroy {
  navigationCurrentlySelectedNode$ = this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedNode));
  currentSelectedNode: TreePill;
  locationId: string;
  private destroy$ = new Subject<boolean>();
  newLot: DuplicateControlRequest[];
  newNBrLot: StartNewBrLotRequest[];

  constructor(
    private actions$: Actions<LabConfigDuplicateLotsActions.LabConfigDuplicateLotActionsUnion>,
    private store: Store<fromRoot.State>,
    private portalApiService: PortalApiService,
    private appLogger: AppLoggerService,
    private navigationService: NavigationService,
    private appNavigationService: AppNavigationTrackingService
  ) {
    this.navigationCurrentlySelectedNode$
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(currentSelectedNode => this.currentSelectedNode = currentSelectedNode);

    this.store.pipe(select(sharedStateSelector.getCurrentLabLocation))
      .pipe(filter(labLocation => !!labLocation), takeUntil(this.destroy$))
      .subscribe(labLocation => {
        this.locationId = labLocation.id;
      });
  }
  createDuplicateLots$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigDuplicateLotsActions.duplicateLot.type),
      map(action => action.duplicateLotEmitter),
      flatMap((duplicateLots: DuplicateControlRequest[]) => {
        this.newLot = duplicateLots;
        const response =
          this.portalApiService.duplicateNode(EntityType.LabProduct, duplicateLots);
        return response
          .pipe(map((nodeIds: Array<string>) => {
            return LabConfigDuplicateLotsActions.duplicateLotSuccess({ nodeIds });
          }),
            catchError((error) => {
              return of(LabConfigDuplicateLotsActions.duplicateLotFailure({ error }));
            })
          );
      })
    )
  );

  duplicateLotsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigDuplicateLotsActions.duplicateLotSuccess.type),
      map(action => action.nodeIds),
      tap((nodeIds) => {
        if (nodeIds) {
          this.sendAuditTrailPayload(this.newLot, nodeIds);
          if (this.currentSelectedNode && this.currentSelectedNode.nodeType !== EntityType.LabLocation) {
            if (nodeIds.length) {
              this.store.dispatch(NavBarActions.removeItemsFromCurrentBranch({ 'item': this.currentSelectedNode }));
              this.store.dispatch(NavBarActions.setNodeItems({ nodeType: this.currentSelectedNode.nodeType,
                id: this.currentSelectedNode.id }));
            } else {
              this.navigationService.navigateToDashboard(this.currentSelectedNode.id);
            }
          } else {
            this.navigationService.navigateToDashboard(this.locationId);
          }
        }
      })
    ),
    { dispatch: false }
  );

  duplicateLotsFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigDuplicateLotsActions.duplicateLotFailure.type),
      tap((x) => {
        const auditDetailsPayload = this.prepareAuditTrailPayload(this.newLot, null);
        auditDetailsPayload.auditTrail.actionStatus = AuditTrackingActionStatus.Failure;
        this.appNavigationService.logAuditTracking(auditDetailsPayload, true);
        this.appLogger.error(x);
      })
    ),
    { dispatch: false }
  );

  duplicateInstrumentRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigDuplicateLotsActions.duplicateInstrumentRequest.type),
      map(action => action.copyNodeRequest),
      switchMap((copyNodeRequest: DuplicateInstrumentRequest[]) =>
        this.portalApiService.duplicateNode(this.currentSelectedNode.nodeType, copyNodeRequest).pipe(
          map((nodeIds: Array<string>) => {
            const newNodeInfo: NewCopyNode = {
              nodeIds, parentEntityId: copyNodeRequest[0].parentNodes[0].parentNodeId
            };
            return LabConfigDuplicateLotsActions.duplicateInstrumentRequestSuccess({ newNodeInfo });
          }
          ),
          catchError(error =>
            of(LabConfigDuplicateLotsActions.duplicateInstrumentRequestFailure({ error }))
          )
        )
      )
    )
  );

  duplicateInstrumentRequestSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigDuplicateLotsActions.duplicateInstrumentRequestSuccess.type),
      map(action => action.newNodeInfo),
      tap((newNodeInfo) => {
        if (newNodeInfo && this.currentSelectedNode.parentNodeId === newNodeInfo.parentEntityId) {
          this.store.dispatch(NavBarActions.removeItemsFromCurrentBranch({ 'item': this.currentSelectedNode }));
          this.store.dispatch(NavBarActions.setNodeItems({
            nodeType: this.currentSelectedNode.nodeType,
            id: this.currentSelectedNode.id
          }));
        } else {
          this.navigationService.navigateToDashboard(this.locationId);
        }
      })
    ),
    { dispatch: false }
  );

  duplicateInstrumentRequestFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigDuplicateLotsActions.duplicateInstrumentRequestFailure.type),
      tap((x) => {
        this.appLogger.error(x);
      })
    ),
    { dispatch: false }
  );

  // For NBr start new lot
  defineNBrLot$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigDuplicateLotsActions.defineNBrLot.type),
      map(action => action.startNewBrLotEmitter),
      flatMap((newMasterLot: StartNewBrLotRequest[]) => {
        this.newNBrLot = newMasterLot;
        const nBrLot = this.appNavigationService.includeATDataToPayload(newMasterLot, AuditTrackingAction.Add,
          AuditTrackingActionStatus.Pending, AuditTrackingEvent.NBRLot);
        const response =
          this.portalApiService.postNonBrMasterLotDefinition(nBrLot);
        return response
          .pipe(map((nodeIds: Array<string>) => {
            return LabConfigDuplicateLotsActions.defineNBrLotSuccess({ nodeIds });
          }),
            catchError((error) => {
              return of(LabConfigDuplicateLotsActions.defineNBrLotFailure({ error }));
            })
          );
      })
    )
  );

  defineNBrLotSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigDuplicateLotsActions.defineNBrLotSuccess.type),
      map(action => action.nodeIds),
      tap((nodeIds) => {
        if (this.currentSelectedNode && this.currentSelectedNode.nodeType !== EntityType.LabLocation) {
          if (nodeIds.length) {
            this.store.dispatch(NavBarActions.removeItemsFromCurrentBranch({ 'item': this.currentSelectedNode }));
            this.store.dispatch(NavBarActions.setNodeItems({
              nodeType: this.currentSelectedNode.nodeType,
              id: this.currentSelectedNode.id
            }));
          } else {
            this.navigationService.navigateToDashboard(this.currentSelectedNode.id);
          }
        } else {
          this.navigationService.navigateToDashboard(this.locationId);
        }
        return nodeIds;
      })
    ),
    { dispatch: false }
  );

  defineNBrLotFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigDuplicateLotsActions.defineNBrLotFailure.type),
      tap((err) => {
        this.appLogger.error(err);
      })
    ),
    { dispatch: false }
  );

  /**
   * This function sends audit trail payload to log in backend
   * @param newLot contains new lot values
   * @param nodeIds meta_id
   */
  private sendAuditTrailPayload(newLot: DuplicateControlRequest[], nodeIds: string[]): void {
    const auditTrailPayload = this.prepareAuditTrailPayload(newLot, nodeIds);
    this.appNavigationService.logAuditTracking(auditTrailPayload, true);
  }

  /**
   * Pepares audit trail payload
   * @param newLot Contain new lot values
   * @param nodeIds contains meta_id
   * @returns audit trail payload
   */
  private prepareAuditTrailPayload(newLot: DuplicateControlRequest[], nodeIds: string[]): AppNavigationTracking {
     const auditTrailpayload: AppNavigationTracking =  {
       auditTrail: {
        meta_id: nodeIds,
        eventType: AuditTrackingAction.DuplicateLot,
        action: AuditTrackingAction.Copy,
        actionStatus: AuditTrackingActionStatus.Pending,
        priorValue: {},
        currentValue: {},
      }
    };
    newLot.map((data) => {
      auditTrailpayload.auditTrail.currentValue = {
        parentNodes: data['parentNodes'],
        nodeType: data['nodeType'],
        targetProductMasterLotId: data['targetProductMasterLotId'],
        sourceNodeId: data['sourceNodeId'],
        retainFixedCV: data['retainFixedCV'],
        locationId: data['locationId']
      };
    });
    return auditTrailpayload;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
