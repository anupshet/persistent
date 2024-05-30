// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { ParsingEngineService } from '../../../shared/services/parsing-engine.service';
import { Icon } from '../../../contracts/models/shared/icon.model';
import { icons } from '../../../core/config/constants/icon.const';
import * as actions from './../state/actions';
import { ParsingInfo, ParsingJobConfig } from '../../../contracts/models/connectivity/parsing-engine/instruction-id-name.model';
import { IconService } from '../../../shared/icons/icons.service';
import { BrPermissionsService } from '../../../security/services/permissions.service';
import { Permissions } from '../../../security/model/permissions.model';
import { ConfirmDialogDeleteComponent } from '../../../shared/components/confirm-dialog-delete/confirm-dialog-delete.component';
import { OrchestratorApiService } from '../../../shared/api/orchestratorApi.service';
import { DeleteConfiguration } from '../../../contracts/models/account-management/transformers.model';
import { InformativeMessageComponent } from '../../../shared/components/informative-message/informative-message.component';
import { AuditTrackingAction, AuditTrackingActionStatus, AuditTrackingEvent } from '../../../shared/models/audit-tracking.model';
import { AppNavigationTrackingService } from '../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import * as fromSecuritySelector from '../../../security/state/selectors';
import { UserRole } from '../../../contracts/enums/user-role.enum';
import * as fromRoot from '../../../state/app.state';


@Component({
  selector: 'unext-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss']
})
export class ConfigurationsComponent implements OnInit, OnDestroy {
  @Input() accountId: string;
  @Input() labLocationId: string;

  @ViewChild(MatSort) sort: MatSort;

  public instructions: ParsingInfo;
  public edgeList: Array<ParsingJobConfig>;
  public selectedTransformer: ParsingJobConfig;
  public configurationList: Array<ParsingJobConfig>;

  dataSource: MatTableDataSource<any>;
  showTransformersForm = false;
  showEdgeForm = false;
  showCommonForm = false;
  showListing = true;
  selectedInstruction: ParsingJobConfig;
  existingConfigurationsNames: string[];
  permissions = Permissions;
  isTechnologist: boolean;
  selectedTransformerId: string;
  sortInfo: Sort;
  displayedColumns: string[] = ['name', 'transformerName', 'actions'];

