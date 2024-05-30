// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { MatMenuTrigger } from '@angular/material/menu';
import { trigger, state, style, animate, transition, keyframes, AnimationEvent } from '@angular/animations';
import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import * as fromAuth from '../../../shared/state/selectors';
import * as fromRoot from '../../../state/app.state';
import * as selectors from '../state/selectors';
import * as sharedStateSelector from '../../../shared/state/selectors';

import { EntityType } from '../../../contracts/enums/entity-type.enum';
import { RouterNavigationType } from '../../../contracts/enums/router-navigation-type.enum';
import { TreePill } from '../../../contracts/models/lab-setup/tree-pill.model';
import { Icon } from '../../../contracts/models/shared/icon.model';
import { icons } from '../../../core/config/constants/icon.const';
import { unRouting } from '../../../core/config/constants/un-routing-methods.const';
import { IconService } from '../../icons/icons.service';
import { NavigationService } from '../../navigation/navigation.service';
import { NavBarActions } from '../state/actions';
import { NavHierarchyComponent } from './nav-hierarchy/nav-hierarchy.component';
import { BrPermissionsService } from '../../../security/services/permissions.service';
import {
  AnalyteAccessPermissions, ControlAccessPermissions, DepartmentAccessPermissions,
  InstrumentAccessPermissions, ReportsAccessPermissions, ViewPermissions
} from '../../../security/model/permissions.model';
import { Permissions } from '../../../security/model/permissions.model';
import { LabLocation } from '../../../contracts/models/lab-setup';
import { UnityNextTier } from '../../../contracts/enums/lab-location.enum';
import { DynamicReportingService } from '../../services/reporting.service';
import { NotificationService } from '../../../core/notification/services/notification.service';
import { ReportNotification } from '../models/report-notification.model';
import { ErrorLoggerService } from '../../services/errorLogger/error-logger.service';
import { Reporting, forwardSlash, reports } from '../../../core/config/constants/general.const';
import { ConfirmNavigateGuard } from '../../../master/reporting/shared/guard/confirm-navigate.guard';
import * as fromSelector from '../../../master/data-review/state/selectors';

@Component({
  selector: 'unext-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('start', style({ transform: 'rotate(0deg)' })),
      transition('false => true', [
        animate('3s', keyframes([
          style({ transform: 'rotate(0deg)' }),
          style({ transform: 'rotate(30deg)' }),
          style({ transform: 'rotate(-30deg)' }),
          style({ transform: 'rotate(0deg)' }),
        ]))
      ]),
    ])
  ]
})

export class NavHeaderComponent implements OnInit, OnDestroy {
  @ViewChild('navHierarchy') navHierarchyComponent: NavHierarchyComponent;
  @Input() migrationPending: boolean;
  @Input() userLabId: string;
  @Input() hasConnectivityLicense: boolean;

  public getDataReviewFeatureState$ = this.store.pipe(select(fromSelector.getDataReviewFeatureState));

