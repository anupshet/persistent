// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { TreePill } from '../../../../contracts/models/lab-setup';
import { Icon } from '../../../../contracts/models/shared/icon.model';
import { icons } from '../../../../core/config/constants/icon.const';
import { IconService } from '../../../../shared/icons/icons.service';
import { unRouting } from '../../../../core/config/constants/un-routing-methods.const';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { NavBarActions } from '../../../../shared/navigation/state/actions';
import * as fromNavigationSelector from '../../../../shared/navigation/state/selectors';
import * as fromRoot from '../../../../state/app.state';
import * as fromSecuritySelector from '../../../../security/state/selectors';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { EntityTypeService } from '../../../../shared/services/entity-type.service';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { Permissions } from '../../../../security/model/permissions.model';

@Component({
  selector: 'unext-control-management',
  templateUrl: './control-management.component.html',
  styleUrls: ['./control-management.component.scss']
})
export class ControlManagementComponent implements OnInit, AfterViewInit, OnDestroy {
  public control: TreePill;
  private destroy$ = new Subject<boolean>();
  public showSettings: boolean;
  public hasNonBrLicense: boolean;
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.addCircleOutline[24],
    icons.menu[24],
    icons.edit[24]
  ];
  selectedLeaf: TreePill;
  public levelName: string;
  public isArchived: boolean;
  permissions = Permissions;

  navigationCurrentBranch$ = this.store.pipe(select(fromNavigationSelector.getCurrentBranchState));
  navigationCurrentlySelectedNode$ = this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedNode));
  navigationCurrentlySelectedLeaf$ = this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedLeaf));
  getCurrentUserState$ = this.store.pipe(select(fromSecuritySelector.getCurrentUser));
  showSettings$ = this.store.pipe(select(fromNavigationSelector.getShowSettingsCurrentVal));
  hasNonBrLicense$ = this.store.pipe(select(fromNavigationSelector.getHasNonBrLicenseCurrentVal));

  currentSelectedNode: TreePill;
  constructor(
    private store: Store<fromRoot.State>,
    private navigationService: NavigationService,
    private router: Router,
    private iconService: IconService,
    private errorLoggerService: ErrorLoggerService,
    private entityTypeService: EntityTypeService,
    private brPermissionsService: BrPermissionsService,
    private translate: TranslateService
  ) {
    try {
      this.iconService.addIcons(this.iconsUsed);
      this.showSettings$.pipe(takeUntil(this.destroy$)).subscribe((isShowSettings: boolean) => {
        this.showSettings = isShowSettings;
      });
      this.hasNonBrLicense$.pipe(takeUntil(this.destroy$)).subscribe((hasNonBrLicense: boolean) => {
        this.hasNonBrLicense = hasNonBrLicense;
      });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.ControlManagementComponent + blankSpace + Operations.AddIcons)));
    }
  }

  ngOnInit() {
    try {
      this.loadCardDetailsData();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.ControlManagementComponent + blankSpace + Operations.OnInit)));
    }
  }

  ngAfterViewInit() {
    try {
      this.loadCardDetailsData();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.ControlManagementComponent + blankSpace + Operations.AfterViewInit)));
    }
  }

  loadCardDetailsData() {
    combineLatest([this.navigationCurrentBranch$,
    this.navigationCurrentlySelectedNode$,
    this.navigationCurrentlySelectedLeaf$])
      .pipe(filter((hasData) => !!hasData), takeUntil(this.destroy$))
      .subscribe(([currentBranch, selectedNode, selectedLeaf]) => {
        this.currentSelectedNode = selectedNode;
        this.selectedLeaf = selectedLeaf;
        if (selectedNode && selectedNode.nodeType === EntityType.LabInstrument && !this.showSettings) {
          this.control = selectedNode;
        } else if (selectedLeaf && (selectedLeaf.nodeType === EntityType.LabInstrument
          || selectedLeaf.nodeType === EntityType.LabProduct)) {
          this.control = selectedLeaf;
        } else if (selectedNode &&
          (selectedNode.nodeType === EntityType.LabInstrument || selectedNode.nodeType === EntityType.LabProduct)) {
          this.control = selectedNode;
        }
        // To display level name for archive indicator
        if (selectedLeaf) {
          this.isArchived = selectedLeaf.isArchived;
          this.levelName = this.entityTypeService.getLevelName(selectedLeaf.nodeType);
        }
        if (selectedNode) {
          this.isArchived = selectedNode.isArchived;
          this.levelName = this.entityTypeService.getLevelName(selectedNode.nodeType);
        }
        for (let i = 0; i < currentBranch.length; i++) {
          if (currentBranch[i].isArchived) {
            this.isArchived = true;
            this.levelName = this.entityTypeService.getLevelName(currentBranch[i].nodeType);
            this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
              this.levelName = this.entityTypeService.getLevelName(currentBranch[i].nodeType);
            });
            break;
          }
        }
      });
  }

  redirectToDataTable() {
    // AJ bug fix 161398 March 9 2020

    // If the control has an analyte
    if (this.control && this.control.children?.length > 0) {
      this.router.navigateByUrl(`/data/${this.control.id}/${this.control.nodeType}/table`);
    } else {
      // Display "Add Analyte" screen
      this.navigationService.navigateToUrl(`lab-setup/analytes/${this.control.id}/settings`, false, this.control);
    }
  }

  gotoInstrumentSettings() {
    const url = `/${unRouting.labSetup.lab}/${unRouting.labSetup.instruments}/${(this.selectedLeaf
      || this.currentSelectedNode).id}/${unRouting.labSetup.settings}`;

    this.navigationService.setSelectedNodeById(this.control.nodeType, this.control.id, () => {
      this.store.dispatch(NavBarActions.setShowSettings({ showSettings: true }));
      this.router.navigateByUrl(url);
    });
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