  public destroy$ = new Subject<boolean>();
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.addCircleOutline[24],
    icons.delete[24],
    icons.sortActive[24],
  ];

  public getCurrentUserState$ = this.store.pipe(select(fromSecuritySelector.getCurrentUser));

  constructor(
    private parsingEngineService: ParsingEngineService,
    private dialog: MatDialog,
    private iconService: IconService,
    private brPermissionsService: BrPermissionsService,
    private orchestratorApiService: OrchestratorApiService,
    private appNavigationService: AppNavigationTrackingService,
    private translate: TranslateService,
    private store: Store<fromRoot.State>,
  ) {
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit(): void {
    this.getParsingInfo();

    this.getCurrentUserState$.pipe(filter(account => !!account), takeUntil(this.destroy$)).subscribe(currentUserState => {
      if (currentUserState) {
        this.isTechnologist = currentUserState.roles?.includes(UserRole.Technician);
      }
    });
  }

  sortList(sort: Sort) {
    this.sortInfo = sort;
  }

  setupConfigurations(instructions: ParsingInfo) {
    if (instructions) {
      this.instructions = instructions;
      this.configurationList = this.instructions.configs;
      this.existingConfigurationsNames = [];
      this.existingConfigurationsNames = this.listExistingConfigurationsNames(this.configurationList);

      this.edgeList = this.instructions.configs.filter(ele => ele.isGenericASTM === true);
      this.dataSource = new MatTableDataSource(this.configurationList);
      this.sortInfo = { active: this.displayedColumns[0], direction: 'asc' };
      this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
        if (typeof data[sortHeaderId] === 'string') {
          return data[sortHeaderId].toLocaleLowerCase();
        }

        return data[sortHeaderId];
      };

      this.dataSource.sort = this.sort;
    }
  }

  listExistingConfigurationsNames(filteredList: Array<ParsingJobConfig>) {
    const existingConfigurationsNames = [];
    filteredList.forEach((configuration) => {
      existingConfigurationsNames.push(configuration.name);
    });
    return existingConfigurationsNames;
  }

  public getParsingInfo() {
    this.parsingEngineService.getInstructions(this.labLocationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: ParsingInfo) => {
        this.setupConfigurations(res);
        this.store.dispatch(actions.connectivityActions.setConfigurationList({ configurationList: res }));
      });
  }

  displayDeleteIcon(configuration: ParsingJobConfig) {
    const duplicate = this.configurationList.filter(transformer => transformer.transformerName === configuration.transformerName).length;
    return (configuration.isGenericASTM && this.edgeList.length > 1) ||
      (!configuration.isGenericASTM && configuration.isConfigured && duplicate > 1);
  }

  createOrEditConfiguration(selectedConfig: ParsingJobConfig) {
    if (selectedConfig.isGenericASTM) {
      this.createOrEditEdgeConfiguration(selectedConfig);
    } else {
      this.configureOrEditTransformer(selectedConfig);
    }
  }

  configureOrEditTransformer(selectedTransformer: ParsingJobConfig) {
    this.selectedTransformer = selectedTransformer;
    this.showTransformersForm = !this.showTransformersForm;
    this.showListing = false;
  }

  createOrEditEdgeConfiguration(selectedEdge?: ParsingJobConfig) {
    this.showEdgeForm = !this.showEdgeForm;
    this.showCommonForm = false;
    this.showListing = false;
    this.selectedInstruction = selectedEdge;
  }

  createConfiguration(transformerId?: string) {
    this.showCommonForm = true;
    this.showListing = false;
    this.selectedTransformerId = null;
    if (transformerId) {
      this.selectedTransformerId = transformerId;
    }
  }

  onDeleteConfigClicked(selectedConfig: ParsingJobConfig) {
    if (selectedConfig.isDeletable) {
      this.openConfirmDialog(selectedConfig);
    } else {
      this.dialog.open(InformativeMessageComponent, {
        width: '450px',
        data: {
          message: this.getDeleteNotPossibleErrorMessage(),
          okButtonText: this.getOkButtonLabel()
        }
      });
    }
  }

  openConfirmDialog(selectedConfig: ParsingJobConfig) {
    const displayName = selectedConfig.name;
    let dialogData;
    if (selectedConfig.isHavingMappings) {
      const warningMessage = this.getDeleteAssociationsWarningMessage();
      dialogData = { displayName, warningMessage };
    } else {
      dialogData = { displayName };
    }

    const dialogRef = this.dialog.open(ConfirmDialogDeleteComponent, {
      data: dialogData
    });
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.deleteConfiguration(selectedConfig);
        }
      });
  }

  deleteConfiguration(selectedConfig: ParsingJobConfig) {
    const deleteConfigPayload: DeleteConfiguration = {
      'parsingJobConfigId': selectedConfig.id,
      'locationId': this.labLocationId,
      'accountId': this.accountId
    };

    this.orchestratorApiService.deleteConfiguration(deleteConfigPayload)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        const index = this.instructions.configs.findIndex(
          i => i['id'] === selectedConfig.id
        );
        this.instructions.configs.splice(index, 1);
        this.store.dispatch(actions.connectivityActions.setConfigurationList({ configurationList: this.instructions }));
        this.setupConfigurations(this.instructions);
        this.appNavigationService.sendAuditTrailPayload({ ...deleteConfigPayload, ...selectedConfig }, AuditTrackingEvent.FileUpload,
          AuditTrackingAction.Delete, AuditTrackingActionStatus.Success, AuditTrackingAction.Delete);
      },
        error => {
          if (error.error && error.error.status === 'error') { }
          this.appNavigationService.sendAuditTrailPayload({ ...deleteConfigPayload, ...selectedConfig }, AuditTrackingEvent.FileUpload,
            AuditTrackingAction.Delete, AuditTrackingActionStatus.Failure, AuditTrackingAction.Delete);
        }
      );
  }

  showConfigurations(reloadNeeded?: boolean) {
    if (reloadNeeded) { this.getParsingInfo(); }
    if (this.showEdgeForm) {
      this.showEdgeForm = !this.showEdgeForm;
    } else if (this.showTransformersForm) {
      this.showTransformersForm = !this.showTransformersForm;
    }
    this.showListing = true;
    this.showCommonForm = false;
  }

  // checking Permissions
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  getDeleteAssociationsWarningMessage(): string {
    return this.getTranslation('CONFIGURATION.CONFIGURATIONHASMAPPINGSWARNING');
  }

  getDeleteNotPossibleErrorMessage(): string {
    return this.getTranslation('CONFIGURATION.CONFIGURATIONNOTDELETABLEERROR');
  }
  getOkButtonLabel(): string {
    return this.getTranslation('CONFIGURATION.OK');
  }

  getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
