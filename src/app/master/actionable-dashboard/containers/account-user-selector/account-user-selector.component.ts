// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { MatMenuTrigger } from '@angular/material/menu';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

import { Subject, combineLatest } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { orderBy, cloneDeep } from 'lodash';
import { filter, takeUntil } from 'rxjs/operators';
import * as ngrxStore from '@ngrx/store';
import * as ngrxSelector from '@ngrx/store';

import * as fromRoot from '../../../../state/app.state';
import * as fromAuth from '../../../../shared/state/selectors';
import * as sharedStateSelector from '../../../../shared/state/selectors';
import * as fromSecuritySelector from '../../../../security/state/selectors';

import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { AuthenticationService } from '../../../../security/services/authentication.service';
import { asc } from '../../../../core/config/constants/general.const';
import { Lab } from '../../../../contracts/models/lab-setup/lab.model';
import { Icon } from '../../../../contracts/models/shared/icon.model';
import { icons } from '../../../../core/config/constants/icon.const';
import { AppUser } from '../../../../security/model';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { AuthState } from '../../../../shared/state/reducers/auth.reducer';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { AuthActions } from '../../../../shared/state/actions';
import { LabLocation } from '../../../../contracts/models/lab-setup';
import { NavBarActions } from '../../../../state/actions';
import { SecurityActions } from '../../../../security/state/actions';
import { LocationState, GroupNode } from '../../../../contracts/models/lab-setup/multi-location.model';
import { blankSpace, componentInfo, Operations } from '../../../../core/config/constants/error-logging.const';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { AuditTrackingAction, AuditTrackingActionStatus, AuditTrail, AuditTrailPriorCurrentValues } from '../../../../shared/models/audit-tracking.model';

@Component({
  selector: 'unext-account-user-selector',
  templateUrl: './account-user-selector.component.html',
  styleUrls: ['./account-user-selector.component.scss']
})

export class AccountUserSelectorComponent implements OnInit, OnDestroy {
  @Output() locationChanged: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('groupMenuTrigger') groupMenuTrigger: MatMenuTrigger;
  @Input('parentToChild') resultFromParent: boolean;

  treeControl = new NestedTreeControl<GroupNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<GroupNode>();
  hasChild = (_: number, node: GroupNode) => !!node.children && node.children.length > 0;

