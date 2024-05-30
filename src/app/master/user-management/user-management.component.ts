// © 2023 Bio-Rad Laboratories, Inc.All Rights Reserved.
import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { take, filter, takeUntil } from 'rxjs/operators';
import { Sort } from '@angular/material/sort';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { PaginationInstance } from 'ngx-pagination';
import { TranslateService } from '@ngx-translate/core';

import { orderBy, isEqual } from 'lodash';

import { User, UserSearchRequest, UMUser, AddEditUserRequest, UserPage } from '../../contracts/models/user-management/user.model';
import { DisplayedColumnsUser, UsersField, UserRole, BioRadUserRoles } from '../../contracts/enums/user-role.enum';
import * as fromRoot from '../../state/app.state';
import * as fromSecuritySelector from '../../security/state/selectors';
import * as sharedStateSelector from '../../shared/state/selectors';
import * as userManagementActions from './state/actions';
import * as fromUserState from './state';
import { Icon } from '../../contracts/models/shared/icon.model';
import { icons } from '../../core/config/constants/icon.const';
import { IconService } from '../../shared/icons/icons.service';
import { ErrorLoggerService } from '../../shared/services/errorLogger/error-logger.service';
import { componentInfo, blankSpace, Operations } from '../../core/config/constants/error-logging.const';
import { ErrorType } from '../../contracts/enums/error-type.enum';
import { UserManagementService } from '../../shared/services/user-management.service';
import { LabLocation, TreePill } from '../../contracts/models/lab-setup';
import { GroupFlatNode } from '../../contracts/models/lab-setup/multi-location.model';
import { asc, leadTechnologist, pageItemsDisplay, paginationUsers, paginationUsersPerPage, technologist } from '../../core/config/constants/general.const';
import { PortalApiService } from '../../shared/api/portalApi.service';
import { AppUser } from '../../security/model';
import { EntityType } from '../../contracts/enums/entity-type.enum';
import { MessageSnackBarService } from '../../core/helpers/message-snack-bar/message-snack-bar.service';
import { ValidatorsService } from '../../shared/services/validators/validators.service';
import { ConfirmDialogDeleteComponent } from '../../shared/components/confirm-dialog-delete/confirm-dialog-delete.component';
import { BrPermissionsService } from '../../security/services/permissions.service';
import { Permissions } from '../../security/model/permissions.model';
import { ErrorsInterceptor } from '../../contracts/enums/http-errors.enum';
import { AppNavigationTrackingService } from '../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { AppNavigationTracking, AuditTrackingAction, AuditTrackingActionStatus, AuditTrackingEvent } from '../../shared/models/audit-tracking.model';

