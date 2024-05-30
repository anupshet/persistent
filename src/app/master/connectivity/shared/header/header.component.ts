// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnDestroy, OnInit, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as ngrxStore from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { hasValue } from 'br-component-library';

import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { HeaderService } from './header.service';
import * as fromConnectivity from '../../state';
import * as connectivityStateSelector from '../../state/selectors';
import { unRouting } from '../../../../core/config/constants/un-routing-methods.const';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { Permissions } from '../../../../security/model/permissions.model';
import { AppNavigationTracking, AuditTrackingAction, AuditTrackingActionStatus, AuditTrackingEvent } from '../../../../shared/models/audit-tracking.model';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';

@Component({
  selector: 'unext-connectivity-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnChanges, OnDestroy {
  public showInstructionDetail = true;
  public showUploadFileSection = false;
  public showConnectivityStatus = false;
  public showInstrumentMapping = false;
  public showConfigurations = false;
  protected cleanUp$ = new Subject<boolean>();

  isIntructionsActive: boolean;
  isStatusActive: boolean;
  isUploadActive: boolean;
  isMappingActive: boolean;
  isConfigurationsActive: boolean;

  permissions = Permissions;

  @Input() hasInstructions: boolean;
  @Input() activeLink: boolean;
  @Input() labId: string;

  constructor(
    private navigationService: NavigationService,
    private _headerService: HeaderService,
    private dialog: MatDialog,
    private brPermissionsService: BrPermissionsService,
    private store: ngrxStore.Store<fromConnectivity.ConnectivityStates>,
    private appNavigationService: AppNavigationTrackingService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.store.pipe(ngrxStore.select(connectivityStateSelector.getHasInstructions))
    .pipe(filter(hasInstructions => hasValue(hasInstructions)), takeUntil(this.cleanUp$))
    .subscribe(hasInstructions => {
      this.hasInstructions = hasInstructions;
      this.setActiveLinks();
    });
  }

  ngOnChanges() {
    this.setActiveLink(this.activeLink);
  }

  setActiveLinks() {
    if (this.hasInstructions) {
      this.enableNavigation();
      this.setActiveLink('upload');
    } else {
      this.setActiveLink('configurations');
    }
  }

  enableNavigation() {
    this.showInstructionDetail = true;
    this.showUploadFileSection = true;
    this.showConnectivityStatus = true;
    this.showInstrumentMapping = true;
    this.showConfigurations = true;
  }

  reset() {
    this.isIntructionsActive = false;
    this.isStatusActive = false;
    this.isUploadActive = false;
    this.isMappingActive = false;
    this.isConfigurationsActive = false;
  }

  setActiveLink(path) {
    this.reset();
    if (path === unRouting.connectivity.instructions) {
      this.isIntructionsActive = true;
    } else if (path === unRouting.connectivity.status) {
      this.isStatusActive = true;
    } else if (path === unRouting.connectivity.upload) {
      this.isUploadActive = true;
    } else if (path === unRouting.connectivity.configurations) {
      this.isConfigurationsActive = true;
    } else {
      this.isMappingActive = true;
    }
  }

  routeToConnectivityStatus() {
    this.navigationService.routeToConnectivityStatus(this.labId);
    this._headerService.setDialogComponent('status');
    this.setActiveLink('status');
    this.sendAuditTrailPayload(AuditTrackingEvent.FileStatus, AuditTrackingAction.View, AuditTrackingActionStatus.Success);
  }

  routeToConnectivityConfigurations() {
    this.navigationService.routeToConnectivityConfigurations(this.labId);
    this._headerService.setDialogComponent('configurations');
    this.setActiveLink('configurations');
  }

  routeToFileUploadWithLabId() {
    this.navigationService.routeToFileUpload(this.labId);
    this._headerService.setDialogComponent('upload');
    this.setActiveLink('upload');
  }

  routeToInstructionsWithLabId() {
    this.navigationService.routeToInstructions(this.labId);
    this._headerService.setDialogComponent('instructions');
    this.setActiveLink('instructions');
  }

  routeToConnectivityMapping() {
    this.navigationService.routeToMapping(this.labId);
    this._headerService.setDialogComponent('mapping');
    this.setActiveLink('mapping');
  }

  redirect(): void {
    this.navigationService.routeToDashboard();
    this.closeDialog();
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  routeTo(direction: string) {
    this.navigationService.routeTo(direction);
  }

  // checking Permissions
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  public sendAuditTrailPayload(eventType: string, action: string, actionStatus: string): void {
    const auditPayload: AppNavigationTracking = {
      auditTrail: {
        eventType: eventType,
        action: action,
        actionStatus: actionStatus,
        currentValue: {},
        priorValue: {}
      }
    };
    this.appNavigationService.logAuditTracking(auditPayload, true);
  }

  getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }

  ngOnDestroy() {
    this.cleanUp$.next(true);
    this.cleanUp$.unsubscribe();
  }
}
