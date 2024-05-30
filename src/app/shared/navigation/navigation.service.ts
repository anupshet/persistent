// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Subject } from 'rxjs';
import { take, filter, takeUntil, concatMap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Injectable, NgZone, OnDestroy, EventEmitter } from '@angular/core';
import { NavigationExtras, NavigationEnd, Router } from '@angular/router';
import * as NgRxStore from '@ngrx/store';

import * as orderBy from 'lodash/orderBy';

import * as fromRoot from '../../state/app.state';
import { unRouting } from '../../core/config/constants/un-routing-methods.const';
import { ActionType } from '../../contracts/enums/action-type.enum';
import { RouterStateKeyWords } from '../../contracts/enums/router-state-keywords.enum';
import { TreePill } from '../../contracts/models/lab-setup/tree-pill.model';
import { LevelLoadRequest } from '../../contracts/models/portal-api/labsetup-data.model';
import { EntityType } from '../../contracts/enums/entity-type.enum';
import { LabLocation } from '../../contracts/models/lab-setup';
import * as fromNavigationSelector from '../../shared/navigation/state/selectors';
import { controls, defaultLabId, includeArchivedItems, instruments } from '../../core/config/constants/general.const';
import { QueryParameter } from '../../shared/models/query-parameter';
import { LocationActions } from '../../shared/state/actions';
import { AppUser } from '../../security/model';
import { Permissions } from '../../security/model/permissions.model';
import * as fromSecuritySelector from '../../security/state/selectors';
import { BrPermissionsService } from '../../security/services/permissions.service';
import { PortalApiService } from '../api/portalApi.service';
import { EntityTypeService } from '../services/entity-type.service';

import { MenuLink } from '../models/menu-link.model';
import { NavBarActions } from './state/actions';
import * as actions from '../../state/actions';
@Injectable()
export class NavigationService implements OnDestroy {
  selectedNode: TreePill;
  private destroy$ = new Subject<boolean>();
  public getArchiveToggle$ = this.store.pipe(NgRxStore.select(fromNavigationSelector.getIsArchiveItemsToggleOn));
  public getNavigationState$ = this.store.pipe(NgRxStore.select(fromNavigationSelector.getNavigationState));
  SecondaryNavSelectedTabIndex: EventEmitter<number> = new EventEmitter();
  private history: string[] = [`/${RouterStateKeyWords.Dashboard}`];
  private labsetupUrls: string[] = [
    RouterStateKeyWords.Departments,
    RouterStateKeyWords.Instruments,
    RouterStateKeyWords.Data,
    RouterStateKeyWords.Table,
    controls,
    'analytes'
  ];

  constructor(
    private store: NgRxStore.Store<fromRoot.State>,
    private router: Router,
    private location: Location,
    private portalApiService: PortalApiService,
    private brPermissionsService: BrPermissionsService,
    private entityTypeService: EntityTypeService,
    private zone: NgZone,
  ) {
    if (this.router.events) {
      this.router.events
        .pipe(takeUntil(this.destroy$))
        .subscribe((event) => {
          if (event instanceof NavigationEnd) {
            this.addUrlsToLabSetupHistory(event.urlAfterRedirects);
          }
        });
    }
  }

  routeTo(direction: string, navigationExtras?: NavigationExtras): void {
    this.router.navigate([direction], navigationExtras);
  }

  routeToLabManagement(locationId: string, labId: string): void {
    this.store.pipe(NgRxStore.select(fromNavigationSelector.getCurrentSelectedNode))
      .pipe(filter(selectedNode => !!(selectedNode && selectedNode.id)), takeUntil(this.destroy$))
      .subscribe((selectedNode: TreePill) => {
        this.selectedNode = selectedNode;
      });
    if (this.selectedNode) {
      this.router.navigate([
        unRouting.labManagement.lab,
        this.entityTypeService
          .getNodeTypeUrl(this.selectedNode.nodeType)
          .toLowerCase(),
        this.selectedNode.id
      ]);
    } else {
      // No selectedNode, navigate back to dashboard
      this.router.navigate([unRouting.actionableDashboard]);
    }
  }

  routeToConnectivity(subPath: string, labId: string): void {
    const root = unRouting.connectivity.connectivity;
    const labs = unRouting.connectivity.labs.replace(':id', labId);
    const url = `${root}/${labs}/${subPath}`;
    this.router.navigate([url]);
  }

