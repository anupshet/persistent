// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { AfterContentChecked, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { catchError, take, takeUntil } from 'rxjs/operators';
import { combineLatest, Subject, throwError } from 'rxjs';
import { Router } from '@angular/router';

import * as fromRoot from '../../../state/app.state';
import * as sharedStateSelector from '../../../shared/state/selectors';
import * as fromNavigationSelector from '../../../shared/navigation/state/selectors';
import * as navigationStateSelector from '../../../shared/navigation/state/selectors';

import {
  CorrectiveActionInfo,
  LabConfigResponse, PdfResponse, SearchFilterData, SearchObject
} from '../models/report-info';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { LabconfigSelectionComponent } from './components/labconfig-selection/labconfig-selection.component';
import { ITemplate, LabConfig, SelectionDirection } from '../reporting.enum';
import { DynamicReportsService } from './services/dynamic-reports.service';
import { DynamicReportingService } from '../../../shared/services/reporting.service';
import { headersList } from '../../../core/config/constants/dynamic-reports.const';
import { NavigationService } from '../../../shared/navigation/navigation.service';
import { BrPermissionsService } from '../../../security/services/permissions.service';
import { Permissions } from '../../../security/model/permissions.model';
import { unRouting } from '../../../core/config/constants/un-routing-methods.const';


@Component({
  selector: 'unext-new-reports',
  templateUrl: './new-reports.component.html',
  styleUrls: ['./new-reports.component.scss']
})

export class NewReportsComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentChecked {
  private destroy$ = new Subject<boolean>();
  labConfigData: LabConfigResponse;
  labConfigDataBkp: string;
  accountId: string;
  locationId: string;
  private _labconfigSelectionComponentRef: LabconfigSelectionComponent;
  @ViewChild(LabconfigSelectionComponent)
  get labconfigSelectionComponentRef(): LabconfigSelectionComponent {
    return this._labconfigSelectionComponentRef;
  }

  set labconfigSelectionComponentRef(elem) {
    if (elem) {
      this._labconfigSelectionComponentRef = elem;
    }
  }

  @ViewChild('newReportRef') newReportComponentRef;
  sendTemplateDetails: ITemplate;
  labconfigReference: LabconfigSelectionComponent;
  newReportReference: ElementRef;
  instrumentGroupByDept = false;
  tempSelectionHolder = {
    'departments': [],
    'instruments': [],
    'controls': [],
    'analytes': [],
    'directionIndex': 0
  };
  notificationId: string; // get from state
  isPreviewReport = false; // check state for notification id
  pdfUrl = '';
  pdfData: PdfResponse;
  isReportDetailsMaximized = false;
  isReportFullScreenEnabled = true;
  reportDetails = headersList.reportDetails;
  isClearSelection: boolean;
  reportDate: string;
  correctiveActionsFormStatus = false;
  correctiveActionsPayload: CorrectiveActionInfo;
  isCorrectiveActions = false;
  allowToAddCorrectiveActions = false;
  permissions = Permissions;
  canLoadQuickReport = false;

  constructor(
    private store: Store<fromRoot.State>,
    private errorLoggerService: ErrorLoggerService,
    private reportingService: DynamicReportsService,
    private dynamicReportingService: DynamicReportingService,
    private navigationService: NavigationService,
    private brPermissionsService: BrPermissionsService,
  ) {}

  ngOnInit(): void {

    combineLatest([
      this.store.pipe(select(sharedStateSelector.getCurrentLabLocation)),
      this.store.pipe(select(sharedStateSelector.getAuthState)),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([labLocation, authStateCurrent]) => {
        try {
          this.accountId = authStateCurrent.currentUser.accountId ?
            authStateCurrent.currentUser.accountId : labLocation.parentNode.parentNodeId;
          this.locationId = labLocation.id;
        } catch (error) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(error.message));
        }
      });

