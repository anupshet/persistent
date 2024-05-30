// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import * as ngrxStore from '@ngrx/store';
import { orderBy, cloneDeep } from 'lodash';

import { LabLocation } from '../../../../contracts/models/lab-setup/lab-location.model';
import { Icon } from '../../../../contracts/models/shared/icon.model';
import { icons } from '../../../../core/config/constants/icon.const';
import { IconService } from '../../../icons/icons.service';
import { asc } from '../../../../core/config/constants/general.const';
import { AuthActions } from '../../../../shared/state/actions';
import * as sharedStateSelector from '../../../../shared/state/selectors';
import * as fromAuth from '../../../../shared/state/selectors';
import { LocationState, GroupNode } from '../../../../contracts/models/lab-setup/multi-location.model';
import { SecurityActions } from '../../../../security/state/actions';
import { AuthState } from '../../../../shared/state/reducers/auth.reducer';
import { Lab } from '../../../../contracts/models/lab-setup/lab.model';
import { NavBarActions } from '../../state/actions';
import { Permissions } from '../../../../security/model/permissions.model';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { UserRole } from '../../../../contracts/enums/user-role.enum';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { NavigationService } from '../../navigation.service';
import { unRouting } from '../../../../core/config/constants/un-routing-methods.const';
import { AppNavigationTracking, AuditTrackingAction, AuditTrackingActionStatus, AuditTrail, AuditTrailPriorCurrentValues } from '../../../../../app/shared/models/audit-tracking.model';
import { AppNavigationTrackingService } from '../../../../../app/shared/services/appNavigationTracking/app-navigation-tracking.service';
import { LabTree } from '../../../../contracts/models/lab-setup/lab-tree.model';
import { ConfirmNavigateGuard } from '../../../../master/reporting/shared/guard/confirm-navigate.guard';

@Component({
  selector: 'unext-nav-bar-lab',
  templateUrl: './nav-bar-lab.component.html',
  styleUrls: ['./nav-bar-lab.component.scss']
})
export class NavBarLabComponent implements OnInit, OnDestroy {
  @Input() userLab: Lab[];
  @Output() locationChanged: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('groupMenuTrigger') groupMenuTrigger: MatMenuTrigger;

