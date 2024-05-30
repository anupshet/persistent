// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { combineLatest, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { LabInstrument, LabLocation } from '../../../../contracts/models/lab-setup';
import { LabInstrumentListPoint } from '../../../../contracts/models/lab-setup/instrument-list-point.model';
import { Manufacturer } from '../../../../contracts/models/lab-setup/manufacturer.model';
import { TreePill } from '../../../../contracts/models/lab-setup/tree-pill.model';
import { LevelLoadRequest } from '../../../../contracts/models/portal-api/labsetup-data.model';
import { CodelistApiService } from '../../../../shared/api/codelistApi.service';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import * as fromRoot from '../../state';
import * as fromAppState from '../../../../state/app.state';
import * as actions from '../../state/actions';
import * as duplicateLotsActions from '../../../../shared/state/actions';
import * as fromSelector from '../../state/selectors';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import * as fromSecuritySelector from '../../../../security/state/selectors';
import * as fromNavigationSelector from '../../../../shared/navigation/state/selectors';
import * as sharedStateSelector from '../../../../shared/state/selectors';
import { LabInstrumentValues } from '../../../../contracts/models/lab-setup/instrument.model';
import { DuplicateInstrumentRequest } from '../../../../contracts/models/lab-setup/duplicate-copy-request.model';
import { QueryParameter } from '../../../../shared/models/query-parameter';
import { includeArchivedItems } from '../../../../core/config/constants/general.const';
import { Utility } from '../../../../core/helpers/utility';
import { LocalizationService } from '../../../../shared/navigation/services/localizaton.service';

