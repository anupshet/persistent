// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { Subject, combineLatest, of } from 'rxjs';
import { takeUntil, filter, flatMap, take } from 'rxjs/operators';
import { ActionLink, CardEmitter } from 'br-component-library';
import { cloneDeep } from 'lodash';

import * as fromNavigationSelector from '../../../../shared/navigation/state/selectors';
import * as fromSecuritySelector from '../../../../security/state/selectors';
import * as fromRoot from '../../../../state/app.state';
import { unRouting } from '../../../../core/config/constants/un-routing-methods.const';
import { TreePill, LabLocation, Department, LabInstrument } from '../../../../contracts/models/lab-setup';
import { IconService } from '../../../../shared/icons/icons.service';
import { Icon } from '../../../../contracts/models/shared/icon.model';
import { icons } from '../../../../core/config/constants/icon.const';
import { includeArchivedItems } from '../../../../core/config/constants/general.const';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { TreeNodesService } from '../../../../shared/services/tree-nodes.service';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { LevelLoadRequest } from '../../../../contracts/models/portal-api/labsetup-data.model';
import { NavBarActions } from '../../../../shared/navigation/state/actions';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { QueryParameter } from '../../../../shared/models/query-parameter';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { DepartmentAccessPermissions, Permissions } from '../../../../security/model/permissions.model';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { AppUser } from '../../../../security/model';
import { AuditTrackingAction } from '../../../../shared/models/audit-tracking.model';

@Component({
  selector: 'unext-department-management-component',
  templateUrl: './department-management.component.html',
  styleUrls: ['./department-management.component.scss']
})
export class DepartmentManagementComponent implements OnInit, OnDestroy {
  public newAction: ActionLink;
  public location: LabLocation;
  public currentUser: AppUser;
  public selectedNodeId: string;
  private destroy$ = new Subject<boolean>();
  public showSettings: boolean;
  public showEntryForm: boolean;
  public showAddInstrumentLink: boolean;
  nodeType = EntityType;
  icons = icons;
  hasDepartment: boolean;
  iconsUsed: Array<Icon> = [
    icons.addCircleOutline[24]
  ];
  permissions = Permissions;