  labLocation: LabLocation;
  public _unRouting = unRouting;
  selectedNode: TreePill;
  isLabSetupCompleted = false;
  public fileUploadToolTip: string;
  public showJustTitle = false;
  public title: string;
  selectedLeaf: TreePill = null;
  instrumentsGroupedByDept = true;
  protected destroy$ = new Subject<boolean>();
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.publish[24],
    icons.reportsNotificationIcon[36],
    icons.arrowBack[48]
  ];
  permissions = Permissions;
  viewPermissions = ViewPermissions;
  instrumentAccessPermissions = InstrumentAccessPermissions;
  departmentAccessPermissions = DepartmentAccessPermissions;
  controlAccessPermissions = ControlAccessPermissions;
  analyteAccessPermissions = AnalyteAccessPermissions;
  reportsAccessPermissions = ReportsAccessPermissions;
  notificationList: ReportNotification[] = [];
  newNotification = false;
  opened = false;
  oktaId: string;

  constructor(
    private store: Store<fromRoot.State>,
    private navigationService: NavigationService,
    private iconService: IconService,
    public router: Router,
    private brPermissionsService: BrPermissionsService,
    private dynamicReportingService: DynamicReportingService,
    private notificationService: NotificationService,
    private errorLoggerService: ErrorLoggerService,
    private confirmNavigate: ConfirmNavigateGuard,
    public translate: TranslateService
  ) {
    this.iconService.addIcons(this.iconsUsed);

    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (this.router.url.includes(unRouting.reporting.newReports || unRouting.reporting.pastReports)) {
          this.showJustTitle = true;
          this.title = Reporting;
        } else {
          this.showJustTitle = false;
        }
      }
    });
  }

  ngOnInit() {
    this.store.pipe(select(selectors.getCurrentlySelectedNode),
      takeUntil(this.destroy$)).subscribe((selectedNode) => {
        this.selectedNode = null;
        if (selectedNode) {
          this.selectedNode = JSON.parse(JSON.stringify(selectedNode));
        }
      });

    this.store.pipe(select(selectors.getCurrentlySelectedLeaf), takeUntil(this.destroy$)).subscribe((selectedLeaf) => {
      this.selectedLeaf = selectedLeaf;
    });

    this.store.pipe(select(fromAuth.getAuthState))
      .pipe(filter(authStateCurrent => !!authStateCurrent && !!authStateCurrent.currentUser), takeUntil(this.destroy$))
      .subscribe(authStateCurrent => {
        if (authStateCurrent && authStateCurrent.currentUser) {
          this.oktaId = authStateCurrent.currentUser?.userOktaId;
        }
      });

    this.store.pipe(select(sharedStateSelector.getCurrentLabLocation))
      .pipe(takeUntil(this.destroy$)).subscribe(labLocation => {
        if (labLocation) {
          this.labLocation = labLocation;
          if (!!labLocation.locationSettings) {
            this.instrumentsGroupedByDept = labLocation.locationSettings?.instrumentsGroupedByDept;
            this.store.dispatch(NavBarActions.setInstrumentsGroupedByDept({ instrumentsGroupedByDept: this.instrumentsGroupedByDept }));
            this.isLabSetupCompleted = labLocation?.locationSettings?.isLabSetupComplete;
            this.getReportNotifications();
          } else {
            this.store.dispatch(NavBarActions.setInstrumentsGroupedByDept({ instrumentsGroupedByDept: true }));
            this.isLabSetupCompleted = false;
          }
        }
      });

    this.getReportNotifications();
    this.notificationService.$labStream.pipe(filter(result => !!result), takeUntil(this.destroy$))
      .subscribe(result => {
        const mqttPayload = result?.payload ? JSON.parse(result?.payload) : null;
        if (!!this.labLocation.id && !!this.oktaId && this.labLocation.id === mqttPayload.LocationId
          && result.notificationType === reports && this.oktaId === mqttPayload.OktaId) { // reload only for report notification
          this.getReportNotifications(true);
        }
      });

  }

  onAnimationEvent(event: AnimationEvent) {
    if (event.toState) {
      this.newNotification = false;
    }
  }

  async onNavigateToParent(currentBranch: TreePill[]) {
    if (this.router.url.includes(unRouting.reporting.newReports) || this.router.url.includes(unRouting.reporting.pastReports)) {
      if (this.router.url.includes(unRouting.reporting.newReports)) {
        const result = await this.confirmNavigate.confirmationModal();
        if (!result) {
          return;
        }
      }
      if (this.selectedNode) {
        this.navHierarchyComponent.navigateToNodeContents(this.selectedNode);
      } else if (!this.selectedNode && this.labLocation) {
        this.navHierarchyComponent.navigateToNodeContents(this.labLocation);
      }
    } else {
      if (this.selectedLeaf) {
        this.selectedNode = currentBranch[currentBranch.length - RouterNavigationType.Initial];
      } else {
        this.selectedNode = currentBranch[currentBranch.length - RouterNavigationType.RoutedFromInitial];
        this.store.dispatch(NavBarActions.removeLastItemFromCurrentBranch());
      }
      this.navHierarchyComponent.navigateToNodeContents(this.selectedNode);
    }
  }

  async onNavigateToDashboard() {
    if (this.router.url.includes(unRouting.reports)) {
      const result = await this.confirmNavigate.confirmationModal();
      if (!result) {
        return;
      }
    }
    this.labLocation?.id ? this.navigationService.navigateToDashboard(this.labLocation.id) : this.navigationService.gotoDashboard();
  }

  async onNavigateToSettings() {
    const unityNextTier = this.labLocation.unityNextTier;
    const proceedNavigation = () => {
      if (this.instrumentsGroupedByDept) {
        this.navigationService.navigateToUrl(
          `${unRouting.labSetup.lab}/${unRouting.labSetup.departments}/${this.selectedNode.parentNodeId}/${unRouting.labSetup.settings}`,
          true, this.selectedNode, this.selectedNode.parentNodeId
        );
      } else {
        this.store.dispatch(NavBarActions.setSelectedLeaf({ selectedLeaf: null }));
        this.navigationService.navigateToUrl(
          `${unRouting.labSetup.lab}/${unRouting.labSetup.instruments}/${this.selectedNode.id}/${unRouting.labSetup.settings}`,
          false, this.selectedNode, this.selectedNode.id
        );
      }
    };
  
    if (this.selectedNode.nodeType === EntityType.LabLocation
      && (unityNextTier === UnityNextTier.PeerQc || unityNextTier === UnityNextTier.DailyQc)  // Display settings page only if unityNextTier is peerQc for selected location.
      && this.hasPermissionToAccess(DepartmentAccessPermissions)) {
      if (this.router.url.includes(unRouting.reports)) {
        const result = await this.confirmNavigate.confirmationModal();
        if (!result) {
          return;
        }
      }
      proceedNavigation();
    }
  }

  routeToConnectivity(): void {
    // Set previousUrl in navigation store to navigate user to previous page after connectivity dialog close.
    const previousUrl = this.router?.url;
    this.store.dispatch(NavBarActions.setPreviousUrl({ url: previousUrl }));
    // AJ tricking the app by passing 0 when no lab exists for lotviewer roles
    if (this.userLabId !== '0') {
      this.navigationService.routeToFileUpload(this.userLabId);
    }
  }

  isInDataReview(): boolean {
    return this.router?.url.includes(unRouting.dataReview.review);
  }

  displayFixedNavHeader(): boolean {
    return this.router?.url.includes(unRouting.accountManagement) || this.router?.url.includes(unRouting.labSetup.labDefault);
  }

  routeToReports(): void {
    this.navigationService.setSelectedReportNotificationId('');
    this.router.navigate([unRouting.reports + forwardSlash + unRouting.reporting.newReports]);
  }

  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  // this function triggers when mouse enters the reports button
  openReportNotifications(menuTrigger: MatMenuTrigger) {
    this.opened = true;
    setTimeout(() => {
      menuTrigger.openMenu();
    }, 300);
  }

  // this functions is triggered when mouse leaves the mat menu
  closeReportNotifications(menuTrigger: MatMenuTrigger) {
    this.opened = false;
    setTimeout(() => {
      menuTrigger.closeMenu();
    }, 300);
  }

  onMenuClosed(): void {
    this.opened = false;
  }

  getReportNotifications(animateIcon = false) {
    if (this.labLocation) {
      this.dynamicReportingService.getReportNotifications(this.labLocation?.id)
        .pipe(take(1))
        .subscribe((notificationList) => {
          this.notificationList = notificationList;
          if (animateIcon) {
            this.newNotification = !this.newNotification;
          }
        }, (error) => {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(error.message));
        });
    }

  }

  getDisplayTitle(): string {
    if (this.router?.url.includes(unRouting.accountManagement)) {
      return this.getTranslations('NAV.HEADER.ACCOUNTLOCATIONTITLE');
    } else if (this.router?.url.includes(unRouting.labSetup.labDefault)) {
      return this.getTranslations('TRANSLATION.LABSETUP');
    } else if (this.router?.url.includes(unRouting.reporting.newReports) ||
      this.router?.url.includes(unRouting.reporting.pastReports)) {
      return this.getTranslations('TRANSLATION.REPORTS');
    }
    return '';
  }


  private getTranslations(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }


}
