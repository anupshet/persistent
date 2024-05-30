// © 2024 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Input, OnDestroy, OnInit, AfterViewInit, DoCheck, ChangeDetectorRef  } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { orderBy } from 'lodash';
import { TranslateService } from '@ngx-translate/core';

import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { LabInstrument, LabLocation, LabProduct, TreePill } from '../../../../contracts/models/lab-setup';
import { ProductLot } from '../../../../contracts/models/lab-setup/product-lots-list-point.model';
import { ProductMenuItem } from '../../../../contracts/models/lab-setup/product-list.model';
import { CodelistApiService } from '../../../../shared/api/codelistApi.service';
import * as fromNavigationSelector from '../../../../shared/navigation/state/selectors';
import * as fromAccountSelector from '../../../../shared/state/selectors';
import * as fromLabConfigSettingsSelector from '../../state/selectors';
import * as fromRoot from '../../state';
import * as actions from '../../state/actions';
import * as fromSelector from '../../state/selectors';
import * as selectors from '../../../../shared/navigation/state/selectors';
import { Settings, ControlSettingsValues, ControlConfig, NonBrControlConfig } from '../../../../contracts/models/lab-setup/settings.model';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { children, includeArchivedItems, instrumentId, isArchived, bioRadPlaceHolder, bioRadText, asc, lotNumber } from '../../../../core/config/constants/general.const';
import { LevelLoadRequest } from '../../../../contracts/models/portal-api/labsetup-data.model';
import { QueryParameter } from '../../../../shared/models/query-parameter';
import { ArchiveState } from '../../../../contracts/enums/lab-setup/archive-state.enum';
import * as duplicateLotsActions from '../../../../shared/state/actions';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { Permissions } from '../../../../security/model/permissions.model';
import { UnityNextTier } from '../../../../contracts/enums/lab-location.enum';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';

@Component({
  selector: 'unext-control-config',
  templateUrl: './control-config.component.html',
  styleUrls: ['./control-config.component.scss']
})
export class ControlConfigComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {

