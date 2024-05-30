// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import { combineLatest, Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { take, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import {
  blankSpace,
  hyphen,
} from '../../../../../core/config/constants/general.const';
import {
  LabConfig,
  SelectionDirection,
  LabConfigKeys
} from '../../../reporting.enum';
import {
  AnalyteResponse,
  CategoryItem,
  ControlResponse,
  DepartmentResponse,
  GroupControlResponse,
  GroupInstrumentResponse,
  GroupItem,
  InstrumentResponse,
  LabConfigResponse,
  LocationResponse,
  TooltipData,
} from '../../../models/report-info';
import { IconType, ReportDialogType, TypeOfDialog, TypeOfMessage, StyleOfBtn } from '../../../models/report-dialog';
import { ReportsGenericDialogComponent } from '../../components/reports-generic-dialog/reports-generic-dialog.component';
import { ErrorLoggerService } from '../../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../../contracts/enums/error-type.enum';
import { componentInfo, Operations } from '../../../../../core/config/constants/error-logging.const';
import * as fromRoot from '../../../../../state/app.state';
import * as fromNavigationSelector from '../../../../../shared/navigation/state/selectors';
import { TreePill } from '../../../../../contracts/models/lab-setup';
import { DynamicReportsService } from '../../services/dynamic-reports.service';
import { EntityType } from '../../../../../contracts/enums/entity-type.enum';

@Component({
  selector: 'unext-labconfig-selection',
  templateUrl: './labconfig-selection.component.html',
  styleUrls: ['./labconfig-selection.component.scss']
})
export class LabconfigSelectionComponent implements OnChanges, OnInit, OnDestroy {
  private dialogRef: MatDialogRef<ReportsGenericDialogComponent>;
  protected destroy$ = new Subject<boolean>();
  @ViewChild('labConfigHeader') labConfigHeader: ElementRef;

  @Input() labConfigData: LabConfigResponse;
  @Output() labConfigDataChange: EventEmitter<LabConfigResponse> = new EventEmitter<LabConfigResponse>();
  @Input() tempSelectionHolder;
  @Input() isClearSelection: boolean;
  @Input() canLoadQuickReport: boolean;

  instrumentGroupByDept = false;
  departmentsCount = 0;
  instrumentsCount = 0;
  controlsCount = 0;
  analytesCount = 0;
  showCount = false;
  selectionDirection = SelectionDirection;
  CONSTANTS = {
    lot: 'LOT',
    departmentDetails: 'Department Details',
    instrumentDetails: 'Instrument Details',
    locationDetails: 'Location Details',
    controlDetails: 'Control Details',
    analyteDetails: 'Analyte Details',
    locationAndDepartment: 'Location and Department',
    instrumentGroup: 'InstrumentGroup',
    controlGroup: 'ControlGroup',
    instrument: 'Instrument',
    control: 'Control',
    department: 'Department',
    location: 'Location',
    analyte: 'Analyte'
  };
  labConfig = LabConfig;
  initialLoad = true;
  isFilterOn = false;
  directionIndex: SelectionDirection = SelectionDirection.clear;
  selectedNode: TreePill;
  selectedLeaf: TreePill;
  labConfigKeys = LabConfigKeys;
  departmentMaxLimit = 1;
  instrumentMaxLimit = 5;
  controlMaxLimit = 25;
  analyteMaxLimit = 500;
  selectedElementId: Array<String> = [];

  constructor(private dialog: MatDialog,
    private errorLoggerService: ErrorLoggerService,
    private store: Store<fromRoot.State>,
    private translate: TranslateService,
    private dynamicReportsService: DynamicReportsService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.isClearSelection?.previousValue !== changes?.isClearSelection?.currentValue) {
      this.clearSelection();
    }

