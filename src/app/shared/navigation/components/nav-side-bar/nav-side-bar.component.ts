// © 2024 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { select, Store } from '@ngrx/store';
import { NavigationEnd, Router } from '@angular/router';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { Subject } from 'rxjs';
import * as ngrxSelector from '@ngrx/store';
import { filter, take, takeUntil } from 'rxjs/operators';
import { cloneDeep, orderBy } from 'lodash';
import { TranslateService } from '@ngx-translate/core';
 
import { TreePill } from '../../../../contracts/models/lab-setup/tree-pill.model';
import { Icon } from '../../../../contracts/models/shared/icon.model';
import { icons } from '../../../../core/config/constants/icon.const';
import * as fromRoot from '../../../../state/app.state';
import { IconService } from '../../../icons/icons.service';
import * as actions from '../../state/actions';
import * as navactions from '../../../../shared/navigation/state/actions/nav-bar-action';
import * as panelActions from '../../../../master/panels/state/actions';
import * as selectors from '../../state/selectors';
import { SideBarItem } from '../../models/side-bar-item.model';
import { NavSideBarService } from '../../services/nav-side-bar.service';
import { ErrorLoggerService } from '../../../services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { PortalApiService } from '../../../api/portalApi.service';
import { LevelLoadRequest } from '../../../../contracts/models/portal-api/labsetup-data.model';
import { NotificationService } from '../../../../core/notification/services/notification.service';
import { LotDuplicationStatus, UnityNotification } from '../../../../core/notification/interfaces/unity-notification';
import { AccountActions } from '../../../state/actions';
import * as sharedStateSelector from '../../../state/selectors';
import * as dataManagementSelector from '../../../../master/data-management/state/selectors';
import { Account } from '../../../../contracts/models/account-management/account';
import { notificationTypeArchive, notificationTypeLotDuplication, notificationTypeInstrumentDuplication } from '../../../../core/config/constants/notification.const';
import { QueryParameter } from '../../../models/query-parameter';
import { asc, autoSort, customSort, edit, includeArchivedItems, maxPanel, panel } from '../../../../core/config/constants/general.const';
import { NavigationService } from '../../navigation.service';
import { unRouting } from '../../../../core/config/constants/un-routing-methods.const';
import * as fromSecuritySelector from '../../../../security/state/selectors';
import { SortEntity, SortOrder } from '../../models/sort-entity.model';
import { Panel } from '../../../../contracts/models/panel/panel.model';
import * as fromNavigationSelector from '../../../../shared/navigation/state/selectors';
import { Utility } from '../../../../core/helpers/utility';
import { LabLocation } from '../../../../contracts/models/lab-setup';
import { AppUser } from '../../../../security/model';
import { UnityNextTier } from '../../../../contracts/enums/lab-location.enum';
import { UserRole } from '../../../../contracts/enums/user-role.enum';
import {
  AnalyteAccessPermissions, ControlAccessPermissions, DepartmentAccessPermissions,
  InstrumentAccessPermissions, PanelsAccessPermissions, Permissions
} from '../../../../security/model/permissions.model';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';

@Component({
  selector: 'unext-nav-side-bar',
  templateUrl: './nav-side-bar.component.html',
  styleUrls: ['./nav-side-bar.component.scss']
})