    this.store.pipe(select(navigationStateSelector.getReportNotificationId))
      .pipe(takeUntil(this.destroy$)).subscribe(reportNotificationId => {
        if (reportNotificationId !== this.notificationId) {
          this.pdfData = null;
          this.pdfUrl = '';
        }
        this.isPreviewReport = !!reportNotificationId;
        this.notificationId = reportNotificationId;
        // fetch reports details if report preview mode is active and pdfUrl does not exist
        if (this.isPreviewReport && !this.pdfUrl) {
          this.fetchReportDetails();
        }
        if (!this.isPreviewReport && this.isReportDetailsMaximized) {
          this.isReportDetailsMaximized = false;
        }

        /* this scenario is when the user directly tries to preview the
        report without generating new reports first which is why labconfig is empty */
        if (!this.labConfigData && this.isPreviewReport) {
          this.searchReports({reportDate : new Date(), fromQuickReports : false});
        }

        if (this.labConfigData) {
          this.labConfigData = JSON.parse(this.labConfigDataBkp);
        }

        // process reportd details only when pdfUrl and labConfigData exists
        if (this.labConfigData && this.isPreviewReport && this.pdfUrl) {
          // if preview mode is active clear selected data before processing new data
          this.processReportDetails();
        }
      });
    this.allowToAddCorrectiveActions = this.brPermissionsService.hasAccess([this.permissions.ReportsCorrectiveActionsEntry]);
  }

  ngAfterViewInit() {

    if (this.newReportComponentRef) {
      this.newReportReference = this.newReportComponentRef;
    }
  }

  ngAfterContentChecked() {
    this.labconfigReference = this._labconfigSelectionComponentRef;
  }

  searchReports(searchObject: SearchObject): void {

    if (searchObject.reportDate) {
        this.canLoadQuickReport = searchObject.fromQuickReports;
    }

    if (searchObject.reportDate) {
      const dateString = searchObject.reportDate;
      const dateConvert = new Date(dateString);
      const year = dateConvert.getFullYear();
      const month = dateConvert.getMonth() + 1;

      const formattedDate = `${year}${String(month).padStart(2, '0')}`;
      this.reportDate = formattedDate;

      this.reportingService.searchReport(this.accountId, this.locationId, this.reportDate)
        .pipe(takeUntil(this.destroy$)).subscribe((response) => {
          if (response) {
            this.labConfigData = response;
            this.labConfigData.reloadTooltipData = true;
            this.labConfigDataBkp = JSON.stringify(response);
            this.labConfigData.directionIndex = SelectionDirection.clear;
            this.labConfigData.locations?.forEach((location) => {
              location.isChecked = true;
              this.instrumentGroupByDept = location.instrumentGroupByDept;
            });

            if (this.isPreviewReport && !this.pdfUrl) {
              this.fetchReportDetails();
            }

            if (this.isPreviewReport && this.pdfUrl) {
              this.processReportDetails();
            }
            if (this.sendTemplateDetails && this.sendTemplateDetails.isEditReport) {
              this.dynamicReportingService.setLoadedStatus(this.sendTemplateDetails);
            }
          }
        }, (error) => {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(error.message));
        });
    }
  }

  fetchReportDetails() {
    const payload = {
      'notificationReportId': this.notificationId
    };
    this.dynamicReportingService.viewPdfReport(payload)
      .pipe(
        take(1),
        catchError((err) => {
          return throwError(err);
        })
      )
      .subscribe(
        (data: any) => {
          if (data) {
            this.pdfData = data;
            this.pdfUrl = data.pdfUrl;
            this.checkForReportType();
            // process reportd details only when pdfUrl and labConfigData exists
            if (this.labConfigData && this.isPreviewReport && this.pdfUrl) {
              // if preview mode is active clear selected data before processing new data
              this.processReportDetails();
            }
          }
        }
      );
  }

  processReportDetails(): void {
    const filteredCondition = this.pdfData.templateBody.filterCondition;
    const filteredDepartments = filteredCondition.departmentFilter;
    const filteredInstruments = filteredCondition.instrumentFilter;
    const outlieredLotsControls = filteredCondition.lotFilter;
    const outlieredLotsAnalytes = filteredCondition.analyteFilter;
    const selectedAnalyteIdsList = [];

    // For now, set all the locations checked as reports can have only one location
    this.labConfigData.locations?.forEach((location) => {
      location.isChecked = true;
    });

    // set department checked
    if (filteredDepartments) {
      this.labConfigData.departments.forEach(department => {
        department.isChecked = filteredDepartments.includes(department.id);
      });
    }

    // set instruments checked
    let instrumentGroups = [];
    if (filteredInstruments) {
      this.labConfigData.instruments.forEach(instrument => {
        instrumentGroups = [...instrumentGroups, ...instrument.groups.map(group => group.id)];

        instrument.groups.forEach((group) => {
          if (filteredInstruments.includes(group.id)) {
            instrument.isChecked = true;
            group.isChecked = true;
          }
        });
      });
    }

    // set checked for Controls
    // control is checked if productMasterLotId matches with the one the api returns and the parentId matches with the instrument id
    instrumentGroups = Array.from(new Set(instrumentGroups));
    if (outlieredLotsControls) {
      this.labConfigData.controls.forEach(control => {
        control.groups.forEach((group) => {
          if (outlieredLotsControls.includes(group.id) && filteredInstruments.includes(group.parentId)) {
            control.isChecked = true;
            group.isChecked = true;
          }
        });

        if (control.isChecked) {
          selectedAnalyteIdsList.push(...control.groups.map(group => group.id));
        }
      });
    }

    // set checked for Analytes -- check analyte
    if (outlieredLotsAnalytes) {
      this.labConfigData.analytes.forEach(analyte => {
        analyte.isChecked = outlieredLotsAnalytes.includes(analyte.analyteId);
      });
    }

    this.labConfigData = { ...this.labConfigData };
  }

  toggleReportDetails(isOpen: boolean): void {
    this.isReportDetailsMaximized = isOpen;
  }

  onSearchFilter(value: SearchFilterData) {
    const keywordArray = value.keyword ? value.keyword.toUpperCase().split(' ') : null;
    if (keywordArray != null) {
      if (this.tempSelectionHolder.analytes.length === 0 ||
        (this.instrumentGroupByDept ? this.tempSelectionHolder.departments.length === 0 : false) ||
        this.tempSelectionHolder.controls.length === 0 ||
        this.tempSelectionHolder.instruments.length === 0) {
        this.setTempId(value.filter);
      }

      if (this.instrumentGroupByDept) {
        this.skipDepartentFilter(keywordArray, value.filter !== LabConfig.locationAndDepartment && keywordArray != null);
      }
      this.skipInstrumentFilter(keywordArray, value.filter !== LabConfig.instrument && keywordArray != null);
      this.skipControlFilter(keywordArray, value.filter !== LabConfig.controlAndLot && keywordArray != null);
      this.skipAnalyteFilter(keywordArray, value.filter !== LabConfig.analyte && keywordArray != null);
    }
    if (keywordArray == null) {
      this.patchExistingChecks();
    }
    this.labConfigData.isFiltered = keywordArray != null;
    this.labConfigData = { ...this.labConfigData };
  }

  patchExistingChecks() {
    const checkIndex = this.validateSelectionIndex(this.labConfigData.directionIndex);
    const tempCheckIndex = this.tempSelectionHolder.directionIndex;
    if (this.instrumentGroupByDept) {
      const isDeptCheck = this.labConfigData.departments.some(dept => dept.isChecked && !dept.isFiltered);
      this.labConfigData.departments.forEach(departmentObj => {
        const tempDeptobj = this.tempSelectionHolder.departments.find(tempObj => tempObj.id === departmentObj.id);
        const {isElementChecked, isElementFiltered, isElementDisabled} =
        this.validateElements(checkIndex, tempCheckIndex, SelectionDirection.department, departmentObj.isChecked, departmentObj.isFiltered,
          departmentObj.isDisabled, tempDeptobj, isDeptCheck);

        departmentObj.isChecked = isElementChecked;
        departmentObj.isFiltered = isElementFiltered;
        departmentObj.isDisabled = isElementDisabled;
      });
      this.tempSelectionHolder.departments = [];
    }
    const isAnalyteCheck = this.labConfigData.analytes.some(analyte => analyte.isChecked && !analyte.isFiltered);
    this.labConfigData.analytes.forEach(analyteObj => {
      const tempAnalyteobj = this.tempSelectionHolder.analytes.find(tempobj => tempobj.id === analyteObj.id);
      const {isElementChecked, isElementFiltered, isElementDisabled} =
      this.validateElements(checkIndex, tempCheckIndex, SelectionDirection.analyte, analyteObj.isChecked, analyteObj.isFiltered,
        analyteObj.isDisabled, tempAnalyteobj, isAnalyteCheck);
        analyteObj.isChecked = isElementChecked;
        analyteObj.isFiltered = isElementFiltered;
        analyteObj.isDisabled = isElementDisabled;
    });
    this.tempSelectionHolder.analytes = [];
    const isInstrumentCheck = this.labConfigData.instruments.some(instrument => instrument.groups
      .some(group => group.isChecked && !group.isFiltered));
    this.labConfigData.instruments.forEach(instrumentObj => {
      const tempGroup = this.tempSelectionHolder.instruments.filter(tempObj => tempObj.parentId === instrumentObj.codelistInstrumentId);
      const isAnyChildCheck = tempGroup.some(tempInstrument => tempInstrument.isChecked);
      instrumentObj.groups.forEach(groupObj => {
        const obj = tempGroup.find(tempobj => tempobj.id === groupObj.id);
        const {isElementChecked, isElementFiltered, isElementDisabled} =
        this.validateElements(checkIndex, tempCheckIndex, SelectionDirection.instrument, groupObj.isChecked, groupObj.isFiltered,
          groupObj.isDisabled, obj, isInstrumentCheck, isAnyChildCheck);
        groupObj.isChecked = isElementChecked;
        groupObj.isFiltered = isElementFiltered;
        groupObj.isDisabled = isElementDisabled;
      });
      instrumentObj.isChecked = instrumentObj.groups.some(group => group.isChecked);
      instrumentObj.isFiltered = !instrumentObj.groups.some(group => !group.isFiltered);
      instrumentObj.isDisabled = false;
    });
    this.tempSelectionHolder.instruments = [];
    const isControlCheck = this.labConfigData.controls.some(control => control.groups
      .some(group => group.isChecked && !group.isFiltered));
    this.labConfigData.controls.forEach(controlObj => {
      const tempGroup = this.tempSelectionHolder.controls.filter(tempObj => tempObj.parentId === controlObj.masterLotProductId);
      const isAnyChildCheck = tempGroup.some(ctrl => ctrl.isChecked);
      controlObj.groups.forEach(groupObj => {
        const obj = tempGroup.find(tempobj => tempobj.id === groupObj.id);
        const {isElementChecked, isElementFiltered, isElementDisabled} =
        this.validateElements(checkIndex, tempCheckIndex, SelectionDirection.control, groupObj.isChecked, groupObj.isFiltered,
          groupObj.isDisabled, obj, isControlCheck, isAnyChildCheck);
        groupObj.isChecked = isElementChecked;
        groupObj.isFiltered = isElementFiltered;
        groupObj.isDisabled = isElementDisabled;
      });
      controlObj.isChecked = controlObj.groups.some(group => group.isChecked);
      controlObj.isFiltered = !controlObj.groups.some(group => !group.isFiltered);
      controlObj.isDisabled = false;
    });
    this.tempSelectionHolder.controls = [];
    this.labConfigData.directionIndex = tempCheckIndex === SelectionDirection.clear ? checkIndex : this.tempSelectionHolder.directionIndex;
    this.tempSelectionHolder.directionIndex = SelectionDirection.clear;
  }

  setTempId(filter: string) {
    if (this.instrumentGroupByDept) {
    /*
      get all non filtered out department (department visible to user) and check if the user has selected any one of them
      !department.isFiltered - Non Filtered department means the department is visible
      isChecked              - This means that there is atlease one selected department which negates the softcheck for all departments
    */
      const isNonFilteredDepartmentChecked = this.labConfigData.departments
      .some(department => !department.isFiltered && department.isChecked);
      this.tempSelectionHolder.departments = this.labConfigData.departments.map(
        obj => {
          const departmentObj = { 'id': obj.id, 'isChecked': obj.isChecked, 'isFiltered': obj.isFiltered ?? false,
            'isSoftChecked': this.labConfigData.directionIndex > SelectionDirection.clear && !obj.isFiltered ? true : false
          };
          obj.isDisabled = this.disableCheckBox(SelectionDirection.department, obj.isChecked
            , obj.isFiltered, isNonFilteredDepartmentChecked);
          obj.isChecked = obj.isChecked && obj.isDisabled;
          obj.isFiltered = false;
          return departmentObj;
        }
      );
    }

    /*
      get all non filtered out analyte (analytes visible to user) and check if the user has selected any one of them
      !analyte.isFiltered - Non Filtered analytes means the analyte is visible
      isChecked           - This means that there is atlease one selected analyte which negates the softcheck for all analytes
    */
    const isNonFilteredAnalyteChecked = this.labConfigData.analytes.some(analyte => !analyte.isFiltered && analyte.isChecked);
    this.tempSelectionHolder.analytes = this.labConfigData.analytes.map(
      obj => {
        const analyteObj = { 'id': obj.id, 'isChecked': obj.isChecked, 'isFiltered': obj.isFiltered ?? false,
          'isSoftChecked': this.labConfigData.directionIndex > SelectionDirection.clear && !obj.isFiltered ? true : false
        };
        obj.isDisabled = this.disableCheckBox(SelectionDirection.analyte, obj.isChecked, obj.isFiltered, isNonFilteredAnalyteChecked);
        obj.isChecked = obj.isChecked && obj.isDisabled;
        obj.isFiltered = false;
        return analyteObj;
      }
    );

    /*
      get all non filtered out instruments (instruments visible to user) and check if the user has selected any one of them
      !instrument.isFiltered - Non Filtered instrument means the instrument is visible
      isChecked              - This means that there is atlease one selected instrument which negates the softcheck for all instruments
    */
    const isNonFilteredInstrumentChecked = this.labConfigData.instruments
    .some(instrument => !instrument.isFiltered && instrument.isChecked);
    this.tempSelectionHolder.instruments = this.labConfigData.instruments.map(
      instrument => {
        const instrumentGroup = instrument.groups.map(
          obj => {
            const instrumentObj = {
              'id': obj.id, 'isChecked': obj.isChecked, 'isFiltered': obj.isFiltered ?? false,
              'parentId': obj.instrumentId,
              'isSoftChecked': this.labConfigData.directionIndex > SelectionDirection.clear && !obj.isFiltered ? true : false
            };
            obj.isDisabled = this.disableCheckBox(SelectionDirection.instrument
              , obj.isChecked, obj.isFiltered, isNonFilteredInstrumentChecked);
            obj.isChecked = obj.isChecked && obj.isDisabled;
            obj.isFiltered = false;
            return instrumentObj;
          }
        );
        instrument.isChecked = instrument.groups.some(instrumentGrp => instrumentGrp.isChecked);
        instrument.isFiltered = !instrument.groups.some(instrumentGrp => !instrumentGrp.isFiltered);
        instrument.isDisabled = instrument.groups.some(instrumentGrp => instrumentGrp.isDisabled);
        return instrumentGroup;
      }
    ).flat();

    /*
      get all non filtered out controls (controls visible to user) and check if the user has selected any one of them
      !instrument.isFiltered - Non Filtered control means the control is visible
      isChecked              - This means that there is atlease one selected control which negates the softcheck for all controls
    */
    const isNonFilteredControlChecked = this.labConfigData.controls.some(control => !control.isFiltered && control.isChecked);
    this.tempSelectionHolder.controls = this.labConfigData.controls.map(
      control => {
        const controlGroup = control.groups.map(
          obj => {
            const controlObj = {
              'id': obj.id, 'isChecked': obj.isChecked, 'isFiltered': obj.isFiltered ?? false,
              'parentId': obj.productId,
              'isSoftChecked': this.labConfigData.directionIndex > SelectionDirection.clear && !obj.isFiltered ? true : false
            };
            obj.isDisabled = this.disableCheckBox(SelectionDirection.control, obj.isChecked, obj.isFiltered, isNonFilteredControlChecked);
            obj.isChecked = obj.isChecked && obj.isDisabled;
            obj.isFiltered = false;
            return controlObj;
          }
        );
        control.isChecked = control.groups.some(controlGrp => controlGrp.isChecked);
        control.isFiltered = !control.groups.some(controlGrp => !controlGrp.isFiltered);
        control.isDisabled = control.groups.some(controlGrp => controlGrp.isDisabled);
        return controlGroup;
      }
    ).flat();
    this.tempSelectionHolder.directionIndex = this.labConfigData.directionIndex;
    this.labConfigData.directionIndex = this.getFilterIndex(filter);

  }

  disableCheckBox(selectionDirection: SelectionDirection, isChecked: boolean, isFiltered: boolean, isNonFilteredChecked: boolean = false) {
    const checkDisabledState = () => {
      return (this.labConfigData.directionIndex > SelectionDirection.clear &&
        !isNonFilteredChecked && // none of the options are selected(analyte or control or instrument)
        ((this.labConfigData.directionIndex === selectionDirection && isChecked) ||
          (this.labConfigData.directionIndex !== selectionDirection && !isFiltered)));
    };

    return isChecked ? isChecked : checkDisabledState();
  }

  skipDepartentFilter(keywords: string[], skipFilter: boolean) {
    this.labConfigData.departments.forEach((deparementFilterData) => {
      deparementFilterData.isFiltered = !skipFilter && keywords ?
        !keywords.some((keyword: string) => deparementFilterData.name.toUpperCase().trim().includes(keyword)) : skipFilter;
    });
  }

  skipInstrumentFilter(keywords: string[], skipFilter: boolean) {
    this.labConfigData.instruments.forEach((instrumentsFilterData) => {
      instrumentsFilterData.groups.forEach((instrumentsGroupFilterData) => {
        const filterKeys = [instrumentsGroupFilterData.name, instrumentsGroupFilterData.serialNumber,
        instrumentsGroupFilterData.instrumentCustomName].filter((key: string) => key !== '');
        instrumentsGroupFilterData.isFiltered = !skipFilter && keywords
          ? !keywords.map((keyword: string) => filterKeys.some((key: string) => key.toUpperCase().trim().includes(keyword)))
            .some((isFilter: boolean) => isFilter) : skipFilter;
      });
      instrumentsFilterData.isFiltered = !instrumentsFilterData.groups.some(item => !item.isFiltered);
    });
  }

  skipControlFilter(keywords: string[], skipFilter: boolean) {
    this.labConfigData.controls.forEach((controlFilterData) => {
      controlFilterData.groups.forEach((controlGroupFilterData) => {
        const filterKeys = [controlGroupFilterData.name, controlGroupFilterData.productCustomName,
        controlGroupFilterData.lotNumber].filter((key: string) => key !== '');
        controlGroupFilterData.isFiltered = !skipFilter && keywords
          ? !keywords.map((keyword: string) => filterKeys.some((key: string) => key.toUpperCase().trim().includes(keyword)))
            .some((isFilter: boolean) => isFilter) : skipFilter;
      });
      controlFilterData.isFiltered = !controlFilterData.groups.some(item => !item.isFiltered);
    });
  }

  skipAnalyteFilter(keywords: string[], skipFilter: boolean) {
    this.labConfigData.analytes.forEach((analyteFilterData) => {
      analyteFilterData.isFiltered = !skipFilter && keywords ?
        !keywords.some((keyword: string) => analyteFilterData.name.toUpperCase().trim().includes(keyword)) : skipFilter;
    });
  }

  setIsReportFullScreen(state) {
    this.isReportFullScreenEnabled = state;
  }

  checkForReportType() {
    if (this.pdfData && this.pdfData.dynReportType.includes('0')) {
      this.isCorrectiveActions = true;
      this.isReportFullScreenEnabled = false;
    } else {
      this.isCorrectiveActions = false;
      this.isReportFullScreenEnabled = true;
    }
  }

  onFormStatus(formStatus) {
    this.correctiveActionsFormStatus = formStatus;
  }

  onFormValue(formValue) {
    this.correctiveActionsPayload = formValue;
  }

  changePreview(previewValue) {
    this.isPreviewReport = previewValue;
  }

  sendTemplateDataForSelections(templateInfo: ITemplate) {
    this.sendTemplateDetails = templateInfo;
  }

  clearTemplateSelection(event) {
    this.labconfigSelectionComponentRef?.clearSelection();
  }

  ngOnDestroy(): void {
    this.navigationService.setSelectedReportNotificationId('');
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getFilterIndex(filter) {
    switch (filter) {
      case LabConfig.locationAndDepartment:
        return SelectionDirection.department;
      case LabConfig.instrument:
        return SelectionDirection.instrument;
      case LabConfig.controlAndLot:
        return SelectionDirection.control;
      case LabConfig.analyte:
        return SelectionDirection.analyte;
      default:
        return SelectionDirection.clear;
    }
  }

  validateSelectionIndex(index: SelectionDirection): SelectionDirection {
    switch (index) {
      case SelectionDirection.department:
        return this.labConfigData.departments.some(dept => dept.isChecked && !dept.isFiltered && !dept.isDisabled)
        ? index : SelectionDirection.clear;
      case SelectionDirection.instrument:
        return this.labConfigData.instruments.some(instrument => instrument.groups.some(grp =>
          grp.isChecked && !grp.isFiltered && !grp.isDisabled)) ? index : SelectionDirection.clear;
      case SelectionDirection.control:
        return this.labConfigData.controls.some(control => control.groups.some(grp => grp.isChecked && !grp.isFiltered && !grp.isDisabled))
        ? index : SelectionDirection.clear;
      case SelectionDirection.analyte:
        return this.labConfigData.analytes.some(analyte => analyte.isChecked && !analyte.isFiltered && !analyte.isDisabled)
         ? index : SelectionDirection.clear;
      default:
        return SelectionDirection.clear;
    }
  }

  validateElements(checkIndex: SelectionDirection, tempCheckIndex: SelectionDirection, compareIndex: SelectionDirection, isElementChecked:
    boolean, isElementFiltered: boolean, isElementDisabled: boolean, tempElement: any, itemCheck: boolean,
    anyChildCheck: boolean = false): {isElementChecked: boolean, isElementFiltered: boolean, isElementDisabled: boolean} {
      // handles checkbox check/uncheck
      if (isElementDisabled) {
        isElementChecked = tempElement.isChecked;
      } else if (checkIndex > SelectionDirection.clear && (itemCheck ? isElementChecked : !isElementFiltered)) {
        isElementChecked = (tempCheckIndex === compareIndex || anyChildCheck) ? true : isElementChecked;
      } else {
        isElementChecked = tempElement ? tempElement.isChecked : isElementChecked;
      }

      // handles checkbox hide/show
      if (isElementDisabled) {
        isElementFiltered = tempElement.isFiltered;
      } else if (checkIndex === SelectionDirection.clear && tempCheckIndex === SelectionDirection.clear) {
        isElementFiltered = false;
      } else if (checkIndex > SelectionDirection.clear && !isElementFiltered) {
        if (checkIndex === compareIndex && tempCheckIndex > SelectionDirection.clear && tempCheckIndex !== compareIndex
          && !isElementChecked && !tempElement.isSoftChecked) {
          isElementFiltered = true;
        }
      } else if (tempElement && (tempCheckIndex || checkIndex === compareIndex)) {
        isElementFiltered = tempElement.isFiltered;
      }

      isElementDisabled = false;
      return {isElementChecked, isElementFiltered, isElementDisabled};
  }

}
