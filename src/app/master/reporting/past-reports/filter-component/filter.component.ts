// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, EventEmitter, Output, ViewChild, Input, OnChanges, SimpleChanges, } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import * as selectors from '../../../../shared/navigation/state/selectors';
import * as fromRoot from '../../../../state/app.state';
import { PastReportsMonthPickerComponent } from '../month-picker/month-picker.component';
import { PastReportsYearPickerComponent } from '../year-picker/year-picker.component';
import * as _moment from 'moment';
import { select as ngrxSelect, Store } from '@ngrx/store';
import { PastReportsFilterReportList } from '../../../../core/config/constants/past-reports.const';
const moment = _moment;

@Component({
  selector: 'unext-past-reports-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class PastReportsFilterComponent implements OnChanges {

  @ViewChild('yearComp', { static: true }) yearComp: PastReportsYearPickerComponent;
  @ViewChild('monthComp', { static: true }) monthComp: PastReportsMonthPickerComponent;
  @Output('filterChanged') filterChanged: EventEmitter<any> = new EventEmitter();
  @Output('formReset') formReset: EventEmitter<any> = new EventEmitter();
  pastReportsFormGroup: FormGroup;
  reportList: Array<any> = PastReportsFilterReportList;
  @Input('signedBylist') signedBylist: Array<any> = [];
  @Input('dataSource') dataSource;
  @Input('originalData') originalData: Array<any> = [];
  yrsBefore;
  isSideNavExpanded: boolean;

  dataLoaded = false;
  originalListMonth;
  originalListYear;
  listMonth;
  listYear;

  constructor(
    private _formBuilder: FormBuilder,
    private store: Store<fromRoot.State>) {
    this.pastReportsFormGroup = this._formBuilder.group({
      'reportTypes': [[]],
      'month': [null],
      'year': [null],
      'signedBy': [null]
    });

    this.pastReportsFormGroup.valueChanges
      .subscribe(
        (data: any) => {
          // data.month = (data.month != null && data.month >= 0) ? data.month+1 : null;
          this.filterChanged.emit(data);
        }
      );

    this.store.pipe(ngrxSelect(selectors.getSideNavState)).subscribe((isSideNavExpanded: boolean) => {
      this.isSideNavExpanded = isSideNavExpanded;
    });
  }

  calculatePastYears(dataSource) {
    const currentYear = moment().year();
    const earliestYear = Math.min(...dataSource.map(item => item.year));
    this.yrsBefore = currentYear - earliestYear;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (this.dataSource.length) {
        this.originalListYear = this.getReshapedlList(this.dataSource, 'year', 'desc');
        this.originalListMonth = this.getReshapedlList(this.dataSource, 'month', 'asc');
        this.listYear = this.originalListYear;
        this.listMonth = this.originalListMonth;
        this.dataLoaded = true;
      } else {
        this.yrsBefore = 0;
      }
    }
  }

  recentlySelectedTypes: Array<any> = [];
  reportsChange(event: any) {
    let data: any = event.value;
    if (!this.recentlySelectedTypes.includes('0_1_2') && data.includes('0_1_2')) {
      data = ['0', '1', '2', '0_1_2'];
      this.pastReportsFormGroup.controls['reportTypes'].setValue(data);
    } else if (this.recentlySelectedTypes.includes('0_1_2') && !data.includes(2)) {
      this.pastReportsFormGroup.controls['reportTypes'].setValue(null);
    } else if (!this.recentlySelectedTypes.includes('0_1_2') && data.length === 3) {
      data = ['0', '1', '2', '0_1_2'];
      this.pastReportsFormGroup.controls['reportTypes'].setValue(data);
    } else if (this.recentlySelectedTypes.includes('0_1_2') && data.length > 1) {
      data.splice(data.length - 1, 1);
      this.pastReportsFormGroup.controls['reportTypes'].setValue(data);
    } else {
      this.pastReportsFormGroup.controls['reportTypes'].setValue(data);
    }

    this.recentlySelectedTypes = data;
    const formValues: any = this.pastReportsFormGroup.value || {};
    this.filterChanged.emit(formValues);
  }

  selectAll(event: any) {
    const selectedItems: Array<any> = [];
    if (event.value.includes(this.reportList.length - 1)) {
      this.reportList.forEach((item: any, index: number) => {
        selectedItems.push(index);
      });
      this.pastReportsFormGroup.controls['reportTypes'].setValue(selectedItems);
    }
  }


  getReshapedlList(data, key, order) {
    const reduceObjectByKey = data.map(item => [key].reduce((acc, k) => ({ ...acc, [k]: item[k] }), {}));
    const arr = [];
    reduceObjectByKey.forEach((i) => {
      arr.push(i[key]);
    });

    const unique = arr.filter((d, index) => {
      return arr.indexOf(d) === index;
    });

    const sort = (order === 'asc') ? unique.sort((a, b) => a - b) : unique.sort((a, b) => b - a);
    return sort;
  }


  getFilteredYears(selectedMonth) {
    const arr = [];
    this.originalData.forEach((i) => {
      if (i.month === selectedMonth) {
        arr.push(i);
      }
    });
    const filteredYears = this.getReshapedlList(arr, 'year', 'desc');
    return filteredYears;
  }

  getFilteredMonths(selectedYear) {
    let arr = [];
    const data: any = this.pastReportsFormGroup.value;
    this.originalData.forEach((i) => {
      if (i.year === selectedYear) {
        arr.push(i);
      }
    });
    if (data.reportTypes && data.reportTypes.length > 0) {
      arr = arr.filter(item => item.type.split('_').filter(o => data.reportTypes.includes(o)).length);
    }
    const filteredMonths = this.getReshapedlList(arr, 'month', 'asc');
    return filteredMonths;
  }

  onSelectionChangeYear(e) {
    const selectedYear = this.pastReportsFormGroup.value.year;
    this.listMonth = this.getFilteredMonths(selectedYear);
  }


  onSelectionChangeMonth(e) {
    const selectedMonth = this.pastReportsFormGroup.value.month;
    this.listYear = this.getFilteredYears(selectedMonth);
  }

  resetForm() {
    this.pastReportsFormGroup.reset();
    this.formReset.emit(this.pastReportsFormGroup.value);
    this.recentlySelectedTypes = [];
    this.listYear = this.originalListYear;
    this.listMonth = this.originalListMonth;
  }

}