export class NavSideBarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  @ViewChild('sideNav') sideNav;
  verticalScroll: PerfectScrollbarComponent;
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.close[24],
    icons.menu[24],
    icons.addCircleOutline[24],
    icons.verticalBars[24],
    icons.sort[24],
  ];
  nodeSelected: TreePill;
  selectedSideNavItem: TreePill = null;
  selectedNode: TreePill;
  sideBarList: SideBarItem[];
  archiveItemList: SideBarItem[];
  permissions = Permissions;
  public isArchiveItemsToggleOn = false;
  public showArchivedItemsToggle = false;
  notificationType;
  UnityNotification: LotDuplicationStatus;
  nodeType = EntityType;
  showPanel = false;
  showTooltip = false;
  private locationId: string;
  location: LabLocation;
  public instGroupedByDept: boolean;

  public currentAccountState$ = this.store.pipe(select(sharedStateSelector.getCurrentAccount));
  public getCurrentUserState$ = this.store.pipe(select(fromSecuritySelector.getCurrentUser));
  public getInstrumentsGroupedByDeptVal$ = this.store.pipe(select(fromNavigationSelector.getInstrumentsGroupedByDeptVal));
  public getSecurityState$ = this.store.pipe(select(fromSecuritySelector.getSecurityState));
  public getCurrentLabLocation$ = this.store.pipe(select(sharedStateSelector.getCurrentLabLocation));

  public showSortOpts = false;
  public showSortOptsPanels = false;
  public panelList: SideBarItem[];
  public disableAZ = true;
  public disableDone = true;
  public disablePanelAZ = true;
  public disablePanelDone = true;
  public sortedSideBarList: SideBarItem[];
  public sortedSideBarArchiveList: SideBarItem[];
  public sortedPanelList: SideBarItem[];
  public sortedPanelAZ: boolean;
  public custPanelSorted: boolean;
  public sortedAZ: boolean;
  public custSorted: boolean;
  public sortEntityArray: SortEntity[];
  public showSideBarItems = true;
  private sliderLastLeft = 0;
  private sliderDirection: string;
  public isPanelMDEmode = false;
  public dataEntryMode: boolean;
  public currentUser: AppUser;
  public showLocationSelector = false;
  public isLUM = false;
  public showNavigation = true;

  constructor(
    private store: Store<fromRoot.State>,
    private iconService: IconService,
    private navSideBarService: NavSideBarService,
    private errorLoggerService: ErrorLoggerService,
    private portalApiService: PortalApiService,
    private notificationService: NotificationService,
    private navigationService: NavigationService,
    private router: Router,
    private brPermissionsService: BrPermissionsService,
    private appNavigationService: AppNavigationTrackingService,
    private translate: TranslateService
  ) {
    this.iconService.addIcons(this.iconsUsed);
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.isPanelMDEmode = this.router.url.includes(panel) && !this.router.url.includes(edit);
        this.store.dispatch(actions.NavBarActions.setCustomSortMode({ isCustomSortMode: false }));
        if (this.showSortOptsPanels) {
          this.resetPanels(true);
        }
        if (this.showSortOpts) {
          this.resetSideBarItems(true);
        }

        const hideSideNavBar =
        this.router.url.includes(unRouting.labSetup.labDefault) ||
        this.router.url.includes(unRouting.accountManagement) ||
        this.router.url.includes(unRouting.reporting.newReports) ||
        this.router.url.includes(unRouting.reporting.pastReports);
        if (hideSideNavBar) {
          this.showNavigation = false;
          this.store.dispatch(actions.NavBarActions.toggleNavigationbar({ isSideNavExpanded: false }));
        } else {
          this.showNavigation = true;
          this.store.dispatch(actions.NavBarActions.toggleNavigationbar({ isSideNavExpanded: true }));
        }
      }
    });
  }

  isSideNavExpanded$ = this.store.pipe(select(selectors.getSideNavState),
    takeUntil(this.destroy$)).subscribe((isSideNavExpanded: boolean) => {
      try {
        if (this.sideNav) {
          isSideNavExpanded ? this.sideNav.open() : this.sideNav.close();
        }
      } catch (error) {
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, error.message,
            (componentInfo.NavSideBarComponent + blankSpace + Operations.IsSideNavExpanded)));
      }
    });

  ngOnInit() {
    this.getIsAccountUserSelectorOn();
    this.nodeSelected = null;
    this.checkDataEntryMode();

    this.getCurrentLabLocation$.pipe(
        filter(labLocation => !!labLocation),
        takeUntil(this.destroy$))
      .subscribe(labLocation => {
      if (labLocation) {
          this.location = labLocation;
          this.locationId = this.location?.id;
          if (!this.location?.children && labLocation.id !== this.location?.id) {
            this.sideBarList = undefined;
          } else {
            // adding this condition for location with no departments access, we will reset the sidenav
            if (this.location.children && this.location.children.length > 0) {
              if (!(this.location.children.some(ele => ele.nodeType === EntityType.LabDepartment))) {
                this.sideBarList = undefined;
              }
            }
          }
      }
    });

    this.getCurrentUserState$.pipe(filter(account => !!account), takeUntil(this.destroy$)).subscribe(currentUserState => {
      if (currentUserState) {
        this.isLUM = this.isOnlyLabUserManagerRole(currentUserState);
      }
    });

    this.getCurrentlySelectedNode();

    this.notificationService.$labStream.pipe(filter(unityNotification => !!unityNotification), takeUntil(this.destroy$))
      .subscribe((unityNotification: UnityNotification) => {
        if (unityNotification.notificationType === notificationTypeLotDuplication) {
          this.store.pipe(select(selectors.getCurrentlySelectedNode))
            .pipe(filter((selectedNode => !!selectedNode && !!selectedNode.children)), take(1))
            .subscribe((selectedNode: TreePill) => {
              if (unityNotification.payload.isSuccess && unityNotification.payload.id === selectedNode.id) {
                this.store.dispatch(actions.NavBarActions.setNodeItems(unityNotification.payload.id));
              } else if (!unityNotification.payload.isSuccess && unityNotification.payload.id === selectedNode.id) {
                this.store.dispatch(actions.NavBarActions.setNodeItems(unityNotification.payload.parentNodeId));
              } else if (!unityNotification.payload.isSuccess && unityNotification.payload.parentNodeId === selectedNode.id) {
                this.store.dispatch(actions.NavBarActions.updateNavigation({
                  nodeType: Utility.getParentNodeType(unityNotification.payload.nodeType,
                    this.location?.locationSettings?.instrumentsGroupedByDept),
                  id: unityNotification.payload.parentNodeId
                }));
              }
            });
        } else if (unityNotification.notificationType === notificationTypeArchive && unityNotification.payload.isSuccess) {
          this.currentAccountState$.pipe(filter(account => !!account), take(1))
            .subscribe((account: Account) => {
              this.store.dispatch(AccountActions.getAccount({ accountId: account.id }));
            });
        } else if (unityNotification.notificationType === notificationTypeInstrumentDuplication) {
          this.store.pipe(select(selectors.getCurrentlySelectedNode))
            .pipe(filter((selectedNode => !!selectedNode && !!selectedNode.children)), take(1))
            .subscribe((selectedNode: TreePill) => {
              if (!unityNotification.payload.isSuccess && unityNotification.payload.id === selectedNode.id) {
                this.store.dispatch(actions.NavBarActions.setNodeItems(unityNotification.payload.sourceNodeId));
              }
            });
        }
      });

    this.getInstrumentsGroupedByDeptVal$.pipe(takeUntil(this.destroy$))
      .subscribe((hasDepartment) => {
        this.instGroupedByDept = hasDepartment;
      });

    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.getCurrentlySelectedNode();
    });
  }

  private getCurrentlySelectedNode() {
    this.store.pipe(select(selectors.getCurrentlySelectedNode))
    .pipe(filter((selectedNode => !!selectedNode)), takeUntil(this.destroy$))
    .subscribe((selectedNode: TreePill) => {
      if (selectedNode && selectedNode.children) {
        this.selectedNode = selectedNode;
        let sideNavItems: TreePill[] = [];
        this.showPanel = selectedNode.nodeType === EntityType.LabLocation;
        this.showTooltip = selectedNode.nodeType === EntityType.Panel;
        this.sortedPanelAZ = false;
        this.sortedAZ = false;
        this.custPanelSorted = false;
        this.custSorted = false;
        this.disableDone = true;
        this.disablePanelDone = true;
        sideNavItems = selectedNode.children;

        if (selectedNode.nodeType === EntityType.LabLocation || selectedNode.nodeType === EntityType.LabDepartment ||
          selectedNode.nodeType === EntityType.LabInstrument || selectedNode.nodeType === EntityType.LabProduct ||
          selectedNode.nodeType === EntityType.Panel) {
          this.updateArchivedItemsState(this.location?.usedArchive);
          if (this.location?.usedArchive) {
            this.getIsArchiveItemsToggleOn();
          } else {
            // Get side bar list items with proper attributes.
            if (selectedNode.nodeType === EntityType.Panel) {
              this.sideBarList = this.navSideBarService.getSideBarItems(sideNavItems, true);
              this.sortedSideBarList = cloneDeep(this.sideBarList);
              this.sortedSideBarList = this.sortedSideBarList.filter((element) => (!element.node.isArchived));
            } else {
              const sideBarList = this.navSideBarService.getSideBarItems(sideNavItems);
              this.sideBarList = sideBarList.filter(item => item.node.nodeType !== EntityType.Panel && !item.node.isArchived);
              this.sortedSideBarList = cloneDeep(this.sideBarList);
              this.panelList = sideBarList.filter(item => item.node.nodeType === EntityType.Panel);
              this.sortedPanelList = cloneDeep(this.panelList);
            }
            this.disableAZ = this.checkIfCustomSorted(this.sideBarList, this.selectedNode.nodeType === EntityType.Panel);
            this.disablePanelAZ = this.panelList.length > 0 ? this.checkIfCustomSorted(this.panelList) : true;
          }
        } else {
          this.updateArchivedItemsState(false);
          // Get side bar list items with proper attributes.
          this.sideBarList = this.navSideBarService.getSideBarItems(sideNavItems);
        }
        // Should not display Side Nav if user switches the location and the location doesn't have a UnityNext license or
        // labsetup is not complete(UN-11155)
        if (this.hasPermissionToAccess([Permissions.DepartmentAdd, Permissions.InstrumentAdd])
          && this.location?.unityNextTier === UnityNextTier.None) {
          this.sideBarList = undefined;
        }
        this.store.pipe(select(selectors.getSelectedLeftNavItem), filter((selectedLeftNav => !!selectedLeftNav)),
          take(1)).subscribe((selectedLeftNavItem: TreePill) => {
            const _selectedLeftNavItem = sideNavItems.filter((sideNavItem: TreePill) => sideNavItem.id === selectedLeftNavItem.id)[0];
            const isManageControl = this.router.url.includes('define-control') ? true : false;
            this.setSelectedNode(_selectedLeftNavItem, isManageControl);
            if (_selectedLeftNavItem) {
              this.store.dispatch(actions.NavBarActions.setLeftNavItemSelected({ selectedLeftNavItem: null }));
            }
          });
      } else {
        if (selectedNode.nodeType === EntityType.LabLocation) {
          this.sideBarList = undefined;
        }
      }
    });
  }

  private getIsAccountUserSelectorOn() {
    this.store.pipe(ngrxSelector.select(fromNavigationSelector.getIsAccountUserSelectorOn))
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.showLocationSelector = res;
      });
  }

  isAddAPanelDisabled(): boolean {
    return this.sideBarList.filter(item => item.node.nodeType === EntityType.Panel).length >= maxPanel;
  }

  gotoAddLink() {
    try {
      const labSetUpBaseUrl = unRouting.labSetup.lab;
      let url: string;
      switch (this.selectedNode.nodeType) {
        case EntityType.LabLocation:
          url = this.instGroupedByDept ? `/${labSetUpBaseUrl}/${unRouting.labSetup.departments}/${this.selectedNode.id}/${unRouting.labSetup.settings}`
            : `/${labSetUpBaseUrl}/${unRouting.labSetup.instruments}/${this.selectedNode.id}/${unRouting.labSetup.settings}`;
          break;
        case EntityType.LabDepartment:
          url = `/${labSetUpBaseUrl}/${unRouting.labSetup.instruments}/${this.selectedNode.id}/${unRouting.labSetup.settings}`;
          break;
        case EntityType.LabInstrument:
          url = `/${labSetUpBaseUrl}/${unRouting.labSetup.controls}/${this.selectedNode.id}/${unRouting.labSetup.settings}`;
          break;
        case EntityType.LabProduct:
          url = `/${labSetUpBaseUrl}/${unRouting.labSetup.analytes}/${this.selectedNode.id}/${unRouting.labSetup.settings}`;
          break;
      }
      if (this.selectedNode.nodeType === EntityType.LabProduct) {
        this.navigationService.setStateForSelectedNode(null, false, url);
      } else {
        this.navigationService.navigateToUrl(url, false, this.selectedNode);
      }
      this.navigationService.setSelectedNotificationId('');
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.NavSideBarComponent + blankSpace + Operations.GoToAddNode)));
    }
    this.appNavigationService.resetData();
    this.appNavigationService.subject.next(true);
  }

  public getLinkName(nodeType: EntityType): string {
    switch (nodeType) {
      case EntityType.LabLocation: return this.instGroupedByDept ? this.getTranslations('NAV.SIDEMENU.ADDDEPARTMENT') : this.getTranslations('TRANSLATION.ADDINSTRUMENT');
      case EntityType.LabDepartment: return this.getTranslations('TRANSLATION.ADDINSTRUMENT');
      case EntityType.LabInstrument: return this.getTranslations('TRANSLATION.ADDCONTROL');
      case EntityType.LabProduct: return this.getTranslations('TRANSLATION.ADDANALYTE');
      default:
        return '';
    }
  }

  private getTranslations(codeToTranslate: string): string {
    let translatedContent:string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }

  private checkDataEntryMode(): void {
    this.store.pipe(select(dataManagementSelector.getDataEntryMode), takeUntil(this.destroy$))
      .subscribe((dataEntryMode: boolean) => {
        this.dataEntryMode = dataEntryMode;
      });
  }

  private getIsArchiveItemsToggleOn() {
    this.store.pipe(select(selectors.getIsArchiveItemsToggleOn), take(1))
      .subscribe((isArchiveItemsToggleOn: boolean) => {
        this.isArchiveItemsToggleOn = isArchiveItemsToggleOn;
        if (this.selectedNode) {
          this.getSideBarItemsIncludesArchived(this.selectedNode.nodeType, this.selectedNode.id, isArchiveItemsToggleOn);
        }
      });
  }

  private getSideBarItemsIncludesArchived(selectedNodetype: EntityType, selectedNodeId: string, isIncludeArchivedItems: boolean,
    isCalledFromToggleArchivedItems?: boolean) {
    const queryParameter = new QueryParameter(includeArchivedItems, (isIncludeArchivedItems).toString());
    this.portalApiService.getLabSetupNode(selectedNodetype, selectedNodeId,
      LevelLoadRequest.LoadUpToGrandchildren, EntityType.None, [queryParameter])
      .pipe(take(1))
      .subscribe((selectedNode: TreePill) => {
        if (selectedNode.id) {
          if (isCalledFromToggleArchivedItems) {
            this.changeSelectedNodeBasisOfNewChildren(selectedNode);
          } else {
            this.setSideBarList(selectedNode);
          }
        } else {
          this.navigationService.navigateToDashboard(this.locationId);
        }
      });
  }

  private changeSelectedNodeBasisOfNewChildren(updatedSelectedNode: TreePill) {

    const isOnDataTableScreen = (this.router.url.includes('4/table') || this.router.url.includes('5/table') || this.router.url.includes('6/table')) ? true : false;
    const hasArchivedAnalytes = (this.sortedSideBarArchiveList.length >= 1) ? true : false;
    const hasSortedSideBarList = (this.sortedSideBarList.length >= 1) ? true : false;

    // pbi #224607
    if (!this.isArchiveItemsToggleOn && isOnDataTableScreen && hasArchivedAnalytes && !hasSortedSideBarList) {
      this.changeSelectedNode(updatedSelectedNode);
      return false;
    }

    if (this.router.url.includes('table') || this.selectedNode.nodeType === EntityType.Panel) {
      this.store.pipe(select(selectors.getCurrentlySelectedLeaf))
        .pipe(take(1))
        .subscribe((selectedLeaf: TreePill) => {
          if (selectedLeaf) {
            this.navigationService.setSelectedNodeById(updatedSelectedNode.nodeType, updatedSelectedNode.id, () => {
              this.store.dispatch(actions.NavBarActions.setNodeItems({ nodeType: selectedLeaf.nodeType, id: selectedLeaf.id }));
            });
          } else {
            this.store.dispatch(actions.NavBarActions.setNodeItems({ nodeType: updatedSelectedNode.nodeType, id: updatedSelectedNode.id }));
          }
        });
    } else {
      this.changeSelectedNode(updatedSelectedNode);
    }
  }

  private changeSelectedNode(updatedSelectedNode: TreePill) {
    if (!updatedSelectedNode || !updatedSelectedNode.children || !updatedSelectedNode.children.length) {
      this.store.dispatch(actions.NavBarActions.setNodeItems({
        nodeType: Utility.getParentNodeType(updatedSelectedNode.nodeType,
          this.location?.locationSettings?.instrumentsGroupedByDept),
        id: updatedSelectedNode.parentNodeId
      }));
      // Setting parent node as a selected node
      setTimeout(() => {
        // And set the currently selected node as leaf node.
        // Using timeout here as setting selected node and selected leaf is conflicting with each other.
        if (!updatedSelectedNode.isArchived) {
          this.store.dispatch(actions.NavBarActions.setNodeItems({ nodeType: updatedSelectedNode.nodeType, id: updatedSelectedNode.id }));
          this.store.dispatch(actions.NavBarActions.setLeftNavItemSelected({ selectedLeftNavItem: updatedSelectedNode }));
        } else {
          // Clear archived child nodes from sidebar menu (this is called when !this.isArchiveItemsToggleOn)
          this.setSideBarList(new TreePill());
        }
        this.store.dispatch(actions.NavBarActions.removeItemsFromCurrentBranch({ item: updatedSelectedNode }));
      }, 100);
    } else if (!this.nodeSelected || !this.nodeSelected.children || !this.nodeSelected.children.length) {
      // this condition is to see if there were no nodes under the selected item in the side bar.
      const nodeSelected = updatedSelectedNode.children.find((node: TreePill) => this.nodeSelected && node.id === this.nodeSelected.id);
      if (nodeSelected && nodeSelected.children) {
        // After getting updated value, if there are children available for the same node, set that node as selected node.
        this.store.dispatch(actions.NavBarActions.setNodeItems({ nodeType: nodeSelected.nodeType, id: nodeSelected.id }));
      } else {
        this.store.dispatch(actions.NavBarActions.setNodeItems({ nodeType: updatedSelectedNode.nodeType, id: updatedSelectedNode.id }));
        this.setSideBarList(updatedSelectedNode);
      }
    } else {
      if (updatedSelectedNode.isArchived) {
        this.store.dispatch(actions.NavBarActions.setNodeItems({ nodeType: updatedSelectedNode.nodeType, id: updatedSelectedNode.id }));
      }
      this.setSideBarList(updatedSelectedNode);
    }

    // update the current branch with archived and unarchived items on nav-side bar archive toggle
    this.store.dispatch(actions.NavBarActions.setCurrentBranchState({ currentBranchItem: updatedSelectedNode }));
  }

  public setSideBarList(updatedSelectedNode: TreePill) {
    const sideNavItems: TreePill[] = updatedSelectedNode.children || [];
    if (this.selectedNode.nodeType === EntityType.Panel) {
      this.sideBarList = this.navSideBarService.getSideBarItems(sideNavItems, true);
      this.archiveItemList = orderBy(this.sideBarList, [(item) => item.primaryText], [asc]);
      this.sortedSideBarArchiveList = this.archiveItemList.filter(item => item.node.isArchived);
      this.sortedSideBarList = cloneDeep(this.sideBarList);
      this.sortedSideBarList = this.sortedSideBarList.filter((element) => (!element.node.isArchived));
    } else {
      const sideBarList = this.navSideBarService.getSideBarItems(sideNavItems);
      this.archiveItemList = orderBy(sideBarList, [(item) => item.primaryText], [asc]);
      this.sortedSideBarArchiveList = this.archiveItemList.filter(item => item.node.isArchived);
      this.sideBarList = sideBarList.filter(item => item.node.nodeType !== EntityType.Panel && !item.node.isArchived);
      this.sortedSideBarList = cloneDeep(this.sideBarList);
      this.panelList = sideBarList.filter(item => item.node.nodeType === EntityType.Panel);
      this.sortedPanelList = cloneDeep(this.panelList);
    }
    this.disableAZ = this.checkIfCustomSorted(this.sideBarList, this.selectedNode.nodeType === EntityType.Panel);
    this.disablePanelAZ = this.panelList.length > 0 ? this.checkIfCustomSorted(this.panelList) : true;
  }

  private updateArchivedItemsState(usedArchive: boolean) {
    this.showArchivedItemsToggle = usedArchive;
    this.store.dispatch(actions.NavBarActions.setArchiveItemsToggle({ showArchivedItemsToggle: usedArchive }));
  }

  public toggleArchivedItems() {
    this.store.dispatch(actions.NavBarActions.toggleArchiveItems({ isArchiveItemsToggleOn: this.isArchiveItemsToggleOn }));
    this.getSideBarItemsIncludesArchived(this.selectedNode.nodeType, this.selectedNode.id, this.isArchiveItemsToggleOn, true);
    const queryParameter = new QueryParameter(includeArchivedItems, (this.isArchiveItemsToggleOn).toString());
    this.portalApiService.getLabSetupNode(EntityType.LabLocation, this.locationId,
      LevelLoadRequest.LoadUpToGrandchildren, EntityType.None, [queryParameter])
      .pipe(take(1))
      .subscribe((selectedNode: TreePill) => {
        // update location in the current branch with archived and unarchived items to be displayed in panels
        this.store.dispatch(actions.NavBarActions.setCurrentBranchState({ currentBranchItem: selectedNode }));
      });
  }

  toggleNavbar(): void {
    try {
      this.sideNav.opened ?
        this.store.dispatch(actions.NavBarActions.toggleNavigationbar({ isSideNavExpanded: false }))
        : this.store.dispatch(actions.NavBarActions.toggleNavigationbar({ isSideNavExpanded: true }));
    } catch (error) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, error.message,
          (componentInfo.NavSideBarComponent + blankSpace + Operations.ToggleNavBar)));
    }
  }

  setSelectedNode(selectedNode: TreePill, isManageControl?: boolean): void {
    if (selectedNode && this.hasPermissionToAccessWithNodeTypes(selectedNode?.nodeType)) {
      this.nodeSelected = selectedNode;
      this.store.dispatch(actions.NavBarActions.setNodeItems({ nodeType: selectedNode.nodeType, id: selectedNode.id, isManageControl }));
    }
  }

  isArray(obj: any) {
    return Array.isArray(obj);
  }

  gotoAddPanel() {
    try {
      const url = `/${unRouting.panels.panel}/${unRouting.panels.actions.add}`;
      this.navigationService.routeTo(url);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.NavSideBarComponent + blankSpace + Operations.GoToAddPanel)));
    }
  }

  toggleSortOptions() {
    this.showSortOpts = true;
    this.showPanel = false;
    this.disableAZ = this.checkIfCustomSorted(this.sideBarList, this.selectedNode.nodeType === EntityType.Panel);
    this.store.dispatch(actions.NavBarActions.setCustomSortMode({ isCustomSortMode: true }));
  }

  toggleSortOptionsPanels() {
    this.showSortOptsPanels = true;
    this.showSideBarItems = false;
  }

  drop(event: CdkDragDrop<{ title: string, poster: string }[]>, type?: string) {
    if (type && type === 'panel') {
      this.sortedPanelAZ = false;
      this.disablePanelAZ = false;
      this.disablePanelDone = false;
      this.custPanelSorted = true;
      moveItemInArray(this.sortedPanelList, event.previousIndex, event.currentIndex);
    } else {
      this.sortedAZ = false;
      this.disableAZ = false;
      this.disableDone = false;
      this.custSorted = true;
      moveItemInArray(this.sortedSideBarList, event.previousIndex, event.currentIndex);
    }
  }

  sortSideBarItems(sideBarItems: SideBarItem[]) {
    this.sortedAZ = true;
    this.disableAZ = true;
    sideBarItems.forEach(item => {
      item.sortOrder = 0;
    });
    this.sortedSideBarList = this.navSideBarService.sortSideBarItems(sideBarItems);
    this.sortedSideBarList = this.sortedSideBarList.filter((element) => (!element.node.isArchived));
    this.disableDone = false;
  }

  sortSideBarPanels(panelItems: SideBarItem[]) {
    this.sortedPanelAZ = true;
    this.disablePanelAZ = true;
    panelItems.forEach(item => {
      item.sortOrder = 0;
    });
    this.sortedPanelList = this.navSideBarService.sortSideBarItems(panelItems);
    this.disablePanelDone = false;
  }

  resetPanels(disablePanelDone: boolean) {
    if (disablePanelDone) {
      this.showSortOptsPanels = false;
      this.showSideBarItems = true;
    }
    this.disablePanelDone = true;
    this.disablePanelAZ = this.panelList.length > 0 ? this.checkIfCustomSorted(this.panelList) : true;
    this.sortedPanelList = cloneDeep(this.panelList);
  }

  resetSideBarItems(disableDone: boolean) {
    if (disableDone) {
      this.showSortOpts = false;
      if (this.selectedNode.nodeType === EntityType.LabLocation) {
        this.showPanel = true;
      }
      this.store.dispatch(actions.NavBarActions.setCustomSortMode({ isCustomSortMode: false }));
    }
    this.disableAZ = this.checkIfCustomSorted(this.sideBarList, this.selectedNode.nodeType === EntityType.Panel);
    this.disableDone = true;
    this.sortedSideBarList = cloneDeep(this.sideBarList.filter((element) => (!element.node.isArchived)));
  }

  resetReportingNav() {
    this.navigationService.SecondaryNavSelectedTabIndex.emit(0);
  }


  onSubmit(isPanelMDEmode = false) {
    this.sideBarList = cloneDeep(this.sortedSideBarList);
    if (isPanelMDEmode) {
      const newPanel = new Panel();
      newPanel.id = this.selectedNode.id;
      newPanel.name = this.selectedNode.displayName;
      newPanel.parentNodeId = this.selectedNode.parentNodeId;
      newPanel.panelItemIds = [];
      newPanel.panelItemIds.push(...this.sideBarList.map(item => item.entityId));
      if (this.sortedSideBarArchiveList?.length) {
        // Add all the archived items (if any) to the end of the sorted newPanel items array.
        newPanel.panelItemIds.push(...this.sortedSideBarArchiveList.map(item => item.entityId));
      }
      this.store.dispatch(panelActions.PanelActions.updatePanel({ panels: [newPanel] }));
    } else {
      this.sortEntityArray = [];
      this.sideBarList.forEach((item, index) => {
        if (this.sortedAZ) {
          this.navSideBarService.sortAction = autoSort;
          this.sortEntityArray.push(this.transformListToPayLoad(item, index + 1));
        } else if (this.custSorted) {
          this.navSideBarService.sortAction = customSort;
          this.sortEntityArray.push(this.transformListToPayLoad(item, index + 1));
        }
      });
      const updateSortOrderPayload: SortOrder = {
        parentNodeId: this.selectedNode.id,
        sortEntity: this.sortEntityArray,
        nodeType: this.selectedNode.nodeType
      };
      const childrenNodeType = this.selectedNode.children[0].nodeType;
      this.store.dispatch(actions.NavBarActions.updateSortOrder({ updatedSortOrder: updateSortOrderPayload, childrenNodeType }));
    }
    this.resetSideBarItems(true);
    this.resetReportingNav();
  }

  onSubmitPanel() {
    this.panelList = cloneDeep(this.sortedPanelList);
    this.sortEntityArray = [];
    this.panelList.forEach((item, index) => {
      if (this.sortedPanelAZ) {
        this.navSideBarService.sortAction = autoSort;
        this.sortEntityArray.push(this.transformListToPayLoad(item, index + 1));
      } else if (this.custPanelSorted) {
        this.navSideBarService.sortAction = customSort;
        this.sortEntityArray.push(this.transformListToPayLoad(item, index + 1));
      }
    });
    const childrenNodeType = EntityType.Panel;
    const updateSortOrderPayload: SortOrder = {
      parentNodeId: this.selectedNode.id,
      sortEntity: this.sortEntityArray,
      nodeType: this.selectedNode.nodeType
    };
    this.store.dispatch(actions.NavBarActions.updateSortOrder({ updatedSortOrder: updateSortOrderPayload, childrenNodeType }));
    this.resetPanels(true);
  }

  transformListToPayLoad(sideBarItem: SideBarItem, sortOrder?: number): SortEntity {
    const sortEntityObj = new SortEntity(sideBarItem.entityId, sortOrder);
    return sortEntityObj;
  }

  checkIfCustomSorted(arrayList: SideBarItem[], isPanel? : boolean) {
    if (!arrayList?.length) {
      return true;
    }
    if (isPanel) {
      return this.isPanelItemsSortedAlphabetically(arrayList);
    } else {
      const arrayListItems: SideBarItem[] = cloneDeep(arrayList);
      arrayListItems.forEach(item => {
        item.sortOrder = 0;
      });
      if (JSON.stringify(arrayListItems.map(nodeItem => nodeItem.primaryText)) ===
      JSON.stringify(this.navSideBarService.sortSideBarItems(arrayListItems).map(nodeItem => nodeItem.primaryText))) {
        return true;
      } else {
        return false;
      }
    }
  }

  isPanelItemsSortedAlphabetically(arrayList: SideBarItem[]): boolean {
    let isSorted = true;
    const sortedItems: SideBarItem[] = orderBy(arrayList, [
      (selectedItem: SideBarItem) => selectedItem.primaryText.replace(/\s/g, '').toLocaleLowerCase(),
      (selectedItem: SideBarItem) => selectedItem.secondaryText.replace(/\s/g, '').toLocaleLowerCase()
    ], [asc, asc]);
    for (let index = 0; index < sortedItems.length; index++) {
      if (sortedItems[index].entityId !== arrayList[index].entityId) {
        isSorted = false;
      }
    }
    return isSorted;
  }


  moveSlider(direction) {
    const pos =
      this.sliderDirection === 'down'
        ? (this.sliderLastLeft = this.sliderLastLeft + 36)
        : (this.sliderLastLeft = this.sliderLastLeft - 36);
    this.verticalScroll.directiveRef.scrollToY(pos);
  }

  drag(event: CdkDragDrop<{ title: string, poster: string }[]>, type?: string) {
    this.sliderDirection = (event.previousIndex > event.currentIndex) ? 'up' : 'down';
    if (event.currentIndex > 8) {
      this.moveSlider('down');
    }
    if (event.currentIndex < 5) {
      this.verticalScroll.directiveRef.scrollToY(0);
      // this.moveSlider('up');
    }
  }

  isOnlyLabUserManagerRole(currentUserState): boolean {
    const roles = currentUserState.roles;
    return (roles && roles.length === 1 && roles[0] === UserRole.LabUserManager) ? true : false;
  }

  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  hasPermissionToAccessWithNodeTypes(nodeType: EntityType): boolean {
    switch (nodeType) {
      case EntityType.LabLocation: return this.instGroupedByDept ? this.brPermissionsService.hasAccess(DepartmentAccessPermissions)
        : this.brPermissionsService.hasAccess(InstrumentAccessPermissions);
      case EntityType.LabDepartment: return this.brPermissionsService.hasAccess(DepartmentAccessPermissions);
      case EntityType.LabInstrument: return this.brPermissionsService.hasAccess(InstrumentAccessPermissions);
      case EntityType.LabProduct: return this.brPermissionsService.hasAccess(ControlAccessPermissions);
      case EntityType.LabTest: return this.brPermissionsService.hasAccess(AnalyteAccessPermissions);
      case EntityType.Panel: return this.brPermissionsService.hasAccess(PanelsAccessPermissions);
      default:
        return false;
    }
  }

  hasAddPermissionToAccess(nodeType: EntityType): boolean {
    switch (nodeType) {
      case EntityType.LabLocation: return this.instGroupedByDept ?
        this.brPermissionsService.hasAccess([Permissions.DepartmentAdd, Permissions.DepartmentAddViewOnly])
        : this.brPermissionsService.hasAccess([Permissions.InstrumentAdd, Permissions.InstrumentAddViewOnly]);
      case EntityType.LabDepartment:
        return this.brPermissionsService.hasAccess([Permissions.InstrumentAdd, Permissions.InstrumentAddViewOnly]);
      case EntityType.LabInstrument:
        return this.brPermissionsService.hasAccess([Permissions.ControlAdd, Permissions.ControlAddViewOnly]);
      case EntityType.LabProduct: return this.brPermissionsService.hasAccess([Permissions.AnalyteAdd, Permissions.AnalyteAddViewOnly]);
      default:
        return false;
    }
  }

  canSortPanels(): boolean {
    if (this.sortedPanelList && this.sortedPanelList.length > 0) {
      return this.hasPermissionToAccess([Permissions.PanelsEdit]);
    } else {
      return false;
    }
  }

  canSortSideBar(): boolean {
    if (this.sortedSideBarList && this.sortedSideBarList.length > 0) {
      const sideBarItem = this.sortedSideBarList[0];
      let permissionsForSortByNodeType: Permissions[] = [];
      switch (sideBarItem.node.nodeType) {
        case EntityType.LabDepartment:
          permissionsForSortByNodeType = [Permissions.DepartmentEdit];
          break;
        case EntityType.LabInstrument:
          permissionsForSortByNodeType = [Permissions.InstrumentEdit];
          break;
        case EntityType.LabProduct:
          permissionsForSortByNodeType = [Permissions.ControlEdit];
          break;
        case EntityType.LabTest:
          permissionsForSortByNodeType = [Permissions.AnalyteEdit];
          break;
      }
      return this.hasPermissionToAccess(permissionsForSortByNodeType);
    } else {
      return false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.appNavigationService.subject.next(false);
  }
}
