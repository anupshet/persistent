// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';

import { forkJoin, of } from 'rxjs';
import { catchError, concatMap, filter, map, switchMap, tap, withLatestFrom, mergeMap, flatMap, take } from 'rxjs/operators';
import { first } from 'lodash';

import { ActionType } from '../../../../contracts/enums/action-type.enum';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { TreePill } from '../../../../contracts/models/lab-setup/tree-pill.model';
import { LevelLoadRequest } from '../../../../contracts/models/portal-api/labsetup-data.model';
import { MenuLink } from '../../../models/menu-link.model';
import * as fromRoot from '../../../../state/app.state';
import { PortalApiService } from '../../../api/portalApi.service';
import { NavigationService } from '../../navigation.service';
import { NavBarActions } from '../actions';
import * as fromNavigationSelector from '../selectors';
import * as fromSecuritySelector from '../../../../security/state/selectors';
import * as sharedStateSelector from '../../../../shared/state/selectors';
import { unRouting } from '../../../../core/config/constants/un-routing-methods.const';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { autoSort, customSort, includeArchivedItems, isArchived } from '../../../../core/config/constants/general.const';
import { QueryParameter } from '../../../models/query-parameter';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { PanelsApiService } from '../../../../master/panels/services/panelsApi.service';
import { Utility } from '../../../../core/helpers/utility';
import { UnityNextTier } from '../../../../contracts/enums/lab-location.enum';
import { Permissions } from '../../../../security/model/permissions.model';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { NavSideBarService } from '../../services/nav-side-bar.service';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { AuditTrackingActionStatus } from '../../../../shared/models/audit-tracking.model';

@Injectable()
export class NavBarEffects {
  constructor(
    private actions$: Actions<NavBarActions.NavBarActionsUnion>,
    private portalApiService: PortalApiService,
    private navigationService: NavigationService,
    private router: Router,
    private store: Store<fromRoot.State>,
    private appLogger: AppLoggerService,
    private errorLoggerService: ErrorLoggerService,
    private panelsApiService: PanelsApiService,
    private navSideBarService: NavSideBarService,
    private brPermissionsService: BrPermissionsService,
    private appNavigationService: AppNavigationTrackingService,
  ) { }

