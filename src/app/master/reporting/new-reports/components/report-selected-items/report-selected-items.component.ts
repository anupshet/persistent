// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { ElementRef, EventEmitter, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { Icon } from '../../../../../contracts/models/shared/icon.model';
import { cloneDeep } from 'lodash';

import { icons } from '../../../../../core/config/constants/icon.const';
import { IconService } from '../../../../../shared/icons/icons.service';
import { ControlResponse, InstrumentResponse, LabConfigResponse } from '../../../models/report-info';
import { blankSpace, headerHeight, hyphen, materialPadding } from '../../../../../core/config/constants/general.const';
import { headersList } from '../../../../../core/config/constants/dynamic-reports.const';

@Component({
  selector: 'unext-report-selected-items',
  templateUrl: './report-selected-items.component.html',
  styleUrls: ['./report-selected-items.component.scss']
})


export class ReportSelectedItemsComponent implements OnInit, OnChanges {
  @ViewChild('selectedItems') selectedItems: ElementRef;

  @Input() labConfigData: LabConfigResponse;
  @Input() labconfigReference;
  @Input() headerText = headersList.selectedItems;
  @Output() toggleSelection: EventEmitter<boolean> = new EventEmitter<boolean>();

  possibleHeadersList = headersList;
  toggleIcon = false;
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.expandedIconArrowDown[24],
    icons.expandedIconArrowUp[24]
  ];

  panelHeight: String;
  wrapperHeight: String;
  panelHeaderHeight = '40px';

  selectedIndexMatTab = 0;
  hasDepartmentChecked: boolean;
  instrumentGroupByDept = true;
  isInstrumentChecked: boolean;
  isDepartmentChecked: boolean;
  isControlChecked: boolean;
  isAnalyteChecked: boolean;
  allCheck: boolean;
  isAnalyteFiltered: boolean;

  constructor(private iconService: IconService) {
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.labConfigData = changes?.labConfigData?.currentValue;
    if (this.labConfigData) {
      this.labConfigData.locations?.forEach((location) => {
        this.instrumentGroupByDept = location.instrumentGroupByDept;
      });

      const departments = cloneDeep(this.labConfigData.departments);
      this.hasDepartmentChecked = departments?.some((department) => {
        return department.isChecked === true;
      });

      if (this.instrumentGroupByDept) {
        this.isDepartmentChecked = this.labConfigData.departments.some(x => x.isChecked);
      }
      this.isInstrumentChecked = this.labConfigData.instruments.some(x => x.isChecked);
      this.isControlChecked = this.labConfigData.controls.some(x => x.isChecked);
      this.isAnalyteChecked = this.labConfigData.analytes.some(x => x.isChecked);

      // 0-dept & 1- instrument, the default tab is the location/dept or instrument for locations without a dept
      this.hasDepartmentChecked ? this.selectedIndexMatTab = 0 : this.selectedIndexMatTab = 1;

      this.allCheck = this.isDepartmentChecked || this.isInstrumentChecked || this.isControlChecked || this.isAnalyteChecked;
    }
  }

  /**
   * Append custom name or serial name to the instrument group name
   * @param instrumentGroup group for which name needs to be modified
   * @returns formatted string to be displayed
   */
  getDisplayNameForInstrument(instrumentGroup: InstrumentResponse): String {
    const displayName = instrumentGroup.instrumentCustomName ?
      (instrumentGroup.name + hyphen + instrumentGroup.instrumentCustomName.trim()) :
      instrumentGroup.serialNumber ? (instrumentGroup.name + hyphen + instrumentGroup.serialNumber) : instrumentGroup.name;
    return displayName;
  }

  /**
   * Append custom name or lot number to custom name as control group name
   * @param controlGroup group for which name needs to be modified
   * @returns formatted string to be displayed
   */
  getDisplayNameForControlGroup(controlGroup: ControlResponse): String[] {
    const controlGroups = cloneDeep(controlGroup);
    const lotNumbers: string[] = [];
    controlGroups.map((group) => {
      if (this.isControlChecked ? group.isChecked : group.isFiltered === false) {
        const displayName = group.productCustomName
          ? group.productCustomName.trim() + blankSpace + group.lotNumber
          : group.lotNumber;
        lotNumbers.push(displayName);
      }
    });
    return lotNumbers;
  }

  toggleArrowIcon() {
    this.toggleIcon = !this.toggleIcon;
  }

  /**
   * Calcultes the height for the selected items Tray
   */
  openGroup() {
    const isNativeElem  = !!this.labconfigReference?.nativeElement;
    const nativeElement = this.labconfigReference?.labConfigHeader?.nativeElement || this.labconfigReference?.nativeElement;
    let calcHeight = 0;
    calcHeight = Math.round(
      nativeElement.getBoundingClientRect().top +
      nativeElement.offsetHeight
    ) + materialPadding; // materialPadding here is the material padding
    this.panelHeight = isNativeElem ? 'calc(100% - 85px)' : 'calc(100vh - ' + calcHeight + 'px)';
    // changing height here for footer component
    const innerHeight = isNativeElem ? '100%' : calcHeight + headerHeight;
    // headerHeight is the header and padding of the selected items tray
    this.wrapperHeight = isNativeElem ? 'calc(100vh - 352px)' : 'calc(100vh - ' + innerHeight + 'px)';
    this.toggleSelection.emit(true);
  }

  closeGroup() {
    this.panelHeight = this.panelHeaderHeight;
    this.toggleSelection.emit(false);
  }
}
