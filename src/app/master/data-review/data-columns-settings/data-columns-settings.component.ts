// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Component, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter, forwardRef, ChangeDetectorRef, OnChanges} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { cloneDeep } from 'lodash';
import { TranslateService } from '@ngx-translate/core';

import { Icon } from '../../../contracts/models/shared/icon.model';
import { icons } from '../../../core/config/constants/icon.const';
import { IconService } from '../../../shared/icons/icons.service';
import { DisplayColumn, UserReviewPreferences } from '../../../contracts/models/data-review/data-review-info.model';
import { DataReviewService } from '../../../shared/api/data-review.service';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../contracts/enums/error-type.enum';
import { blankSpace } from '../../../core/config/constants/general.const';
import { Operations, componentInfo } from '../../../core/config/constants/error-logging.const';
import { MessageSnackBarService } from '../../../core/helpers/message-snack-bar/message-snack-bar.service';

@Component({
  selector: 'unext-data-columns-settings',
  templateUrl: './data-columns-settings.component.html',
  styleUrls: ['./data-columns-settings.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DataColumnsSettingsComponent),
      multi: true
    }
  ]
})

export class DataColumnsSettingsComponent implements OnInit , OnChanges, OnDestroy {
  @Input() navIconName: string;
  @Input() dataColumnsFormGroup: any;
  @Output() data: EventEmitter<string[]> = new EventEmitter<string[]>();
  @ViewChild('menuTrigger') trigger: MatMenuTrigger;
  @Input() checkedDataColumn: string[];
  @Input() checkedDataColumnItems: boolean[];
  @Input() savePreferenceResponse: UserReviewPreferences;
  @Input() preferenceLayerChange: DisplayColumn;
  protected destroy$ = new Subject<boolean>();
  getPreferenceResponse: UserReviewPreferences;
  savePreferenceObject = [];
  checkedValArray: string[];
  dataColValChanged = false;
  closeBtnFunctionality = [];
  isDisabled = true;
  preferenceArray: DisplayColumn[] = [];
  constructor(private dialog: MatDialog,
    private iconService: IconService,
    private dataReviewApiService: DataReviewService,
    private errorLoggerService: ErrorLoggerService,
    private messageSnackBar: MessageSnackBarService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private translate: TranslateService
  ) {
    this.iconService.addIcons(this.iconsUsed);
  }
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.settings[24],
    icons.close[24]
  ];
  displayColumns: Array<DisplayColumn>;

  ngOnInit() {
    this.checkedValArray = this.checkedDataColumn;
  }

  ngOnChanges() {
    this.getUserReviewPreferences();
    const displayColumnsValue = this.savePreferenceColValueHandler(this.preferenceLayerChange).splice(2);
    this.displayColumns = cloneDeep(displayColumnsValue);
    this.checkedValArray = this.checkedDataColumn;
  }

  /** function to handle/format get user preference value  */
  savePreferenceColValueHandler(savePreference): DisplayColumn[]  {
    const showColumnValue = [];
    if ( savePreference !== undefined) {
    savePreference.forEach(item => {
      const inputDataColumnValue = item;
      inputDataColumnValue.forEach((arrayItem, i) => {
      const key = arrayItem.columnName;
      const preferenceItemKey =  this.dataReviewApiService.dataColumnsHandler(key);
      const columnConfig = {
        'columnName': preferenceItemKey,
        'id': i ,
        'isChecked': arrayItem.isChecked,
        };
        showColumnValue.push(columnConfig);
    });
  });
}
    return showColumnValue;
  }

  private getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }

  /** close function to close the popup if there is no valuechange , else reset the checkbox modified value */
  close() {
  this.displayColumns?.forEach(key => {
    this.closeBtnFunctionality.forEach(closeItem => {
      if (key.columnName === closeItem) {
          key.isChecked = !key.isChecked;
      }
     });
  });
    this.isDisabled = true;
    this.trigger.closeMenu();
    this.closeBtnFunctionality = [];
    this.dataColValChanged = false;
  }

  /** cancle function for close the popup without making changes */
  cancel() {
    this.close();
    this.dataColValChanged = false;
    this.isDisabled = true;
    this.trigger.closeMenu();
  }

  /** function for save the user review preferences */
  saveUserReviewPreferences(saveUserDatacolumnValue: UserReviewPreferences) {
    this.dataReviewApiService.saveUserReviewPreferences(saveUserDatacolumnValue)
    .pipe(take(1))
    .subscribe(() => {
      this.changeDetectorRef.detectChanges();
      this.redirectTo('/review/data-review');
    }, error => {
      if (error.error) {
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
            (componentInfo.DataReviewComponent + blankSpace + Operations.GetDataReviewData)));
      }
      this.messageSnackBar.showMessageSnackBar(this.getTranslation("DATAREVIEW.LOADDATAREVIEWLISTERROR"));
  });
}

/**  function to catch savePreferenceResponse from parent and show displayColumns */
  getUserReviewPreferences() {
    this.getPreferenceResponse = this.savePreferenceResponse;
    const saveData =  this.savePreferenceResponse;
    this.getPreferenceResponse = saveData;
     if (saveData !== undefined) {
       Object.keys(saveData).forEach((key, i) => {
          const preferencekey = saveData[key];
          key =  this.dataReviewApiService.dataColumnsHandler(key);
             const columnConfig: DisplayColumn = {
              columnName: key,
              id: i ,
              isChecked: preferencekey,
              };
              this.preferenceArray.push(columnConfig);
        });
     }
}

/** update user review preferences */
  onUpdate() {
      this.saveUserReviewPreferences(this.getPreferenceResponse);
      this.data.emit(this.checkedValArray);
    }

  redirectTo(url: string): void {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([url]);
    });
  }

  /** toggle function to get updated check box value */
  toggleCheckboxes(evt: any) {
    if (!this.closeBtnFunctionality.includes(evt.source.name)) {
      this.closeBtnFunctionality.push(evt.source.name);
      this.dataColValChanged =  true;
      if (this.closeBtnFunctionality.length > 0) {
        this.isDisabled = false;
      }
      } else {
        this.isDisabled = false;
        const index = this.closeBtnFunctionality.indexOf(evt.source.name);
      if (index > -1) {
        this.closeBtnFunctionality.splice(index, 1);
        this.dataColValChanged =  false;
        if (this.closeBtnFunctionality.length === 0) {
        this.isDisabled = true;
        }
      }
    }
    const changeVal = this.getPreferenceResponse;
     this.displayColumns.forEach((data) => {
       if (data.id === Number(evt.source.value)) {
         Object.keys(changeVal).forEach((item, i) => {
           if (data.id === i) {
             changeVal[item] = evt.source.checked;
           }
         });
         if (evt.source.checked === true) {
           if (!this.checkedValArray.includes(data.columnName)) {
                 this.checkedValArray.push(data.columnName);
           }
         } else {
           const index = this.checkedValArray.indexOf(data.columnName);
           if (index > -1) {
             this.checkedValArray.splice(index, 1);
           }
         }
       }
     });
     const allDisplayColumnsCheckedFalse = this.displayColumns.every( ({isChecked}) =>
     isChecked === false);
     if (allDisplayColumnsCheckedFalse === true) {
        this.isDisabled = true;
     }
   }

   public getLocalizationKey(columnName: string): string {
    return columnName.toUpperCase().replace(' ', '').replace('-', '');
   }

   ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