    this.labConfigData = changes?.labConfigData?.currentValue;
    if (this.labConfigData) {
      if (this.isFilterOn !== this.labConfigData.isFiltered) {
        this.directionIndex = this.labConfigData.directionIndex;
      }
      this.labConfigData.locations?.forEach((location) => {
        this.instrumentGroupByDept = location.instrumentGroupByDept;
      });
      if (this.initialLoad) {
        this.setTooltipData();
        this.initialLoad = false;
        if (this.canLoadQuickReport) {
          this.getCurrentlySelectedItems();
        }
      }
      if (this.labConfigData?.reloadTooltipData) {
        this.setTooltipData();
        this.labConfigData.reloadTooltipData = false;
      }
      this.isFilterOn = this.labConfigData.isFiltered;
      this.updateCount();
    }
  }

  getCurrentlySelectedItems() {
    combineLatest([
      this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedNode)),
      this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedLeaf)),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([selectedNode, selectedLeaf]) => {
        try {
          this.selectedNode = selectedNode;
          this.selectedLeaf = selectedLeaf;
          if (this.selectedNode?.nodeType > EntityType.LabLocation && this.selectedNode.hasOwnProperty('reportCreate')) {
            this.triggerFilterForSelectedNodes();
          }
        } catch (error) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(error.message));
        }
      });
  }

  ngOnInit() {
  }

  /**
   * Filter and check those items for which we are creating report through navigation
   */
  triggerFilterForSelectedNodes() {
    switch (this.selectedNode.nodeType) {
      case EntityType.LabDepartment:
        this.filterWithoutGroups(this.labConfigKeys.departments, this.labConfig.department);
        break;
      case EntityType.LabInstrument:
        this.filterThroughGroups(this.labConfigKeys.instruments, this.labConfig.instrument);
        break;
      case EntityType.LabControl:
        if (this.selectedLeaf) {
          this.filterWithoutGroups(this.labConfigKeys.analytes, this.labConfig.analyte);
          this.filterThroughControls();
        } else {
          this.filterThroughGroups(this.labConfigKeys.controls, this.labConfig.control);
        }
        break;
    }
  }

  /**
   * Filter through departments and analytes and check the ones which are selected
   * @param key object key
   * @param type type - department/analyte
   */
  filterWithoutGroups(key: string, type: string) {
    const index = this.labConfigData[key].findIndex(element =>
      this.selectedLeaf ? (element.parentId.includes(this.selectedLeaf.parentNodeId) &&
        this.selectedLeaf['testSpecInfo'].analyteId === element.analyteId) : this.selectedNode.id === element.id);
    if (index > -1) {
      const selectedElement = this.labConfigData[key][index];
      selectedElement.isChecked = true;
      this.onCheckChanged(type, selectedElement.isChecked, index, null);
    }
  }

  // Filter through controls and show the selected one
  filterThroughControls() {
    let selectedGroupFound = false;
    this.labConfigData.controls.forEach((parent: GroupControlResponse, parentIndex: number) => {
      if (!parent.isFiltered) {
        selectedGroupFound = false;
        parent.groups.forEach((group, groupIndex) => {
          if (this.selectedNode.id === group.id) {
            group.isChecked = true;
            this.onCheckChanged(this.labConfig.control, true, parentIndex, groupIndex);
            group.isChecked = false;
            parent.isChecked = false;
            selectedGroupFound = true;
          } else {
            group.isFiltered = true;
          }
        });
        if (!selectedGroupFound) {
          parent.isFiltered = true;
        }
      }
    });
  }

  /**
   * Filter through instruments and controls and check the ones which are selected
   * @param key object key
   * @param type type - instrument/control
   */
  filterThroughGroups(key: string, type: string) {
    outerLoop: for (const [parentIndex, parent] of this.labConfigData[key].entries()) {
      for (const [groupIndex, group] of parent.groups.entries()) {
        if (this.selectedNode.id === group.id) {
          group.isChecked = true;
          this.onCheckChanged(type, group.isChecked, parentIndex, groupIndex);
          break outerLoop;
        }
      }
    }
  }

  /**
   * Following methods return length of selected checkboxes if none is selected then returns total count of
   * instruments, departments, etc.
   * @returns length of selected checkboxes/ total length of instruments, departments, etc
   */
  getInstrumentsCount() {
    const isChecked = this.labConfigData.instruments
      .map((instrument) => instrument.groups.some((group) => group.isChecked && !group.isDisabled))
      .some((isCheck) => isCheck);
    return {
      'check': isChecked, 'count': this.labConfigData.instruments
        .map(
          (instrument) =>
            instrument.groups.filter((group) =>
              (isChecked ? group.isChecked : !group.isFiltered) && !group.isDisabled
            ).length
        )
        .reduce((prev, current) => prev + current)
    };
  }

  getControlsCount() {
    const isChecked = this.labConfigData.controls
      .map((control) => control.groups.some((group) => group.isChecked && !group.isDisabled))
      .some((isCheck) => isCheck);
    return {
      'check': isChecked, 'count': this.labConfigData.controls
        .map(
          (control) =>
            control.groups.filter((group) =>
              (isChecked ? group.isChecked : !group.isFiltered) && !group.isDisabled
            ).length
        )
        .reduce((prev, current) => prev + current)
    };
  }

  getAnalytesCount() {
    const isChecked = this.labConfigData.analytes.some(
      (analyte) => analyte.isChecked && !analyte.isDisabled
    );
    return {
      'check': isChecked, 'count': this.labConfigData.analytes.filter((analyte) =>
        (isChecked ? analyte.isChecked : !analyte.isFiltered) && !analyte.isDisabled
      ).length
    };
  }

  getDepartmentsCount() {
    if (!this.instrumentGroupByDept) {
      return { 'check': false, 'count': 0 };
    }
    const isChecked = this.labConfigData.departments.some(
      (dept) => dept.isChecked && !dept.isDisabled
    );
    return {
      'check': isChecked, 'count': this.labConfigData.departments.filter((dept) =>
        (isChecked ? dept.isChecked : !dept.isFiltered) && !dept.isDisabled
      ).length
    };
  }

  /**
   * Includes calls to get related parent and child items
   * @param type type of column ex. departments, instruments, etc
   * @param isChecked boolean value true if checkbox is checked else false
   * @param index index of checkbox item
   * @param subIndex index of group inside checkbox item
   */
  onCheckChanged(
    type: string,
    isChecked: boolean,
    index: number,
    subIndex: number
  ) {
    switch (type) {
      case this.labConfig.department:
        if (this.directionIndex === SelectionDirection.clear) {
          this.directionIndex = SelectionDirection.department;
        }
        if (this.directionIndex === SelectionDirection.department) {
          this.checkInstrumentByDepartment(isChecked);
          this.checkControlByInstrument(isChecked);
          this.checkAnalyteByControl(isChecked);
        }
        break;
      case this.labConfig.instrument:
        const instrument = this.labConfigData.instruments[index];
        if (subIndex == null) {
          instrument.groups.forEach(instrumentObj => {
            if (!instrumentObj.isFiltered && !instrumentObj.isDisabled) {
              instrumentObj.isChecked = isChecked;
            }
          });
        } else {
          this.selectedElementId = [instrument.groups[subIndex].id];
        }
        instrument.isChecked = instrument.groups.some(group => group.isChecked && !group.isDisabled);
        if (this.directionIndex === SelectionDirection.clear) {
          this.directionIndex = SelectionDirection.instrument;
        }
        if ([SelectionDirection.department, SelectionDirection.instrument].indexOf(this.directionIndex) > -1) {
          this.checkControlByInstrument(isChecked);
          this.checkAnalyteByControl(isChecked);
        }
        if ([SelectionDirection.instrument, SelectionDirection.control, SelectionDirection.analyte].indexOf(this.directionIndex) > -1) {
          this.checkDepartmentByInstrument(isChecked);
        }
        this.selectedElementId = [];
        break;
      case this.labConfig.control:
        const control = this.labConfigData.controls[index];
        if (subIndex == null) {
          control.groups.forEach(controlObj => {
            if (!controlObj.isFiltered && !controlObj.isDisabled) {
              controlObj.isChecked = isChecked;
            }
          });
        } else {
          this.selectedElementId = [control.groups[subIndex].parentId];
        }
        control.isChecked = control.groups.some(group => group.isChecked && !group.isDisabled);
        if (this.directionIndex === SelectionDirection.clear) {
          this.directionIndex = SelectionDirection.control;
        }
        if ([SelectionDirection.department, SelectionDirection.instrument, SelectionDirection.control].indexOf(this.directionIndex) > -1) {
          this.checkAnalyteByControl(isChecked);
        }
        if ([SelectionDirection.control, SelectionDirection.analyte].indexOf(this.directionIndex) > -1) {
          this.checkInstrumentByControl(isChecked);
          this.checkDepartmentByInstrument(isChecked);
        }
        this.selectedElementId = [];
        break;
      case this.labConfig.analyte:
        if (this.directionIndex === SelectionDirection.clear) {
          this.directionIndex = SelectionDirection.analyte;
        }
        this.selectedElementId = this.labConfigData.analytes[index].parentId;
        if (this.directionIndex === SelectionDirection.analyte) {
          this.checkControlByAnalyte(isChecked);
          this.checkInstrumentByControl(isChecked);
          this.checkDepartmentByInstrument(isChecked);
        }
        this.selectedElementId = [];
        break;
      default:
        break;
    }
    this.updateCount();
    if (this.isFilterOn && this.directionIndex === SelectionDirection.clear) {
      this.clearSelection();
    } else {
      this.labConfigData.directionIndex = this.directionIndex;
      this.labConfigDataChange.emit({ ...this.labConfigData });
    }
  }

  /**
   * Checks whether number of department or instrument or control or analyte selected(through child checkboxes)
   * is within permitted limit else trigger error popup
   * @param event current event
   * @param type Is it Dept or instrument or control or analyte type
   * @param isChecked checkbox was selected or not before this click operation
   */
  onClick(event, type: string, isChecked: boolean = false, isDisabled: boolean) {
    if (isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (isChecked && (type === this.labConfig.department || type === this.labConfig.instrument || type === this.labConfig.control ||
      type === this.labConfig.analyte)) {
      return;
    }
    if (type === this.labConfig.department &&
      (this.labConfigData.departments.filter(department => department.isChecked).length >= this.departmentMaxLimit)) {
      const titleMessage = this.getTranslation('LABCONFIGSELECTION.MAXDEPARTMENTREACHEDTITLE');
      const messageContent = [this.getTranslation('LABCONFIGSELECTION.MAXDEPARTMENTREACHEDMESSAGE')];
      this.openGenericDialog(TypeOfDialog.doubleBlock, IconType.NotInterested, titleMessage, IconType.RedWarning,
        messageContent, TypeOfMessage.Error, true);
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (type === this.labConfig.instrument && (this.getCount(this.labConfigData.instruments) >= this.instrumentMaxLimit)) {
      this.callGenericDialogInstrument();
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (type === this.labConfig.control && (this.getCount(this.labConfigData.controls) >= this.controlMaxLimit)) {
      this.callGenericDialogControl();
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (type === this.labConfig.analyte && (this.labConfigData.analytes.filter(x => x.isChecked).length >= this.analyteMaxLimit)) {
      const titleMessage = this.getTranslation('LABCONFIGSELECTION.MAXANALYTEREACHEDTITLE');
      const messageContent = [this.getTranslation('LABCONFIGSELECTION.MAXANALYTEREACHEDMESSAGE')];
      this.openGenericDialog(TypeOfDialog.doubleBlock, IconType.NotInterested, titleMessage, IconType.RedWarning,
        messageContent, TypeOfMessage.Error, true);
      event.preventDefault();
      event.stopPropagation();
      return;
    }
  }

  /**
   * Count the number of selected instruments or control
   * @param instrumentOrControlLists Contains instrument or control list
   * @returns number of total selected instrument or control
   */
  getCount(instrumentOrControlLists: any): number {
    let count = 0;
    instrumentOrControlLists.map((list) => {
      list.groups.map((group) => {
        if (group.isChecked === true) {
          count++;
        }
      });
    });
    return count;
  }

  /**
   * Checks if number of instrument or control selected checkboxes(selected via parent checkbox)
   * is within permitted limit else trigger error popup
   * @param event current event
   * @param type Is it Dept or instrument or control or analyte type
   * @param isChecked checkbox was selected or not before this click operation
   * @param instrumentOrControl instrument or control item
   */
  onClickParentCheckbox(event, type: string, isChecked: boolean = false, instrumentOrControl: any, isDisabled: boolean) {
    if (isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    let totalSelectedInstrumentOrControl = 0;
    type === this.labConfig.instrument ?
      totalSelectedInstrumentOrControl = instrumentOrControl?.groups?.filter(group => (group.isFiltered === false ||
        !!group.isFiltered === false)).length
    + this.getCount(this.labConfigData.instruments) :
      totalSelectedInstrumentOrControl = instrumentOrControl?.groups?.filter(group => (group.isFiltered === false ||
        !!group.isFiltered === false)).length
    + this.getCount(this.labConfigData.controls);

    if (type === this.labConfig.instrument && !isChecked && totalSelectedInstrumentOrControl > this.instrumentMaxLimit) {
      this.callGenericDialogInstrument();
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (type === this.labConfig.control && !isChecked && totalSelectedInstrumentOrControl > this.controlMaxLimit) {
      this.callGenericDialogControl();
      event.preventDefault();
      event.stopPropagation();
      return;
    }
  }

  callGenericDialogControl(): void {
    const titleMessage = this.getTranslation('LABCONFIGSELECTION.MAXLOTSREACHEDTITLE');
    const messageContent = [this.getTranslation('LABCONFIGSELECTION.MAXLOTSREACHEDMESSAGE')];
    this.openGenericDialog(TypeOfDialog.doubleBlock, IconType.NotInterested, titleMessage, IconType.RedWarning,
      messageContent, TypeOfMessage.Error, true);
  }

  callGenericDialogInstrument(): void {
    const titleMessage = this.getTranslation('LABCONFIGSELECTION.MAXINSTRUMENTREACHEDTITLE');
    const messageContent = [this.getTranslation('LABCONFIGSELECTION.MAXINSTRUMENTREACHEDMESSAGE')];
    this.openGenericDialog(TypeOfDialog.doubleBlock, IconType.NotInterested, titleMessage, IconType.RedWarning,
      messageContent, TypeOfMessage.Error, true);
  }

  openGenericDialog(dialogType: TypeOfDialog, titleIcon: IconType, titleMessage: string, messageIcon: IconType,
    messageContent: string[], messageType: TypeOfMessage, dialogFullwidth: boolean) {
    const dialogMessageContent: ReportDialogType = {
      dialogType: dialogType,
      titleIcon: titleIcon,
      titleMessage: titleMessage,
      messageIcon: messageIcon,
      messageContent: messageContent,
      messageType: messageType,
      fullwidth: dialogFullwidth,
      buttonsList: [{
        btnName: this.getTranslation('LABCONFIGSELECTION.CLOSE'),
        btnStyle: StyleOfBtn.SolidButton
      }]
    };
    this.dialogRef = this.dialog.open(ReportsGenericDialogComponent, {
      panelClass: ['report-generic-container'],
      data: dialogMessageContent,
    });
  }

  openClearSelectionDialog() {
    const dialogMessageContent: ReportDialogType = {
      dialogType: TypeOfDialog.SimpleBlock,
      simpleMessageList: [this.getTranslation('LABCONFIGSELECTION.RESETSELECTIONSDIALOGMESSAGEONE'),
         this.getTranslation('LABCONFIGSELECTION.RESETSELECTIONSDIALOGMESSAGETWO')],
      buttonsList: [{
        btnName: this.getTranslation('LABCONFIGSELECTION.CONTINUEBUTTONTEXT'),
        btnStyle: StyleOfBtn.SolidButton
      }, {
        btnName: this.getTranslation('LABCONFIGSELECTION.CANCEL'),
        btnStyle: StyleOfBtn.OutlineButton
      }],
      fullwidth: true,
    };
    this.dialogRef = this.dialog.open(ReportsGenericDialogComponent, {
      panelClass: ['report-generic-container'],
      data: dialogMessageContent,
    });
    this.dialogRef.afterClosed().pipe(
      takeUntil(this.destroy$))
      .subscribe(value => {
        if (!value.buttonIndex) {
          this.clearSelection();
        }
      }, (err) => {
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
            (componentInfo.LabconfigSelectionComponent + blankSpace + Operations.CloseDialog)));
      });
  }

  checkDepartmentByInstrument(isChecked: boolean) {
    if (!this.instrumentGroupByDept) { return; }
    const isCheck = this.labConfigData.instruments.map(group => group.groups).some(
      (groups) => groups.some(instrument => instrument.isChecked && !instrument.isDisabled));
    const instrumentIdList = this.labConfigData.instruments
      .map((instrument) =>
        instrument.groups
          .filter((group) => (isCheck ? group.isChecked : !group.isFiltered) && !group.isDisabled)
          .map((group) => group.parentId)
      )
      .reduce((prev, current) => prev.concat(current), []);
    const instrumentCount = this.labConfigData.instruments.map(instument => instument.groups.length).
      reduce((previous, current) => previous + current, 0);
    this.labConfigData.departments.forEach((dept) => {
      const isExist = instrumentIdList.indexOf(dept.id) > -1;
      const _isChecked = isChecked
        ? isChecked && isExist
        : isChecked || isExist;
      if (!isChecked && (!_isChecked || instrumentCount === instrumentIdList.length)) {
        dept.isChecked = isChecked;
      }
      dept.isFiltered = isChecked
        ? !_isChecked
        : instrumentIdList.length !== 0
          ? !isExist
          : isExist;
    });
  }

  checkInstrumentByControl(isChecked: boolean) {
    const isCheck = this.labConfigData.controls.map(group => group.groups).some(
      (groups) => groups.some(control => control.isChecked && !control.isDisabled));
    const controlIdList = this.labConfigData.controls
      .map((control) =>
        control.groups
          .filter((group) => (isCheck ? group.isChecked : !group.isFiltered) && !group.isDisabled)
          .map((group) => group.parentId)
      )
      .reduce((prev, current) => prev.concat(current), []);
    const controlCount = this.labConfigData.controls.map(control => control.groups.length).
      reduce((previous, current) => previous + current, 0);
    this.labConfigData.instruments.forEach((instrument) => {
      const isChildCheck = instrument.groups.some(instrumentObj => instrumentObj.isChecked);
      instrument.groups.forEach((group) => {
        const isExist = controlIdList.indexOf(group.id) > -1;
        const _isChecked = isChecked
          ? isChecked && isExist
          : isChecked || isExist;
        if (!isChecked && (!_isChecked || controlCount === controlIdList.length)) {
          group.isChecked = isChecked;
        }
        if (!isExist && group.isChecked) {
          group.isChecked = isExist;
        }
        group.isFiltered = isChecked
          ? !_isChecked
          : controlIdList.length !== 0
            ? !isExist
            : isExist;
        if (isChecked && isChildCheck && !group.isFiltered && this.selectedElementId.indexOf(group.id) > -1) {
          group.isChecked = isChecked;
        }
      });
      instrument.isChecked = instrument.groups.some(
        (group) => group.isChecked
      );
      instrument.isFiltered = !instrument.groups.some(
        (group) => !group.isFiltered
      );
      instrument.isDisabled = instrument.groups.filter(group => !group.isFiltered && !group.isDisabled).length === 0;
    });
  }

  checkInstrumentByDepartment(isChecked: boolean) {
    const departmentIdList = this.labConfigData.departments
      .filter((dept) => dept.isChecked && !dept.isDisabled)
      .map((dept) => dept.id);
    this.labConfigData.instruments.forEach((instrument) => {
      instrument.groups.forEach((group) => {
        const isExist = departmentIdList.indexOf(group.parentId) > -1;
        const _isChecked = isChecked
          ? isChecked && isExist
          : isChecked || isExist;
        if (!isChecked && !_isChecked) {
          group.isChecked = _isChecked;
        }
        group.isFiltered = isChecked
          ? !_isChecked
          : departmentIdList.length !== 0
            ? !isExist
            : isExist;
      });
      instrument.isChecked = instrument.groups.some(
        (group) => group.isChecked
      );
      instrument.isFiltered = !instrument.groups.some(
        (group) => !group.isFiltered
      );
      instrument.isDisabled = instrument.groups.filter(group => !group.isFiltered && !group.isDisabled).length === 0;
    });
  }

  checkControlByAnalyte(isChecked: boolean) {
    const analyteIdList = this.labConfigData.analytes
      .filter((analyte) => analyte.isChecked && !analyte.isDisabled)
      .map((analyte) => analyte.parentId)
      .reduce((prev, current) => prev.concat(current), []);
    this.labConfigData.controls.forEach((control) => {
      const isChildCheck = control.groups.some(ctrl => ctrl.isChecked);
      control.groups.forEach((group) => {
        const isExist = analyteIdList.indexOf(group.id) > -1;
        const _isChecked = isChecked
          ? isChecked && isExist
          : isChecked || isExist;
        if (!isChecked && !_isChecked) {
          group.isChecked = _isChecked;
        }
        group.isFiltered = isChecked
          ? !_isChecked
          : analyteIdList.length !== 0
            ? !isExist
            : isExist;
        if (isChecked && isChildCheck && !group.isFiltered && this.selectedElementId.indexOf(group.id) > -1) {
          group.isChecked = isChecked;
        }
      });
      control.isChecked = control.groups.some((group) => group.isChecked);
      control.isFiltered = !control.groups.some((group) => !group.isFiltered);
      control.isDisabled = control.groups.filter(group => !group.isFiltered && !group.isDisabled).length === 0;
    });
  }

  checkControlByInstrument(isChecked: boolean) {
    const isCheck = this.labConfigData.instruments.map(group => group.groups).some(
      (groups) => groups.some(instrument => instrument.isChecked && !instrument.isDisabled));
    const instrumentIdList = this.labConfigData.instruments
      .map((instrument) =>
        instrument.groups
          .filter((group) => (isCheck ? group.isChecked : !group.isFiltered) && !group.isDisabled)
          .map((group) => group.id)
      )
      .reduce((prev, current) => prev.concat(current), []);
    const instrumentCount = this.labConfigData.instruments.map(instrument => instrument.groups.length).
      reduce((previous, current) => previous + current, 0);
    this.labConfigData.controls.forEach((control) => {
      const isChildCheck = control.groups.some(ctrl => ctrl.isChecked);
      control.groups.forEach((group) => {
        const isExist = instrumentIdList.indexOf(group.parentId) > -1;
        const _isChecked = isChecked
          ? isChecked && isExist
          : isChecked || isExist;
        if (!isChecked && (!_isChecked || instrumentCount === instrumentIdList.length)) {
          group.isChecked = isChecked;
        }
        if (!isExist && group.isChecked) {
          group.isChecked = isExist;
        }
        group.isFiltered = isChecked
          ? !_isChecked
          : instrumentIdList.length !== 0
            ? !isExist
            : isExist;
        if (isChecked && isChildCheck && !group.isFiltered && this.selectedElementId.indexOf(group.parentId) > -1) {
          group.isChecked = isChecked;
        }
      });
      control.isChecked = control.groups.some((group) => group.isChecked);
      control.isFiltered = !control.groups.some((group) => !group.isFiltered);
      control.isDisabled = control.groups.filter(group => !group.isFiltered && !group.isDisabled).length === 0;
    });
  }

  checkAnalyteByControl(isChecked: boolean) {
    const isCheck = this.labConfigData.controls.map(group => group.groups).some(
      (groups) => groups.some(control => control.isChecked && !control.isDisabled));
    const controlIdList = this.labConfigData.controls
      .map((control) =>
        control.groups
          .filter((group) => (isCheck ? group.isChecked : !group.isFiltered) && !group.isDisabled)
          .map((group) => group.id)
      )
      .reduce((prev, current) => prev.concat(current), []);
    const controlCount = this.labConfigData.controls.map(control => control.groups.length).
      reduce((previous, current) => previous + current, 0);
    this.labConfigData.analytes.forEach((analyte) => {
      const isExist = controlIdList.some(
        (ids) => analyte.parentId.indexOf(ids) > -1
      );
      const _isChecked = isChecked
        ? isChecked && isExist
        : isChecked || isExist;
      if (!isChecked && (!_isChecked || controlCount === controlIdList.length)) {
        analyte.isChecked = isChecked;
      }
      analyte.isFiltered = isChecked
        ? !_isChecked
        : controlIdList.length !== 0
          ? !isExist
          : isExist;
    });
  }

  /**
   * Get the latest count of selected checkboxes
   */
  updateCount() {

    // showCount
    const depCount = this.getDepartmentsCount();
    this.departmentsCount = depCount.count;
    const insCount = this.getInstrumentsCount();
    this.instrumentsCount = insCount.count;
    const ctlCount = this.getControlsCount();
    this.controlsCount = ctlCount.count;
    const alyCount = this.getAnalytesCount();
    this.analytesCount = alyCount.count;

    this.showCount = depCount.check || insCount.check || ctlCount.check || alyCount.check;
    if (!this.showCount) {
      this.directionIndex = SelectionDirection.clear;
    }

    // Checks whether any of the checkoboxes from instrument, control and analyte are selected and if its a search mode
    // Based on the selection it enables/disables the create button
    this.dynamicReportsService.enableOrDisableCreateButton(this.labConfigData.isFiltered ?
      false : insCount.check || ctlCount.check || alyCount.check);
  }

  /**
   * Includes calls to set tooltip data
   */
  setTooltipData() {
    if (this.labConfigData?.locations) {
      this.labConfigData.locations.forEach((location: LocationResponse) => {
        if (location.instrumentGroupByDept) {
          this.setTooltipDataForDepartmentAndLocation(location);
        } else {
          // when we dont have departments but locations instead
        }
      });
    }
    if (this.labConfigData?.instruments) {
      this.setTooltipDataForInstruments();
    }
    if (this.labConfigData?.controls) {
      this.setTooltipDataForControls();
    }
    if (this.labConfigData?.analytes) {
      this.setTooltipDataForAnalytes();
    }
  }

  /**
   * Gets list of instrument groups which belong to individual department
   * sets data for tooltip to display
   * @param location location to which the instrument belongs
   */
  setTooltipDataForDepartmentAndLocation(location: LocationResponse) {
    let listOfInstruments: GroupItem[] = [];
    const listOfInstrumentsForLocation: GroupItem[] = [];
    let instrumentObj: GroupItem;
    let index: number;
    this.labConfigData.departments.forEach((department: DepartmentResponse) => {
      if (department.parentId === location.id) {
        listOfInstruments = [];
        this.labConfigData.instruments.forEach(
          (instrument: GroupInstrumentResponse) => {
            instrumentObj = this.createGroupItem(
              instrument.name,
              instrument.codelistInstrumentId.toString(),
              false
            );
            instrument.groups.forEach((group: InstrumentResponse) => {
              if (department.id === group.parentId) {
                instrumentObj.matched = true;
                instrumentObj.groups.push({
                  name: this.getDisplayNameForInstrument(group),
                  id: group.id,
                });
              }
            });
            if (instrumentObj.matched) {
              listOfInstruments.push(instrumentObj);
              index = this.getIndex(
                listOfInstrumentsForLocation,
                instrumentObj.id
              );
              if (index > -1) {
                listOfInstrumentsForLocation[index].groups =
                  listOfInstrumentsForLocation[index].groups.concat(
                    instrumentObj.groups
                  );
              } else {
                listOfInstrumentsForLocation.push(cloneDeep(instrumentObj));
              }
            }
          }
        );
        this.attachTooltipDetailsToObject(
          department,
          this.labConfig.department,
          listOfInstruments,
          this.labConfig.departmentDetails,
          this.labConfig.instrument
        );
      }
    });
    this.attachTooltipDetailsToObject(
      location,
      this.labConfig.location,
      listOfInstrumentsForLocation,
      this.labConfig.locationDetails,
      this.labConfig.instrument
    );
  }

  /**
   * Gets list of controls which are children to each instrument
   * sets data for tooltip to display=
   */
  setTooltipDataForInstruments() {
    let listOfControlsForInstrumentGroup: GroupItem[] = [];
    let listOfControlsForInstrument: GroupItem[] = [];
    let index: number;
    this.labConfigData.instruments.forEach(
      (instrument: GroupInstrumentResponse) => {
        listOfControlsForInstrument = [];
        instrument.groups.forEach((instrumentGroup: InstrumentResponse) => {
          listOfControlsForInstrumentGroup = [];
          this.labConfigData.controls.forEach(
            (control: GroupControlResponse) => {
              const controlObj = this.createGroupItem(
                control.name,
                control.masterLotProductId.toString(),
                false
              );
              control.groups.forEach((controlGroup: ControlResponse) => {
                if (controlGroup.parentId === instrumentGroup.id) {
                  controlObj.groups.push({
                    id: controlGroup.id,
                    name: this.getDisplayNameForControlGroup(controlGroup),
                  });
                  controlObj.matched = true;
                }
              });
              if (controlObj.matched) {
                listOfControlsForInstrumentGroup.push(controlObj);
                index = this.getIndex(
                  listOfControlsForInstrument,
                  controlObj.id
                );
                if (index > -1) {
                  listOfControlsForInstrument[index].groups =
                    listOfControlsForInstrument[index].groups.concat(
                      controlObj.groups
                    );
                } else {
                  listOfControlsForInstrument.push(cloneDeep(controlObj));
                }
              }
            }
          );
          this.attachTooltipDetailsToObject(
            instrumentGroup,
            this.labConfig.instrumentGroup,
            listOfControlsForInstrumentGroup,
            this.labConfig.instrumentDetails,
            this.labConfig.control
          );
        });
        this.attachTooltipDetailsToObject(
          instrument,
          this.labConfig.instrument,
          listOfControlsForInstrument,
          this.labConfig.instrumentDetails,
          this.labConfig.control
        );
      }
    );
  }

  /**
   * Gets list of instrument & groups to which each control and control group it belongs
   * sets data for tooltip to display
   */
  setTooltipDataForControls() {
    let listOfInstrumentsObj: GroupItem[] = [];
    let instrumentObj: GroupItem;
    let instrumentGroupObj: CategoryItem;
    let index: number;
    this.labConfigData.controls.forEach((control: GroupControlResponse) => {
      listOfInstrumentsObj = [];
      control.groups.forEach((controlGroup: any) => {
        this.labConfigData.instruments.forEach(
          (instrument: GroupInstrumentResponse) => {
            instrumentObj = this.createGroupItem(
              instrument.name,
              instrument.codelistInstrumentId.toString()
            );
            instrument.groups.forEach((instrumentGroup: InstrumentResponse) => {
              if (controlGroup.parentId === instrumentGroup.id) {
                instrumentGroupObj = {
                  id: instrumentGroup.id,
                  name: this.getDisplayNameForInstrument(instrumentGroup),
                };
                this.attachTooltipDetailsToObject(
                  controlGroup,
                  this.labConfig.controlGroup,
                  {
                    name: instrument.name,
                    id: instrument.codelistInstrumentId.toString(),
                    groups: [instrumentGroupObj],
                  },
                  this.labConfig.controlDetails,
                  this.labConfig.instrument
                );
                controlGroup.parent = {
                  name: instrument.name,
                  id: instrument.codelistInstrumentId,
                  groups: [instrumentGroupObj],
                };
                index = this.getIndex(listOfInstrumentsObj, instrumentObj.id);
                if (index > -1) {
                  if (
                    !this.checkForDuplicates(
                      listOfInstrumentsObj[index].groups,
                      instrumentGroupObj.id
                    )
                  ) {
                    listOfInstrumentsObj[index].groups.push(instrumentGroupObj);
                  }
                } else {
                  instrumentObj.groups.push(instrumentGroupObj);
                  listOfInstrumentsObj.push(instrumentObj);
                }
                return;
              }
            });
            this.attachTooltipDetailsToObject(
              control,
              this.labConfig.control,
              listOfInstrumentsObj,
              this.labConfig.controlDetails,
              this.labConfig.instrument
            );
          }
        );
      });
    });
  }

  /**
   * Gets list of control & control groups to which each analyte belongs
   * sets data for tooltip to display
   */
  setTooltipDataForAnalytes() {
    let controlObj;
    let listOfControls: GroupItem[] = [];
    this.labConfigData.analytes.forEach((analyte: AnalyteResponse) => {
      listOfControls = [];
      this.labConfigData.controls.forEach((control: GroupControlResponse) => {
        controlObj = this.createGroupItem(
          control.name,
          control.masterLotProductId.toString(),
          false
        );
        control.groups.forEach((controlGroup: any) => {
          analyte.parentId.forEach((analyteParentId) => {
            if (analyteParentId === controlGroup.id) {
              controlObj.matched = true;
              if (
                !this.checkForDuplicates(controlObj.groups, controlGroup.id)
              ) {
                controlObj.groups.push({
                  id: controlGroup.id,
                  name: this.getDisplayNameForControlGroup(controlGroup),
                  parent: controlGroup.parent,
                });
              }
              return;
            }
          });
        });
        if (controlObj.matched) {
          listOfControls.push(controlObj);
        }
      });
      this.getParent(listOfControls);
      this.attachTooltipDetailsToObject(
        analyte,
        this.labConfig.analyte,
        listOfControls,
        this.labConfig.analyteDetails,
        this.labConfig.control
      );
    });
  }

  /**
   * Get List of Instrument and Instrument groups which are parents to control groups
   * @param listOfControls for which we need to find parent instruments
   */
  getParent(listOfControls) {
    let listOfInstruments: GroupItem[] = [];
    let index: number;
    listOfControls.forEach((control) => {
      listOfInstruments = [];
      control.groups.forEach((controlGroup) => {
        index = this.getIndex(listOfInstruments, controlGroup.parent.id);
        if (index > -1) {
          if (
            !this.checkForDuplicates(
              listOfInstruments[index].groups,
              controlGroup.parent.groups[0].id
            )
          ) {
            listOfInstruments[index].groups.push(controlGroup.parent.groups[0]);
          }
        } else {
          listOfInstruments.push(controlGroup.parent);
        }
      });
      control.parent = listOfInstruments;
    });
  }

  /**
   * Gets index of existing item
   * @param listOfItems list of existing items like departments, instrument groups, etc
   * @param itemIdToBeChecked id of item to be checked for duplicates
   * @returns id of existing item
   */
  getIndex(listOfItems: CategoryItem[], itemIdToBeChecked: String) {
    const index = listOfItems.findIndex(
      (element) => element.id === itemIdToBeChecked
    );
    return index;
  }

  /**
   * Creates a group item object so as to push data in object format for tooltip
   * @param name name of the item like instrument name, department name etc
   * @param id id of the item
   * @param matched if it has parent
   * @returns object which contains all these properties
   */
  createGroupItem(
    name: String,
    id: String,
    matched?: boolean
  ): GroupItem {
    return {
      name: name.toString(),
      id: id,
      groups: [],
      matched: matched,
    };
  }

  /**
   * Checks if the item already exists in the list of departments/instruments(ex.)
   * @param listOfItems present list of items
   * @param itemIdToBeChecked id of item that needs to be checked for duplicates
   * @returns true if exists else false
   */
  checkForDuplicates(
    listOfItems: CategoryItem[],
    itemIdToBeChecked: String
  ): boolean {
    return listOfItems.some((element) => {
      return element.id === itemIdToBeChecked;
    });
  }

  /**
   * Append custom name or serial name to the instrument group name
   * @param instrumentGroup group for which name needs to be modified
   * @returns formatted string to be displayed
   */
  getDisplayNameForInstrument(instrumentGroup: InstrumentResponse): String {
    const displayName = instrumentGroup.instrumentCustomName
      ? instrumentGroup.name + hyphen + instrumentGroup.instrumentCustomName.trim()
      : instrumentGroup.serialNumber
        ? instrumentGroup.name + hyphen + instrumentGroup.serialNumber
        : instrumentGroup.name;
    return displayName;
  }

  /**
   * Append custom name or lot number to custom name as control group name
   * @param controlGroup group for which name needs to be modified
   * @returns formatted string to be displayed
   */
  getDisplayNameForControlGroup(controlGroup: ControlResponse): String {
    const displayName = controlGroup.productCustomName
      ? controlGroup.productCustomName.trim() + blankSpace + controlGroup.lotNumber
      : this.labConfig.lot + blankSpace + controlGroup.lotNumber;
    return displayName;
  }

  /**
   * Attatches required tooltip data to objects
   * @param item item for which tooltip data needs to be attached
   * @param category whether its for instrument, department, etc
   * @param data contains parent or children items
   * @param heading heading for tooltip
   * @param subheading subheading for tooltip
   */
  attachTooltipDetailsToObject(
    item: DepartmentResponse | LocationResponse | GroupControlResponse | ControlResponse | GroupInstrumentResponse |
      InstrumentResponse | AnalyteResponse,
    category: string,
    data: GroupItem | GroupItem[],
    heading: string,
    subheading: string
  ) {
    const tooltipData: TooltipData = {
      category: category,
      data: data,
      heading: heading,
      subheading: subheading,
    };
    item.tooltipData = tooltipData;
  }

  /**
   * Clears all selected checkboxes
   */
  clearSelection() {
    this.directionIndex = SelectionDirection.clear;
    if (this.isFilterOn) {
      const directionIndex = this.labConfigData.directionIndex;
      if (this.instrumentGroupByDept) {
        this.labConfigData.departments.filter((dept) => !dept.isFiltered).forEach(
          (department: DepartmentResponse) => {
            department.isChecked = department.isDisabled ? department.isChecked : false;
            department.isFiltered = directionIndex !== SelectionDirection.department;
          }
        );
      }
      this.labConfigData.analytes.filter((analyte) => !analyte.isFiltered).forEach((analyte: AnalyteResponse) => {
        analyte.isChecked = analyte.isDisabled ? analyte.isChecked : false;
        analyte.isFiltered = directionIndex !== SelectionDirection.analyte;
      });
      this.labConfigData.instruments.filter((instrument) => !instrument.isFiltered)
      .forEach((instrument: GroupInstrumentResponse) => {
          instrument.groups.filter((instrumentGrp) => !instrumentGrp.isFiltered)
          .forEach((group: InstrumentResponse) => {
            group.isChecked = group.isDisabled ? group.isChecked : false;
            group.isFiltered = directionIndex !== SelectionDirection.instrument;
          });
          instrument.isChecked = instrument.groups.some(group => group.isChecked);
          instrument.isFiltered = directionIndex !== SelectionDirection.instrument;
        }
      );
      this.labConfigData.controls.filter((control) => !control.isFiltered)
      .forEach((control: GroupControlResponse) => {
        control.groups.filter((controlGrp) => !controlGrp.isFiltered).forEach((group: ControlResponse) => {
          group.isChecked = group.isDisabled ? group.isChecked : false;
          group.isFiltered = directionIndex !== SelectionDirection.control;
        });
        control.isChecked = control.groups.some(group => group.isChecked);
        control.isFiltered = directionIndex !== SelectionDirection.control;
      });
    } else {
      if (this.instrumentGroupByDept) {
        this.labConfigData.departments.forEach(
          (department: DepartmentResponse) => {
            department.isChecked = false;
            department.isFiltered = false;
            department.isDisabled = false;
          }
        );
      }
      this.labConfigData.analytes.forEach((analyte: AnalyteResponse) => {
        analyte.isChecked = false;
        analyte.isFiltered = false;
        analyte.isDisabled = false;
      });
      this.labConfigData.instruments.forEach(
        (instrument: GroupInstrumentResponse) => {
          instrument.isChecked = false;
          instrument.isFiltered = false;
          instrument.isDisabled = false;
          instrument.groups.forEach((group: InstrumentResponse) => {
            group.isChecked = false;
            group.isFiltered = false;
            group.isDisabled = false;
          });
        }
      );
      this.labConfigData.controls.forEach((control: GroupControlResponse) => {
        control.isChecked = false;
        control.isFiltered = false;
        control.isDisabled = false;
        control.groups.forEach((group: ControlResponse) => {
          group.isChecked = false;
          group.isFiltered = false;
          group.isDisabled = false;
        });
      });
    }
    this.labConfigData.directionIndex = SelectionDirection.clear;
    this.labConfigData.isTemplate = false;
    this.labConfigDataChange.emit({ ...this.labConfigData });
    this.updateCount();
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