  userLab: Lab[];
  firstName: string;
  currentUser: AppUser = null;
  userRole: string[];
  isLotViewer = false;
  labLocation: LabLocation;
  groupName: string;
  selectedLocationName: string;
  locationState: LocationState;
  userLocationId: string;
  parentNodeId: string;
  assignedGroups: Array<Lab>;
  selectedLocation: LabLocation;
  viewAccountSelector = true;
  disableProceed = true;
  public labLocationList: Array<LabLocation>;

  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.close[24],
  ];

  private destroy$ = new Subject<boolean>();
  public getSecurityState$ = this.store.pipe(select(fromSecuritySelector.getSecurityState));
  public getCurrentLabLocation$ = this.store.pipe(select(sharedStateSelector.getCurrentLabLocation));

  constructor(
    public authService: AuthenticationService,
    public changeDetectionRef: ChangeDetectorRef,
    private errorLoggerService: ErrorLoggerService,
    private store: Store<fromRoot.State>,
    private navigationService: NavigationService,
    private appNavigationService: AppNavigationTrackingService) {
  }

  ngOnInit() {
    combineLatest([this.getCurrentLabLocation$, this.store.pipe(ngrxSelector.select(fromAuth.getAuthState))])
      .pipe(filter(([labLocation, authState]) => !!labLocation && !!authState?.directory || !!authState?.currentUser?.roles),
        takeUntil(this.destroy$)
      )
      .subscribe(([labLocation, authState]) => {
        try {
          this.setSelectedLocationData(labLocation);
          if (authState.directory) {
            this.userLab = authState.directory.children.filter(c => c.nodeType === EntityType.Lab);
            // Filter groups with no location.
            this.userLab = this.userLab.filter(c => c.children && c.children.length >= 1);
          }
          if (authState.currentUser) {
            this.firstName = authState.currentUser.firstName;
          }
        } catch (error) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, error.message,
              (componentInfo.NavBarTopComponent + blankSpace + Operations.FetchAuthState)));
        }
      });
  }

  navigateToDashboard() {
    this.navigationService.navigateToDashboard(this.userLocationId);
  }

  onLocationChanged(locationId: string): void {
    this.userLocationId = locationId;
    this.navigateToDashboard();
  }

  public transformGroupsToGroupNode(): GroupNode[] {
    return this.assignedGroups.map(ele => {
      return {
        displayName: ele.labName,
        children: this.sortLocationNames(ele.children)
      } as GroupNode;
    });
  }

  public sortGroupNames() {
    const sortedGroupsList = orderBy(this.assignedGroups, [el => el.labName.replace(/\s/g, '')
      .toLocaleLowerCase()], [asc]);

    const itemToFind = sortedGroupsList.find(el => el.id === this.parentNodeId);
    if (itemToFind) {
      const foundIdx = sortedGroupsList.findIndex(el => el.id === itemToFind.id);
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

  async proceedLogged() {
    let [changeLocationCurrentValue, changeLocationPriorValue] = [this.getChangeLocationValue(), {}];
    const currentValueSnapshot = { ...changeLocationCurrentValue };
    const logoutAuditTrail = this.getChangeLocationAuditTrail(AuditTrackingAction.Logout, changeLocationCurrentValue, changeLocationPriorValue);
    await this.appNavigationService.logChangeLocation(logoutAuditTrail);
    await this.proceed();
    [changeLocationCurrentValue, changeLocationPriorValue] = [this.getChangeLocationValue(), currentValueSnapshot];
    const loginAuditTrail = this.getChangeLocationAuditTrail(AuditTrackingAction.Login, changeLocationCurrentValue, changeLocationPriorValue);
    await this.appNavigationService.logChangeLocation(loginAuditTrail);
  }

  private getChangeLocationValue(): AuditTrailPriorCurrentValues {
    return {
      group_id: this.parentNodeId,
      groupName: this.groupName,
      location_id: this.userLocationId,
      locationName: this.selectedLocationName
    }
  }

  private getChangeLocationAuditTrail(action: AuditTrackingAction, currentValue: AuditTrailPriorCurrentValues, priorValue: AuditTrailPriorCurrentValues): AuditTrail {
    return {
      eventType: AuditTrackingAction.ChangeLocation,
      action,
      actionStatus: AuditTrackingActionStatus.Success,
      runDateTime: new Date(),
      hierarchy: this.appNavigationService.getHierarchyTree(),
      priorValue,
      currentValue
    }
  }

  async proceed() {
    this.viewAccountSelector = false;
    this.resultFromParent = true;
    this.setSelectedLocationData(this.selectedLocation);
    this.updateLocationInStore(this.selectedLocation);
    this.locationChanged.emit(this.selectedLocation.id);
    if (this.locationState === LocationState.MultiLocation) {
      this.labLocationList = this.sortLocationNames(this.labLocationList);
    } else if (this.locationState === LocationState.MultiGroup) {
      this.assignedGroups = this.sortGroupNames();
      this.dataSource.data = this.transformGroupsToGroupNode();
      this.groupMenuTrigger?.closeMenu();
    }
    this.store.dispatch(NavBarActions.toggleAccountUserSelector({ isAccountUserSelectorOn: false }));
  }

  setNode(location: LabLocation) {
    this.selectedLocation = location;
    this.disableProceed = false;
  }

  public setSelectedLocationData(labLocation: LabLocation) {
    this.selectedLocationName = labLocation?.labLocationName;
    this.userLocationId = labLocation?.id;
    this.groupName = labLocation?.groupName;
    this.parentNodeId = labLocation?.parentNodeId;
  }

  updateLocationInStore(selectedLocation: LabLocation): void {
    // Update selected location id in auth state
    this.store.pipe(ngrxStore.select(fromAuth.getAuthState))
      .pipe(filter(lab => !!lab), takeUntil(this.destroy$))
      .subscribe((authState: AuthState) => {
        if (authState) {
          const _authState: AuthState = cloneDeep(authState);
          _authState.currentUser.labLocationId = selectedLocation.id;
          this.store.dispatch(AuthActions.UserAuthenticationUpdate({ payload: _authState }));
          this.store.dispatch(SecurityActions.UserAuthenticationUpdate({ payload: _authState }));
        }
      });

    // Turn off archive item toggle after switching to new location
    this.store.dispatch(NavBarActions.toggleArchiveItems({ isArchiveItemsToggleOn: false }));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