  // this sets all the navigation items - top nav, side nav and header with node id by getting its descendants
  setNodeItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavBarActions.setNodeItems.type),
      map(action => action),
      withLatestFrom(this.store.pipe(select(fromNavigationSelector.getNavigationState))),
      mergeMap(([action, navigation]) => {
        const isManageControl = action?.isManageControl;
        // get its children
        // adding this below since for test we dont any children
        let options = action.nodeType === EntityType.LabTest ? LevelLoadRequest.None : LevelLoadRequest.LoadUpToGrandchildren;
        if (action.nodeType === EntityType.LabLocation) {
          options = LevelLoadRequest.LoadChildren;
        }
        const queryParameter = new QueryParameter(includeArchivedItems, (navigation.isArchiveItemsToggleOn).toString());
        return this.portalApiService.getLabSetupNode(
          action.nodeType ? action.nodeType : EntityType.LabLocation,
          action.id,
          options,
          EntityType.None, [queryParameter]
        ).pipe(
          concatMap((selectedNode: TreePill) =>
            (!navigation.isArchiveItemsToggleOn && selectedNode[isArchived]) ? [NavBarActions.navigateToDashboard()] : [
              NavBarActions.setSelectedLeaf({ selectedLeaf: null }),
              // if node is unavailable then it should go to selectedNode in navigationState, to show unavailable notification on screen
              (((selectedNode && selectedNode.nodeType !== EntityType.LabTest) || selectedNode.isUnavailable) ?
                NavBarActions.setDefaultNode({ selectedNode })
                : NavBarActions.setSelectedLeaf({ selectedLeaf: selectedNode })),
              NavBarActions.setItemToCurrentBranch({ currentBranchItem: selectedNode }),
              NavBarActions.loadContentPane({ selectedNode, isManageControl }),
            ]
          ),
          catchError(error => of(NavBarActions.setCurrentlySelectedNodeFailure({ error })))
        );
      })
    )
  );

  updateNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavBarActions.updateNavigation.type),
      map(action => action),
      withLatestFrom(this.store.pipe(select(fromNavigationSelector.getNavigationState))),
      mergeMap(([action, navigation]) => {
        // get its children
        const queryParameter = new QueryParameter(includeArchivedItems, (navigation.isArchiveItemsToggleOn).toString());
        return this.portalApiService.getLabSetupNode(action.nodeType, action.id,
          LevelLoadRequest.LoadUpToGrandchildren, EntityType.None, [queryParameter]).pipe(
            concatMap((selectedNode: TreePill) => [
              NavBarActions.setSelectedLeaf({ selectedLeaf: null }),
              (selectedNode.children && selectedNode.children.length) ?
                NavBarActions.setDefaultNode({ selectedNode }) : NavBarActions.setSelectedLeaf({ selectedLeaf: selectedNode }),
              NavBarActions.setItemToCurrentBranch({ currentBranchItem: selectedNode }),
            ]),
            catchError(error => of(NavBarActions.setCurrentlySelectedNodeFailure({ error })))
          );
      })
    )
  );

  // this sets all the navigation items - setting the first item selected
  setNodeFirstLeftNavItemSelected$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavBarActions.setNodeFirstLeftNavItemSelected.type),
      map(action => action),
      withLatestFrom(this.store.pipe(select(fromNavigationSelector.getNavigationState)),
        this.store.pipe(select(sharedStateSelector.getCurrentLabLocation))),
      mergeMap(([action, navigation, location]) => {
        const isManageControl = action?.isManageControl;
        const queryParameter = new QueryParameter(includeArchivedItems, (navigation.isArchiveItemsToggleOn).toString());
        return this.portalApiService.getLabSetupNode(action.nodeType, action.id,
          LevelLoadRequest.LoadChildren, EntityType.None, [queryParameter]).pipe(
            concatMap((selectedNode: TreePill) => [
              NavBarActions.setDefaultNode({ selectedNode }),
              NavBarActions.setNodeItems(this.checkNodeChildren(selectedNode, location, isManageControl)),
              NavBarActions.setLeftNavItemSelected({
                selectedLeftNavItem: selectedNode?.children?.length > 0 ?
                  first(this.navigationService.sortNavItems(selectedNode?.children)) : selectedNode
              })
            ]),
            catchError(error => of(NavBarActions.setCurrentlySelectedNodeFailure({ error })))
          );
      }
      )
    )
  );

  private checkNodeChildren(selectedNode: TreePill, location, isManageControl?: boolean) {
    if (selectedNode?.children?.length > 0) {
      return {
        nodeType: first(this.navigationService.sortNavItems(selectedNode.children))?.nodeType,
        id: first(this.navigationService.sortNavItems(selectedNode.children))?.id,
        isManageControl: true
      };
    } else {
      return {
        nodeType: Utility.getParentNodeType(selectedNode.nodeType, location?.locationSettings?.instrumentsGroupedByDept),
        id: selectedNode.parentNodeId,
        isManageControl: true
      };
    }
  }

  // this sets all the navigation items - setting the first item selected
  setLeafNodes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavBarActions.setLeafNodes.type),
      map(action => action.selectedNode),
      concatMap((selectedNode: TreePill) => [
        NavBarActions.setSelectedLeaf({ selectedLeaf: null }),
        selectedNode.children && selectedNode.children.length
          ? NavBarActions.setDefaultNode({ selectedNode })
          : NavBarActions.setSelectedLeaf({ selectedLeaf: selectedNode }),
        NavBarActions.loadContentPane({ selectedNode }),
      ]),
      catchError(error => of(NavBarActions.setCurrentlySelectedNodeFailure({ error })))
    )
  );

  // set bread crumb
  setItemToCurrentBranch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavBarActions.setItemToCurrentBranch.type),
      map(action => action.currentBranchItem),
      map((currentBranchItem: TreePill) => NavBarActions.setCurrentBranchState({ currentBranchItem })
      )
    )
  );

  loadContentPane$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavBarActions.loadContentPane.type),
      map(action => action),
      withLatestFrom(this.store.pipe(select(fromNavigationSelector.getInstrumentsGroupedByDeptVal)),
        this.store.pipe(select(sharedStateSelector.getCurrentLabLocation)),
        this.store.pipe(select(fromNavigationSelector.getIsAccountUserSelectorOn)),
        this.store.pipe(select(fromNavigationSelector.getStateRouterState), filter(route => !!route && !!route.state))),
      tap(([action, instrumentsGroupedByDeptVal, location, isAccountUserSelectorOn, routerstate]) => {
        // Should display dashboard if user switches the location(UN-11155)
        if (this.brPermissionsService.hasAccess([Permissions.DepartmentAdd, Permissions.InstrumentAdd])
          && location && location.unityNextTier === UnityNextTier.None) {
          return;
        }
        if (action.selectedNode.nodeType === EntityType.LabLocation && !instrumentsGroupedByDeptVal
          && !location?.locationSettings?.isLabSetupComplete) {
          const hasChildren = action.selectedNode.children && action.selectedNode.children.length > 0;
          if (!!hasChildren) {
            this.navigationService.routeToDashboard();
          } else {
            isAccountUserSelectorOn ? this.router.navigate([unRouting.actionableDashboard]) :
              this.navigationService.navigateToUrl(
                `${unRouting.labSetup.lab}/${unRouting.labSetup.instruments}/${action.selectedNode.id}/${unRouting.labSetup.settings}`,
                false, action.selectedNode, action.selectedNode.id
              );
          }
        } else if (action.selectedNode.nodeType === EntityType.Panel) {
          this.navigationService.navigateToPanel(action.selectedNode);
        } else {
          const hasChildren = action.selectedNode.children && action.selectedNode.children.length > 0;
          const isUnavailable = action.selectedNode.isUnavailable;
          if (this.navigationService.isSelectedNodeOfDataTable(action.selectedNode)) {
            hasChildren || (isUnavailable) || action.selectedNode.nodeType === EntityType.LabTest ?
              this.router.navigateByUrl(`/data/${action.selectedNode.id}/${action.selectedNode.nodeType}/table`) :
              this.navigationService.navigateToLabSetup(action.selectedNode, location, instrumentsGroupedByDeptVal);
              if (action?.isManageControl) {
                this.navigationService.navigateToManageControls();
              }
          } else if (action.selectedNode.nodeType === EntityType.LabDepartment ||
            (!routerstate.state.url.includes(`${unRouting.panels.panel}/${unRouting.panels.actions.add}`) &&
              !routerstate.state.url.includes(`${unRouting.panels.panel}/edit`))) {
              if(!action?.isManageControl){
                isAccountUserSelectorOn ? this.router.navigate([unRouting.actionableDashboard]) :
                this.navigationService.navigateToLabSetup(action.selectedNode, location, instrumentsGroupedByDeptVal);
              } else {
                this.navigationService.navigateToManageControls();
              }
          }
        }
      }),
    ),
    { dispatch: false }
  );

  navigateToContent$ = createEffect(() =>
    this.actions$.pipe(ofType(NavBarActions.navigateToContent.type),
      map(action => action.selectedLink),
      tap((selectedLink: MenuLink) => {
        this.navigationService.navigateToContent(selectedLink);
      })
    ),
    { dispatch: false }
  );

  // This sets all of the navigation items - top nav, side nav and header with node id by getting the selected node's ancestors.
  // Used when app is reloaded so state is rehydrated.
  setAllNavItemsWithNodeId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavBarActions.setAllNavItemsWithNodeId.type),
      switchMap((action) => this.portalApiService.getLabSetupAncestors(action.nodeType, action.nodeId).pipe(
        filter(hasAncestors => !!hasAncestors),
        map((ancestors: Array<TreePill>) => {
          return NavBarActions.loadAllChildrenForNode({ ancestors });
        }),
      ))
    )
  );

  setPanelsAsCurrentSelectedNode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavBarActions.setPanelsAsCurrentSelectedNode.type),
      map(action => action.id),
      flatMap((nodeId: string) => {
        return forkJoin([
          of(nodeId),
          this.portalApiService.getLabSetupAncestors(EntityType.Panel, nodeId).pipe(filter(hasAncestors => !!hasAncestors))
        ]);
      }),
      mergeMap(([_nodeId, ancestors]) => [
        NavBarActions.setNodeItems({ nodeType: EntityType.Panel, id: _nodeId }),
        NavBarActions.setCurrentBranchStates({
          currentBranchItems: ancestors.filter((node: TreePill) => node.nodeType === EntityType.LabLocation)
        })
      ])
    )
  );

  navigateToDashboard$ = createEffect(() =>
    this.actions$.pipe(ofType(NavBarActions.navigateToDashboard.type),
      tap(() => {
        this.navigationService.gotoDashboard();
      })
    ),
    { dispatch: false }
  );

  loadAllChildrenForNode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavBarActions.loadAllChildrenForNode.type),
      map(action => action.ancestors),
      flatMap(ancestors => {
        return forkJoin([
          this.store.pipe(select(fromNavigationSelector.getIsArchiveItemsToggleOn), take(1)),
          of(ancestors)
        ]);
      }),
      switchMap(([isArchiveItemsToggleOn, allAncestors]) => {
        // get  the node and its children
        const queryParameter = new QueryParameter(includeArchivedItems, (isArchiveItemsToggleOn).toString());
        const ancestors = (first(allAncestors));
        return this.portalApiService.getLabSetupNode(ancestors.nodeType, ancestors.id,
          LevelLoadRequest.LoadChildren, EntityType.None, [queryParameter]).pipe(
            concatMap((selectedNode: TreePill) => [
              selectedNode.children && selectedNode.children.length > 0
                ? NavBarActions.setNodeItems({ nodeType: selectedNode.nodeType, id: selectedNode.id })
                : NavBarActions.loadAllChildrenForNode({ ancestors: allAncestors.slice(1) }),
              NavBarActions.setCurrentBranchStates({
                currentBranchItems: allAncestors.filter((node: TreePill) =>
                  node.nodeType === EntityType.LabDepartment
                  || node.nodeType === EntityType.LabLocation
                  || node.nodeType === EntityType.LabInstrument
                  || node.nodeType === EntityType.LabProduct)
              }),
            ]
            ),
            catchError(error => of(NavBarActions.setCurrentlySelectedNodeFailure({ error })))
          );
      })
    )
  );

  // preprocess before updating the current branch
  getSetSelectedNodeState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavBarActions.getSetSelectedNodeState.type),
      map(action => action.selectedNode),
      withLatestFrom(this.store.pipe(select(fromNavigationSelector.getCurrentBranchState))),
      map(([selectedNode, currentBranch]) => {
        this.navigationService.getUpdatedSelectedNodeState(currentBranch, selectedNode, ActionType.update);
        return NavBarActions.updateSelectedNodeState({
          currentBranch
        });
      }),
    )
  );

  deleteNodeFromSelectedNodeState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavBarActions.deleteNodeFromSelectedNodeState.type),
      map(action => action.selectedNodeId),
      withLatestFrom(this.store.pipe(select(fromNavigationSelector.getCurrentBranchState))),
      map(([selectedNodeId, currentBranch]) => {
        this.navigationService.getUpdatedSelectedNodeState(currentBranch, null, ActionType.delete, selectedNodeId);
        return NavBarActions.updateSelectedNodeState({ currentBranch });
      }),
    )
  );

  setCurrentlySelectedNodeFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavBarActions.setCurrentlySelectedNodeFailure.type),
      map(action => action.error),
      tap((error) => {
        this.appLogger.error(error);
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, error.message,
            (componentInfo.NavBarEffects + blankSpace + Operations.CurrentSelectedNodeFailure)));
        this.store.dispatch(NavBarActions.navigateToDashboard());
      })
    ),
    { dispatch: false }
  );
  updatedSortOrderPayload() {
    let sortedValues;
    if (this.navSideBarService.sortAction === autoSort) {
      sortedValues = this.navSideBarService.sortedData(autoSort, customSort);
    } else {
      sortedValues = this.navSideBarService.sortedData(customSort, autoSort);
    }
    return sortedValues;
  }

  updatedSortOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavBarActions.updateSortOrder.type),
      map(action => action),
      withLatestFrom(this.store.pipe(select(fromSecuritySelector.getSecurityState))),
      mergeMap(([action]) => {
        const response =
          this.panelsApiService.updateSortOrder(action.updatedSortOrder, action.childrenNodeType);
        return response
          .pipe(map(() => {
            return NavBarActions.updateSortOrderSuccess({
              selectedNodeType: action.updatedSortOrder.nodeType,
              selectedNodeId: action.updatedSortOrder.parentNodeId
            });
          }),
            catchError((error) => {
              return of(NavBarActions.updateSortOrderFailure({ error }));
            })
          );
      })
    )
  );

  updatedSortOrderSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavBarActions.updateSortOrderSuccess.type),
      map(action => action),
      map((action) => {
       const sortedValues = this.updatedSortOrderPayload();
        this.appNavigationService.logAuditTracking( sortedValues, true);
        return NavBarActions.setNodeItems({ nodeType: action.selectedNodeType, id: action.selectedNodeId });
      })
    )
  );

  updatedSortOrderFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavBarActions.updateSortOrderFailure.type),
      tap((x) => {
        const sortedValues = this.updatedSortOrderPayload();
        sortedValues.auditTrail.actionStatus = AuditTrackingActionStatus.Failure;
        this.appNavigationService.logAuditTracking(sortedValues, true);
        this.appLogger.error(x);
      })
    ),
    { dispatch: false }
  );
}