  public navigationCurrentlySelectedNode$ = this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedNode));
  public navigationCurrentlySelectedLeaf$ = this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedLeaf));
  public getIsArchiveItemsToggleOn$ = this.store.pipe(select(fromNavigationSelector.getIsArchiveItemsToggleOn));
  public showSettings$ = this.store.pipe(select(state => {
    if (state && state.navigation) {
      return state.navigation.showSettings;
    }
  }));
  public getCurrentUserState$ = this.store.pipe(select(fromSecuritySelector.getCurrentUser));

  constructor(
    private store: Store<fromRoot.State>,
    private navigationService: NavigationService,
    private iconService: IconService,
    private treeNodeService: TreeNodesService,
    private portalApiService: PortalApiService,
    private errorLoggerService: ErrorLoggerService,
    private appNavigationService: AppNavigationTrackingService,
    private brPermissionsService: BrPermissionsService,
    private translate: TranslateService
  ) {
    try {
      this.iconService.addIcons(this.iconsUsed);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.DeparmentManagementComponent + blankSpace + Operations.AddIcons)));
    }
  }

  ngOnInit() {
    try {
      this.showSettings$.pipe(
        takeUntil(this.destroy$)
      ).subscribe((isShowSettings) => {
        if (this.hasPermissionToAccess(DepartmentAccessPermissions)) {
          this.showSettings = isShowSettings;
          this.showEntryForm = !isShowSettings;
          this.loadCardDetailsData();
        } else {
          this.navigationService.routeToDashboard();
        }
      });
      this.newAction = {
        icon: 'addCircleOutline[24]',
        text: this.getTranslations('TRANSLATION.ADDINSTRUMENT'),
        url: `/${unRouting.labSetup.lab}/${unRouting.labSetup.instruments}/${this.selectedNodeId}/${unRouting.labSetup.settings}`
      };
      this.showAddInstrumentLink = this.hasPermissionToAccess([Permissions.InstrumentAdd, Permissions.InstrumentAddViewOnly]);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.DeparmentManagementComponent + blankSpace + Operations.OnInit)));
    }
  }

  loadCardDetailsData() {
    let selectedNode: TreePill;
    // TODO: Need to uncomment once current selected node gets GRAND CHILDREN information for Lab Location
    // combineLatest(
    //   this.navigationCurrentlySelectedNode$, this.navigationCurrentlySelectedLeaf$
    // ).pipe(takeUntil(this.destroy$)).subscribe(([currentSelectedNode, currentSelectedLeaf]) => {
    //   if (currentSelectedNode && currentSelectedNode.nodeType === EntityType.LabLocation) {
    //     selectedNode = currentSelectedNode;
    //   } else if (currentSelectedLeaf && currentSelectedLeaf.nodeType === EntityType.LabLocation) {
    //     selectedNode = currentSelectedLeaf;
    //   }
    //   if (selectedNode) {
    //     // returns new sorted ascending array, order by displayName, label.
    //     const children = this.treeNodeService.sortByOrder(selectedNode.children);
    //     selectedNode = { ...selectedNode, children };
    //     this.location = <LabLocation>selectedNode;
    //     this.selectedNodeId = selectedNode.id;
    //   }
    // });

    // TODO: Need to remove once selected node has GRAND CHILDREN data for Lab Location
    combineLatest(
      [this.navigationCurrentlySelectedNode$, this.navigationCurrentlySelectedLeaf$, this.getIsArchiveItemsToggleOn$]
    ).pipe(takeUntil(this.destroy$),
      flatMap(([currentSelectedNode, currentSelectedLeaf, isArchiveItemsToggleOn]) => {
        if (currentSelectedNode && currentSelectedNode.nodeType === EntityType.LabLocation) {
          selectedNode = currentSelectedNode;
        } else if (currentSelectedLeaf && currentSelectedLeaf.nodeType === EntityType.LabLocation) {
          selectedNode = currentSelectedLeaf;
        }
        if (selectedNode) {
          this.selectedNodeId = selectedNode.id;

          // selected node not having grand children data need to get those by calling API
          if (this.showSettings) {
            const queryParameter = new QueryParameter(includeArchivedItems, (isArchiveItemsToggleOn).toString());
            return this.portalApiService.getLabSetupNode(
              EntityType.LabLocation, this.selectedNodeId, LevelLoadRequest.LoadUpToGrandchildren, EntityType.None, [queryParameter])
              .pipe(filter(labLocationData => !!labLocationData));
          } else {
            const selectedNodeData = cloneDeep(selectedNode);
            selectedNodeData.children = selectedNodeData.children ? selectedNodeData.children.filter((department: TreePill) =>
              department.nodeType === EntityType.LabDepartment) : [];
            this.location = this.getLablocationSortedChildren(selectedNodeData);
            return of(null);
          }
        }
      })).pipe(
        filter(labLocationData => !!labLocationData),
        takeUntil(this.destroy$))
      .subscribe((labLocationDataUpToGrandChildren) => {
        const filteredLabLocationDataUpToGrandChildren = labLocationDataUpToGrandChildren;
        if (labLocationDataUpToGrandChildren) {
          filteredLabLocationDataUpToGrandChildren.children = labLocationDataUpToGrandChildren.children
            .filter((department: TreePill) => department.nodeType === EntityType.LabDepartment);
        }
        this.location = this.getLablocationSortedChildren(filteredLabLocationDataUpToGrandChildren);
      });
  }

  getLablocationSortedChildren(labLocation) {
    let newSelectedNode = labLocation;
    // returns new sorted ascending array, order by displayName, label.
    const children = this.treeNodeService.sortByOrder(newSelectedNode.children);
    newSelectedNode = { ...newSelectedNode, children };
    return <LabLocation>newSelectedNode;
  }

  addDepartmentButtonClick() {
    try {
      this.navigationService.navigateToUrl(
        `${unRouting.labSetup.lab}/${unRouting.labSetup.departments}/${this.selectedNodeId}/${unRouting.labSetup.settings}`,
        false,
        this.location, this.selectedNodeId, () => { this.store.dispatch(NavBarActions.setShowSettings({ showSettings: true })); }
      );
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.DeparmentManagementComponent + blankSpace + Operations.AddDepartmentButtonClick)));
    }
    // to call service resetdata function
    this.appNavigationService.resetData();
    this.appNavigationService.auditTrailViewData(AuditTrackingAction.Settings);
  }

  linkClicked(data: CardEmitter) {
    let selectedElement: Department | LabInstrument = null;
    if (this.location && this.location.children && this.location.children.length > 0) {
      const selectedElementIndex = this.location.children.findIndex(ele => ele.id === data.selectedNodeId);
      if (selectedElementIndex !== -1) {
        selectedElement = this.location.children[selectedElementIndex];
        this.navigationService.navigateToUrl(data.url, false, selectedElement, data.selectedNodeId);
      } else {
        this.navigationService.navigateToUrl(data.url, false, null, data.selectedNodeId);
      }
    }
  }

  getCount(department) {
    return department.children?.length ? department.children.length : 0;
  }

  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  private getTranslations(codeToTranslate: string): string {
    let translatedContent:string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
    }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