  routeToInstructions(labId: string): void {
    this.routeToConnectivity(unRouting.parsingInstructions.instructions, labId);
  }

  routeToMapping(labId: string): void {
    const subPath = `${unRouting.connectivity.mapping}/${unRouting.connectivity.map.instrument
      }`;
    this.routeToConnectivity(subPath, labId);
  }

  routeToFileUpload(labId: string): void {
    this.routeToConnectivity(unRouting.connectivity.upload, labId);
  }

  routeToConnectivityStatus(labId: string): void {
    this.routeToConnectivity(unRouting.connectivity.status, labId);
  }

  routeToConnectivityConfigurations(labId: string): void {
    this.routeToConnectivity(unRouting.connectivity.configurations, labId);
  }

  routeToUserManagement(labId: string): void {
    // Lotveiwer or sales roles dont have labid
    if (labId === '' || labId === null) {
      labId = defaultLabId;
    }
    const url = this.getUserManagementUrlNew(labId);
    this.routeTo(url);
  }

  routeToUserManagementAddNew(labId: string): void {
    const url = this.getUserManagementUrlNew(labId);
    this.router.navigate([url], { queryParams: { add: 'true' } });
  }

  routeToAccountManagement(): void {
    this.routeTo(this.getAccountManagementUrl());
  }

  routeToAccountManagementAdd(): void {
    const url = this.getAccountManagementUrl();
    this.router.navigate([url], { queryParams: { add: 'true' } });
  }

  routeToBioRadUserManagement(): void {
    this.routeTo(this.getBioRadUserManagementUrl());
  }

  routeToDashboard(navigationOrigin?: string): void {
    if (navigationOrigin) {
      this.routeTo(unRouting.actionableDashboard, { queryParams: { [unRouting.navigationOrigin]: navigationOrigin } });
    } else {
      this.routeTo(unRouting.actionableDashboard);
    }
  }

  routeToAccountUserSelector(): void {
    this.routeToDashboard();
  }

  navigateToManageControls(): void {
    this.routeTo(unRouting.manageCustomControls.define);
  }

  navigateToAddLocation(parentId: string): void {
    const url =
      unRouting.labManagement.lab +
      '/' +
      unRouting.add.location.replace(':parentId', parentId);
    this.routeTo(url);
  }

  navigateToLogin(): void {
    this.routeTo(unRouting.login);
  }

  navigateToLoginWithQueryParams(queryParams: any): void {
    this.router.navigate([unRouting.login], queryParams);
  }

  private getUserManagementUrlNew(labId: string): string {
    const root = unRouting.userManagement;
    const url = `/${root}/${labId}`;
    return url;
  }

  private getAccountManagementUrl(): string {
    const root = unRouting.accountManagement;
    const url = `/${root}/`;
    return url;
  }

  private getBioRadUserManagementUrl(): string {
    const root = unRouting.bioradUserManagement;
    return `/${root}/`;
  }

  navigateToContent(selectedLink: MenuLink): void {
    this.router.navigate([selectedLink.link]);
  }

  navigateToLabSetupDefault(): void {
    this.router.navigateByUrl(`/${unRouting.labSetup.lab}/${unRouting.labSetup.labDefault}`);
  }

  setSelectedNodeById(selectedNodeType: EntityType, selectedNodeId: string, cb: Function): void {
    // Get selected node by using id.
    this.getArchiveToggle$.pipe(take(1))
      .subscribe(isArchiveItemsToggleOn => {
        const queryParameter = new QueryParameter(includeArchivedItems, (isArchiveItemsToggleOn).toString());
        this.portalApiService.getLabSetupNode(selectedNodeType, selectedNodeId,
          LevelLoadRequest.LoadChildren, EntityType.None, [queryParameter]).pipe(
            take(1)
          ).subscribe(selectedNode => {
            // set selected node and current branch.
            this.setSelectedNode(selectedNode);
            if (cb) {
              cb();
            }
          });
      });
  }

  setSelectedInstrumentNodeById(instrumentNodeId: string): void {
    this.store.dispatch(NavBarActions.resetNavigationState());
    this.store.dispatch(NavBarActions.setAllNavItemsWithNodeId({ nodeType: EntityType.LabInstrument, nodeId: instrumentNodeId }));
  }

