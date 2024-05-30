// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnInit, Input } from '@angular/core';
import {  Store } from '@ngrx/store';
import {  take } from 'rxjs/operators';

import { Utility } from '../../../../core/helpers/utility';
import { Permissions } from '../../../../security/model/permissions.model';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { AuthActions, LocationActions } from '../../../../shared/state/actions';
import { SecurityActions } from '../../../../security/state/actions';
import { NavBarActions } from '../../../../shared/navigation/state/actions';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import * as fromRoot from '../../../../state/app.state';
import { LabSetupService } from '../../../../shared/services/lab-setup.service';
import { LabLocation } from '../../../../contracts/models/lab-setup/lab-location.model';
import { NotificationManagerService } from '../../../../core/notification/services/notification-manager.service';


@Component({
  selector: 'unext-licence-info',
  templateUrl: './licence-info.component.html',
  styleUrls: ['./licence-info.component.scss']
})
export class LicenceInfoComponent implements OnInit {
  @Input() expirationDate: Date;
  @Input() location: LabLocation;
  permissions = Permissions;

  constructor(private brPermissionsService: BrPermissionsService,
    private navigationService: NavigationService,
    private store: Store<fromRoot.State>,
    private labSetupService: LabSetupService,
    private notificationService: NotificationManagerService,
  ) { }

  ngOnInit() {
  }


  launchLab(location: LabLocation) {
    this.updateLaunchLabAccountSelectorData(location);
    this.navigationService.navigateToDashboard(location.id);
  }


  updateLaunchLabAccountSelectorData(selectedLocation: LabLocation) {
    // clear directory when changing labs
    this.store.dispatch(AuthActions.UpdateLabDirectory({ payload: null }));
    this.store.dispatch(SecurityActions.UpdateLabDirectory({ payload: null }));
    this.store.dispatch(LocationActions.setCurrentLabLocation({ currentLabLocation: null }));

    this.labSetupService.getLabDirectory(EntityType.Account, selectedLocation.parentNode.parentNodeId).pipe(take(1)).subscribe(
      directoryResponse => {
        if (directoryResponse && directoryResponse.children) {
          this.store.dispatch(AuthActions.UpdateLabDirectory({ payload: directoryResponse }));
          this.store.dispatch(SecurityActions.UpdateLabDirectory({ payload: directoryResponse }));
          const user = directoryResponse.children.find(ele => ele.contactId === selectedLocation.labLocationContactId);
          if (user) {
            this.notificationService.connect(selectedLocation.accountNumber, user.userOktaId);
          }
        }
      });
    this.store.dispatch(LocationActions.setCurrentLabLocation({ currentLabLocation: selectedLocation }));
    this.store.dispatch(NavBarActions.toggleArchiveItems({ isArchiveItemsToggleOn: false }));
  }

  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  // ToDo: Read from Guard
  get isLabExpired(): boolean {
    if (!this.expirationDate) {
      return true;
    }

    return Utility.isDateExpired(this.expirationDate);
  }

}