  public selectedNodeDisplayName: string;
  public instrumentId: string;
  public accountId: string;
  private destroy$ = new Subject<boolean>();
  public labConfigurationControlsList: ProductMenuItem[] = [];
  public settingsSpcRuleset: Settings;
  public currentlySelectedControls: Array<TreePill> = [];
  public isParentArchived: boolean;
  public lotList: Array<Array<ProductLot>> = [];
  public unityNextTierOptions = UnityNextTier;
  public labConfigControlList$ = this.store.pipe(select(fromSelector.getLabConfigControlList));
  public settingsSpcRulesetControl$ = this.store.pipe(select(fromLabConfigSettingsSelector.getSettings));
  labSetupControlHeaderTitle: string;
  navigationCurrentlySelectedNode$ = this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedNode));
  navigationCurrentlySelectedLeaf$ = this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedLeaf));
  navigationCurrentBranchState$ = this.store.pipe(select(fromNavigationSelector.getCurrentBranchState));
  labConfigAnalyteFloatPoint$ = this.store.pipe(select(fromLabConfigSettingsSelector.getFloatPointDetails));
  currentAccount$ = this.store.pipe(select(fromAccountSelector.getAccountState));
  currentLabLocation$ = this.store.pipe(select(fromAccountSelector.getCurrentLabLocation));

  sourceNode: TreePill;
  @Input() showSettings;
  @Input() hasNonBrLicense: boolean;
  floatPointData: number;
  instrumentDisplayName: string;
  isToggledToNotArchived: boolean;
  title: string;
  location: LabLocation;
  lotListOriginal: Array<Array<ProductLot>> = [];
  _lotsList: Array<Array<ProductLot>> = [];

  constructor(
    private store: Store<fromRoot.LabSetupStates>,
    private codeListService: CodelistApiService,
    private errorLoggerService: ErrorLoggerService,
    private portalAPIService: PortalApiService,
    public translate: TranslateService,
    private brPermissionsService: BrPermissionsService,
    private changeDetection: ChangeDetectorRef,
    private dateTimeHelper: DateTimeHelper,
  ) { }

  ngOnInit() {
    try {
      this.getCurrentAccount();
      this.labConfigAnalyteFloatPoint$.pipe(filter(floatData => !!floatData), takeUntil(this.destroy$))
        .subscribe(floatData => {
          this.floatPointData = floatData;
        });
      this.currentLabLocation$.pipe(filter(location => !!location), takeUntil(this.destroy$)).subscribe(location => {
          this.location = location;
      });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.ControlConfigComponent + blankSpace + Operations.OnInit)));
    }
  }

  ngAfterViewInit() {
    try {
      this.loadControls();
      this.loadSpcRuleSettings();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.ControlConfigComponent + blankSpace + Operations.AfterViewInit)));
    }
    this.changeDetection.detectChanges();
  }

  isDefineControlsClosed(value: boolean) {
    if(!value) {
      this.loadControls();
    }
  }

  ngDoCheck(): void {
    this.populateHeaderTitle(this.title);
  }

  // tslint:disable-next-line: no-shadowed-variable
  loadControlsIntoStore(instrumentId: string) {
    this.labConfigurationControlsList = [];
    this.lotList = [];
    this.store.dispatch(
      actions.LabConfigControlActions.loadControlList({ request: { accountId: this.accountId, instrumentId: instrumentId } })
    );
  }

  loadControls() {
    this.labConfigControlList$
      .pipe(filter(labConfigurationMasterControls => !!labConfigurationMasterControls), takeUntil(this.destroy$))
      .subscribe(labConfigurationMasterControls => {
        this.labConfigurationControlsList = [];
        this.labConfigurationControlsList = this.labConfigurationControlsList.concat(labConfigurationMasterControls);
      });
    this.loadHeaderTitleData();
  }


  loadSpcRuleSettings() {
    this.settingsSpcRulesetControl$
      .pipe(filter(settingsSpcRuleset => !!settingsSpcRuleset), takeUntil(this.destroy$))
      .subscribe(settingsSpcRuleset => {
        this.settingsSpcRuleset = settingsSpcRuleset;
        if (settingsSpcRuleset.archiveState === ArchiveState.NotArchived) {
          this.isToggledToNotArchived = false;
        }
      });
  }

  // This filtered array is passed to control-entry component input on changes
  onLoadLots(controlId: string, pointIndex: number): void {
    // AJT refactor this to append the lot list if it already exists for a control
    // look the productId value in the existing lotlists and if it matches, append instead of calling teh codelistService
    try {
      this.codeListService.getProductMasterLotsByProductId(controlId)
        .pipe(filter(productLots => !!productLots), takeUntil(this.destroy$))
        .subscribe(productLots => {
          const _lotList = [...this.lotList];
          this.lotList = [];
          _lotList[pointIndex] = productLots;
          this.lotList = [..._lotList];

          this.filterExpiredLotsAndSort();

        });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.ControlConfigComponent + blankSpace + Operations.OnLoadLots)));
    }
  }


  public filterExpiredLotsAndSort(): void {
    const arraySize = this.lotList.length;
    var num:number = 0;
    this._lotsList = this.lotList;

    // remove expired lots
    for(num=1;num<=arraySize;num++) {
      this._lotsList[num-1] = this._lotsList[num-1].filter(lot =>
        !this.dateTimeHelper.isExpired(lot.expirationDate));

    }

    // sort lots in lot number ascending order
    this._lotsList = this._lotsList.map((lots) =>
      orderBy(lots, [lotNumber], [asc])
    );
    this.lotList = this._lotsList;
  }



  saveConfigControl(controlEmitter: ControlSettingsValues) {
    try {
      const labControlsFormValue = controlEmitter.labConfigFormValues;
      const settings = controlEmitter.settings;
      const typeOfOperation = controlEmitter.typeOfOperation;
      if (labControlsFormValue.length > 0) {
        const labControls: LabProduct[] = [];
        labControlsFormValue.forEach(controlData => {
          const generatedControlData = new LabProduct();
          if (this.showSettings) {
            generatedControlData.displayName = controlData.displayName;
            generatedControlData.id = controlData.id;
          }
          generatedControlData.manufacturerId = controlData.manufacturerId;
          generatedControlData.productId = controlData.productId;
          generatedControlData.productMasterLotId = controlData.productMasterLotId;
          generatedControlData.productCustomName = controlData.customName;
          generatedControlData.parentNodeId = this.instrumentId;
          labControls.push(generatedControlData);
        });
        if (settings) {
          settings.entityType = EntityType.LabProduct;
        }
        const controlConfigEmitter: ControlConfig = {
          labControls: labControls, settings: settings,
          nodeType: settings.entityType, typeOfOperation: typeOfOperation
        };
        this.store.dispatch(actions.LabConfigControlActions.saveControl({ controlConfigEmitter }));
      } else {
        settings.entityType = EntityType.LabProduct;
        this.store.dispatch(actions.LabConfigSettingsActions.setSettings({ settings: settings }));
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.ControlConfigComponent + blankSpace + Operations.SaveConfigControl)));
    }
  }

  addNonBRControlDefinition(customControlEmitter: NonBrControlConfig) {
    try {
      this.store.dispatch(actions.LabConfigControlActions.addCustomControl({ customControlEmitter }));
    }
    catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.ControlConfigComponent + blankSpace + Operations.AddNonBRControlDefinition)));
    }
  }

  getCurrentAccount() {
    try {
      this.currentAccount$.pipe(take(1)).subscribe((res: any) => {
        this.accountId = res?.currentAccountSummary?.id;
      });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.ControlConfigComponent + blankSpace + Operations.OnInit)));
    }
  }
  loadHeaderTitleData() {
    try {
      this.navigationCurrentlySelectedNode$
        .pipe(filter(currentSelectedNode => !!currentSelectedNode), takeUntil(this.destroy$))
        .subscribe((currentSelectedNode) => {
          this.selectedNodeDisplayName = currentSelectedNode.displayName;
          if (currentSelectedNode.nodeType === EntityType.LabInstrument) {
            this.title = currentSelectedNode.displayName;
            this.populateHeaderTitle(this.title);
            this.instrumentDisplayName = currentSelectedNode.displayName;
            this.instrumentId = currentSelectedNode.id;
            this.loadControlsIntoStore(currentSelectedNode[instrumentId].toString());
            this.currentlySelectedControls = currentSelectedNode[children];
            this.isParentArchived = currentSelectedNode.isArchived;
          }
          if (currentSelectedNode.nodeType === EntityType.LabProduct) {
            this.sourceNode = currentSelectedNode;
            this.instrumentId = currentSelectedNode.parentNodeId;
            this.navigationCurrentBranchState$.pipe(filter((currentBranch: TreePill[]) => !!currentBranch), takeUntil(this.destroy$))
              .subscribe((currentBranch) => {
                currentBranch = currentBranch.filter(ele => ele.id === this.instrumentId);
                this.isParentArchived = (currentBranch && currentBranch.length > 0) ? currentBranch[0][isArchived] : false;
                if (currentBranch && currentBranch.length) {
                  /* When page relaoded in product data table page, children comes as null */
                  this.store.pipe(select(selectors.getIsArchiveItemsToggleOn), take(1))
                    .subscribe((isArchiveItemsToggleOn: boolean) => {
                      const queryParameter = new QueryParameter(includeArchivedItems, (isArchiveItemsToggleOn).toString());
                      this.portalAPIService.getLabSetupNode<LabInstrument>(
                        currentBranch[0].nodeType, currentBranch[0].id, LevelLoadRequest.LoadChildren, EntityType.None, [queryParameter])
                        .pipe(takeUntil(this.destroy$)).subscribe((node) => {
                          this.currentlySelectedControls = node.children;
                        });
                    });
                  this.instrumentDisplayName = currentBranch[0].displayName;
                  this.loadControlsIntoStore(currentBranch[0][instrumentId].toString());
                }
              });
          }
        });

      this.navigationCurrentlySelectedLeaf$
        .pipe(filter(selectedLeaf => !!selectedLeaf), takeUntil(this.destroy$))
        .subscribe((currentSelectedLeaf) => {
          if (currentSelectedLeaf.nodeType === EntityType.LabInstrument) {
            this.title = currentSelectedLeaf.displayName;
            this.populateHeaderTitle(this.title);
            this.instrumentId = currentSelectedLeaf.id;
            this.loadControlsIntoStore(currentSelectedLeaf[instrumentId].toString());
          } else if (currentSelectedLeaf.nodeType === EntityType.LabProduct) {
            this.sourceNode = currentSelectedLeaf;
          }
        });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.ControlConfigComponent + blankSpace + Operations.OnInit)));
    }
  }

  populateHeaderTitle(title): void {
    this.labSetupControlHeaderTitle = this.getTranslations('TRANSLATION.BIORADCONTROL') + ' ' + (title);
  }

  onDeleteControl(controlId: LabProduct) {
    try {
      this.store.dispatch(actions.LabConfigControlActions.deleteControl({ control: controlId }));
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.ControlConfigComponent + blankSpace + Operations.OnDelete)));
    }
  }

  onResetForm() {
    this.lotList = [];
  }

  private getTranslations(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(duplicateLotsActions.LabConfigDuplicateLotsActions.ClearState());
  }

  isDefineOwnControlAvailable(): boolean {
    return this.hasPermissionToAccess([Permissions.NonBRLotManagement, Permissions.NonBRLotManagementViewOnly]) && this.hasNonBrLicense;
  }

  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }
}