  setSelectedNotificationId(selectedNotificationId: string): void {
    this.store.dispatch(NavBarActions.setSelectedNotificationId({ selectedNotificationId: selectedNotificationId }));
  }

  setSelectedReportNotificationId(selectedReportNotificationId: string): void {
    this.store.dispatch(NavBarActions.setSelectedReportNotificationId({ selectedReportNotificationId: selectedReportNotificationId }));
  }

  setSelectedNode(selectedNode: TreePill): void {
    this.setCurrentlySelectedNode(selectedNode);
    this.store.dispatch(NavBarActions.setCurrentBranchState({ 'currentBranchItem': selectedNode }));
  }

  setSelectedNodeWithTestSettings(selectedNode: TreePill): void {
    // Get selected node by using id.
    this.portalApiService.getLabSetupNodeWithTestSettings(selectedNode.nodeType, selectedNode.id,
      LevelLoadRequest.LoadChildren).pipe( // updated url
        take(1)
      ).subscribe(getSelectedNode => {
        // set selected node and current branch.
        this.setCurrentlySelectedNode(getSelectedNode);
        // this.store.dispatch(NavBarActions.setCurrentBranchState({ 'currentBranchItem': selectedNode }));
      });
  }

  public setCurrentlySelectedNode(selectedNode: TreePill) {
    if (selectedNode.children && selectedNode.children.length) {
      this.store.dispatch(NavBarActions.setSelectedLeaf({ selectedLeaf: null }));
      this.store.dispatch(NavBarActions.setDefaultNode({ selectedNode }));
    } else {
      if (selectedNode.nodeType === EntityType.Lab || selectedNode.nodeType === EntityType.LabLocation) {
        // selected node should update when location is with no child, as this is the root node in the tree.
        this.store.dispatch(NavBarActions.setDefaultNode({ selectedNode }));
      }

      if (selectedNode.nodeType === EntityType.LabTest) {
        this.store.dispatch(NavBarActions.setSelectedLeaf({ selectedLeaf: selectedNode }));
      } else {
        this.store.dispatch(NavBarActions.setSelectedLeaf({ selectedLeaf: null }));
        this.store.dispatch(NavBarActions.setDefaultNode({ selectedNode }));
      }
    }

  }

  navigateToUrl(navUrl: string, showSettings: boolean, selectedNode: TreePill, selectedNodeId?: string, postProcess?: Function): void {
    if (!selectedNode) {
      if (selectedNodeId) {
        // Get selected node by using id.
        this.getNavigationState$.pipe(take(1)).subscribe(navigation => {
          const queryParameter = new QueryParameter(includeArchivedItems, (navigation.isArchiveItemsToggleOn ? true : false).toString());
          this.portalApiService.getLabSetupNode(selectedNode ? selectedNode?.nodeType : EntityType.LabLocation, selectedNodeId,
            LevelLoadRequest.LoadChildren, EntityType.None, [queryParameter]).pipe(
              take(1)
            ).subscribe(_selectedNode => {
              this.setStateForSelectedNode(_selectedNode, showSettings, navUrl);

              if (postProcess) {
                postProcess();
              }
            });
        });

      }
    } else {
      this.setStateForSelectedNode(selectedNode, showSettings, navUrl);
    }
  }

  navigateToFeedBackPage(selectedLeafId: string, showSettings: boolean, firstAnalyteId: string) {
    const feedbackURL = `${unRouting.labSetup.lab}/${unRouting.labSetup.labConfigSetUpFeedback.add.replace(':id', selectedLeafId)}`;
    // Get selected node by using id.
    this.portalApiService.getLabSetupNode(EntityType.LabProduct, selectedLeafId, LevelLoadRequest.LoadChildren).pipe(
      take(1),
      concatMap(_selectedNode => [
        this.setStateForSelectedNode(_selectedNode, showSettings, null)
      ]),
      concatMap(() =>
        this.portalApiService.getLabSetupNode(EntityType.LabTest, firstAnalyteId, LevelLoadRequest.LoadChildren)
      ),
    ).subscribe(_selectedNode => {
      // Redirect to next url with first selected node from response array
      this.setStateForSelectedNode(_selectedNode, !!showSettings, feedbackURL);
    });
  }

  gotoDashboard(): void {
    this.store.pipe(NgRxStore.select(fromSecuritySelector.getCurrentUser))
      .pipe(
        filter(currentUser => !!currentUser.labLocationId),
        take(1)
      ).subscribe((currentUser: AppUser) => {
        this.navigateToDashboard(currentUser.labLocationId);
      });
  }

