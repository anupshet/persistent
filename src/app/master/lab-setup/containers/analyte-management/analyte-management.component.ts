// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, iif, Subject } from 'rxjs';
import { filter, switchMap, take, takeUntil } from 'rxjs/operators';

import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { TreePill } from '../../../../contracts/models/lab-setup/tree-pill.model';
import { Icon } from '../../../../contracts/models/shared/icon.model';
import { icons } from '../../../../core/config/constants/icon.const';
import { unRouting } from '../../../../core/config/constants/un-routing-methods.const';
import { IconService } from '../../../../shared/icons/icons.service';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import * as fromNavigationSelector from '../../../../shared/navigation/state/selectors';
import * as fromRoot from './../../state';
import * as fromSecuritySelector from '../../../../security/state/selectors';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { EntityTypeService } from '../../../../shared/services/entity-type.service';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { Permissions } from '../../../../security/model/permissions.model';

@Component({
  selector: 'unext-analyte-management-component',
  templateUrl: './analyte-management.component.html',
  styleUrls: ['./analyte-management.component.scss']
})
export class AnalyteManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  public selectedNodeDisplayName: string;
  public dataTableUrl: string;
  public showSettings: boolean;
  selectedProduct: TreePill;
  navigationCurrentBranch$ = this.store.pipe(select(fromNavigationSelector.getCurrentBranchState));
  navigationCurrentlySelectedLeaf$ = this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedLeaf));
  navigationShowSettings$ = this.store.pipe(select(fromNavigationSelector.getShowSettingsCurrentVal));
  navigationCurrentlySelectedNode$ = this.store.pipe(select(fromNavigationSelector.getCurrentSelectedNode));
  navigationSelectedNode$ = this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedNode));
  getCurrentUserState$ = this.store.pipe(select(fromSecuritySelector.getCurrentUser));
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.menu[24],
    icons.edit[24]
  ];
  currentSelectedLeaf: TreePill;
  currentSelectedNode: TreePill;
  public levelName: string;
  public isArchived: boolean;
  public hideEditControlLink: boolean;
  permissions = Permissions;

  constructor(
    private store: Store<fromRoot.LabSetupStates>,
    private router: Router,
    private iconService: IconService,
    private navigationService: NavigationService,
    private errorLoggerService: ErrorLoggerService,
    private entityTypeService: EntityTypeService,
    private portalAPIService: PortalApiService,
    private brPermissionsService: BrPermissionsService,
    private translate: TranslateService
  ) {
    try {
      this.iconService.addIcons(this.iconsUsed);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.AnalyteManagementComponent + blankSpace + Operations.AddIcons)));
    }
  }

  ngOnInit() {
    try {
      this.navigationShowSettings$.pipe(takeUntil(this.destroy$)).subscribe((showSettings) => {
        if (showSettings !== undefined) {
          this.showSettings = showSettings;
        }
      });

      combineLatest([
        this.navigationSelectedNode$.pipe(filter(selectedNode => !!selectedNode), take(1),
          switchMap((selectedNode: TreePill) => iif(() => selectedNode.nodeType === EntityType.Panel,
            this.navigationCurrentlySelectedLeaf$, this.navigationCurrentBranch$)
          ),
          switchMap((_selectedLeaf: TreePill) => {
            if (Array.isArray(_selectedLeaf)) {
              return this.navigationCurrentBranch$;
            } else {
              return this.portalAPIService.getLabSetupAncestors<TreePill>(_selectedLeaf.nodeType, (_selectedLeaf) ? _selectedLeaf.id : '');
            }
          })
        ),
        this.navigationCurrentlySelectedNode$,
        this.navigationCurrentlySelectedLeaf$,
        this.navigationSelectedNode$])
        .pipe(filter((hasData) => !!hasData), takeUntil(this.destroy$))
        .subscribe(([currentBranch, selectedNode, selectedLeaf, selectedNodeData]) => {
          this.currentSelectedNode = selectedNode;
          if (!selectedLeaf && !selectedNode) {
            this.selectedNodeDisplayName = '';
          } else if (selectedLeaf) {
            // To display level name for archive indicator
            this.isArchived = selectedLeaf.isArchived;
            this.levelName = this.entityTypeService.getLevelName(selectedLeaf.nodeType);
            this.selectedNodeDisplayName = selectedLeaf.displayName;
            this.hideEditControlLink = selectedLeaf.nodeType === EntityType.LabTest ? true : false;
            // Assign data table link for selected analyte (since it is the leaf in the context of this component).
            this.dataTableUrl = `/data/${selectedLeaf.id}/${selectedLeaf.nodeType}/table`;
            if (selectedLeaf.nodeType === EntityType.LabProduct) {
              this.selectedProduct = selectedLeaf;
            }
          } else {
            if (selectedNode.nodeType === EntityType.LabProduct) {
              this.selectedProduct = selectedNode;
              this.hideEditControlLink = false;
              if (!this.showSettings) {
                this.selectedNodeDisplayName = selectedNode.displayName;
              }
            }
          }
          // To display level name for archive indicator
          if (selectedNodeData?.nodeType === EntityType.Panel) {
            currentBranch.reverse();
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
          (componentInfo.AnalyteManagementComponent + blankSpace + Operations.OnInit)));
    }
  }

  navigateToDataTable() {
    this.navigationService.setSelectedNodeById(this.currentSelectedNode.nodeType, this.currentSelectedNode.id, () => {
      this.router.navigateByUrl(this.dataTableUrl);
    });
  }

  gotoControlSettings(): void {
    const url =
      `/${unRouting.labSetup.lab}/${unRouting.labSetup.controls}/${this.selectedProduct.id}/${unRouting.labSetup.settings}`;
    this.navigationService.navigateToUrl(url, true, this.selectedProduct, this.selectedProduct.id);
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
