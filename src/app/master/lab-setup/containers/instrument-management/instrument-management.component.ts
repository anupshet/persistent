// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, iif, Subject } from 'rxjs';
import { filter, map, switchMap, take, takeUntil } from 'rxjs/operators';

import * as fromSecurity from '../../../../security/state/selectors';
import * as fromNavigationSelector from '../../../../shared/navigation/state/selectors';
import * as fromRoot from '../../state';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { TreePill } from '../../../../contracts/models/lab-setup/tree-pill.model';
import { Icon } from '../../../../contracts/models/shared/icon.model';
import { icons } from '../../../../core/config/constants/icon.const';
import { AppUser } from '../../../../security/model/app-user.model';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { IconService } from '../../../../shared/icons/icons.service';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { EntityTypeService } from '../../../../shared/services/entity-type.service';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { InstrumentAccessPermissions } from '../../../../security/model/permissions.model';

@Component({
  selector: 'unext-instrument-management',
  templateUrl: './instrument-management.component.html',
  styleUrls: ['./instrument-management.component.scss']
})
export class InstrumentManagementComponent implements OnInit, OnDestroy {
  navigationCurrentlySelectedNode$ = this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedNode));
  destroy$ = new Subject<boolean>();
  showAddInstrument = false;
  instrumentName = '';
  selectedNode: any = null;
  navigationShowSettings$ = this.store.pipe(select(fromNavigationSelector.getShowSettingsCurrentVal));
  getCurrentlySelectedLeaf$ = this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedLeaf));
  getInstrumentsGroupedByDeptVal$: any = this.store.pipe(select(fromNavigationSelector.getInstrumentsGroupedByDeptVal));
  getCurrentlySelectedNode$ = this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedNode));
  getCurrentUser$: any = this.store.pipe(select(fromSecurity.getCurrentUser),
    filter((currentUser: AppUser) => !!currentUser && !!currentUser.roles),
    map((currentUser: AppUser) => currentUser.roles),
    switchMap(() => {
      return iif(() => this.hasPermissionToAccess(InstrumentAccessPermissions),
        this.getCurrentlySelectedNode$
      );
    }));
  navigationCurrentBranch$ = this.store.pipe(select(fromNavigationSelector.getCurrentBranchState));
  showSettings: boolean;
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.addCircleOutline[24],
    icons.menu[24]
  ];
  currentNode: any;
  showInstrumentConfig = true;
  isParentArchived: boolean;
  public levelName: string;
  public isArchived: boolean;
  instrumentAccessPermissions = InstrumentAccessPermissions;

  constructor(
    private store: Store<fromRoot.LabSetupStates>,
    private router: Router,
    private navigationService: NavigationService,
    private iconService: IconService,
    private errorLoggerService: ErrorLoggerService,
    private entityTypeService: EntityTypeService,
    private brPermissionsService: BrPermissionsService,
    private translate: TranslateService

  ) {
    try {
      this.iconService.addIcons(this.iconsUsed);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.InstrumentManagementComponent + blankSpace + Operations.AddIcons)));
    }
  }
  ngOnInit() {
    try {
      combineLatest([
        this.navigationCurrentBranch$,
        this.getCurrentUser$,
        this.navigationShowSettings$,
        this.getCurrentlySelectedLeaf$,
        this.getInstrumentsGroupedByDeptVal$]
      ).pipe(filter((hasData) => !!hasData),
        takeUntil(this.destroy$)).subscribe(([currentBranch, selectedNode, showSettings, selectedLeaf, hasDepartments]: any) => {
          this.showSettings = showSettings;
          if (selectedNode) {
            this.selectedNode = selectedNode;
            if (!hasDepartments) {
              this.processLabWithNoDepartments(selectedNode, selectedLeaf);
            } else {
              this.currentNode = (selectedLeaf && (selectedLeaf.nodeType === EntityType.LabDepartment
                || selectedLeaf.nodeType === EntityType.LabInstrument)) ?
                selectedLeaf : ((selectedNode
                  && (selectedNode.nodeType === EntityType.LabDepartment
                    || selectedNode.nodeType === EntityType.LabInstrument)) ?
                  selectedNode : null);
              if (selectedLeaf && selectedLeaf.nodeType === EntityType.LabInstrument) {
                this.showAddInstrument = false;
              } else {
                if (selectedNode.nodeType === EntityType.LabDepartment) {
                  this.showAddInstrument = this.showSettings;
                  this.isParentArchived = selectedNode.isArchived;
                }
              }
              if (!selectedLeaf && showSettings && this.selectedNode.nodeType === EntityType.LabDepartment) {
                this.showAddInstrument = true;
              }
            }
          } else {
            // This is the case of new lab setup when selectedNode is null
            if (selectedLeaf && !selectedNode) {
              this.showAddInstrument = false;
              this.currentNode = selectedLeaf;
            }
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
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.InstrumentManagementComponent + blankSpace + Operations.OnInit)));
    }
  }

  returnToData() {
    try {
      const curNode = this.currentNode;
      // If has instrument has controls
      if (curNode.children?.length > 0) {
        this.router.navigateByUrl(`/data/${curNode.id}/${curNode.nodeType}/table`);
      } else {
        // Display "Add Control" screen
        this.navigationService.navigateToUrl(`lab-setup/controls/${curNode.id}/settings`, false, curNode);
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.InstrumentManagementComponent + blankSpace + Operations.ReturnToData)));
    }
  }

  processLabWithNoDepartments(selectedNode: TreePill, selectedLeaf: TreePill) {
    const currentNode = selectedLeaf && selectedLeaf.nodeType === EntityType.LabInstrument ? selectedLeaf : selectedNode;
    this.instrumentName = currentNode.displayName;
    this.currentNode = currentNode;
    this.showAddInstrument = false;
  }

  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