  gotoDashboardLanguageChange(path: string): void {
    // if user is on dashboard no navigation is needed so skip
    let onDashboard = false || path.includes(`/${RouterStateKeyWords.Dashboard}`);
    if (!onDashboard) {
      this.gotoDashboard();
    }
  }

  // TODO : TO move this to ngrx effects
  navigateToDashboard(locationId: string, showSettings: boolean = false): void {
    this.portalApiService.getLabSetupNode(EntityType.LabLocation, locationId, LevelLoadRequest.LoadChildren).pipe(
      take(1)
    ).subscribe(selectedNode => {
      this.routeToDashboard();
      this.resetTree(selectedNode, showSettings);
    });
  }

  navigateToDataReview(): void {
    this.routeTo(`/${unRouting.dataReview.review}/${unRouting.dataReview.dataReview}`);
  }

  resetTree(selectedNode, showSettings: boolean = false): void {
    // First we need to reset before setting anything
    this.store.dispatch(NavBarActions.resetNavigationState());
    // Set selected location node as current lab location
    this.store.dispatch(LocationActions.setCurrentLabLocation({ currentLabLocation: selectedNode }));
    this.router.navigate([unRouting.actionableDashboard]);
    this.store.dispatch(NavBarActions.setShowSettings({ showSettings: showSettings }));
    if (this.hasPermissionToAccess([Permissions.ReportsRun])) {
      this.store.dispatch(NavBarActions.setNodeItems({ nodeType: selectedNode.nodeType, id: selectedNode.id }));
      if (!selectedNode.children) {
        this.store.dispatch(NavBarActions.setDefaultNode({ selectedNode }));
      }
    }
  }

  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  public setStateForSelectedNode(selectedNode: TreePill, showSettings: boolean, url: string) {
    // set showSettings boolean state
    this.store.dispatch(NavBarActions.setShowSettings({ showSettings }));
    // AJT UN-9112 The timeout delay is to allow the showsettings action to be completed and set showsettings to false
    // this will refresh the analyte entry component pane and reload the anayltes
    setTimeout(() => {
      if (selectedNode) {
        // set selected node and current branch.
        this.setCurrentlySelectedNode(selectedNode);
        this.store.dispatch(NavBarActions.setCurrentBranchState({ 'currentBranchItem': selectedNode }));
      }
      if (url) {
        this.router.navigateByUrl(url);
      }
    }, 50);
  }

  navigateToDepartmentSettings(selectedNode: TreePill): void {
    this.setStateForSelectedNode(selectedNode, true,
      `/${unRouting.labSetup.lab}/${unRouting.labSetup.departments}/${selectedNode.id}/${unRouting.labSetup.settings}`);
  }

  // SR 08/19/2020: addressing the need for grandchildren when navigating from settings to instrument data-table
  navigateToInstrumentSettings(navUrl: string, showSettings: boolean, selectedNode?: TreePill,
    selectedNodeId?: string, postProcess?: Function): void {
    if (!selectedNode) {
      if (selectedNodeId) {
        this.getArchiveToggle$
          .pipe(take(1))
          .subscribe((isArchiveItemsToggleOn: boolean) => {
            const queryParameter = new QueryParameter(includeArchivedItems, (isArchiveItemsToggleOn).toString());
            // Get selected node by using id.
            this.portalApiService.getLabSetupNode(EntityType.LabInstrument, selectedNodeId,
              LevelLoadRequest.LoadUpToGrandchildren, EntityType.None, [queryParameter]).pipe(take(1))
              .subscribe((_selectedNode: TreePill) => {
                if (_selectedNode.id) {
                  this.setStateForSelectedNode(_selectedNode, showSettings, navUrl);
                  if (postProcess) {
                    postProcess();
                  }
                } else {
                  this.routeToDashboard();
                }
              });
          });
      }
    } else {
      this.setStateForSelectedNode(selectedNode, showSettings, navUrl);
    }
  }

  navigateToLabSetup(selectedNode: TreePill, location: LabLocation, instGroupedByDept: boolean = false): void {
    this.zone.run(() => {
      selectedNode && selectedNode.children && selectedNode.children.length > 0 ?
        this.router.navigateByUrl(`${this.entityTypeService.getLabSetupUrl(selectedNode, true, location, instGroupedByDept)}`) :
        this.router.navigateByUrl(`${this.entityTypeService.getLabSetupUrl(selectedNode, false, location, instGroupedByDept)}`);
    });
  }

