// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { Input, OnDestroy, OnChanges, SimpleChanges, ViewChild, EventEmitter, Output, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { combineLatest, Subject, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';

import * as fromRoot from '../../../../../state/app.state';
import * as sharedStateSelector from '../../../../../shared/state/selectors';
import { icons } from '../../../../../core/config/constants/icon.const';
import { IconService } from '../../../../../shared/icons/icons.service';
import { Icon } from '../../../../../contracts/models/shared/icon.model';
import { DynamicReportingService } from '../../../../../shared/services/reporting.service';
import { ErrorLoggerService } from '../../../../../shared/services/errorLogger/error-logger.service';
import {
  AnalyteResponse, ControlResponse, DepartmentResponse, GroupControlResponse,
  GroupInstrumentResponse, InstrumentResponse, LabConfigResponse
} from '../../../models/report-info';
import { ReportsGenericDialogComponent } from '../reports-generic-dialog/reports-generic-dialog.component';
import { IconType, ReportDialogType, StyleOfBtn, TypeOfDialog, TypeOfMessage, TemplateValidation } from '../../../models/report-dialog';
import { blankSpace, componentInfo, Operations } from '../../../../../core/config/constants/error-logging.const';
import { ErrorType } from '../../../../../contracts/enums/error-type.enum';
import { ITemplate, LabConfig, SelectionDirection } from '../../../reporting.enum';
import { ActionType } from '../../../../../contracts/enums/action-type.enum';
import { LabConfigKeys } from '../../../reporting.enum';
import { BrPermissionsService } from '../../../../../security/services/permissions.service';
import { Permissions } from '../../../../../security/model/permissions.model';
import { CommonService } from '../../services/common.service';
import { underscore } from '../../../../../core/config/constants/general.const';
import { DynamicReportsService } from '../../services/dynamic-reports.service';
import { cloneDeep } from 'lodash';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'unext-report-templates',
  templateUrl: './report-templates.component.html',
  styleUrls: ['./report-templates.component.scss'],
  providers: [CommonService]
})
export class ReportTemplatesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() allSelected: boolean;
  @Input() recentlySelectedTypes: Array<string> = [];
  @Input() sendTemplateDetails: ITemplate;
  @Input() isSearchEnabled: boolean;
  @ViewChild('selector') selectDropdown: MatSelect;
  private dialogRef: MatDialogRef<ReportsGenericDialogComponent>;
  private destroy$ = new Subject<boolean>();
  dropdownOpen = false;
  templateList: ITemplate[] = [];
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.templateMenu[24],
    icons.contentUpdate[24],
    icons.contentEdit[24],
    icons.contentDelete[24]
  ];
  selectedOption: ITemplate;
  accountId: string;
  locationId: string;
  showSaveNewTempButton = false;
  showClearTempButton = false;
  instrumentGroupByDept = true;
  isInstrumentChecked: boolean;
  isDepartmentChecked: boolean;
  isControlChecked: boolean;
  isAnalyteChecked: boolean;
  hasDepartmentChecked: boolean;
  isClear = false;
  actionType = ActionType;
  labConfigKeys = LabConfigKeys;
  permissions = Permissions;
  actionPermissions = {
    update: false,
    rename: false,
    delete: false
  };
  checkValidity = false;
  templateRowSelected: ITemplate;
  updateDisable: boolean;
  analyteFilter: number[] = [];
  departmentFilter: String[] = [];
  lotFilter = [];
  instrumentFilter: String[] = [];
  instrumentIds: String[] = [];
  isSelectedItemsUpdated = false;
  selectedTemplateId: string;
  reportData: ITemplate;
  lotIds: Array<string>;
  deptId: Array<string>;
  instrumentFilterArray: Array<String>;
  labConfig = LabConfig;
  selectedTemplateName: string;
  previousSelectedOption: ITemplate;

  @Input() labConfigData: LabConfigResponse;
  @Output() labConfigDataChange: EventEmitter<LabConfigResponse> = new EventEmitter<LabConfigResponse>();
  @Output() isClearSelection: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() templateLoaded: EventEmitter<ITemplate> = new EventEmitter<ITemplate>();
  @Output() emitlabConfigData: EventEmitter<LabConfigResponse> = new EventEmitter<LabConfigResponse>();
  @Output() setReportType: EventEmitter<string> = new EventEmitter<string>();
  @Output() setReportDate: EventEmitter<string> = new EventEmitter<string>();
  private isDataLoaded$: Subscription;

  constructor(private iconService: IconService,
    private store: Store<fromRoot.State>,
    private dynamicReportsService: DynamicReportingService,
    private errorLoggerService: ErrorLoggerService,
    private dialog: MatDialog,
    private brPermissionsService: BrPermissionsService,
    private translate: TranslateService,
    private dynamicReportsHelperService: DynamicReportsService,
    private commonService: CommonService) {
    this.iconService.addIcons(this.iconsUsed);
  }

  reportsTemplate = new FormGroup({
    templateControl: new FormControl(),
  });

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(sharedStateSelector.getCurrentLabLocation)),
      this.store.pipe(select(sharedStateSelector.getAuthState)),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([labLocation, authStateCurrent]) => {
        try {
          this.accountId = authStateCurrent.currentUser.accountId;
          this.locationId = labLocation.id;
        } catch (error) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(error.message));
        }
      });
    this.checkForPermissions();
    if (!this.sendTemplateDetails) {
      this.getTemplateList();
    }
    this.isDataLoaded$ = this.dynamicReportsService.getLoadedStatus().subscribe(templateDetails => {
      this.sendTemplateDetails = templateDetails;
      this.getTemplateList();
    });
    this.dynamicReportsService.getResetStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        setTimeout(() => {
          this.clearSelectionsAndDisableButtons(this.actionType.reset);
          this.selectDropdown.value = [];
        }, 0);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.labConfigData = changes?.labConfigData?.currentValue; --will be removed later
    this.checkForSelectedItems();
    // Enable/Disable Update button for selected template
    this.compareData();
  }

  compareData() {
    this.departmentFilter = [];
    this.instrumentFilter = [];
    this.lotFilter = [];
    this.analyteFilter = [];

    const isDeptChecked = this.labConfigData?.departments?.some(x => x.isChecked);
    const isInstrumentChecked = this.labConfigData?.instruments?.some(x => x.isChecked);
    const isControlChecked = this.labConfigData?.controls?.some(x => x.isChecked);
    const isAnalyteChecked = this.labConfigData?.analytes?.some(x => x.isChecked);

    if (!isDeptChecked && !isInstrumentChecked && !isControlChecked && !isAnalyteChecked) {
      this.isSelectedItemsUpdated = true;
      this.dynamicReportsHelperService.setTemplateUpdated(this.isSelectedItemsUpdated);

    } else if (this.selectedOption) {
      this.labConfigData?.analytes?.forEach((analyte: AnalyteResponse) => {
        if (analyte.isChecked) {
          this.analyteFilter.push(analyte.analyteId);
        }
      });

      this.labConfigData?.departments?.forEach((dept: DepartmentResponse) => {
        if (dept.isChecked) {
          this.departmentFilter.push(dept.id);
        }
      });

      this.labConfigData?.instruments?.forEach((instrument: GroupInstrumentResponse) => {
        instrument.groups.forEach((group: InstrumentResponse) => {
          if (group.isChecked) {
            this.instrumentFilter.push(group.id);
          }
        });
      });

      this.instrumentIds = this.labConfigData?.instruments?.map((instrument) =>
        instrument.groups.map((group) => group.id)
      )
        .reduce((prev, current) => prev.concat(current), []);

      if (this.instrumentIds) {
        this.labConfigData?.controls?.forEach((control: GroupControlResponse) => {
          control.groups.forEach((group: ControlResponse) => {
            if (group.isChecked && this.instrumentIds.includes(group.parentId)) {
              this.lotFilter.push(group.id);
            }
          });
        });
      }

      const filterCondition = {
        departmentFilter: this.departmentFilter,
        instrumentFilter: this.instrumentFilter,
        lotFilter: this.lotFilter,
        analyteFilter: this.analyteFilter
      };

      const analyteFlag = this.matchValues(filterCondition?.analyteFilter,
        this.selectedOption?.templateBody?.filterCondition?.analyteFilter);
      const instrumentFlag = this.matchValues(filterCondition?.instrumentFilter,
        this.selectedOption?.templateBody?.filterCondition?.instrumentFilter);

      const lotFlag = this.matchValues(filterCondition?.lotFilter,
        this.selectedOption?.templateBody?.filterCondition?.lotFilter);

      const departmentFlag = this.matchValues(filterCondition?.departmentFilter,
        this.selectedOption?.templateBody?.filterCondition?.departmentFilter);

      this.isSelectedItemsUpdated = analyteFlag && instrumentFlag && lotFlag && departmentFlag || (!(this.recentlySelectedTypes &&
        this.recentlySelectedTypes.length > 0));

        this.dynamicReportsHelperService.setTemplateUpdated(this.isSelectedItemsUpdated);
    }
  }

  matchValues(filterCondition, selectedTemplate): boolean {
    return (
      filterCondition?.length === selectedTemplate?.length &&
      filterCondition.every((element_1) =>
        selectedTemplate.some(
          (element_2) =>
            element_1 === element_2
        )
      )
    );
  }

  getTemplateList(actionType?: string) {
    this.dynamicReportsService.getTemplateList(this.locationId)
      .pipe(take(1))
      .subscribe((response) => {
        if (response.length) {
          this.templateList = response;
          if (actionType === this.actionType.insert || actionType === this.actionType.rename) {
            const index = this.templateList.findIndex(x => this.selectedOption?.id === x.id);
            this.reportsTemplate.controls['templateControl'].setValue(this.templateList[index]);
            this.selectDropdown.value = this.selectedOption;
            actionType = null;
          }

          if (this.sendTemplateDetails) {
            this.sendTemplateDetails.isEditReport = false;
            this.setTemplateFromPreview();
          }
        } else {
          this.templateList = [];
        }
      }, (error) => {
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(error.message));
      });
  }

  checkForSelectedItems(): boolean {
    if (this.labConfigData) {
      this.labConfigData.locations?.forEach((location) => {
        this.instrumentGroupByDept = location.instrumentGroupByDept;
      });

      if (this.instrumentGroupByDept) {
        this.isDepartmentChecked = this.labConfigData.departments.some(x => x.isChecked);
      }
      this.isInstrumentChecked = this.labConfigData.instruments.some(x => x.isChecked);
      this.isControlChecked = this.labConfigData.controls.some(x => x.isChecked);
      this.isAnalyteChecked = this.labConfigData.analytes.some(x => x.isChecked);
      const allCheck = this.isInstrumentChecked || this.isControlChecked || this.isAnalyteChecked;
      if (allCheck) {
        this.showSaveNewTempButton = true;
      } else {
        this.showSaveNewTempButton = false;
      }
      return allCheck;
    }
  }

  menuOpened(templateSelected: ITemplate) {
    this.templateRowSelected = templateSelected;
  }

  menuClosed() {
    this.selectDropdown.close();
  }

  templateOnSelection(templateSelected: MatSelectChange) {
    this.templateLoaded.emit(templateSelected.value);
    // Has the user checked any item
    const isChecked = this.checkForSelectedItems();
    this.isSelectedItemsUpdated = true;
    if (isChecked) { // here we need to check for templateValid
      this.callGenericDialog();
    } else {
      this.checkForTempValidity();
    }
    // enable clear template button
    this.showClearTempButton = true;
  }

  checkForTempValidity() {
    const isTemplateValid = this.validateTemplate();
    if (isTemplateValid === TemplateValidation.Missing) {
      const titleMessage = this.getTranslation('LABCONFIGSELECTION.TEMPLATEMISSING');
      const messageContent = [this.getTranslation('LABCONFIGSELECTION.TEMPLATEMISSINGMESSAGE')];
      this.openGenericDialog(TypeOfDialog.doubleBlock, IconType.CardWarning, titleMessage, messageContent,
        this.getTranslation('LABCONFIGSELECTION.TEMPLATELOADANYWAYS'),
        this.getTranslation('LABCONFIGSELECTION.CANCEL'), StyleOfBtn.SolidButton,
        StyleOfBtn.OutlineButton, false, null, this.actionType.loadTemplateMissing, false,
        IconType.RedWarning, TypeOfMessage.Error);
    } else if (isTemplateValid === TemplateValidation.AllMissing) {
      const titleMessage = this.getTranslation('LABCONFIGSELECTION.TEMPLATEUNABLE');
      const messageContent = [this.getTranslation('LABCONFIGSELECTION.TEMPLATEUNABLEMESSAGEFIRST'),
        this.getTranslation('LABCONFIGSELECTION.TEMPLATEUNABLEMESSAGESECOND')];

      const hideDeleteTemplateBtn = this.actionPermissions.delete && this.selectedOption?.isOwner ? false : true;
      const deleteTemplateBtn = !hideDeleteTemplateBtn ?
        this.getTranslation('LABCONFIGSELECTION.DELETETEMPLATE') : null;
      const deleteTemplateBtnStyle = !hideDeleteTemplateBtn ?
      StyleOfBtn.OutlineButton : null;

      this.openGenericDialog(TypeOfDialog.doubleBlock, IconType.NotInterested, titleMessage, messageContent,
        this.getTranslation('LABCONFIGSELECTION.CLOSE'),
        deleteTemplateBtn,
        StyleOfBtn.SolidButton, deleteTemplateBtnStyle, false, null, this.actionType.templateUnableToLoad, false,
        IconType.RedWarning, TypeOfMessage.Error);
    } else if (isTemplateValid === TemplateValidation.AllFound) {
      this.setReportType.emit(this.selectedOption?.templateBody?.filterCondition?.reportType);
      this.loadItems();
    }
  }

  loadItems() {
    this.previousSelectedOption = this.selectedOption,
    this.clearTemplate(false);
    setTimeout(() => {
      this.selectItems();
      this.showClearTempButton = true;
      this.selectDropdown.close();
    }, 10);
  }

  validateTemplate(): string {
    let allInstrumentFound, allLotFound, allDeptFound, allAnalyteFound;
    let instrumentMatchCount = 0;
    let lotMatchCount = 0;
    let deptMatchCount = 0;
    let analyteMatchCount = 0;
    let returnString: string;

    const selectedTemplateInstrumentLength = this.selectedOption?.templateBody?.filterCondition?.instrumentFilter?.length;
    const selectedTemplateDeptLength = this.selectedOption?.templateBody?.filterCondition?.departmentFilter?.length;
    const selectedTemplateLotLength = this.selectedOption?.templateBody?.filterCondition?.lotFilter?.length;
    const selectedTemplateAnalyteLength = this.selectedOption?.templateBody?.filterCondition?.analyteFilter?.length;

    // check for any template missing items
    this.selectedOption?.templateBody?.filterCondition?.instrumentFilter?.forEach((instrumentIdFromTemplate: string) => {
      this.labConfigData?.instruments?.forEach((instrument: GroupInstrumentResponse) => {
        instrument.groups.forEach((group: InstrumentResponse) => {
          if (group.id === instrumentIdFromTemplate) {
            instrumentMatchCount++;
          }
        });
      });
    });

    if (instrumentMatchCount === selectedTemplateInstrumentLength) {
      allInstrumentFound = true;
    } else if (instrumentMatchCount < selectedTemplateInstrumentLength && instrumentMatchCount !== 0) {
      allInstrumentFound = false;
    }

    const outputArray = Array.from(new Set(this.selectedOption?.templateBody?.filterCondition?.lotFilter));

    outputArray.forEach((lotId) => {
      this.labConfigData?.controls.forEach((control: GroupControlResponse) => {
        control.groups.forEach((group: ControlResponse) => {
          if (group.id === lotId && this.selectedOption?.templateBody?.filterCondition?.instrumentFilter.
            some(x => x === group.parentId)) {
            lotMatchCount++;
          }
        });
      });
    });

    if (lotMatchCount === selectedTemplateLotLength) {
      allLotFound = true;
    } else if (lotMatchCount < selectedTemplateLotLength && lotMatchCount !== 0) {
      allLotFound = false;
    }

    this.selectedOption?.templateBody?.filterCondition?.departmentFilter?.forEach((departmentId: string) => {
      this.labConfigData?.departments?.forEach((dept: DepartmentResponse) => {
        if (dept.id === departmentId) {
          deptMatchCount++;
        }
      });
    });

    if (deptMatchCount === selectedTemplateDeptLength) {
      allDeptFound = true;
    } else if (deptMatchCount < selectedTemplateDeptLength && deptMatchCount !== 0) {
      allDeptFound = false;
    }
    const controlGroups = this.labConfigData?.controls?.map(x => x.groups).flat();
    this.selectedOption?.templateBody?.filterCondition?.analyteFilter?.forEach((analyteId: number) => {
      this.labConfigData?.analytes?.forEach((analyte: AnalyteResponse) => {
        const lot = controlGroups.filter(x => analyte.parentId?.includes(x.id)).map(x => x.id);

        if (analyte.analyteId === analyteId &&
          this.selectedOption?.templateBody?.filterCondition?.lotFilter?.some(x => lot.indexOf(x) > -1)) {
          analyteMatchCount++;
        }
      });
    });

    if (analyteMatchCount === selectedTemplateAnalyteLength) {
      allAnalyteFound = true;
    } else if (analyteMatchCount < selectedTemplateAnalyteLength && analyteMatchCount !== 0) {
      allAnalyteFound = false;
    }

    if (lotMatchCount === 0 || instrumentMatchCount === 0 || analyteMatchCount === 0) {
      return returnString = TemplateValidation.AllMissing;
    }

    if ((allInstrumentFound && allLotFound && allDeptFound && allAnalyteFound)
      || (allInstrumentFound && allDeptFound && (selectedTemplateLotLength === 0 || selectedTemplateAnalyteLength === 0))) {
      return TemplateValidation.AllFound;
    } else if (!allInstrumentFound && !allLotFound && !allAnalyteFound && !allDeptFound &&
      (allInstrumentFound === undefined && allLotFound === undefined && allAnalyteFound === undefined && allDeptFound === undefined)) {
      return returnString = TemplateValidation.AllMissing;
    } else if (!allInstrumentFound || !allLotFound || !allDeptFound || !allAnalyteFound) {
      return returnString = TemplateValidation.Missing;
    }
  }

  callGenericDialog() {
    const titleMessage = this.getTranslation('LABCONFIGSELECTION.LOADINGTEMPLATE');
    const messageContent = [this.getTranslation('LABCONFIGSELECTION.LOADINGTEMPLATECONFIRMATION'),
    this.getTranslation('LABCONFIGSELECTION.LOADINGTEMPLATECONFIRMATIONSELECTIONCHANGE')];
    this.openGenericDialog(TypeOfDialog.doubleBlock, IconType.Reload, titleMessage, messageContent,
      this.getTranslation('LABCONFIGSELECTION.LOADINGTEMPLATE'),
      this.getTranslation('LABCONFIGSELECTION.CANCEL'),
      StyleOfBtn.SolidButton, StyleOfBtn.OutlineButton, false, null, this.actionType.loadTemplate,
      true, IconType.YellowWarning, TypeOfMessage.Warning);
  }

  openGenericDialog(dialogType: TypeOfDialog, titleIcon: IconType, titleMessage: string,
    messageContent: string[], button1: string, button2: string, btn1Style, btn2Style, dialogFullWidth: boolean,
    templateData: ITemplate, action: string, checkValidity: boolean, messageIcon?: IconType, messageType?: TypeOfMessage, data?: any) {
    const dialogMessageContent: ReportDialogType = {
      dialogType: dialogType,
      titleIcon: titleIcon,
      titleMessage: titleMessage,
      messageIcon: messageIcon,
      messageContent: messageContent,
      messageType: messageType,
      simpleMessageList: dialogType === TypeOfDialog.SimpleBlock ? messageContent : null,
      fullwidth: dialogFullWidth,
      buttonsList: [{
        btnName: button1,
        btnStyle: btn1Style
      },
      {
        btnName: button2,
        btnStyle: btn2Style
      }],
      templateData: cloneDeep(templateData),
      isRename: action === this.actionType.rename ? true : false,
    };
    this.dialogRef = this.dialog.open(ReportsGenericDialogComponent, {
      panelClass: ['report-generic-container'],
      data: dialogMessageContent,
      autoFocus: false
    });
    this.dialogRef.afterClosed().pipe(
      takeUntil(this.destroy$))
      .subscribe(value => {
        if (!value['buttonIndex']) {
          if (checkValidity) {
            this.checkForTempValidity();
          }
          if (action === this.actionType.loadTemplate || action === this.actionType.loadTemplateMissing) {
            if (!checkValidity) {
              this.setReportType.emit(this.selectedOption?.templateBody?.filterCondition?.reportType);
              this.loadItems();
            }
            if (checkValidity && action === this.actionType.loadTemplateMissing) {
              this.setReportType.emit(this.selectedOption?.templateBody?.filterCondition?.reportType);
              this.loadItems();
            }
          }
          if (action === this.actionType.delete) {
            this.deleteTemplate(templateData);
          }
          if (action === this.actionType.clear) {
            this.selectDropdown.value = [];
            this.clearSelectionsAndDisableButtons();
            this.setReportType.emit(this.actionType.delete);
            this.selectDropdown.close();
          }
          if (action === this.actionType.update) {
            this.updateTemplateValue(action, data);
            // this.isSelectedItemsUpdated = true;
          } else if (action === this.actionType.rename) {
            titleMessage = this.getTranslation('LABCONFIGSELECTION.RENAMETEMPLATE');
            messageContent = [this.getTranslation('LABCONFIGSELECTION.RENAMETEMPLATESUCCESSDIALOG')];
            this.openActionSuccessDialog(TypeOfDialog.SingleBlock, IconType.ContentEdit, titleMessage, messageContent,
              this.actionType.rename, null);
          } else if (action === this.actionType.insert) {
            if (value?.templateInfo?.hasOwnProperty('templateName')) {
              this.selectedOption = value.templateInfo;
            }
            titleMessage = this.getTranslation('LABCONFIGSELECTION.TEMPLATESAVETITLEFOOTER');
            messageContent = [this.getTranslation('LABCONFIGSELECTION.PREVIEWINSERTTEMPLATESUCCESSDIALOG')];
            this.openActionSuccessDialog(TypeOfDialog.SingleBlock, IconType.ContentCopy, titleMessage, messageContent,
              this.actionType.insert, value.templateInfo);
          } else if (action === this.actionType.templateUnableToLoad) {
            this.clearTemplateFromParent();
            this.selectDropdown.close();
            this.setReportType.emit(this.actionType.delete);
          }
        } else if (value['buttonIndex'] === -1) {
          this.dialogRef.close();
          if (action === this.actionType.templateUnableToLoad) {
            this.clearTemplateFromParent();
            this.selectDropdown.close();
            this.setReportType.emit(this.actionType.delete);
          }
        } else if (value['buttonIndex']) {
          if (action === this.actionType.templateUnableToLoad) {
            this.deleteTemplate();
          } else if (action === this.actionType.loadTemplate || action === this.actionType.loadTemplateMissing) {
            if (!this.previousSelectedOption) { // template selected for first time but user clicked Cancel to abort the load
              this.selectDropdown.value = [];
              this.showClearTempButton = false;
            } else {
              const index = this.templateList.findIndex(x => this.previousSelectedOption?.id === x.id);
              this.reportsTemplate.controls['templateControl'].setValue(this.templateList[index]);
            }
          }
        }
      }, (err) => {
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
            (componentInfo.LabconfigSelectionComponent + blankSpace + Operations.CloseDialog)));
      });
  }

  selectItems() {
    const selectedTemplateInstrument = this.selectedOption?.templateBody?.filterCondition?.instrumentFilter;
    const selectedTemplateDept = this.selectedOption?.templateBody?.filterCondition?.departmentFilter;
    const selectedTemplateLot = this.selectedOption?.templateBody?.filterCondition?.lotFilter;
    const selectedTemplateAnalyte = this.selectedOption?.templateBody?.filterCondition?.analyteFilter;
    const directionIndex = this.selectedOption?.templateBody?.filterCondition?.filterBaseColumn;

    // check select items from template
    this.labConfigData?.instruments?.forEach((instrument: GroupInstrumentResponse) => {
      instrument.groups.forEach((group: InstrumentResponse) => {
        if (directionIndex && directionIndex !== SelectionDirection.instrument) {
          group.isFiltered = true;
          group.isChecked = false;
        }
        if (selectedTemplateInstrument && selectedTemplateInstrument.some(instrumentObj => instrumentObj === group.id)) {
          group.isChecked = true;
          group.isFiltered = false;
        }
      });
      instrument.isChecked = instrument.groups.some(group => group.isChecked);
      instrument.isFiltered = !instrument.groups.some(group => !group.isFiltered);
    });

    this.labConfigData?.controls?.forEach((control: GroupControlResponse) => {
      control.groups.forEach((group: ControlResponse) => {
        if (directionIndex && directionIndex !== SelectionDirection.control) {
          group.isFiltered = true;
          group.isChecked = false;
        }
        if (selectedTemplateLot && selectedTemplateLot.some(controlObj => controlObj === group.id) &&
        selectedTemplateInstrument && selectedTemplateInstrument.some(instrumentObj => instrumentObj === group.parentId)) {
          group.isChecked = true;
          group.isFiltered = false;
        }
      });
      control.isChecked = control.groups.some(group => group.isChecked);
      control.isFiltered = !control.groups.some(group => !group.isFiltered);
    });

    this.labConfigData?.departments?.forEach((dept: DepartmentResponse) => {
      if (directionIndex && directionIndex !== SelectionDirection.department) {
        dept.isFiltered = true;
        dept.isChecked = false;
      }
      if (selectedTemplateDept && selectedTemplateDept.some(deptObj => deptObj === dept.id)) {
        dept.isChecked = true;
        dept.isFiltered = false;
      }
    });

    const controlGroups = this.labConfigData?.controls?.map(control => control.groups).flat();
    this.labConfigData?.analytes?.forEach((analyte: AnalyteResponse) => {
      if (directionIndex && directionIndex !== SelectionDirection.analyte) {
        analyte.isFiltered = true;
        analyte.isChecked = false;
      }
      const lot = controlGroups.filter(group => analyte.parentId?.includes(group.id)).map(group => group.id);
      if (selectedTemplateAnalyte && selectedTemplateAnalyte.some(analyteObj => analyteObj === analyte.analyteId) &&
        this.selectedOption?.templateBody?.filterCondition?.lotFilter?.some(lotObj => lot.indexOf(lotObj) > -1)) {
        analyte.isChecked = true;
        analyte.isFiltered = false;
      }
    });
    this.labConfigData.directionIndex = directionIndex;
    // Will remove this commented code in next PR
    // selectedTemplateAnalyte?.forEach((analyteId: number) => {
    //   this.labConfigData?.analytes?.forEach((analyte: AnalyteResponse) => {
    //     if (analyte.analyteId === analyteId) {
    //       analyte.isChecked = true;
    //       analyte.isFiltered = false;
    //     }
    //   });
    // });
    this.labConfigData.isTemplate = true;
    this.emitlabConfigData.emit({ ...this.labConfigData });
  }

  async saveNewTemplate() {
    const { departmentList, instrumentList, controlList, analyteList, isSelectionValid, canProceed, directionIndex }
      = this.commonService.filterLabConfigData(this.labConfigData);
    if (!isSelectionValid) {
      const isContinue = await this.commonService.openSelectionsDialog(this.dialogRef, ReportsGenericDialogComponent,
        TypeOfDialog.SimpleBlock, [
        canProceed ? this.getTranslation('LABCONFIGSELECTION.SELECTIONCONFIRMATIONONE') :
          this.getTranslation('LABCONFIGSELECTIONSELECTIONCONFIRMATIONONECANNOTPROCEED'),
        canProceed ? this.getTranslation('LABCONFIGSELECTION.RESETSELECTIONSDIALOGMESSAGETWO') :
          this.getTranslation('LABCONFIGSELECTION.SELECTIONCONFIRMATIONTWOCANNOTPROCEED')
      ],
        [
          {
            btnName: this.getTranslation('LABCONFIGSELECTION.CONTINUEBUTTONTEXT'), btnStyle: StyleOfBtn.SolidButton,
            btnDisable: !canProceed
          },
          { btnName: this.getTranslation('LABCONFIGSELECTION.CANCEL'), btnStyle: StyleOfBtn.OutlineButton },
        ], true, this.actionType.insert);
      if (!isContinue) {
        return;
      }
    }
    const reportData: ITemplate = {
      labLocationId: this.locationId,
      templateName: ''
    };
    reportData.templateBody = {
      filterCondition: {
        departmentFilter: departmentList,
        instrumentFilter: instrumentList,
        lotFilter: controlList,
        analyteFilter: analyteList,
        reportType: this.reportTypeCalculate(),
        filterBaseColumn: directionIndex
      }
    };
    this.selectDropdown.close();
    const titleMessage = this.getTranslation('LABCONFIGSELECTION.TEMPLATESAVETITLEFOOTER');
    this.openGenericDialog(TypeOfDialog.FormBlock, IconType.ContentCopy, titleMessage, [],
      this.getTranslation('LABCONFIGSELECTION.TEMPLATESAVE'),
      this.getTranslation('LABCONFIGSELECTION.CANCEL'),
      StyleOfBtn.SolidButton, StyleOfBtn.OutlineButton, false, reportData, this.actionType.insert,
      false, IconType.YellowWarning, TypeOfMessage.Warning);
  }


  /**
   *Clear the template selected checkbox and selected dropdown value
   * @param isClear If true then Clear Template button is clicked else if false clear the selections only
   * for selecting a new template
   */
  clearTemplate(isClear: boolean) {
    if (isClear) {
      this.previousSelectedOption = null;
      const simpleMessageList = [this.getTranslation('LABCONFIGSELECTION.RESETSELECTIONSDIALOGMESSAGEONE'),
      this.getTranslation('LABCONFIGSELECTION.RESETSELECTIONSDIALOGMESSAGETWO')];

      this.openGenericDialog(TypeOfDialog.SimpleBlock, null, null, simpleMessageList,
        this.getTranslation('LABCONFIGSELECTION.CONTINUEBUTTONTEXT'),
        this.getTranslation('LABCONFIGSELECTION.CANCEL'),
        StyleOfBtn.SolidButton, StyleOfBtn.OutlineButton, true, null, this.actionType.clear, false);
    } else if (!isClear) {
      this.clearSelectionsAndDisableButtons();
    }
  }

  clearSelectionsAndDisableButtons(actionType?: string) {
    if (actionType === this.actionType.reset) {
      this.previousSelectedOption = null;
    }
    this.showClearTempButton = false;
    this.isClear = !this.isClear;
    this.isClearSelection.emit(this.isClear);
    this.showSaveNewTempButton = false;
    this.compareData();
  }

  clearTemplateFromParent(isDateChange?: boolean) {
    this.previousSelectedOption = null;
    this.selectDropdown.value = [];
    this.showClearTempButton = false;
    this.showSaveNewTempButton = false;
    if (!isDateChange) {
      this.isClear = !this.isClear;
      this.isClearSelection.emit(this.isClear);
    }
    this.compareData();
  }

  async performAction(action: string) {
    let titleMessage: string;
    let messageContent: string[];
    switch (action) {
      case this.actionType.update:
        const { departmentList, instrumentList, controlList, analyteList, isSelectionValid, canProceed, directionIndex }
          = this.commonService.filterLabConfigData(this.labConfigData);
        if (!isSelectionValid) {
          const isContinue = await this.commonService.openSelectionsDialog(this.dialogRef, ReportsGenericDialogComponent,
            TypeOfDialog.SimpleBlock, [
            canProceed ? this.getTranslation('LABCONFIGSELECTION.SELECTIONCONFIRMATIONONE') :
              this.getTranslation('LABCONFIGSELECTION.SELECTIONCONFIRMATIONONECANNOTPROCEED'),
            canProceed ? this.getTranslation('LABCONFIGSELECTION.RESETSELECTIONSDIALOGMESSAGETWO') :
              this.getTranslation('LABCONFIGSELECTION.SELECTIONCONFIRMATIONTWOCANNOTPROCEED')
          ],
            [
              {
                btnName: this.getTranslation('LABCONFIGSELECTION.CONTINUEBUTTONTEXT'),
                btnStyle: StyleOfBtn.SolidButton,
                btnDisable: !canProceed
              },
              {
                btnName: this.getTranslation('LABCONFIGSELECTION.CANCEL'),
                btnStyle: StyleOfBtn.OutlineButton
              },
            ], true, this.actionType.insert);
          if (!isContinue) {
            return;
          }
        }
        titleMessage = this.getTranslation('LABCONFIGSELECTION.UPDATETEMPLATE');
        messageContent = [this.getTranslation('LABCONFIGSELECTION.UPDATETEMPLATECONFIRMATIONDIALOG')];
        this.openGenericDialog(TypeOfDialog.SingleBlock, IconType.ContentUpdate, titleMessage,
          messageContent, this.getTranslation('REPORTTEMPLATES.UPDATE'),
          this.getTranslation('LABCONFIGSELECTION.CANCEL'),
          StyleOfBtn.SolidButton, StyleOfBtn.OutlineButton, false, null, action, false, null, null,
          { departmentList, instrumentList, controlList, analyteList, directionIndex });
        break;
      case this.actionType.rename:
        titleMessage = this.getTranslation('LABCONFIGSELECTION.RENAMETEMPLATE');
        this.openGenericDialog(TypeOfDialog.FormBlock, IconType.ContentCopy, titleMessage,
          messageContent, this.getTranslation('LABCONFIGSELECTION.TEMPLATESAVE'),
          this.getTranslation('LABCONFIGSELECTION.CANCEL'),
          StyleOfBtn.SolidButton, StyleOfBtn.OutlineButton, false, this.templateRowSelected, action, false);
        break;
      case this.actionType.delete:
        titleMessage = this.getTranslation('LABCONFIGSELECTION.DELETETEMPLATE');
        messageContent = [this.getTranslation('LABCONFIGSELECTION.DELETETEMPLATECONFIRMATIONDIALOG')];
        this.openGenericDialog(TypeOfDialog.doubleBlock, IconType.ContentDelete, titleMessage,
          messageContent,
          this.getTranslation('LABCONFIGSELECTION.DELETETEMPLATE'),
          this.getTranslation('LABCONFIGSELECTION.CANCEL'),
          StyleOfBtn.ErrorSolidButton, StyleOfBtn.OutlineButton, false, this.templateRowSelected,
          action, false, IconType.RedWarning, TypeOfMessage.Error);
        break;
    }
  }

  updateTemplateValue(action: string, data: any) {
    const { departmentList, instrumentList, controlList, analyteList, directionIndex } = data;
    let titleMessage: string;
    let messageContent: string[];
    this.reportData = {
      id: this.selectDropdown.value.id,
      labLocationId: this.locationId,
      templateName: this.selectDropdown.value.templateName,
    };
    if (action === this.actionType.update) {
      this.reportData.templateBody = {
        filterCondition: {
          departmentFilter: departmentList,
          instrumentFilter: instrumentList,
          lotFilter: controlList,
          analyteFilter: analyteList,
          reportType: this.reportTypeCalculate(),
          filterBaseColumn: directionIndex
        }
      };
    }
    this.dynamicReportsService.updateTemplate(this.reportData)
      .pipe(take(1))
      .subscribe(
        (response) => {
          if (response) {
            titleMessage = this.getTranslation('LABCONFIGSELECTION.UPDATETEMPLATE');
            messageContent = [this.getTranslation('LABCONFIGSELECTION.UPDATETEMPLATESUCCESSDIALOG')];
            this.selectedOption.templateBody.filterCondition.departmentFilter =
              this.reportData?.templateBody?.filterCondition?.departmentFilter;
            this.selectedOption.templateBody.filterCondition.instrumentFilter =
              this.reportData?.templateBody?.filterCondition?.instrumentFilter;
            this.selectedOption.templateBody.filterCondition.lotFilter =
              this.reportData?.templateBody?.filterCondition?.lotFilter;
            this.selectedOption.templateBody.filterCondition.analyteFilter =
              this.reportData?.templateBody?.filterCondition?.analyteFilter;
            this.selectedOption.templateBody.filterCondition.reportType =
              this.reportData?.templateBody?.filterCondition?.reportType;
            this.openActionSuccessDialog(TypeOfDialog.SingleBlock, IconType.ContentUpdate, titleMessage, messageContent,
              this.actionType.update);
            this.setReportType.emit(this.selectedOption.templateBody.filterCondition.reportType);
          }
        },
        (error) => {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(error.message));
        });
  }

  deleteTemplate(templateData?: ITemplate) {
    const selectedDropdownValue = this.selectedOption;
    // When Template validation returns All item missing, then For that Delete template, we need to load templateData with selectedOption
    // If templateData is not coming that means, template is unable to load which means template validation is All items missing
    // and templateRowSelected data cannot be taken as we havenot clicked on 3 dots to delete, so we need to send the selectedOptions
    // id here
    if (templateData === null || templateData === undefined || templateData?.id === undefined) {
      templateData = this.selectedOption;
    }
    this.dynamicReportsService.deleteTemplate(templateData.id)
      .pipe(take(1))
      .subscribe(
        (response) => {
          if (response) {
            const titleMessage = this.getTranslation('LABCONFIGSELECTION.DELETETEMPLATE');
            const messageContent = [this.getTranslation('LABCONFIGSELECTION.DELETETEMPLATESUCCESSDIALOG')];
            if (templateData.id === this.selectDropdown.value?.id) {
              this.selectedOption = null;
              this.clearSelectionsAndDisableButtons();
              this.setReportType.emit(this.actionType.delete);
              this.selectDropdown.close();
            }
            this.openActionSuccessDialog(TypeOfDialog.SingleBlock, IconType.ContentDelete, titleMessage, messageContent,
              this.actionType.delete, selectedDropdownValue);
          }
        },
        (error) => {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(error.message));
        });
  }

  openActionSuccessDialog(dialogType: TypeOfDialog, titleIcon: IconType, titleMessage: string, messageContent: string[],
    actionType?: string, selectedTemplate?: ITemplate) {
    const dialogMessageContent: ReportDialogType = {
      dialogType: dialogType,
      titleIcon: titleIcon,
      titleMessage: titleMessage,
      messageContent: messageContent,
      templateData: selectedTemplate ? cloneDeep(selectedTemplate) : null,
      buttonsList: [{
        btnName: this.getTranslation('LABCONFIGSELECTION.CLOSE'),
        btnStyle: StyleOfBtn.SolidButton
      }]
    };
    this.dialogRef = this.dialog.open(ReportsGenericDialogComponent, {
      panelClass: ['report-generic-container'],
      data: dialogMessageContent,
      autoFocus: false
    });
    this.dialogRef.afterClosed().pipe(
      takeUntil(this.destroy$))
      .subscribe(value => {
        if (!((this.templateRowSelected?.id !== selectedTemplate?.id && actionType === this.actionType.delete) ||
          actionType === this.actionType.rename)) {
          this.loadItems();
        }
        if (actionType === this.actionType.insert && selectedTemplate) {
          this.templateLoaded.emit(selectedTemplate);
          this.setReportType.emit(selectedTemplate?.templateBody?.filterCondition?.reportType);
        }
        if (actionType === this.actionType.delete && !this.templateRowSelected) {
          this.templateRowSelected = selectedTemplate;
        }
        if (actionType !== this.actionType.update) {
          if ((this.templateRowSelected?.id !== selectedTemplate?.id && actionType === this.actionType.delete)) {
            const index = this.templateList.findIndex(template => template.id === this.templateRowSelected?.id);
            this.templateList.splice(index, 1);
          } else {
            this.getTemplateList(actionType);
          }
        }
      }, (err) => {
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
            (componentInfo.LabconfigSelectionComponent + blankSpace + Operations.CloseDialog)));
      });
  }

  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  checkForPermissions() {
    this.actionPermissions.update = this.hasPermissionToAccess([this.permissions.CreateOrUpdateTemplate]);
    this.actionPermissions.rename = this.hasPermissionToAccess([this.permissions.CreateOrUpdateTemplate]);
    this.actionPermissions.delete = this.hasPermissionToAccess([this.permissions.DeleteTemplate]);
  }

  getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }

  // Here we are calculating the report type
  reportTypeCalculate(): string {
    let reportType: string;
    if (this.allSelected) {
      reportType = this.recentlySelectedTypes[0];
    } else {
      reportType = this.recentlySelectedTypes.join(underscore);
    }
    return reportType;
  }

  setTemplateFromPreview() {
    if (this.sendTemplateDetails && this.templateList && this.templateList.length > 0) {
      const index = this.templateList.findIndex(x => this.sendTemplateDetails?.id === x.id);
      if (index > -1) {
        this.reportsTemplate.controls['templateControl'].setValue(this.templateList[index]);
        this.selectDropdown.value = this.sendTemplateDetails;
        this.showClearTempButton = true;
      }
      this.selectedOption = this.sendTemplateDetails;
      this.showSaveNewTempButton = true;
      this.setReportType.emit(this.sendTemplateDetails?.templateBody?.filterCondition?.reportType);
      this.setReportDate.emit(this.sendTemplateDetails?.yearMonth);
      this.selectItems();
      this.sendTemplateDetails = null;
    }
  }

  templateDisabled(): boolean {
    if (!this.isSearchEnabled) {
      return this.templateList && this.templateList.length > 0 ? false :
        !(this.showSaveNewTempButton && this.recentlySelectedTypes && this.recentlySelectedTypes.length > 0);
    } else {
      return true;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.isDataLoaded$.unsubscribe();
  }
}