@Component({
  selector: 'unext-instrument-config',
  templateUrl: './instrument-config.component.html',
  styleUrls: ['./instrument-config.component.scss']
})
export class InstrumentConfigComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<boolean>();
  manufacturersList: Manufacturer[] = [];
  allInstrumentInDep: TreePill[];
  instrumentList: Array<Array<LabInstrumentListPoint>> = [];
  labSetupInstrumentHeaderTitle: string;
  selectedNodeDisplayName: string;
  labConfigManufacturers$ = this.store.pipe(select(fromSelector.getLabManufacturers));
  currentUserState$ = this.store.pipe(select(fromSecuritySelector.getCurrentUser));
  getIsArchiveItemsToggleOn$ = this.store.pipe(select(fromNavigationSelector.getIsArchiveItemsToggleOn));
  getCurrentLabLocation$ = this.store.pipe(select(sharedStateSelector.getCurrentLabLocation));
  departmentId: string;
  currentLocation: LabLocation;

  constructor(
    private store: Store<fromRoot.LabSetupStates>,
    private ngrxStore: Store<fromAppState.State>,
    private codeListService: CodelistApiService,
    private portalApiService: PortalApiService,
    private errorLoggerService: ErrorLoggerService,
    private translate: TranslateService,
    private localizationService: LocalizationService
  ) { }

  _currentNode: TreePill;
  get currentNode(): TreePill {
    return this._currentNode;
  }

  @Input('currentNode')
  set currentNode(value: TreePill) {
    this._currentNode = value;
    this.setTitle(value);
  }

  @Input() isParentArchived: boolean;

  ngOnInit() {
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.instrumentHeaderTitle();
    });
    try {
      this.loadManufacturers();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.InstrumentConfigComponent + blankSpace + Operations.OnInit)));
    }
  }

  loadAllInstrumentsList(parentNodeId) {
    try {
      combineLatest([this.getIsArchiveItemsToggleOn$, this.getCurrentLabLocation$]).pipe(take(1), takeUntil(this.destroy$))
        .subscribe(([isArchiveItemsToggleOn, location]) => {
          this.currentLocation = location;
          const queryParameter = new QueryParameter(includeArchivedItems, (isArchiveItemsToggleOn).toString());
          this.portalApiService.getLabSetupNode(Utility.getParentNodeType(EntityType.LabInstrument,
            location?.locationSettings.instrumentsGroupedByDept), parentNodeId,
            LevelLoadRequest.LoadChildren, EntityType.None, [queryParameter])
            .pipe(take(1), filter(departmentData => !!departmentData)).pipe(
              takeUntil(this.destroy$)).subscribe((departmentDetails) => {
                if (departmentDetails) {
                  const isDepartment = departmentDetails.nodeType === EntityType.LabDepartment;
                  this.allInstrumentInDep = [];
                  this.allInstrumentInDep = (isDepartment) ? departmentDetails.children :
                    departmentDetails.children?.filter(inst => inst.nodeType !== EntityType.Panel);
                }
              });
        });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.InstrumentConfigComponent + blankSpace + Operations.LoadAllInstrumentsList)));
    }
  }

  loadManufacturers() {
    this.store.dispatch(
      actions.LabConfigInstrumentActions.loadManufacturerList()
    );

    this.labConfigManufacturers$
      .pipe(filter(manufacturers => !!manufacturers), takeUntil(this.destroy$))
      .subscribe(manufacturers => {
        this.manufacturersList = manufacturers;
      });
  }

  onLoadInstruments(manufacturerId: string, pointIndex: number) {
    try {
      this.currentUserState$
        .pipe(filter(currentUser => !!currentUser), takeUntil(this.destroy$))
        .subscribe((currentUser) => {
          this.loadInstruments(manufacturerId, currentUser.accountNumber, pointIndex);
        });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.InstrumentConfigComponent + blankSpace + Operations.OnLoadInstruments)));
    }
  }

  saveLabConfigurationInstrument(labInstruments: LabInstrumentValues) {
    try {
      const labInstrumentInfo = labInstruments.labConfigFormValues;
      const archivedSettings = labInstruments.archivedSettings;
      const nodeType = labInstruments.nodeType;
      const typeOfOperation = labInstruments.typeOfOperation;
      const instrumentConfigEmitter: LabInstrumentValues = {
        labConfigFormValues: labInstrumentInfo,
        archivedSettings: archivedSettings,
        nodeType: nodeType,
        typeOfOperation: typeOfOperation
      };
      if (labInstrumentInfo.length > 0) {
        this.store.dispatch(
          actions.LabConfigInstrumentActions.saveInstruments({ labInstruments: instrumentConfigEmitter })
        );
      } else {
        this.store.dispatch(actions.LabConfigSettingsActions.setSettings({ settings: archivedSettings }));
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.InstrumentConfigComponent + blankSpace + Operations.SaveLabConfigurationInstrument)));
    }
  }

  private loadInstruments(manufacturerId: string, accountNumber: string, pointIndex: number) {
    this.codeListService.getInstruments(manufacturerId)
      .pipe(filter(instrumentList => !!instrumentList), takeUntil(this.destroy$))
      .subscribe(instrumentList => {
        const _instrumentList = Object.assign([], this.instrumentList);
        this.instrumentList = null;
        _instrumentList[pointIndex] = instrumentList;
        this.instrumentList = _instrumentList;
      });
  }

  setTitle(currentSelectedItem: TreePill) {
    try {
      if (currentSelectedItem) {
        if (currentSelectedItem.displayName) {
          this.selectedNodeDisplayName = currentSelectedItem.displayName;
        }
        if (currentSelectedItem.id) {
          this.departmentId = currentSelectedItem.id;
        }
        let parentNodeId;
        if (currentSelectedItem.nodeType === EntityType.LabInstrument) {
          parentNodeId = currentSelectedItem.parentNodeId;
        } else if (currentSelectedItem.nodeType === EntityType.LabDepartment || currentSelectedItem.nodeType === EntityType.LabLocation) {
          parentNodeId = currentSelectedItem.id;
        }
        this.loadAllInstrumentsList(parentNodeId);
        this.instrumentHeaderTitle();
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.InstrumentConfigComponent + blankSpace + Operations.SetTitle)));
    }
  }

  instrumentHeaderTitle(): void {
    this.labSetupInstrumentHeaderTitle = `${this.getTranslation('INSTRUMENTCONFIG.TITLE')} ${this.selectedNodeDisplayName}.`;
  }

  onDeleteInstrument(selectedNodeId: LabInstrument) {
    try {
      this.store.dispatch(actions.LabConfigInstrumentActions.deleteInstrument({ instrument: selectedNodeId }));
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.InstrumentConfigComponent + blankSpace + Operations.OnDelete)));
    }
  }

  restInstrumentConfigData() {
    this.instrumentList = [];
  }

  copyInstrument(copyNodeRequest: DuplicateInstrumentRequest[]): void {
    try {
      const copyInstrument = copyNodeRequest.map(intrumentData => ({ ...intrumentData, locationId: this.currentLocation?.id }));
      this.ngrxStore.dispatch
        (duplicateLotsActions.LabConfigDuplicateLotsActions.duplicateInstrumentRequest({ copyNodeRequest: copyInstrument }));
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.InstrumentConfigComponent + blankSpace + Operations.CopyRequest)));
    }
  }

  private getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.ngrxStore.dispatch(duplicateLotsActions.LabConfigDuplicateLotsActions.ClearState());
  }
}
