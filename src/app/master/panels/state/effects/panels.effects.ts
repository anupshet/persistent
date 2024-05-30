// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, tap, flatMap } from 'rxjs/operators';
import { cloneDeep } from 'lodash';

import { PanelActions } from '../actions';
import { DeletePanelConfig, Panel } from '../../../../contracts/models/panel/panel.model';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { PanelsApiService } from '../../services/panelsApi.service';
import { TreePill } from '../../../../contracts/models/lab-setup';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { AuditTrackingAction, AuditTrackingActionStatus, AuditTrackingSort, getSortPayload } from '../../../../shared/models/audit-tracking.model';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { ChangeTrackerService } from '../../../../shared/guards/change-tracker/change-tracker.service';
@Injectable()
export class PanelEffects {
  constructor(
    private actions$: Actions<PanelActions.PanelActionsUnion>,
    private portalApiService: PortalApiService,
    private panelsApiService: PanelsApiService,
    private navigationService: NavigationService,
    private appLogger: AppLoggerService,
    private appNavigationService: AppNavigationTrackingService,
    private changeTrackerService: ChangeTrackerService,
  ) { }

  currentPanelValue;
  priorPanelValue;

  addPanel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PanelActions.addPanel.type),
      map(action => action),
      flatMap(({ panels, sort }: { panels: Array<Panel>, sort?: AuditTrackingSort }) => {
        const response = this.panelsApiService.addPanelData(panels);

        return response.pipe(
          map((_panels: TreePill[]) => {
            this.currentPanelValue = _panels[0];
            return PanelActions.addPanelSuccess({ locationId: _panels[0].parentNodeId, sort });
          }),
          catchError((error) => {
            this.currentPanelValue = panels[0];
            return of(PanelActions.addPanelFailure({ error }));
          })
        );
      })
    )
  );

  addPanelSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PanelActions.addPanelSuccess.type),
      map(action => action),
      tap(({locationId, sort }: { locationId: string, sort?: AuditTrackingSort }) => {
        let currentPanelData = new Panel();
        const panelItemList = this.panelsApiService.panelItemListData();

        const panelItems: TreePill[] = [];
        if (panelItemList) {
          for (let i = 0; i < this.currentPanelValue.panelItemIds?.length; i++) {
            panelItems[i] = this.findTreeByAnalyteId(panelItemList, this.currentPanelValue.panelItemIds[i]);
          }
        }
        currentPanelData = {
          name: this.currentPanelValue.name,
          id: this.currentPanelValue.id,
          panelItemIds: this.currentPanelValue.panelItemIds,
          panelItems: panelItems,
          parentNodeId: this.currentPanelValue.parentNodeId,
          panelItemList: panelItemList,
        };

        this.sendAuditTrailPayload(currentPanelData, this.priorPanelValue,
          AuditTrackingAction.Add, AuditTrackingAction.Panel, AuditTrackingActionStatus.Success, sort);
        this.navigationService.navigateToDashboard(locationId);
        this.panelsApiService.resetPanelsData();
        this.changeTrackerService.resetDirty();
      })
    ),
    { dispatch: false }
  );

  addPanelFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PanelActions.addPanelFailure.type),
      tap((x) => {
        const currentPanelData = new Panel();
        currentPanelData.panelItemList = this.panelsApiService.panelItemListData();
        currentPanelData.name = this.currentPanelValue?.name;
        currentPanelData.id = this.currentPanelValue?.id;
        currentPanelData.panelItemIds = this.currentPanelValue?.panelItemIds;
        currentPanelData.parentNodeId = this.currentPanelValue?.parentNodeId;
        this.sendAuditTrailPayload(currentPanelData, this.priorPanelValue,
          AuditTrackingAction.Add, AuditTrackingAction.Panel, AuditTrackingActionStatus.Failure);
        this.appLogger.error(x);
      }),
    ),
    { dispatch: false }
  );

  updatePanel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PanelActions.updatePanel.type),
      map(action => action),
      flatMap(({ panels, sort }: { panels: Array<Panel>, sort?: AuditTrackingSort }) => {
        const panelValues = cloneDeep(panels);
        this.priorPanelValue = panelValues[0].panelPriorItems;
        delete panelValues[0].panelPriorItems;

        const response = this.panelsApiService.updatePanelData(panelValues);
        return response.pipe(
          map((_panels: TreePill[]) => {
            this.currentPanelValue = _panels[0];
            return PanelActions.updatePanelSuccess({ locationId: _panels[0].parentNodeId, sort });
          }),
          catchError((error) => {
            return of(PanelActions.updatePanelFailure({ error }));
          })
        );
      })
    )
  );

  updatePanelSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PanelActions.updatePanelSuccess.type),
      map(action => action),
      tap(({locationId, sort }: { locationId: string, sort?: AuditTrackingSort }) => {
        const panelPriorItemListData = this.panelsApiService.priorPanelList;
        const panelCurrentItemList = this.panelsApiService.panelItemListData();
        const changedPanelList = new Set(this.panelsApiService.changedPanelList);
        const priorPanelData = new Panel();
        priorPanelData.panelItemList = panelPriorItemListData;
        priorPanelData.panelItemIds = this.priorPanelValue.panelItemIds;
        priorPanelData.name = this.priorPanelValue.name;
        const priorPanelItems: TreePill[] = [];
        if (priorPanelData.panelItemList) {
          for (let i = 0; i < this.priorPanelValue.panelItemIds?.length; i++) {
            priorPanelItems[i] = this.findTreeByAnalyteId(priorPanelData.panelItemList, this.priorPanelValue.panelItemIds[i]);
          }
        }
        priorPanelData.panelItems = priorPanelItems;

        const currentPanelData = new Panel();
        currentPanelData.panelItemList = (changedPanelList.size !== 0 ) ? [...changedPanelList] :  panelPriorItemListData ;
        currentPanelData.panelItemIds = this.currentPanelValue.panelItemIds;
        currentPanelData.name = this.currentPanelValue.name;
        const currentPanelItems: TreePill[] = [];
        if (panelCurrentItemList) {
          for (let i = 0; i < this.currentPanelValue.panelItemIds?.length; i++) {
            currentPanelItems[i] = this.findTreeByAnalyteId(panelCurrentItemList, this.currentPanelValue.panelItemIds[i]);
          }
        }
        currentPanelData.panelItems = currentPanelItems;

        this.sendAuditTrailPayload(currentPanelData, priorPanelData,
          AuditTrackingAction.Update, AuditTrackingAction.Panel, AuditTrackingActionStatus.Success, sort);
        this.navigationService.navigateToDashboard(locationId);
        this.panelsApiService.resetPanelsData();
        this.changeTrackerService.resetDirty();
      })
    ),
    { dispatch: false }
  );

  updatePanelFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PanelActions.updatePanelFailure.type),
      tap((x) => {
        const panelPriorItemListData = this.panelsApiService.priorPanelList;
        const changedPanelList = new Set(this.panelsApiService.changedPanelList);
        const priorPanelData = new Panel();
        priorPanelData.panelItemList = panelPriorItemListData;
        priorPanelData.panelItemIds = this.priorPanelValue.panelItemIds;
        const currentPanelData = new Panel();
        currentPanelData.panelItemList = [...changedPanelList];
        currentPanelData.panelItemIds = this.currentPanelValue.panelItemIds;

        this.sendAuditTrailPayload(currentPanelData, priorPanelData,
          AuditTrackingAction.Update, AuditTrackingAction.Panel, AuditTrackingActionStatus.Failure);
        this.appLogger.error(x);
      }),
    ),
    { dispatch: false }
  );

  deletePanel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PanelActions.deletePanel.type),
      map(action => action.deletePanelConfig),
      flatMap((action: DeletePanelConfig) => {
        this.priorPanelValue = action['panelPriorValue'];
        return this.portalApiService.deleteLabSetupNode(action.nodeType, action.panelId).pipe(
          map((_panels: boolean) => {
            return PanelActions.deletePanelSuccess({ locationId: action.locationId });
          }),
          catchError((error) => {
            return of(PanelActions.deletePanelFailure({ error }));
          })
        );
      })
    )
  );

  deletePanelSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PanelActions.deletePanelSuccess.type),
      map(action => action.locationId),
      tap((locationId: string) => {
        const data = new Panel();
        data.panelItemList = this.panelsApiService.panelItemListData();
        data.name = this.priorPanelValue.name;
        data.id = this.priorPanelValue.id;
        data.panelItemIds = this.priorPanelValue.panelItemIds;
        const priorPanelItems: TreePill[] = [];
        if (data.panelItemList) {
          for (let i = 0; i < this.priorPanelValue.panelItemIds?.length; i++) {
            priorPanelItems[i] = this.findTreeByAnalyteId(data.panelItemList, this.priorPanelValue.panelItemIds[i]);
          }
        }
        data.panelItems = priorPanelItems;
        if (this.currentPanelValue) {
          this.currentPanelValue.panelItems = priorPanelItems;
        }
        this.sendAuditTrailPayload(this.currentPanelValue, data,
          AuditTrackingAction.Delete, AuditTrackingAction.Panel, AuditTrackingActionStatus.Success);
        this.navigationService.navigateToDashboard(locationId);
        this.panelsApiService.resetPanelsData();
      })
    ),
    { dispatch: false }
  );

  deletePanelFailure$ = createEffect(() => this.actions$.pipe(
    ofType(PanelActions.deletePanelFailure.type),
    tap((x) => {
      const data = new Panel();
      data.panelItemList = this.panelsApiService.panelItemListData();
      data.name = this.priorPanelValue.name;
      data.id = this.priorPanelValue.id;
      data.panelItemIds = this.priorPanelValue.panelItemIds;
      this.sendAuditTrailPayload(this.currentPanelValue, data,
        AuditTrackingAction.Delete, AuditTrackingAction.Panel, AuditTrackingActionStatus.Failure);
      this.appLogger.error(x);
    })
  ),
    { dispatch: false }
  );
  /**
   * This function sends audit trail payload to log in backend
   * @param currentPanelValues Contains current panel values
   * @param priorPanelValues Contains prior panel values
   * @param typeOfAction Type of operation- Add/Update/Delete
   */

  private sendAuditTrailPayload(currentPanelValues: Panel, priorPanelValues: Panel,
    typeOfAction: string, eventType: string, actionStatus: string,
    sort: AuditTrackingSort = AuditTrackingSort.None): void {
    const auditTrailPayload = this.appNavigationService
      .comparePriorAndCurrentValues(currentPanelValues, priorPanelValues, typeOfAction, eventType, actionStatus);
    this.appNavigationService.logAuditTracking(auditTrailPayload, true);
    if(sort !== AuditTrackingSort.None) {
      this.appNavigationService.logAuditTracking(getSortPayload(this.currentPanelValue.id, sort), true);
    }
  }


  /**
   * This function returns treePill value for perticular analyte id
   * @param panelItemList Contains current panel values
   * @param analyteId Contains prior panel values
   * @param typeOfAction Type of operation- Add/Update/Delete
   */
  findTreeByAnalyteId(panelItemList: TreePill[], analyteId: string): TreePill {
    let node: TreePill;
    const isDeparmentExist = panelItemList[0].nodeType === EntityType.LabDepartment ? true : false;

    function iter(panelItem) {
      const panelItemNode = {
        id: panelItem.id,
        nodeType: panelItem.nodeType,
        parentNodeId: panelItem.parentNodeId,
        displayName: panelItem.displayName,
      };
      if (panelItem.id === analyteId) {
        if (isDeparmentExist && node?.children[0]?.children?.length > 0) {
          node['children'][0]['children'][0]['children'] = [panelItemNode];
        } else if (node?.children?.length > 0) {
          node['children'][0]['children'] = [panelItemNode];
        }
        result = node;
        return true;
      }
      if (!node || (isDeparmentExist && panelItem.nodeType === EntityType.LabDepartment) ||
        (!isDeparmentExist && panelItem.nodeType === EntityType.LabInstrument)) {
        node = panelItemNode;
      } else {
        const children = [panelItemNode];
        if (panelItem.nodeType === EntityType.LabInstrument) {
          node['children'] = children;
        } else if (panelItem.nodeType === EntityType.LabControl) {
          if (panelItem?.children) {
            const panelItemChildrenIds = panelItem.children.map(el => el.id);
            if (panelItem?.children && !panelItemChildrenIds?.includes(analyteId)) {
              return Array.isArray(panelItem) && panelItem.some(iter);
            } else {
              if (isDeparmentExist && node?.children?.length > 0) {
                node['children'][0]['children'] = children;
              } else {
                node['children'] = children;
              }
            }
          }
        }
      }
      return Array.isArray(panelItem.children) && panelItem.children.some(iter);
    }

    let result: TreePill;
    panelItemList.some(iter);
    return result;
  }

}