  navigateToPanel(selectedNode: TreePill) {
    this.getArchiveToggle$.pipe(take(1))
      .subscribe(isArchiveItemsToggleOn => {
        const isArchivedChildren = selectedNode.children && selectedNode.children.length > 0 ?
          selectedNode.children.every(e => e.isArchived) : true;
        (isArchivedChildren && !isArchiveItemsToggleOn && !selectedNode.isUnavailable) ? this.router.navigateByUrl(`/${unRouting.panels.panel}/edit/${selectedNode.id}`) :
          this.router.navigateByUrl(`/${unRouting.panels.panel}/${selectedNode.id}`);
      });
  }

  getUpdatedSelectedNodeState(currentBranchState: TreePill[],
    selectedNode: TreePill, actionType: ActionType, selectedNodeId: string = ''): TreePill[] {
    const nodeFound = true;
    currentBranchState = currentBranchState.map(function iter(node) {
      const foundItem = node['children'].findIndex(x => x.id.toString() === selectedNodeId.toString());
      if (foundItem > -1) {
        return actionType === ActionType.delete ? node['children'].splice(foundItem, 1) :
          node['children'][foundItem] = Object.assign({}, selectedNode);
      } else {
        return Array.isArray(node.children) && node.children.length > 0 ? node.children.map(iter) : node.children;
      }
    });
    if (nodeFound && selectedNode && selectedNode.children && selectedNode.children.length > 0) {
      return this.getUpdatedSelectedNodeState(selectedNode.children, selectedNode, actionType, selectedNodeId);
    }
    return currentBranchState;
  }

  sortNavItems(sideNavItems: any): any {
    return sideNavItems =
      orderBy(sideNavItems, [(node: TreePill) => node.displayName ? node.displayName.replace(/\s/g, '').toLocaleLowerCase() : '']);
  }

  isSelectedNodeOfDataTable(selectedNode: TreePill): boolean {
    return selectedNode.nodeType === EntityType.LabTest || selectedNode.nodeType === EntityType.LabProduct
      || selectedNode.nodeType === EntityType.LabInstrument ||
      (selectedNode.isUnavailable) ? true : false;
  }

  addUrlsToLabSetupHistory(url: string) {
    if (this.labsetupUrls.includes(url)) {
      return;
    }
    if (url.split('/').some(urlPath => this.labsetupUrls.includes(urlPath))) {
      if (url.includes(`/${RouterStateKeyWords.Departments}/`) || url.includes(`/${RouterStateKeyWords.Instruments}/`)) {
        this.history = [`/${RouterStateKeyWords.Dashboard}`, url];
        return;
      } else if (!this.history.includes(url)) {
        this.history.push(url);
        return;
      } else if (url === `/${RouterStateKeyWords.Dashboard}`) {
        this.history = [`/${RouterStateKeyWords.Dashboard}`];
      }
    }
  }

  goPreviousPageInLabSetup() {
    const lastPage = this.history.pop();
    const lastUrlIndex = this.history.length - 1;
    if (lastPage === `/${RouterStateKeyWords.Dashboard}`) {
      this.gotoDashboard();
      this.store.dispatch(NavBarActions.resetNavigationState());
      return;
    }
    if (this.history.length > 0) {
      for (let i = lastUrlIndex; i >= 0; i--) {
        if (lastPage !== this.history[i]) {
          if (lastPage === `/${RouterStateKeyWords.Dashboard}` || this.history[i] === `/${RouterStateKeyWords.Dashboard}`) {
            this.gotoDashboard();
            this.store.dispatch(NavBarActions.resetNavigationState());
          } else {
            if (lastPage.includes(controls) && this.history[i].includes(RouterStateKeyWords.Instruments)) {
              const urlParts = this.history[i].split('/');
              const instrumentId = urlParts[urlParts.length - 2];
              this.store.dispatch(NavBarActions.removeLastItemFromCurrentBranch());
              this.store.dispatch(
                actions.NavBarActions.setNodeItems({
                  nodeType: EntityType.LabDepartment,
                  id: instrumentId,
                })
              );
            }
            this.router.navigateByUrl(this.history[i]);
          }
          break;
        }
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
