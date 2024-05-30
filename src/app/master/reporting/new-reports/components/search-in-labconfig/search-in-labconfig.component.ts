// © 2023 Bio - Rad Laboratories, Inc.All Rights Reserved.
import { Component, OnInit, EventEmitter, Output, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DynamicReportingService } from '../../../../../shared/services/reporting.service';
import { Icon } from '../../../../../contracts/models/shared/icon.model';
import { icons } from '../../../../../core/config/constants/icon.const';
import { IconService } from '../../../../../shared/icons/icons.service';
import { SearchFilterData } from '../../../models/report-info';
import { LabConfig } from '../../../reporting.enum';

@Component({
  selector: 'unext-search-in-labconfig',
  templateUrl: './search-in-labconfig.component.html',
  styleUrls: ['./search-in-labconfig.component.scss']
})

export class SearchInLabconfigComponent implements OnChanges, OnInit, OnDestroy {
  @Input() instrumentGroupByDept: boolean;
  @Output() searchClick: EventEmitter<SearchFilterData> = new EventEmitter();
  selectedCategory: string;
  searchInput: string = null;
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.replay[24],
  ];
  isSearched = false;
  text: string;
  isSearchMode = false;

  searchCategoryList: Array<LabConfig> = [
    LabConfig.locationAndDepartment,
    LabConfig.instrument,
    LabConfig.controlAndLot,
    LabConfig.analyte,
  ];
  private destroy$ = new Subject<boolean>();

  constructor(
    private iconService: IconService,
    private dynamicReportingService: DynamicReportingService
  ) {
    this.iconService.replayIcons(this.iconsUsed);
  }

  ngOnInit() {
   this.dynamicReportingService.getResetStatus()
    .pipe(takeUntil(this.destroy$))
    .subscribe(res => {
      if (this.isSearchMode) {
        this.reset();
      } else {
        this.searchInput = null;
        this.selectedCategory = '';
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.instrumentGroupByDept = changes.instrumentGroupByDept.currentValue;
  }
  filterList: Array<LabConfig> = [
    LabConfig.locationAndDepartment,
    LabConfig.instrument,
    LabConfig.controlAndLot,
    LabConfig.analyte,
  ];

  public onOptionsSelected() {
    this.isSearched = false;
 }

  searchFilter() {
    this.isSearched = true;
    this.isSearchMode = true;
    const data: SearchFilterData = {
      filter: this.selectedCategory,
      keyword: this.searchInput
    };
    this.searchClick.emit(data);
  }

  reset() {
    this.searchInput = null;
    this.selectedCategory = '';
    this.searchFilter();
    this.isSearched = false;
    this.isSearchMode = false;
  }

  checkForDisable() {
    return !(this.selectedCategory && this.searchInput);
  }

  updateSearchBtn() {
    this.isSearched = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