  treeControl = new NestedTreeControl<GroupNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<GroupNode>();
  hasChild = (_: number, node: GroupNode) => !!node.children && node.children.length > 0;
  protected userId: string;
  navIconName: string;
  public labLocationList: Array<LabLocation>;
  groupName: string;
  selectedLocationName: string;
  locationState: LocationState;
  userLocationId: string;
  parentNodeId: string;
  assignedGroups: Array<Lab>;
  labLocationIds: Array<string>;
  hasOnlyAUMrole = false;
  hasAUMrole = false;
  hasMultipleLocations = false;
  hasAUMmultipleLocations = false;
  permissions = Permissions;
  hasNoLabLocationPermission: boolean;
  showCTSUserLaunchLabAccountLocationSelector = false;
  hasSingleLocation: boolean;
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.addCircleOutline[24],
    icons.buildingWithArrow[24],
    icons.buildingWithoutArrow[24],
  ];

  public destroy$ = new Subject<boolean>();
  public getCurrentLabLocation$ = this.store.pipe(select(sharedStateSelector.getCurrentLabLocation));
  public labLocationId: string;
  public locationName: string;

  constructor(private store: Store<any>,
    private iconService: IconService,
    private navigationService: NavigationService,
    private router: Router,
    private brPermissionsService: BrPermissionsService,
    private confirmNavigate: ConfirmNavigateGuard,
    private _appNavigationService: AppNavigationTrackingService) {
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit() {
    this.getCurrentLabLocation$.pipe(filter(labLocation => !!labLocation),
      takeUntil(this.destroy$)).subscribe(labLocation => {
        this.showCTSUserLaunchLabAccountLocationSelector = true;
        this.labLocationId = labLocation.id;
        this.locationName = labLocation.labLocationName;
        this.parentNodeId = labLocation.parentNodeId;
        if (labLocation) {
          this.setSelectedLocationData(labLocation);
        }
      });

    this.store.pipe(ngrxStore.select(fromAuth.getAuthState))
      .pipe(filter(authState => !!(authState && authState.isLoggedIn && authState.currentUser)), takeUntil(this.destroy$))
      .subscribe((authState: AuthState) => {
        if (authState && authState.isLoggedIn) {
          this.labLocationIds = authState.currentUser.labLocationIds;
          // When AUM with multiple locations will show the first time when logged in location panel
          this.hasAUMmultipleLocations = (this.labLocationIds?.length > 1) ? true : false;
          this.hasOnlyAUMrole =
            (authState.currentUser?.roles?.length === 1 && authState.currentUser?.roles[0] === UserRole.AccountUserManager) ? true : false;
          this.hasAUMrole = (authState.currentUser?.roles?.includes(UserRole.AccountUserManager)) ? true : false;
          if (this.hasAUMmultipleLocations && this.hasOnlyAUMrole) {
            this.store.dispatch(NavBarActions.toggleAccountUserSelector({ isAccountUserSelectorOn: true }));
          }
          // If AUM with single location, populate redux
          if (this.hasOnlyAUMrole && !this.hasAUMmultipleLocations && authState.directory) {
            const lab = authState.directory.children.filter(c => c.nodeType === EntityType.Lab);
            if (lab) {
              // detectChanges() doesn't work
              setTimeout(() => {
                this.onNodeSelect(lab[0].children[0]);
              }, 100);
            }
          }

          // Only below roles can see 'lab change' button
          const roles = authState.currentUser.roles;
          const rolesArr = [];
          if (roles && roles.length > 1) {
            roles.forEach(role => {
              if (role === UserRole.LabUserManager
                || role === UserRole.LabSupervisor || role === UserRole.LeadTechnician || role === UserRole.Technician) {
                rolesArr.push(true);
              } else {
                rolesArr.push(false);
              }
            });
            this.hasNoLabLocationPermission = rolesArr.includes(false);
          }
        }
        if (authState && authState.directory && this.hasPermissionToAccess([this.permissions.LaunchLocation])) {
          this.displayLocationForCTSUser(authState.directory);
        }
      });

    this.assignedGroups = this.userLab?.filter(el => (el.children && el.children.length >= 1));
    this.filterGroupsAndLocations();
  }

  public displayLocationForCTSUser(labTree: LabTree) {
    let lab = labTree?.children.filter(c => c.nodeType === EntityType.Lab);
    lab = lab?.filter(el => (el.children && el.children.length >= 1));
    // UN-14999- If CTSUser has launch the lab and has only one location , do not display change location.
    this.hasSingleLocation = (lab?.length && lab[0].children?.length === 1) ? true : false;
    this.navIconName = this.hasSingleLocation ? this.iconsUsed[2].name : this.iconsUsed[1].name;
    if (this.hasPermissionToAccess([this.permissions.LaunchLocation])
      && this.showCTSUserLaunchLabAccountLocationSelector && this.hasSingleLocation) {
      if (lab?.length && lab[0].children?.length === 1) {
        this.store.dispatch(NavBarActions.toggleAccountUserSelector({ isAccountUserSelectorOn: false }));
        this.onNodeSelect(lab[0].children[0]);
      }
    }
  }

  public setSelectedLocationData(labLocation: LabLocation) {
    this.selectedLocationName = labLocation?.labLocationName;
    this.userLocationId = labLocation?.id;
    this.groupName = labLocation?.groupName;
    this.parentNodeId = labLocation?.parentNodeId;
  }

  public filterGroupsAndLocations() {
    if (this.assignedGroups) {
      if (this.assignedGroups.length === 1) {
        // single group single location
        if (this.assignedGroups[0].children.length === 1) {
          this.locationState = LocationState.SingleLocation;
          this.navIconName = this.iconsUsed[2].name;
        } else if (this.assignedGroups[0].children.length > 1) { // single group multiple locations
          this.locationState = LocationState.MultiLocation;
          this.navIconName = this.iconsUsed[1].name;
          this.labLocationList = this.assignedGroups[0].children;
          this.labLocationList = this.sortLocationNames(this.labLocationList);
        }
      } else if (this.assignedGroups.length > 1) { // multiple groups
        this.locationState = LocationState.MultiGroup;
        this.navIconName = this.iconsUsed[1].name;

        this.assignedGroups = this.sortGroupNames();

        const treeGroupNode: GroupNode[] = this.transformGroupsToGroupNode();
        this.dataSource.data = treeGroupNode;
      }
    }
  }

  public transformGroupsToGroupNode(): GroupNode[] {
    return this.assignedGroups.map(ele => {
      return {
        displayName: ele.labName,
        children: this.sortLocationNames(ele.children)
      } as GroupNode;
    });
  }

  // set selected location and group as 1st item on the list and rest of the groups and locations in alphabetical order
  public sortGroupNames() {
    const sortedGroupsList = orderBy(this.assignedGroups, [el => el.labName.replace(/\s/g, '')
      .toLocaleLowerCase()], [asc]);

    const itemToFind = sortedGroupsList?.find(el => el.id === this.parentNodeId);
    if (itemToFind) {
      const foundIdx = sortedGroupsList?.findIndex(el => el.id === itemToFind.id);
      sortedGroupsList.splice(foundIdx, 1);
      sortedGroupsList.unshift(itemToFind);
    }
    return sortedGroupsList;
  }

  public sortLocationNames(locationList: LabLocation[]): Array<LabLocation> {
    const sortedLocationList = orderBy(locationList, [el => el.labLocationName.replace(/\s/g, '')
      .toLocaleLowerCase()], [asc]);

    const itemToFind = sortedLocationList?.find(el => el.id === this.userLocationId);
    if (itemToFind) {
      const foundIdx = sortedLocationList?.findIndex(el => el.id === itemToFind.id);
      sortedLocationList.splice(foundIdx, 1);
      sortedLocationList.unshift(itemToFind);
    }
    return sortedLocationList;
  }

  public groupMenuOpened() {
    const index = this.dataSource.data?.findIndex(el => el.displayName === this.groupName);
    this.treeControl.expand(this.dataSource.data[index]);
  }

  public groupMenuClosed() {
    this.treeControl.collapseAll();
  }

  public collapseGroupNode(node: GroupNode) {
    const isExpanded = this.treeControl.isExpanded(node);
    if (isExpanded) {
      this.treeControl.collapseAll();
      this.treeControl.expand(node);
    }
  }

  async onNodeSelect(selectedLocation: LabLocation) {
    let [changeLocationCurrentValue, changeLocationPriorValue] = [
      this.getChangeLocationValue(this.labLocationId, this.locationName), {}
    ];
    const currentValueSnapshot = { ...changeLocationCurrentValue };
    const logoutAuditTrail = this.getChangeLocationAuditTrail(AuditTrackingAction.Logout,
      changeLocationCurrentValue, changeLocationPriorValue);
    await this._appNavigationService.logChangeLocation(logoutAuditTrail);
    this.setSelectedLocationData(selectedLocation);
    this.updateLocationInStore(selectedLocation);
    this.locationChanged.emit(selectedLocation.id);
    if (this.locationState === LocationState.MultiLocation) {
      this.labLocationList = this.sortLocationNames(this.labLocationList);
    } else if (this.locationState === LocationState.MultiGroup) {
      this.assignedGroups = this.sortGroupNames();
      this.dataSource.data = this.transformGroupsToGroupNode();
      this.groupMenuTrigger?.closeMenu();
    }
    [changeLocationCurrentValue, changeLocationPriorValue] = [
      this.getChangeLocationValue(this.userLocationId, this.selectedLocationName), currentValueSnapshot
    ];
    const loginAuditTrail = this.getChangeLocationAuditTrail(AuditTrackingAction.Login,
      changeLocationCurrentValue, changeLocationPriorValue);
    await this._appNavigationService.logChangeLocation(loginAuditTrail);
  }

  updateLocationInStore(selectedLocation: LabLocation): void {
    // Update selected location id in auth state
    this.store.pipe(ngrxStore.select(fromAuth.getAuthState))
      .pipe(filter(lab => !!lab), takeUntil(this.destroy$))
      .subscribe((authState: AuthState) => {
        if (authState) {
          this.userId = authState.currentUser.userOktaId;
          const _authState: AuthState = cloneDeep(authState);
          _authState.currentUser.labLocationId = selectedLocation.id;
          this.store.dispatch(AuthActions.UserAuthenticationUpdate({ payload: _authState }));
          this.store.dispatch(SecurityActions.UserAuthenticationUpdate({ payload: _authState }));
        }
      });

    // Turn off archive item toggle after switching to new location
    this.store.dispatch(NavBarActions.toggleArchiveItems({ isArchiveItemsToggleOn: false }));
  }

  private getChangeLocationValue(locationId: string, locationName: string): AuditTrailPriorCurrentValues {
    return {
      group_id: this.parentNodeId,
      groupName: this.groupName,
      location_id: locationId,
      locationName: locationName
    };
  }

  /*
  * The method constructs Change Location AuditTrail json from current and prior audit trail values for one of
  * two possible actions specific to Change Location: login and logout. Audit trail hierarchy property is
  * initialized with the call to navigation service's getHierarchyTree().
  */
  private getChangeLocationAuditTrail(action: AuditTrackingAction, currentValue: AuditTrailPriorCurrentValues,
    priorValue: AuditTrailPriorCurrentValues): AuditTrail {
    return {
      eventType: AuditTrackingAction.ChangeLocation,
      action,
      actionStatus: AuditTrackingActionStatus.Success,
      runDateTime: new Date(),
      hierarchy: this._appNavigationService.getHierarchyTree(),
      priorValue,
      currentValue
    };
  }

  // Display change location banner on dashboard.
  async navigateAccountUserSelector() {
    if (this.router.url.includes(unRouting.reports)) {
      const result = await this.confirmNavigate.confirmationModal();
      if (!result) {
        return;
      }
    }
    this.store.dispatch(NavBarActions.toggleAccountUserSelector({ isAccountUserSelectorOn: true }));
    if (!this.router?.url.includes(unRouting.actionableDashboard)) {
      this.navigationService.navigateToDashboard(this.userLocationId);
    }
  }

  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