@Component({
  selector: 'unext-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit, OnDestroy {
  @ViewChild(PerfectScrollbarComponent) userComponentRef?: PerfectScrollbarComponent;

  userData: Array<UMUser> = [];
  currentSearchKey = '';
  isAddUserDisabled = false;
  isAUMSelected = false;
  isLUMSelected = false;
  isSingleGroupError = false;
  userSearchRequest = new UserSearchRequest();
  userAddEditRequest = new AddEditUserRequest();
  public dataSource: MatTableDataSource<User>;
  public searchInput: string;
  userForm: FormGroup;
  showSaveWarning = false;
  isSuccess = false;
  existingFormValue: any;
  resetData: Array<User> = [];
  currentRoles: Array<string> = [];
  sortInfo: Sort;
  currentLocation: LabLocation;
  editIndex: number;
  userDefaultLocation: string;
  locationOptions: Array<String> = [];
  existingLocationValue: Array<GroupFlatNode>;
  selectedLocations: Array<Object>;
  currentUserData: AppUser;
  assignedGroups: Array<TreePill>;
  defaultLocationNode: GroupFlatNode = null;
  locationDataSource: MatTreeFlatDataSource<TreePill, GroupFlatNode>;
  treeControl: FlatTreeControl<GroupFlatNode>;
  treeFlattener: MatTreeFlattener<TreePill, GroupFlatNode>;
  // The selection for checklist
  checklistSelection = new SelectionModel<GroupFlatNode>(true /* multiple */);
  allLocationChecklistSelection = new SelectionModel<GroupFlatNode>(true /* multiple */);
  // Map from flat node to nested node. This helps us finding the nested node to be modified
  flatNodeMap = new Map<GroupFlatNode, TreePill>();
  // Map from nested node to flattened node. This helps us to keep the same object for selection
  nestedNodeMap = new Map<TreePill, GroupFlatNode>();
  userColumns: string[] = [
    DisplayedColumnsUser.UserName,
    DisplayedColumnsUser.UserEmail,
    DisplayedColumnsUser.UserRole,
    DisplayedColumnsUser.UserLocation,
  ];
  userFields = UsersField;
  isAddUser = false;
  isEditUser = false;
  selectedCategory = 0;
  totalPages = 0;
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.close[24],
    icons.addCircleOutline[24],
    icons.search[24],
    icons.delete[24],
    icons.sortActive[24],
    icons.refreshBlue[24],
    icons.refreshBlueDisabled[24],
    icons.arrowBack[48]
  ];
  permissions = Permissions;

  readonly countLUM = 4;
  readonly countAUM = 5;
  readonly maxSize = pageItemsDisplay;
  paginationConfig: PaginationInstance = {
    id: paginationUsers,
    itemsPerPage: paginationUsersPerPage,
    currentPage: 1,
    totalItems: 1,
  };

  rolesOptions = [
    { id: 1, roleName: this.getRoleName(UserRole.Technician), rolesType: UserRole.Technician, isDisabled: false },
    { id: 2, roleName: this.getRoleName(UserRole.LeadTechnician), rolesType: UserRole.LeadTechnician, isDisabled: false },
    { id: 3, roleName: this.getRoleName(UserRole.LabSupervisor), rolesType: UserRole.LabSupervisor, isDisabled: false },
    { id: 4, roleName: this.getRoleName(UserRole.LabUserManager), rolesType: UserRole.LabUserManager, isDisabled: false },
    { id: 5, roleName: this.getRoleName(UserRole.AccountUserManager), rolesType: UserRole.AccountUserManager, isDisabled: false },
  ];

  protected destroy$ = new Subject<boolean>();

  public getCurrentUserState$ = this.store.pipe(select(fromSecuritySelector.getCurrentUser));
  public getLocation$ = this.store.pipe(select(sharedStateSelector.getCurrentLabLocation));
  public hasUserCountExceeds = false;
  public isViewOnly = true;
  priorLocationForAT;

  @HostListener('window:keyup.esc') onKeyUp() {
    this.close();
  }

  constructor(
    private userManagementService: UserManagementService,
    private store: Store<fromRoot.State>,
    private storeUser: Store<fromUserState.UsersState>,
    private iconService: IconService,
    private errorLoggerService: ErrorLoggerService,
    private dialogRef: MatDialogRef<UserManagementComponent>,
    private portalApiService: PortalApiService,
    private messageSnackBar: MessageSnackBarService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private brPermissionsService: BrPermissionsService,
    private appNavigationService: AppNavigationTrackingService,
    public translate: TranslateService
  ) {
    this.iconService.addIcons(this.iconsUsed);
  }

  loadLocationDropdownOptions() {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );
    this.treeControl = new FlatTreeControl<GroupFlatNode>(this.getLevel, this.isExpandable);
    this.locationDataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.filterGroupsAndLocations();
  }

  ngOnInit() {
    this.logAuditTracking({} as AddEditUserRequest, AuditTrackingAction.View, AuditTrackingActionStatus.Success);
    this.createUserForm();
    this.fetchCurrentUser();
    this.portalApiService.searchLabSetupNode(User, this.currentUserData.userOktaId, false)
      .pipe(filter(currentUser => !!currentUser), takeUntil(this.destroy$))
      .subscribe(userState => {
        this.currentRoles = userState[0].userRoles;
        if (userState[0].parentAccounts) {
          userState[0].parentAccounts.map(data => {
            this.assignedGroups = data?.children;
          });
        }
        this.intiateUserList();
      });
    this.dialogRef.backdropClick()
      .pipe(takeUntil(this.destroy$))
      .subscribe((e) => {
        this.close();
      });

    this.isViewOnly = this.hasPermissionToAccess([Permissions.UserEditViewOnly]);
  }

  intiateUserList() {
    this.sortInfo = { active: this.userColumns[0], direction: 'asc' };
    this.userSearchRequest.searchString = '';
    this.userSearchRequest.searchColumn = UsersField.Name;
    this.userSearchRequest.sortColumn = UsersField.Name;
    this.userSearchRequest.sortDescending = false;
    this.userSearchRequest.pageIndex = 0;
    this.userSearchRequest.pageSize = this.paginationConfig.itemsPerPage;

    // Fetch current location
    this.getLocation$.pipe(filter(labLocation => !!labLocation),
      take(1)).subscribe(labLocation => {
        if (labLocation) {
          this.currentLocation = labLocation;
          this.userSearchRequest.locationId = labLocation.id;
          this.loadUserList(this.userSearchRequest);
        }
      });
  }

  /* Load the User List and map the pagination configuration */
  loadUserList(userSearchRequest: UserSearchRequest) {
    const pageNumber = userSearchRequest.pageIndex ? userSearchRequest.pageIndex : 0;
    userSearchRequest.pageIndex = pageNumber;
    this.userData = null;
    this.dataSource = null;
    this.userManagementService.searchUsers<UserPage>(userSearchRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe(userData => {
        this.userData = Object.assign<Array<User>, any>([], userData.users);
        this.userData = this.userData.map((item) =>
          Object.assign({}, item, {
            isEditable: false,
            disableAccountUserManager: (!this.currentRoles.includes(UserRole.AccountUserManager)
              && item?.userRoles.includes(UserRole.AccountUserManager) && !this.currentRoles.includes(BioRadUserRoles.CTSUser)),
            userRoles: item?.userRoles.map(role => {
              return this.getRoleName(role);
            })
          })
        );
        this.paginationConfig.itemsPerPage = userData.pageSize;
        this.totalPages = userData.totalPages;
        this.paginationConfig.totalItems = userData.totalItems;
        this.dataSource = new MatTableDataSource(this.userData);
        this.resetData = JSON.parse(JSON.stringify(this.userData));
        this.hasUserCountExceeds = this.currentLocation.licenseNumberUsers <= userData.locationUserCount;
      }, error => {
        this.userData = [];
        if (error.error && error.error.status === 'error') {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
              (componentInfo.UserManagementComponent + blankSpace + Operations.UserSearch)));
        }
        this.messageSnackBar.showMessageSnackBar(this.getLoadUsersErrorMessage());
      });
  }

  private getRoleName(role: string): string {
    switch (role) {
      case UserRole.Technician:
        return this.getTranslations('USERMANAGEMENT.TECHNOLOGIST');
      case UserRole.LeadTechnician:
        return this.getTranslations('USERMANAGEMENT.LEADTECHNOLOGIST');
      case UserRole.LabSupervisor:
        return this.getTranslations('USERMANAGEMENT.LABSUPERVISOR');
      case UserRole.LabUserManager:
        return this.getTranslations('USERMANAGEMENT.LABUSERMANAGER');
      case UserRole.AccountUserManager:
        return this.getTranslations('USERMANAGEMENT.ACCOUNTUSERMANAGER');
    }

    return role;
  }

  fetchCurrentUser() {
    this.getCurrentUserState$.pipe(filter(currentUser => !!currentUser), take(1)).subscribe(currentUserState => {
      if (!currentUserState.roles.includes(UserRole.AccountUserManager)
        && this.rolesOptions.some(role => role.rolesType === UserRole.AccountUserManager)
      ) {
        this.rolesOptions.pop();
      }
      this.currentUserData = currentUserState;
      this.userSearchRequest.accountId = currentUserState.accountId;
    });
  }

  sortList(sort: Sort) {
    this.sortInfo = sort;
    this.userSearchRequest.pageIndex = 0;
    this.userSearchRequest.pageSize = this.paginationConfig.itemsPerPage;
    const sortDescending = sort.direction === 'desc' ? true : false;
    const sortColumn = Object.keys(DisplayedColumnsUser).indexOf(sort.active) + 1;
    this.userSearchRequest.sortDescending = sortDescending;
    this.userSearchRequest.sortColumn = sortColumn;
    this.paginationConfig.currentPage = 1;
    this.loadUserList(this.userSearchRequest);
    this.scrollTop();
  }

  /* Search with category values and text through api call */
  onUserSearch() {
    if (!this.searchInput || +this.selectedCategory < 1) {
      return;
    }
    this.userSearchRequest.searchString = this.searchInput;
    this.userSearchRequest.searchColumn = +this.selectedCategory;
    this.userSearchRequest.pageIndex = 0;
    this.userSearchRequest.pageSize = this.paginationConfig.itemsPerPage;
    const sortDescending = this.sortInfo.direction === 'desc' ? true : false;
    const sortColumn = Object.keys(DisplayedColumnsUser).indexOf(this.sortInfo.active) + 1;
    this.userSearchRequest.sortDescending = sortDescending;
    this.userSearchRequest.sortColumn = sortColumn;
    this.paginationConfig.currentPage = 1;
    this.loadUserList(this.userSearchRequest);
    this.scrollTop();
  }

  /* Edit existing user */
  openFormForEdit(index: number) {
    index = !!this.isAddUser ? --index : index;
    this.editIndex = index;
    this.defaultLocationNode = null;
    this.resetDataSet();
    this.isEditUser = !this.isAddUser;
    this.userData[index].isEditable = !this.userData[index].isEditable;
    this.dataSource.data = [...this.userData];
    this.userForm.reset();
    this.userForm.controls['firstName'].setValue(this.userData[index].contactInfo.firstName);
    this.userForm.controls['lastName'].setValue(this.userData[index].contactInfo.lastName);
    this.userForm.controls['userEmail'].setValue(this.userData[index].contactInfo.email);
    this.isAddUser = false;
    this.userDefaultLocation = !!this.userData[index].defaultLabLocation
      ? this.userData[index].defaultLabLocation : this.currentLocation.id;
    if (!this.userData[index].defaultLabLocation) {
      this.isAUMSelected = true;
      this.isLUMSelected = false;
    }
    this.loadLocationDropdownOptions();
    this.markDefaultLocationChecked(this.userData[index]);
    this.markEditLocationChecked(this.userData[index]);
    this.populateSelectedRoles(index);
    this.existingFormValue = JSON.parse(JSON.stringify(this.userForm.getRawValue()));
    this.existingLocationValue = this.checklistSelection.selected;
    this.priorLocationForAT = this.selectedLocations['groups'];
  }

  checkValuesAreEqual() {
    return isEqual(this.userForm.getRawValue(), this.existingFormValue)
      && this.checkLocationSelections(this.existingLocationValue, this.checklistSelection.selected);
  }

  checkLocationSelections(existingLocation, currentLocations) {
    if (this.existingLocationValue && this.checklistSelection.selected) {
      return (
        existingLocation.length === currentLocations.length &&
        existingLocation.every((previousLocation) =>
          currentLocations.some((currentLocation) =>
            Object.keys(previousLocation).every((key) => previousLocation[key] === currentLocation[key])
          )
        )
      );
    }
  }

  isSingleGroupSelected(selectedLocations) {
    const groups = [];
    if (this.isLUMSelected) {
      selectedLocations.forEach(node => {
        if (node.nodeType === EntityType.Lab) {
          groups.push(node.id);
        } else if (node.nodeType === EntityType.LabLocation) {
          groups.push(node.parentNodeId);
        } else if (node.nodeType === EntityType.LabDepartment) {
          const rootNode = this.assignedGroups.map(grp => grp?.children
            .filter(item => !!item.id && item.id === node.parentNodeId
            )).filter(value => value.length);
          rootNode[0][0].children.forEach(location => {
            if (location.id === node.id) {
              groups.push(rootNode[0][0].parentNodeId);
            }
          });
        }
      });
    }
    const groupSet = Array.from(new Set(groups));
    this.isSingleGroupError = groupSet.length > 1;
    if (groupSet.length > 0) {
      this.userForm.updateValueAndValidity();
      this.changeDetectorRef.detectChanges();
    }
  }

  /* To Mark roles dropdown options as checked */
  populateSelectedRoles(index: number) {
    const selectedRoles = [];
    this.rolesOptions.forEach(role => {
      this.userData[index].userRoles.some(selectRole => {
        if (role.roleName.toString() === selectRole) {
          selectedRoles.push(role);
        }
      });
    });
    this.userForm.controls['userRole'].setValue(selectedRoles);
    this.disableRoles({ value: selectedRoles });
  }

  /* Disable other roles based on a selection made */
  disableRoles(selection) {
    const selectedRoles = selection.value.map(role => role.id);
    const val = selectedRoles.filter(opt => opt < this.countLUM);
    this.rolesOptions.forEach((x) => {
      x.isDisabled = !!val[0] ? (x.id < this.countLUM && x.id !== val[0]) : false;
    });
    // handle location dropdown options based on role selected
    if (selectedRoles.length === 1 && selectedRoles.includes(this.countAUM)) {
      this.isAUMSelected = true;
      this.userForm.controls['userLocation'].setValue([]);
      this.userForm.controls['userLocation'].setErrors(null);
      // maintained seperate checklistselection(allLocationChecklistSelection) for all location selection
      this.allLocationChecklistSelection.select(...this.treeControl.dataNodes);
    } else if (selectedRoles.includes(this.countLUM) && !selectedRoles.includes(this.countAUM)) {
      this.isLUMSelected = true;
      this.isAUMSelected = false;
    } else {
      this.isAUMSelected = false;
      this.isLUMSelected = false;
    }
    this.changeDetectorRef.detectChanges();
    this.selectedDescendants();
  }

  createUserForm() {
    const nameRegex = '^(?! ).*[^ ]$';
    this.userForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required, Validators.maxLength(100),
      Validators.pattern(nameRegex)]),
      lastName: new FormControl(null, [Validators.required, Validators.maxLength(100),
      Validators.pattern(nameRegex)]),
      userEmail: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.email,
        Validators.maxLength(100),
        ValidatorsService.ValidateEmail
      ])),
      userRole: new FormControl([], Validators.required),
      userLocation: new FormControl([], Validators.required)
    });

    // disable form if permissions are not available
    if (this.hasPermissionToAccess([Permissions.UserAdd, Permissions.UserEdit])) {
      this.userForm.enable();
    } else {
      this.userForm.disable();
    }
  }

  /* Form for adding new user*/
  addUserForm() {
    this.defaultLocationNode = null;
    this.isAddUser = true;
    if (!!this.assignedGroups) {
      this.loadLocationDropdownOptions();
      this.resetDataSet();
      this.markDefaultLocationChecked(null);
    }
    this.userData = this.userData.map((item) => Object.assign({}, item, { isEditable: false }));
    this.scrollTop();
    this.userForm.reset();
    this.userForm.markAsPristine();
    this.userForm.markAsUntouched();
    this.userData.unshift(new UMUser);
    this.userData[0].isEditable = true;
    this.dataSource.data = [...this.userData];
    this.isEditUser = false;
  }

  /* Error && Success messages */
  private getLoadUsersErrorMessage() {
    return this.getTranslations('USERMANAGEMENT.LOADUSERSERROR');
  }

  private getAddUserMessage() {
    return this.getTranslations('USERMANAGEMENT.ADDSUCCESS');
  }

  private getUpdateUserMessage() {
    return this.getTranslations('USERMANAGEMENT.UPDATESUCCESS');
  }

  private getAddUsersErrorMessage() {
    return this.getTranslations('USERMANAGEMENT.ADDUSERERROR');
  }

  private getAddErrorMessage() {
    return this.getTranslations('USERMANAGEMENT.MAXIMUMUSERSALLOWED');
  }

  private getPrimaryContactErrorMessage() {
    return this.getTranslations('USERMANAGEMENT.PRIMARYCONTACTERROR');
  }

  private getUpdateUsersErrorMessage() {
    return this.getTranslations('USERMANAGEMENT.UPDATEUSERERROR');
  }

  /* Api call for add/update user */
  saveRecord(index?: number, isModalClose = false) {
    this.showSaveWarning = false;
    const userRoles = this.userForm.controls['userRole'].value;

    this.userAddEditRequest.firstName = this.userForm.controls['firstName'].value;
    this.userAddEditRequest.lastName = this.userForm.controls['lastName'].value;
    this.userAddEditRequest.email = this.userForm.controls['userEmail'].value;
    this.userAddEditRequest.userRoles = userRoles.map(role => role.rolesType);
    this.userAddEditRequest.groups = this.selectedLocations['groups'];

    if (!!index) {
      this.userData[index].contactInfo.firstName = this.userAddEditRequest.firstName;
      this.userData[index].contactInfo.lastName = this.userAddEditRequest.lastName;
      this.userData[index].contactInfo.email = this.userAddEditRequest.email;
    }
    if (this.isAddUser) {
      this.userAddEditRequest.id = undefined;
      this.userAddEditRequest.userOktaId = undefined;
      this.userAddEditRequest.contactId = undefined;
      return this.userManagementService
        .updateUser(this.userAddEditRequest, EntityType.User)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          () => {
            this.logAuditTracking(this.userAddEditRequest, AuditTrackingAction.Add, AuditTrackingActionStatus.Success);
            this.messageSnackBar.showMessageSnackBar(
              `${this.userAddEditRequest.firstName} ${this.userAddEditRequest.lastName} ` +
              this.getAddUserMessage()
            );
            isModalClose ? this.dialogRef.close() : this.fetchUpdatedUserList();
          }, error => {
            this.logAuditTracking(this.userAddEditRequest, AuditTrackingAction.Add, AuditTrackingActionStatus.Failure);
            if (error.error?.errorCode === ErrorsInterceptor.labsetup102) {
              this.userForm.controls['userEmail'].setErrors({ duplicateEmail: true });
            } else if (error.error?.errorCode === ErrorsInterceptor.labsetup108) {
              this.isSuccess = false;
              this.hasUserCountExceeds = true;
              this.messageSnackBar.showMessageSnackBar(this.getAddErrorMessage());
            } else if (error.error) {
              this.isSuccess = false;
              this.errorLoggerService.logErrorToBackend(
                this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, error.message,
                  (componentInfo.UserManagementComponent + blankSpace + Operations.OnSaveClick)));
              this.fetchUpdatedUserList();
              this.messageSnackBar.showMessageSnackBar(this.getAddUsersErrorMessage());
            }
          });
    } else {
      this.userAddEditRequest.id = this.userData[this.editIndex].id;
      this.userAddEditRequest.userOktaId = this.userData[this.editIndex].userOktaId;
      this.userAddEditRequest.contactId = this.userData[this.editIndex].contactId;
      return this.userManagementService
        .updateUser(this.userAddEditRequest, EntityType.User)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          () => {
            this.logAuditTracking(this.userAddEditRequest, AuditTrackingAction.Update, AuditTrackingActionStatus.Success);
            this.messageSnackBar.showMessageSnackBar(
              `${this.userAddEditRequest.firstName} ${this.userAddEditRequest.lastName} ` +
              this.getUpdateUserMessage()
            );
            isModalClose ? this.dialogRef.close() : this.fetchUpdatedUserList();
          }, error => {
            this.logAuditTracking(this.userAddEditRequest, AuditTrackingAction.Update, AuditTrackingActionStatus.Failure);
            if (error.error?.errorCode === ErrorsInterceptor.labsetup102) {
              this.userForm.controls['userEmail'].setErrors({ duplicateEmail: true });
              this.messageSnackBar.showMessageSnackBar(this.getUpdateUsersErrorMessage());
            } else if (error.error?.errorCode === ErrorsInterceptor.labsetup113) {
              this.isSuccess = false;
              this.messageSnackBar.showMessageSnackBar(this.getPrimaryContactErrorMessage());
              this.fetchUpdatedUserList();
            } else if (error.error) {
              this.isSuccess = false;
              this.errorLoggerService.logErrorToBackend(
                this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, error.message,
                  (componentInfo.UserManagementComponent + blankSpace + Operations.OnSaveClick)));
              this.fetchUpdatedUserList();
              this.messageSnackBar.showMessageSnackBar(this.getUpdateUsersErrorMessage());
            }
          });
    }
  }

  /* Api call for audit trail */
  private logAuditTracking(currentUserData: AddEditUserRequest | User, typeOfAction: string, actionStatus: string): void {
    let previousValue = {};
    let currentValue = {};
    const currentData: any = currentUserData;

    if (typeOfAction === AuditTrackingAction.Delete) {
      currentData.groups = this.priorLocationForAT;
    }

    if (typeOfAction !== AuditTrackingAction.View) {
      previousValue = {
        id: currentData?.id,
        userRoles: this.existingFormValue?.userRole.map(role => role.rolesType),
        userLocations: { groups: this.priorLocationForAT }
      };
      currentValue = {
        id: currentData.id,
        userRoles: currentData.userRoles,
        userLocations: { groups: currentData.groups }
      };
    }

    const auditTrailPayload: AppNavigationTracking = this.appNavigationService
      .comparePriorAndCurrentValues(currentValue, previousValue, typeOfAction, AuditTrackingEvent.UserManagement, actionStatus);

    if (typeOfAction === AuditTrackingAction.Update) {
      auditTrailPayload.auditTrail.currentValue.id = currentData.id;
    }

    this.appNavigationService.logAuditTracking(auditTrailPayload, true);
  }

  /* Reset flags on add/edit success */
  fetchUpdatedUserList() {
    this.isSuccess = true;
    this.isAddUser = false;
    this.isEditUser = false;
    this.userForm.reset();
    this.loadUserList(this.userSearchRequest);
  }

  cancelFormEdit() {
    this.isAddUser = false;
    this.isEditUser = false;
    this.resetDataSet();
  }

  /* Reset data on add/edit form cancel, populate location dropdown default */
  resetDataSet() {
    this.isAUMSelected = false;
    this.isLUMSelected = false;
    this.showSaveWarning = false;
    this.userData = JSON.parse(JSON.stringify(this.resetData));
    this.userData = this.userData.map((item) => Object.assign({}, item, { isEditable: false }));
    this.dataSource.data = [...this.userData];
    this.rolesOptions = this.rolesOptions.map((item) => Object.assign({}, item, { isDisabled: false }));
    this.locationOptions = [];
    this.checklistSelection.clear();
    if (this.treeControl) { this.treeControl.collapseAll(); }
    this.userForm.reset();
    this.userForm.markAsPristine();
    this.userForm.markAsUntouched();
  }

  /* Confirmation dialog on modal close with X icon */
  close() {
    (this.userForm.dirty) ? (this.showSaveWarning = true)
      : (this.showSaveWarning = false, this.dialogRef.close());
  }

  isTextTruncated(element): boolean {
    return element.scrollWidth > element.clientWidth;
  }

  /* Reset catagory and search fields, load initial user list */
  reset() {
    this.searchInput = null;
    this.selectedCategory = 0;
    this.resetDataSet();
    this.userSearchRequest.searchString = '';
    this.userSearchRequest.searchColumn = UsersField.Name;
    this.userSearchRequest.sortColumn = UsersField.Name;
    this.userSearchRequest.sortDescending = false;
    this.userSearchRequest.pageSize = this.paginationConfig.itemsPerPage;
    this.userSearchRequest.pageIndex = 0;
    this.paginationConfig.currentPage = 1;
    this.loadUserList(this.userSearchRequest);
    this.scrollTop();
  }

  // Location dropdown start
  /* Filter and sort data to be populated in the location dropdown */
  public filterGroupsAndLocations() {
    const defaultLocation = this.isAddUser ? this.currentLocation?.id : this.userDefaultLocation;
    this.assignedGroups = this.assignedGroups.filter(el => el && el.children);
    if (this.assignedGroups) {
      if (this.assignedGroups.length === 1) {
        // single group
        const labLocationList = this.assignedGroups[0].children;
        const treeGroupNode: TreePill[] = this.sortNames(labLocationList, defaultLocation);
        this.locationDataSource.data = treeGroupNode;
      } else {
        // multiple groups
        this.assignedGroups = orderBy(this.assignedGroups, [el => el.labName.replace(/\s/g, '').toLocaleLowerCase()], [asc]);
        const itemToFind = this.assignedGroups.filter(groupItem => groupItem && groupItem.children.some(el => el.id === defaultLocation));
        if (itemToFind) {
          const foundIdx = this.assignedGroups.findIndex(el => el.id === itemToFind[0]?.id);
          this.assignedGroups.splice(foundIdx, 1);
          this.assignedGroups.unshift(itemToFind[0]);
        }
        const treeGroupNode: TreePill[] = this.transformGroupsToGroupNode(defaultLocation);
        this.locationDataSource.data = treeGroupNode;
      }
    }
  }

  /* Helper functions for Filter and sort data to be populated in the location dropdown */
  public transformGroupsToGroupNode(defaultLocation: string): TreePill[] {
    return this.assignedGroups.map(ele => {
      return {
        id: ele.id,
        displayName: ele.displayName,
        children: this.sortNames(ele.children, defaultLocation),
        parentNodeId: ele.parentNodeId,
        nodeType: ele?.nodeType
      } as TreePill;
    });
  }

  public sortNames(list: TreePill[], defaultLocation: string, isDepartment = false): Array<TreePill> {
    const sortedList = orderBy(list, [el => el.displayName.replace(/\s/g, '')
      .toLocaleLowerCase()], [asc]);
    const itemToFind = sortedList.find(el => el?.id === defaultLocation);
    if (itemToFind) {
      const foundIdx = sortedList.findIndex(el => el?.id === itemToFind?.id);
      sortedList.splice(foundIdx, 1);
      sortedList.unshift(itemToFind);
    }
    if (!isDepartment) {
      return sortedList.map(ele => {
        return {
          id: ele?.id,
          displayName: ele.displayName,
          children: this.sortNames(ele.children, defaultLocation, true),
          parentNodeId: ele.parentNodeId,
          nodeType: ele?.nodeType
        } as TreePill;
      });
    } else {
      return sortedList;
    }
  }

  // tree checkbox handled
  getLevel = (node: GroupFlatNode) => node.level;
  isExpandable = (node: GroupFlatNode) => node.expandable;
  getChildren = (node: TreePill): TreePill[] => node.children;
  hasChild = (_: number, _nodeData: GroupFlatNode) => _nodeData.expandable;

  // Transformer to convert nested node to flat node. Record the nodes in maps for later use.
  transformer = (node: TreePill, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.displayName === node.displayName ? existingNode : new GroupFlatNode();
    flatNode.displayName = node.displayName;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    flatNode.id = node.id;
    flatNode.parentNodeId = node.parentNodeId;
    flatNode.isDefaultLocation = this.isAddUser ? (node?.id === this.currentLocation?.id) : (node.id === this.userDefaultLocation);

    if ((node.id === this.currentLocation?.id || node.id === this.userDefaultLocation)
      && node.nodeType === EntityType.LabLocation && this.defaultLocationNode === null) {
      this.defaultLocationNode = flatNode;
    }
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /* Mark default location option as checked in the location dropdown */
  markDefaultLocationChecked(data): void {
    const defaultNode = this.flatNodeMap.get(this.defaultLocationNode);
    const selectedItems: Array<TreePill> = this.isAddUser || data === null ?
      [this.currentLocation] : [data?.labLocation.find(loc => loc.id === this.userDefaultLocation)];

    // disable department checkbox if only one department exists under default location (for Add User)
    if (defaultNode?.children?.length === 1 && !!this.isAddUser) {
      const department = this.treeControl.getDescendants(this.defaultLocationNode);
      const foundIndex = this.treeControl.dataNodes.findIndex(x => x.id === department[0].id);
      this.treeControl.dataNodes[foundIndex].isDefaultLocation = true;
    }
    const locationOnTree: Array<TreePill> = this.treeControl.dataNodes.filter(child => {
      return child && !!child.isDefaultLocation;
    }).map(child => this.flatNodeMap.get(child));
    const locationToBeSelected: Array<GroupFlatNode> = locationOnTree
      .filter((location: TreePill) => selectedItems.some((selectedItem: LabLocation) => location.id === selectedItem.id))
      .map((element) => {
        return this.nestedNodeMap.get(element);
      }
      );
    const defaultParentNode = this.getParentNode(locationToBeSelected[0]);
    this.treeControl.expand(this.treeControl.dataNodes.find(node => node === defaultParentNode));
    locationToBeSelected.forEach(child => {
      if (!this.checklistSelection.isSelected(child) && this.isAddUser) {
        this.parentItemSelectionToggle(child);
      }
    });
  }

  /* Mark options as checked in location dropdown with user data on edit edit user */
  markEditLocationChecked(data): void {
    const selectedItems: Array<TreePill> = [];
    const locationsData = [];
    data.parentAccounts[0].children.forEach(groups => {
      if (!!groups?.children) {
        locationsData.push(...groups?.children);
      }
    });
    locationsData.forEach((location => {
      if (!!location.children && location.children.length > 0) {
        selectedItems.push(...location.children);
      } else {
        selectedItems.push(location);
      }
    }));

    // disable department checkbox if only one department exists under default location (for Edit User)
    const department = selectedItems.filter(item => item.parentNodeId === this.userDefaultLocation);
    if (department.length === 1) {
      const foundIndex = this.treeControl.dataNodes.findIndex(x => x.id === department[0].id);
      this.treeControl.dataNodes[foundIndex].isDefaultLocation = true;
    }


    const locationOnTree: Array<TreePill> = this.treeControl.dataNodes.filter(child => {
      return child;
    }).map(child => this.flatNodeMap.get(child));
    const locationToBeSelected: Array<GroupFlatNode> = locationOnTree
      .filter((location: TreePill) => selectedItems.some((selectedItem: LabLocation) => location.id === selectedItem.id))
      .map((element) => {
        return this.nestedNodeMap.get(element);
      }
      );
    locationToBeSelected.forEach(child => {
      if (!this.checklistSelection.isSelected(child)) {
        this.parentItemSelectionToggle(child);
      }
    });
    this.changeDetectorRef.detectChanges();
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: GroupFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: GroupFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the location item selection. Select/deselect all the descendants node */
  parentItemSelectionToggle(node: GroupFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);

    // defaultDepartments below: have atleast one department selected if group with default location is toggled
    const defaultDepartments = descendants ? descendants.filter(dept => dept.parentNodeId === this.defaultLocationNode.id) : null;
    const descendantsWithoutDefault = this.treeControl.getDescendants(node)
      .filter(items => !items.isDefaultLocation).filter(dept => !!defaultDepartments && defaultDepartments[0]?.id !== dept?.id);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendantsWithoutDefault);

    if (!!defaultDepartments[0]) {
      this.disableDefaultDepartment(defaultDepartments[0]);
    }

    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
    this.selectedDescendants();
  }

  /** Toggle a leaf location item selection. Check all the parents to see if they changed */
  leafItemSelectionToggle(node: GroupFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
    this.disableDefaultDepartment(node);
    this.selectedDescendants();
  }

  /** Disable default location department checkbox if number of selected departments is one */
  disableDefaultDepartment(node: GroupFlatNode) {
    if (node.parentNodeId === this.defaultLocationNode.id) {
      const parentNode = this.getParentNode(node);
      const descendants = this.treeControl.getDescendants(parentNode);
      let selectedDepartmentCount = 0;
      descendants.forEach(child => {
        selectedDepartmentCount += this.checklistSelection.isSelected(child) ? 1 : 0;
      });

      if (selectedDepartmentCount === 1) {
        const department = descendants.filter(dept => this.checklistSelection.isSelected(dept));
        const foundIndex = this.treeControl.dataNodes.findIndex(x => x.id === department[0].id);
        this.treeControl.dataNodes[foundIndex].isDefaultLocation = true;
      } else {
        this.treeControl.dataNodes.forEach(dept => {
          if (dept.parentNodeId === this.defaultLocationNode.id) {
            dept.isDefaultLocation = false;
          }
        });
      }
    }
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: GroupFlatNode): void {
    let parent: GroupFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: GroupFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: GroupFlatNode): GroupFlatNode | null {
    const currentLevel = this.getLevel(node);
    if (currentLevel < 1) {
      return null;
    }
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  /** Format selected groups/locations/departments for payload and its selections*/
  selectedDescendants(): void {
    const defaultLocation = this.isAddUser ? this.currentLocation?.id : this.userDefaultLocation;
    const _selectedItems = this.getSelectedDescendants();
    this.isSingleGroupSelected(_selectedItems);
    const node = [];
    _selectedItems.forEach((obj, i) => {
      const rootNode = this.assignedGroups.map(grp => grp?.children.filter(x => !!x.id && x.id === obj.parentNodeId
      )).filter(value => value.length);

      // handle group and location selection
      if (obj.nodeType === EntityType.LabLocation) {
        if (node.length === 0) {
          const newGroup = {
            groups: this.addGroupItem(obj, defaultLocation)
          };
          node.push(newGroup);
        } else {
          if (node[0]?.groups.some(val => val.id === obj.parentNodeId)) {
            node[0]?.groups.forEach((x, j) => {
              if (x.id === obj.parentNodeId) {
                const addLocation = this.addLocationItem(obj, defaultLocation);
                node[0].groups[j].locations.push(addLocation[0]);
              }
            });
          } else {
            const addGroup = this.addGroupItem(obj, defaultLocation);
            node[0].groups.push(addGroup[0]);
          }
        }
      } else if (obj.nodeType === EntityType.LabDepartment && obj?.children === null) {
        // handle department selection
        if (node.length === 0) {
          const newGroup = {
            groups: [{
              id: rootNode[0][0].parentNodeId,
              locations: this.addLocationItem(obj, defaultLocation)
            }]
          };
          node.push(newGroup);
        } else {
          if (node[0].groups.some(grp => grp.id === rootNode[0][0].parentNodeId)) {
            node[0]?.groups.forEach((x, j) => {
              if (x.locations.some(val => val.id === obj.parentNodeId)) {
                x.locations.forEach((l, li) => {
                  const addDepts = this.addDeptItem(obj);
                  if (l.id === obj.parentNodeId && !x?.locations[li].departments.includes(addDepts[0])) {
                    x?.locations[li].departments.push(addDepts[0]);
                  }
                });
              } else if (x.id === rootNode[0][0].parentNodeId) {
                const addLocation = {
                  id: obj.parentNodeId, departments: this.addDeptItem(obj),
                  isDefaultLocation: !this.isAUMSelected ? (obj?.parentNodeId === defaultLocation) : false
                };
                x?.locations.push(addLocation);
              }
            });
          } else {
            const addGroup = {
              id: rootNode[0][0].parentNodeId,
              locations: this.addLocationItem(obj, defaultLocation)
            };
            node[0].groups.push(addGroup);
          }
        }
      }
    });

    this.populateLocationPlaceholder(_selectedItems);
    this.selectedLocations = node[0];
  }

  /* show selected locations in location dropdown placeholder */
  populateLocationPlaceholder(_selectedItems: Array<any>) {
    if (_selectedItems.length > 0 && _selectedItems.some(item => item.nodeType === EntityType.LabLocation)) {
      this.locationOptions = _selectedItems.filter(x => x.nodeType === EntityType.LabLocation).map(name => name.displayName);
    }
    if (_selectedItems.length > 0 && _selectedItems.some(item => item.nodeType === EntityType.LabDepartment)) {
      _selectedItems.filter(x => x.nodeType === EntityType.LabDepartment).forEach(name => {
        const rootNode = this.assignedGroups.map(grp => grp?.children
          .filter(x => !!x.id && x.id === name.parentNodeId
            && (!!this.locationOptions && !this.locationOptions.includes(name.displayName))
          )).filter(value => value.length);
        this.locationOptions.push(rootNode[0][0].displayName);
      }
      );
    }
  }


  /* Helper functions for formating selected groups/locations/departments */
  addGroupItem(obj, defaultLocation: string) {
    const groupsVal = [];
    groupsVal.push({
      id: obj.parentNodeId,
      locations: this.addLocationItem(obj, defaultLocation)
    });
    return groupsVal;
  }

  addLocationItem(obj, defaultLocation: string) {
    const locationVal = [];
    obj.nodeType === EntityType.LabDepartment ?
      locationVal.push({
        id: obj.parentNodeId, departments: this.addDeptItem(obj),
        isDefaultLocation: (!this.isAUMSelected ? (obj?.parentNodeId === defaultLocation) : false)
      })
      : locationVal.push({
        id: obj.id, departments: this.addDeptItem(obj),
        isDefaultLocation: (!this.isAUMSelected ? (obj?.id === defaultLocation) : false)
      });
    return locationVal;
  }

  addDeptItem(obj) {
    const deptVal = [];
    if (!!obj.children) {
      obj.children.forEach(dept => deptVal.push(dept.id));
    } else if (obj.nodeType === EntityType.LabDepartment) {
      deptVal.push(obj.id);
    }
    return deptVal;
  }

  /** get selected descendants of the tree. */
  getSelectedDescendants(): any[] {
    // used seperate checklistSelection for select all location for AUM
    const checklistSelectionTemp = this.isAUMSelected ? this.allLocationChecklistSelection : this.checklistSelection;
    if (this.treeControl.dataNodes.length) {
      return this.treeControl.dataNodes.filter(child => {
        return checklistSelectionTemp.isSelected(child);
      }).map(child => this.flatNodeMap.get(child));
    } else {
      return [];
    }
  }
  // Location dropdown end

  onUserPageChange(pageIndex: number) {
    this.isAddUser = false;
    this.isEditUser = false;
    this.paginationConfig.currentPage = pageIndex;
    this.userSearchRequest.pageIndex = pageIndex - 1;
    this.loadUserList(this.userSearchRequest);
    this.scrollTop();
  }

  scrollTop() {
    if (this.userComponentRef && this.userComponentRef.directiveRef) {
      this.userComponentRef.directiveRef.scrollToTop();
    }
  }

  openConfirmDialog(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogDeleteComponent, {
      data: ''
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteAnUser(user);
      }
    });
  }

  deleteAnUser(user: User) {
    this.userManagementService.deleteAnUser(user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.logAuditTracking(user, AuditTrackingAction.Delete, AuditTrackingActionStatus.Success);
        this.fetchUpdatedUserList();
        this.messageSnackBar.showMessageSnackBar(this.getDeleteUserMessage() + user.displayName);
      }, error => {
        if (error.error) {
          this.logAuditTracking(this.userAddEditRequest, AuditTrackingAction.Delete, AuditTrackingActionStatus.Failure);
          this.messageSnackBar.showMessageSnackBar(this.getDeleteUserErrorMessage());
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
              componentInfo.UserManagementComponent + blankSpace + Operations.DeleteUser));
        }
      });
  }

  private getDeleteUserMessage() {
    return this.getTranslations('USERMANAGEMENT.DELETEUSERMESSAGE');
  }

  private getDeleteUserErrorMessage() {
    return this.getTranslations('USERMANAGEMENT.DELETEUSERERROR');
  }

  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  private getTranslations(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }

  ngOnDestroy() {
    this.storeUser.dispatch(userManagementActions.UserManagementActions.ClearUsersState());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
