// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Input, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { isEqual } from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ReviewFilter, ReviewFilterTypes, UnReviewedDataCounts, UnReviewedDataRequest, AdditionalFilterValues } from '../../../contracts/models/data-review/data-review-info.model';
import { Icon } from '../../../contracts/models/shared/icon.model';
import { icons } from '../../../core/config/constants/icon.const';
import { IconService } from '../../../shared/icons/icons.service';

@Component({
  selector: 'unext-additional-filter-dialog',
  templateUrl: './additional-filter-dialog.component.html',
  styleUrls: ['./additional-filter-dialog.component.scss']
})
export class AdditionalFilterDialogComponent implements OnInit {
  @ViewChild('menuTrigger') trigger: MatMenuTrigger;
  @Input() navIconName: string;
  @Output() filterEmit: EventEmitter<object> = new EventEmitter();
  @Input() set filterCountsObject(value: UnReviewedDataCounts) {
    this.filterCountResult = value;
  }
  @Input() filterTypes: ReviewFilter[] = [
    {
      filterType: ReviewFilterTypes.Violations,
      include: false
    },
    {
      filterType: ReviewFilterTypes.Last30Days,
      include: false
    }
  ];
  private destroy$ = new Subject<boolean>();
  public filterCountResult: UnReviewedDataCounts;
  updateButtonDisabled: boolean = true;
  unReviewedDataRequest = new UnReviewedDataRequest();
  last30DaysValue =  ReviewFilterTypes.Last30Days;
  violationsValue = ReviewFilterTypes.Violations;
  checkFilterTypeVal: object = {};
  checkFilterTypeArray = [];
  additionalFilterForm : FormGroup;
  previousSelection : AdditionalFilterValues;

  constructor(
    private iconService: IconService,
    private formBuilder: FormBuilder
  ) {
    this.iconService.addIcons(this.iconsUsed);
  }
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.filter[24],
    icons.close[24]
  ];
  ngOnInit(): void {
    this.additionalFilterForm = this.formBuilder.group({
      last30DaysCheckbox: new FormControl(false),
      violationsCheckbox: new FormControl(false)
    });
    this.previousSelection = this.additionalFilterForm.value;
    this.additionalFilterForm.valueChanges.pipe(
      takeUntil(this.destroy$))
      .subscribe((values) => {
        this.updateButtonDisabled = isEqual(values, this.previousSelection);
      }); 
  }

  onChange(event: MatCheckboxChange) {
    this.filterTypes.find(filter=>filter.filterType === Number(event.source.value)).include = event.checked;
  }

  closeMenu() {
    this.additionalFilterForm.controls['last30DaysCheckbox'].setValue(this.previousSelection.last30DaysCheckbox);
    this.additionalFilterForm.controls['violationsCheckbox'].setValue(this.previousSelection.violationsCheckbox);
    this.trigger.closeMenu();
  }

  formValueReset(value: boolean) {
    this.additionalFilterForm.controls['violationsCheckbox'].setValue(value);
    this.filterTypes.find(filter=>filter.filterType === ReviewFilterTypes.Violations).include = value;
    this.previousSelection = this.additionalFilterForm.value;
    this.updateButtonDisabled = isEqual(this.additionalFilterForm.value, this.previousSelection);
  }

  formReset() {
    this.additionalFilterForm.controls['last30DaysCheckbox'].setValue(false);
    this.additionalFilterForm.controls['violationsCheckbox'].setValue(false);
    this.previousSelection = this.additionalFilterForm.value;
    this.updateButtonDisabled = isEqual(this.additionalFilterForm.value, this.previousSelection);
  }

  onUpdate() {
    this.filterEmit.emit(this.filterTypes);
    this.previousSelection = this.additionalFilterForm.value;
    this.closeMenu();
  }

}
